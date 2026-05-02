<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use PDO;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\PaymentProcessorInterface;
use Procurely\Api\Support\Input;
use Procurely\Api\Support\Telemetry;

final class OrderService
{
    public function __construct(
        private readonly Database $database,
        private readonly CartService $cartService,
        private readonly PaymentProcessorInterface $paymentProcessor,
        private readonly \Procurely\Api\Support\EmailService $emailService,
        private readonly NotificationService $notificationService,
        private readonly \Procurely\Api\Services\ReconciliationService $reconciliationService,
    ) {
    }

    public function checkout(array $payload, ?int $userId = null): array
    {
        return $this->checkoutInternal($payload, $userId, false);
    }

    public function createOrder(array $payload, ?int $userId = null): array
    {
        return $this->checkoutInternal($payload, $userId, true);
    }

    private function checkoutInternal(array $payload, ?int $userId = null, bool $skipPayment = false): array
    {
        $cartToken = Input::cartToken($payload);
        $customerName = Input::requiredString($payload, 'customerName', 'Customer name', 120);
        $customerEmail = Input::email($payload, 'customerEmail', 'customer email');
        $phone = Input::phone($payload, 'phone', 'phone number');
        $address = Input::requiredString($payload, 'address', 'Address', 400, false);
        $paymentMethod = Input::enum(
            $payload['paymentMethod'] ?? 'card',
            ['card', 'cod', 'wallet'],
            'Payment method',
            'card'
        );

        $cart = $this->cartService->getCart($cartToken);
        if (($cart['items'] ?? []) === []) {
            throw new ApiException('Cart is empty.', 422);
        }

        /** @var array $orderData */
        $orderData = $this->database->transaction(function (PDO $pdo) use ($cart, $userId, $cartToken, $customerName, $customerEmail, $phone, $address, $skipPayment, $paymentMethod) {
            Telemetry::start('order_processing');
            
            // 1. Idempotency Check
            $checkExisting = $pdo->prepare('SELECT order_number FROM orders WHERE cart_token = :cart_token LIMIT 1');
            $checkExisting->execute(['cart_token' => $cartToken]);
            $existing = $checkExisting->fetch();

            if ($existing !== false) {
                return $this->findByOrderNumber((string) $existing['order_number'], '', '', true);
            }

            // 2. Inventory Validation & Deduction
            try {
                $checkStock = $pdo->prepare('SELECT stock_level FROM inventory WHERE product_id = :product_id LIMIT 1');
                $deductStock = $pdo->prepare('UPDATE inventory SET stock_level = stock_level - :qty, updated_at = :now WHERE product_id = :product_id AND stock_level >= :qty');
                $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

                foreach ($cart['items'] as $item) {
                    $productId = (string) $item['product']['id'];
                    $quantity = (int) $item['quantity'];

                    $checkStock->execute(['product_id' => $productId]);
                    $stock = $checkStock->fetch();

                    if ($stock !== false && (int) $stock['stock_level'] < $quantity) {
                        Telemetry::error('Inadequate stock', ['product' => $productId]);
                        throw new ApiException(sprintf('Insufficient stock for %s.', $item['product']['name']), 422);
                    }

                    if ($stock !== false) {
                        $deductStock->execute(['qty' => $quantity, 'now' => $now, 'product_id' => $productId]);
                    }
                }
            } catch (\PDOException $e) {
                // If inventory table doesn't exist, assume unlimited stock
                Telemetry::info('Inventory table not found, skipping stock check');
            }

            // 3. Persist Order Root
            $orderNumber = sprintf('PR-%s', strtoupper(substr(bin2hex(random_bytes(6)), 0, 10)));
            $createdAt = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
            
            // Map payment method to initial status
            $initialStatus = 'processing';
            if ($paymentMethod === 'cod') $initialStatus = 'pending_delivery';

            $insertOrder = $pdo->prepare('
                INSERT INTO orders (user_id, order_number, cart_token, customer_name, customer_email, phone, address, subtotal, vat, shipping_fee, service_fee, total, status, payment_method, created_at)
                VALUES (:user_id, :order_number, :cart_token, :customer_name, :customer_email, :phone, :address, :subtotal, :vat, :shipping_fee, :service_fee, :total, :status, :payment_method, :created_at)
            ');
            $insertOrder->execute([
                'user_id' => $userId,
                'order_number' => $orderNumber,
                'cart_token' => $cartToken,
                'customer_name' => $customerName,
                'customer_email' => $customerEmail,
                'phone' => $phone,
                'address' => $address,
                'subtotal' => $cart['subtotal'],
                'vat' => $cart['vat'] ?? 0,
                'shipping_fee' => $cart['shippingFee'] ?? 0,
                'service_fee' => $cart['serviceFee'],
                'total' => $cart['total'],
                'status' => $initialStatus,
                'payment_method' => $paymentMethod,
                'created_at' => $createdAt,
            ]);

            $orderId = (int) $pdo->lastInsertId();
            
            // 4. Persist Order Items
            $insertItem = $pdo->prepare('
                INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total) 
                VALUES (:order_id, :product_id, :product_name, :unit_price, :quantity, :line_total)
            ');

            foreach ($cart['items'] as $item) {
                $insertItem->execute([
                    'order_id' => $orderId,
                    'product_id' => $item['product']['id'],
                    'product_name' => $item['product']['name'],
                    'unit_price' => $item['product']['price'],
                    'quantity' => $item['quantity'],
                    'line_total' => $item['lineTotal'],
                ]);
            }

            // 5. Finalize State
            $finalOrder = $this->findByOrderNumber($orderNumber, '', '', true);

            // Skip immediate capture if it's COD, Card, or Wallet (wallet needs separate processing)
            $isAsyncPayment = in_array($paymentMethod, ['cod', 'card', 'wallet']); 
            
            if (!$skipPayment && !$isAsyncPayment) {
                if (!$this->paymentProcessor->capture($orderNumber, (int) $cart['total'], $customerEmail)) {
                    throw new ApiException('Payment verification failed. Please try again.', 502);
                }
            }
            
            // Send confirmation email for all successful orders (including COD)
            if (!$skipPayment) {
                $this->emailService->sendOrderConfirmation($finalOrder);
            }

            Telemetry::info('Order finalized', [
                'number' => $orderNumber, 
                'ms' => Telemetry::stop('order_processing')
            ]);

            return $finalOrder;
        });

        // 6. Async Notifications (Simulation)
        try {
            $pdo = $this->database->connection();
            $adminStmt = $pdo->prepare('
                SELECT u.id FROM users u
                JOIN user_roles ur ON u.uuid = ur.user_uuid
                JOIN roles r ON ur.role_id = r.id
                WHERE r.name = "admin"
            ');
            $adminStmt->execute();
            $adminIds = $adminStmt->fetchAll(PDO::FETCH_COLUMN);

            if (!empty($adminIds)) {
                $orderRef = $orderData['orderNumber'] ?? 'Unknown';
                $customer = $orderData['customerName'] ?? 'Guest';
                $totalStr = number_format(($orderData['total'] ?? 0) / 100, 2);

                foreach ($adminIds as $id) {
                    $this->notificationService->createNotification(
                        (int) $id,
                        'order.new',
                        'New Order Received',
                        "Order {$orderRef} from {$customer} for N{$totalStr}",
                        ['orderId' => $orderRef]
                    );
                }
            }
        } catch (\Throwable $e) {
            Telemetry::error('Admin alert failed', ['error' => $e->getMessage()]);
        }

        return $orderData;
    }

    public function initialiseWalletFunding(int $userId, int $amountCents): array
    {
        $pdo = $this->database->connection();
        $userStmt = $pdo->prepare('SELECT email, full_name FROM users WHERE id = :id LIMIT 1');
        $userStmt->execute(['id' => $userId]);
        $user = $userStmt->fetch();

        if (!$user) {
            throw new ApiException('User not found.', 404);
        }

        $reference = sprintf('FW-%s-%d', strtoupper(substr(bin2hex(random_bytes(4)), 0, 8)), $userId);
        
        $url = "https://api.paystack.co/transaction/initialize";
        $secretKey = $_ENV['PAYSTACK_SECRET_KEY'] ?? '';

        $fields = [
            'reference' => $reference,
            'amount' => $amountCents,
            'email' => $user['email'],
            'metadata' => [
                'type' => 'wallet_funding',
                'user_id' => $userId,
                'amount' => $amountCents
            ]
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $secretKey,
            "Cache-Control: no-cache",
            "Content-Type: application/json"
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($result, true);

        if (!($response['status'] ?? false)) {
            throw new ApiException('Funding Initialization Failed: ' . ($response['message'] ?? 'Unknown error'), 502);
        }

        return [
            'authorization_url' => $response['data']['authorization_url'],
            'reference' => $reference,
        ];
    }

    public function findByOrderNumber(string $orderNumber, string $cartToken = '', string $email = '', bool $isAdmin = false): array
    {
        $pdo = $this->database->connection();
        $orderStatement = $pdo->prepare(
            'SELECT order_number, cart_token, customer_name, customer_email, phone, address, subtotal, vat, shipping_fee, service_fee, total, status, payment_method, created_at
             FROM orders WHERE order_number = :order_number LIMIT 1'
        );
        $orderStatement->execute(['order_number' => $orderNumber]);
        $order = $orderStatement->fetch();

        if ($order === false) {
            throw new ApiException('Order not found.', 404);
        }

        // Verify requester owns the order. Support session-based (cartToken), guest-based (email) and admin verification.
        $matchesToken = $cartToken !== '' && hash_equals((string) $order['cart_token'], $cartToken);
        $matchesEmail = $email !== '' && hash_equals(mb_strtolower((string) $order['customer_email']), mb_strtolower($email));

        if (!$isAdmin && !$matchesToken && !$matchesEmail) {
            throw new ApiException('Order not found.', 404);
        }

        $itemsStatement = $pdo->prepare(
            'SELECT product_id, product_name, unit_price, quantity, line_total FROM order_items WHERE order_id = (SELECT id FROM orders WHERE order_number = :order_number LIMIT 1)'
        );
        $itemsStatement->execute(['order_number' => $orderNumber]);

        return [
            'orderNumber' => $order['order_number'],
            'status' => $order['status'],
            'paymentMethod' => $order['payment_method'] ?? 'card',
            'customerName' => $order['customer_name'],
            'customerEmail' => $order['customer_email'],
            'phone' => $order['phone'],
            'address' => $order['address'],
            'subtotal' => (int) $order['subtotal'],
            'vat' => (int) ($order['vat'] ?? 0),
            'shippingFee' => (int) ($order['shipping_fee'] ?? 0),
            'serviceFee' => (int) $order['service_fee'],
            'total' => (int) $order['total'],
            'createdAt' => $order['created_at'],
            'items' => array_map(
                static fn (array $item): array => [
                    'productId' => $item['product_id'],
                    'productName' => $item['product_name'],
                    'unitPrice' => (int) $item['unit_price'],
                    'quantity' => (int) $item['quantity'],
                    'lineTotal' => (int) $item['line_total'],
                ],
                $itemsStatement->fetchAll(),
            ),
        ];
    }

    public function handleWebhook(array $event): array
    {
        $status = (string) ($event['event'] ?? '');
        $reference = (string) ($event['data']['reference'] ?? '');
        $eventId = (string) ($event['id'] ?? $reference);

        if ($status === 'charge.failed' || $status === 'charge.timeout' || $status === 'charge.expired') {
            return $this->handleWebhookFailure($event, $status, $eventId);
        }

        if ($status !== 'charge.success') {
            return ['status' => 'ignored'];
        }

        if ($this->reconciliationService->isWebhookProcessed($eventId, 'paystack')) {
            Telemetry::info('Duplicate webhook ignored', ['event_id' => $eventId]);
            return ['status' => 'already_processed'];
        }

        Telemetry::start('webhook_processing');

        $metadata = $event['data']['metadata'] ?? [];
        $isWalletFunding = ($metadata['type'] ?? '') === 'wallet_funding';

        return $this->database->transaction(function (PDO $pdo) use ($event, $status, $reference, $metadata, $isWalletFunding, $eventId) {
            if ($isWalletFunding) {
                $userId = (int) ($metadata['user_id'] ?? 0);
                $creditAmount = (int) ($metadata['amount'] ?? 0);

                if ($userId <= 0 || $creditAmount <= 0) {
                    return ['status' => 'invalid_wallet_metadata'];
                }

                $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
                $update = $pdo->prepare('UPDATE users SET wallet_balance = wallet_balance + :amount, updated_at = :now WHERE id = :id');
                $update->execute(['amount' => $creditAmount, 'id' => $userId, 'now' => $now]);

                $stmt = $pdo->prepare('SELECT wallet_balance FROM users WHERE id = :id LIMIT 1');
                $stmt->execute(['id' => $userId]);
                $newBalance = (int) ($stmt->fetchColumn() ?? 0);

                $this->reconciliationService->recordWalletTransaction(
                    $userId,
                    'credit',
                    $creditAmount,
                    $newBalance,
                    $reference,
                    'Wallet funded via Paystack'
                );

                $this->reconciliationService->logPayment(
                    'paystack',
                    $reference,
                    $creditAmount,
                    'success',
                    null,
                    'NGN',
                    ['type' => 'wallet_funding', 'user_id' => $userId]
                );

                $this->notificationService->createNotification(
                    $userId,
                    'wallet.funded',
                    'Wallet Funded Successfully',
                    sprintf('Your wallet has been credited with N%s', number_format($creditAmount / 100, 2)),
                    ['amount' => $creditAmount]
                );

                $this->reconciliationService->recordWebhookEvent($eventId, $status, 'paystack', hash('sha256', json_encode($event)));

                $duration = Telemetry::stop('webhook_processing');
                Telemetry::info('Wallet funded via webhook', ['userId' => $userId, 'amount' => $creditAmount, 'ms' => $duration]);
                return ['status' => 'success', 'type' => 'wallet_funding'];
            }

            $stmt = $pdo->prepare('SELECT status, paid_at, total, cart_token FROM orders WHERE order_number = :reference');
            $stmt->execute(['reference' => $reference]);
            $order = $stmt->fetch();

            if ($order === false) {
                $this->reconciliationService->logPayment(
                    'paystack',
                    $reference,
                    (int) ($event['data']['amount'] ?? 0),
                    'orphan',
                    null,
                    'NGN',
                    ['event_id' => $eventId]
                );
                return ['status' => 'order_not_found'];
            }

            $paidAmount = (int) ($event['data']['amount'] ?? 0);
            $expectedAmount = (int) $order['total'];

            if ($paidAmount !== $expectedAmount) {
                Telemetry::error('Webhook amount mismatch', ['paid' => $paidAmount, 'expected' => $expectedAmount, 'ref' => $reference]);
                $this->reconciliationService->logPayment(
                    'paystack',
                    $reference,
                    $paidAmount,
                    'amount_mismatch',
                    $reference,
                    'NGN',
                    ['expected' => $expectedAmount, 'event_id' => $eventId]
                );
                return [
                    'status' => 'amount_mismatch',
                    'received' => $paidAmount,
                    'expected' => $expectedAmount
                ];
            }

            if ($order['status'] === 'paid' || $order['paid_at'] !== null) {
                return ['status' => 'already_processed'];
            }

            $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
            $update = $pdo->prepare('UPDATE orders SET status = "paid", paid_at = :paid_at WHERE order_number = :reference');
            $update->execute(['paid_at' => $now, 'reference' => $reference]);

            if (!empty($order['cart_token'])) {
                $this->cartService->clearCart((string) $order['cart_token']);
            }

            $this->reconciliationService->logPayment(
                'paystack',
                $reference,
                $paidAmount,
                'success',
                $reference,
                'NGN',
                ['event_id' => $eventId]
            );

            $orderData = $this->findByOrderNumber($reference, '', '', true);

            $adminStmt = $pdo->prepare('
                SELECT u.id FROM users u
                JOIN user_roles ur ON u.uuid = ur.user_uuid
                JOIN roles r ON ur.role_id = r.id
                WHERE r.name = "admin"
            ');
            $adminStmt->execute();
            $adminIds = $adminStmt->fetchAll(PDO::FETCH_COLUMN);

            foreach ($adminIds as $adminId) {
                $this->notificationService->createNotification(
                    (int) $adminId,
                    'order.paid',
                    'Order Payment Confirmed',
                    sprintf('Payment received for order %s from %s', $orderData['orderNumber'], $orderData['customerName']),
                    ['orderId' => $orderData['orderNumber']]
                );
            }

            $this->emailService->sendOrderConfirmation($orderData);

            $this->reconciliationService->recordWebhookEvent($eventId, $status, 'paystack', hash('sha256', json_encode($event)));

            $duration = Telemetry::stop('webhook_processing');
            Telemetry::info('Order paid via webhook', ['reference' => $reference, 'ms' => $duration]);

            return ['status' => 'success'];
        });
    }

    public function payWithWallet(int $userId, string $orderNumber): array
    {
        return $this->database->transaction(function (PDO $pdo) use ($userId, $orderNumber) {
            $userStmt = $pdo->prepare('SELECT wallet_balance, email, full_name FROM users WHERE id = :id LIMIT 1');
            $userStmt->execute(['id' => $userId]);
            $user = $userStmt->fetch();

            if (!$user) {
                throw new ApiException('User not found.', 404);
            }

            $orderStmt = $pdo->prepare('SELECT status, total, cart_token FROM orders WHERE order_number = :order_number LIMIT 1');
            $orderStmt->execute(['order_number' => $orderNumber]);
            $order = $orderStmt->fetch();

            if (!$order) {
                throw new ApiException('Order not found.', 404);
            }

            if ($order['status'] === 'paid') {
                throw new ApiException('Order is already paid.', 409);
            }

            $walletBalance = (int) $user['wallet_balance'];
            $orderTotal = (int) $order['total'];

            if ($walletBalance < $orderTotal) {
                throw new ApiException(
                    sprintf('Insufficient wallet balance. Required: N%s, Available: N%s', number_format($orderTotal / 100, 2), number_format($walletBalance / 100, 2)),
                    402
                );
            }

            $newBalance = $walletBalance - $orderTotal;
            $now = (new DateTimeImmutable())->format('Y-m-d H:i:s');

            $updateUser = $pdo->prepare('UPDATE users SET wallet_balance = :balance, updated_at = :now WHERE id = :id');
            $updateUser->execute(['balance' => $newBalance, 'now' => $now, 'id' => $userId]);

            $updateOrder = $pdo->prepare('UPDATE orders SET status = "paid", paid_at = :paid_at, payment_method = "wallet" WHERE order_number = :order_number');
            $updateOrder->execute(['paid_at' => $now, 'order_number' => $orderNumber]);

            if (!empty($order['cart_token'])) {
                $this->cartService->clearCart((string) $order['cart_token']);
            }

            $this->reconciliationService->recordWalletTransaction(
                $userId,
                'debit',
                $orderTotal,
                $newBalance,
                $orderNumber,
                sprintf('Payment for order %s', $orderNumber)
            );

            $this->reconciliationService->logPayment(
                'wallet',
                $orderNumber,
                $orderTotal,
                'success',
                $orderNumber,
                'NGN',
                ['user_id' => $userId]
            );

            $orderData = $this->findByOrderNumber($orderNumber, '', '', true);

            $this->emailService->sendOrderConfirmation($orderData);

            return [
                'success' => true,
                'orderNumber' => $orderNumber,
                'newWalletBalance' => $newBalance,
                'message' => 'Order paid successfully from wallet.',
            ];
        });
    }

    public function getUserOrders(int $userId, int $limit = 50, int $offset = 0): array
    {
        $pdo = $this->database->connection();

        $stmt = $pdo->prepare('SELECT COUNT(*) as total FROM orders WHERE user_id = :user_id');
        $stmt->execute(['user_id' => $userId]);
        $total = (int) $stmt->fetchColumn();

        $stmt = $pdo->prepare(
            'SELECT order_number, status, total, payment_method, created_at FROM orders WHERE user_id = :user_id ORDER BY created_at DESC LIMIT :limit OFFSET :offset'
        );
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return [
            'data' => $stmt->fetchAll(),
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
        ];
    }

    public function markOrderPaid(string $orderNumber): void
    {
        $pdo = $this->database->connection();
        
        $stmt = $pdo->prepare('SELECT status, paid_at, cart_token FROM orders WHERE order_number = :order_number LIMIT 1');
        $stmt->execute(['order_number' => $orderNumber]);
        $order = $stmt->fetch();

        if ($order === false || $order['status'] === 'paid') {
            return;
        }

        $this->database->transaction(function (PDO $pdo) use ($orderNumber, $order) {
            $now = (new DateTimeImmutable())->format('Y-m-d H:i:s');
            $update = $pdo->prepare('UPDATE orders SET status = "paid", paid_at = :paid_at WHERE order_number = :order_number');
            $update->execute(['paid_at' => $now, 'order_number' => $orderNumber]);

            if (!empty($order['cart_token'])) {
                $this->cartService->clearCart((string) $order['cart_token']);
            }

            $orderData = $this->findByOrderNumber($orderNumber, '', '', true);
            $this->emailService->sendOrderConfirmation($orderData);
        });
    }

    public function markOrderFailed(string $orderNumber, string $reason = ''): array
    {
        $pdo = $this->database->connection();
        
        $stmt = $pdo->prepare('SELECT status, cart_token FROM orders WHERE order_number = :order_number LIMIT 1');
        $stmt->execute(['order_number' => $orderNumber]);
        $order = $stmt->fetch();

        if ($order === false) {
            throw new ApiException('Order not found.', 404);
        }

        if ($order['status'] === 'paid') {
            throw new ApiException('Cannot mark a paid order as failed.', 422);
        }

        $restored = $this->restoreInventoryForOrder($orderNumber);

        $now = (new DateTimeImmutable())->format('Y-m-d H:i:s');
        $update = $pdo->prepare('UPDATE orders SET status = "failed", failure_reason = :reason, updated_at = :now WHERE order_number = :order_number');
        $update->execute(['reason' => $reason, 'now' => $now, 'order_number' => $orderNumber]);

        if (!empty($order['cart_token'])) {
            $this->cartService->clearCart((string) $order['cart_token']);
        }

        return [
            'message' => 'Order marked as failed.',
            'restored_stock' => $restored,
        ];
    }

    public function restoreInventoryForOrder(string $orderNumber): int
    {
        $pdo = $this->database->connection();

        $stmt = $pdo->prepare('
            SELECT oi.product_id, oi.quantity
            FROM order_items oi
            INNER JOIN orders o ON o.id = oi.order_id
            WHERE o.order_number = :order_number
        ');
        $stmt->execute(['order_number' => $orderNumber]);
        $items = $stmt->fetchAll();

        $restored = 0;
        $now = (new DateTimeImmutable())->format('Y-m-d H:i:s');
        $restoreStmt = $pdo->prepare('UPDATE inventory SET stock_level = stock_level + :qty, updated_at = :now WHERE product_id = :product_id');

        foreach ($items as $item) {
            $restoreStmt->execute([
                'qty' => (int) $item['quantity'],
                'now' => $now,
                'product_id' => (string) $item['product_id'],
            ]);
            $restored += (int) $item['quantity'];
        }

        return $restored;
    }

    public function cleanupAbandonedOrders(int $ageMinutes = 30): int
    {
        $pdo = $this->database->connection();
        $isMysql = ($_ENV['DB_DRIVER'] ?? 'sqlite') === 'mysql';

        $stmt = $pdo->prepare($isMysql
            ? 'SELECT order_number FROM orders
               WHERE status = "processing"
               AND created_at < DATE_SUB(NOW(), INTERVAL :threshold MINUTE)'
            : 'SELECT order_number FROM orders
               WHERE status = "processing"
               AND created_at < datetime("now", :threshold)'
        );
        $stmt->execute(['threshold' => '-' . $ageMinutes . ' minutes']);
        $abandoned = $stmt->fetchAll();

        $cleaned = 0;
        foreach ($abandoned as $order) {
            try {
                $this->restoreInventoryForOrder((string) $order['order_number']);
                
                $now = (new DateTimeImmutable())->format('Y-m-d H:i:s');
                $update = $pdo->prepare('UPDATE orders SET status = "abandoned", updated_at = :now WHERE order_number = :order_number');
                $update->execute(['now' => $now, 'order_number' => $order['order_number']]);
                
                $cleaned++;
            } catch (\Exception $e) {
                Telemetry::error('Abandoned order cleanup failed', ['order' => $order['order_number'], 'error' => $e->getMessage()]);
            }
        }

        return $cleaned;
    }

    private function handleWebhookFailure(array $event, string $eventType, string $eventId): array
    {
        $reference = (string) ($event['data']['reference'] ?? '');
        $gatewayMessage = (string) ($event['data']['gateway_response'] ?? '');

        if ($this->reconciliationService->isWebhookProcessed($eventId, 'paystack')) {
            Telemetry::info('Duplicate failure webhook ignored', ['event_id' => $eventId]);
            return ['status' => 'already_processed'];
        }

        try {
            $result = $this->markOrderFailed($reference, $gatewayMessage ?: $eventType);

            $this->reconciliationService->logPayment(
                'paystack',
                $reference,
                (int) ($event['data']['amount'] ?? 0),
                'failed',
                null,
                'NGN',
                ['gateway_response' => $gatewayMessage, 'event_type' => $eventType]
            );

            $this->reconciliationService->recordWebhookEvent($eventId, $eventType, 'paystack', hash('sha256', json_encode($event)));

            Telemetry::info('Payment failure handled via webhook', ['reference' => $reference, 'reason' => $gatewayMessage]);

            return ['status' => 'failure_handled', 'reference' => $reference, 'restored_stock' => $result['restored_stock']];
        } catch (\Exception $e) {
            Telemetry::error('Failed to process payment failure webhook', ['reference' => $reference, 'error' => $e->getMessage()]);
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
}
