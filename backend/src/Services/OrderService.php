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

        $cart = $this->cartService->getCart($cartToken);
        if (($cart['items'] ?? []) === []) {
            throw new ApiException('Cart is empty.', 422);
        }

        /** @var array $orderData */
        $orderData = $this->database->transaction(function (PDO $pdo) use ($cart, $userId, $cartToken, $customerName, $customerEmail, $phone, $address, $skipPayment) {
            Telemetry::start('order_processing');
            
            // 1. Idempotency Check
            $checkExisting = $pdo->prepare('SELECT order_number FROM orders WHERE cart_token = :cart_token LIMIT 1');
            $checkExisting->execute(['cart_token' => $cartToken]);
            $existing = $checkExisting->fetch();

            if ($existing !== false) {
                return $this->findByOrderNumber((string) $existing['order_number']);
            }

            // 2. Inventory Validation & Deduction
            $checkStock = $pdo->prepare('SELECT stock_level FROM inventory WHERE product_id = :product_id LIMIT 1');
            $deductStock = $pdo->prepare('UPDATE inventory SET stock_level = stock_level - :qty, updated_at = :now WHERE product_id = :product_id AND stock_level >= :qty');
            $now = (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM);

            foreach ($cart['items'] as $item) {
                $productId = (string) $item['product']['id'];
                $quantity = (int) $item['quantity'];

                $checkStock->execute(['product_id' => $productId]);
                $stock = $checkStock->fetch();

                if ($stock === false || (int) $stock['stock_level'] < $quantity) {
                    Telemetry::error('Inadequate stock', ['product' => $productId]);
                    throw new ApiException(sprintf('Insufficient stock for %s.', $item['product']['name']), 422);
                }

                $deductStock->execute(['qty' => $quantity, 'now' => $now, 'product_id' => $productId]);
            }

            // 3. Persist Order Root
            $orderNumber = sprintf('PR-%s', strtoupper(substr(bin2hex(random_bytes(6)), 0, 10)));
            $createdAt = (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM);
            
            $insertOrder = $pdo->prepare('
                INSERT INTO orders (user_id, order_number, cart_token, customer_name, customer_email, phone, address, subtotal, vat, shipping_fee, service_fee, total, status, created_at)
                VALUES (:user_id, :order_number, :cart_token, :customer_name, :customer_email, :phone, :address, :subtotal, :vat, :shipping_fee, :service_fee, :total, "processing", :created_at)
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

            if (!$skipPayment) {
                $this->paymentProcessor->capture($orderNumber, (int) $cart['total'], $customerEmail);
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
                JOIN user_roles ur ON u.id = ur.user_id
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
            'SELECT order_number, cart_token, customer_name, customer_email, phone, address, subtotal, vat, shipping_fee, service_fee, total, status, created_at
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

        if ($status !== 'charge.success') {
            return ['status' => 'ignored'];
        }

        Telemetry::start('webhook_processing');

        $metadata = $event['data']['metadata'] ?? [];
        $isWalletFunding = ($metadata['type'] ?? '') === 'wallet_funding';

        $pdo = $this->database->connection();
        $pdo->exec('BEGIN IMMEDIATE TRANSACTION');

        try {
            if ($isWalletFunding) {
                $userId = (int) ($metadata['user_id'] ?? 0);
                $creditAmount = (int) ($metadata['amount'] ?? 0);

                if ($userId <= 0 || $creditAmount <= 0) {
                    if ($pdo->inTransaction()) { $pdo->rollBack(); }
                    return ['status' => 'invalid_wallet_metadata'];
                }

                $now = (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM);
                $update = $pdo->prepare('UPDATE users SET wallet_balance = wallet_balance + :amount, updated_at = :now WHERE id = :id');
                $update->execute(['amount' => $creditAmount, 'id' => $userId, 'now' => $now]);

                $pdo->commit();
                
                $this->notificationService->createNotification(
                    $userId,
                    'wallet.funded',
                    'Wallet Funded Successfully',
                    sprintf('Your wallet has been credited with N%s', number_format($creditAmount / 100, 2)),
                    ['amount' => $creditAmount]
                );

                Telemetry::stop('webhook_processing');
                Telemetry::info('Wallet funded via webhook', ['userId' => $userId, 'amount' => $creditAmount]);
                return ['status' => 'success', 'type' => 'wallet_funding'];
            }

            $stmt = $pdo->prepare('SELECT status, paid_at, total, cart_token FROM orders WHERE order_number = :reference');
            $stmt->execute(['reference' => $reference]);
            $order = $stmt->fetch();

            if ($order === false) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                return ['status' => 'order_not_found'];
            }

            // Verify amount matches order total (Paystack sends amount in cents/kobo)
            $paidAmount = (int) ($event['data']['amount'] ?? 0);
            $expectedAmount = (int) $order['total'];

            if ($paidAmount !== $expectedAmount) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                Telemetry::error('Webhook amount mismatch', ['paid' => $paidAmount, 'expected' => $expectedAmount, 'ref' => $reference]);
                return [
                    'status' => 'amount_mismatch',
                    'received' => $paidAmount,
                    'expected' => $expectedAmount
                ];
            }

            if ($order['status'] === 'paid' || $order['paid_at'] !== null) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                return ['status' => 'already_processed'];
            }

            $now = (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM);
            $update = $pdo->prepare('UPDATE orders SET status = "paid", paid_at = :paid_at WHERE order_number = :reference');
            $update->execute(['paid_at' => $now, 'reference' => $reference]);

            // Clear the associated cart
            if (!empty($order['cart_token'])) {
                $this->cartService->clearCart((string) $order['cart_token']);
            }

            $pdo->commit();

            // Webhooks get data from Paystack, bypass email check.
            $orderData = $this->findByOrderNumber($reference, '', '', true);
            $this->emailService->sendOrderConfirmation($orderData);

            $duration = Telemetry::stop('webhook_processing');
            Telemetry::info('Order paid via webhook', ['reference' => $reference, 'ms' => $duration]);

            // Create dashboard notification for admins
            $adminStmt = $pdo->prepare('
                SELECT u.id FROM users u
                JOIN user_roles ur ON u.id = ur.user_id
                JOIN roles r ON ur.role_id = r.id
                WHERE r.name = :role
            ');
            $adminStmt->execute(['role' => 'admin']);
            $admins = $adminStmt->fetchAll(PDO::FETCH_COLUMN);

            foreach ($admins as $adminId) {
                $this->notificationService->createNotification(
                    (int) $adminId,
                    'order.paid',
                    'Order Payment Confirmed',
                    sprintf('Payment received for order %s from %s', $orderData['orderNumber'], $orderData['customerName']),
                    ['orderId' => $orderData['orderNumber']]
                );
            }

            return ['status' => 'success'];
        } catch (\Throwable $e) {
            if ($pdo && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    public function getUserOrders(int $userId): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare(
            'SELECT order_number, status, total, created_at FROM orders WHERE user_id = :user_id ORDER BY created_at DESC'
        );
        $stmt->execute(['user_id' => $userId]);

        return $stmt->fetchAll();
    }

    public function markOrderPaid(string $orderNumber): void
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare(
            'UPDATE orders SET status = :status, paid_at = :paid_at WHERE order_number = :order_number'
        );
        $stmt->execute([
            'status' => 'paid',
            'paid_at' => (new DateTimeImmutable())->format('Y-m-d H:i:s'),
            'order_number' => $orderNumber,
        ]);
    }
}
