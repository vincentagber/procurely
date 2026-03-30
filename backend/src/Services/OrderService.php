<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\Input;

final class OrderService
{
    public function __construct(
        private readonly Database $database,
        private readonly CartService $cartService,
        private readonly \Procurely\Api\Support\PaymentProcessor $paymentProcessor,
        private readonly \Procurely\Api\Support\EmailService $emailService,
    ) {
    }

    public function checkout(array $payload, ?int $userId = null): array
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

        $pdo = $this->database->connection();

        $checkExisting = $pdo->prepare('SELECT order_number FROM orders WHERE cart_token = :cart_token LIMIT 1');
        $checkExisting->execute(['cart_token' => $cartToken]);
        $existing = $checkExisting->fetch();

        if ($existing !== false) {
            return $this->findByOrderNumber((string) $existing['order_number']);
        }

        // Use BEGIN IMMEDIATE to prevent write-lock contention during stock validation.
        $pdo->exec('BEGIN IMMEDIATE TRANSACTION');

        try {
            // Verify and deduct stock for each item
            $checkStock = $pdo->prepare('SELECT stock_level FROM inventory WHERE product_id = :product_id LIMIT 1');
            $deductStock = $pdo->prepare('UPDATE inventory SET stock_level = stock_level - :qty, updated_at = :now WHERE product_id = :product_id AND stock_level >= :qty');
            $now = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);

            foreach ($cart['items'] as $item) {
                $productId = (string) $item['product']['id'];
                $quantity = (int) $item['quantity'];

                $checkStock->execute(['product_id' => $productId]);
                $stock = $checkStock->fetch();

                if ($stock === false || (int) $stock['stock_level'] < $quantity) {
                    throw new ApiException(sprintf('Insufficient stock for %s.', $item['product']['name']), 422);
                }

                $deductStock->execute([
                    'qty' => $quantity,
                    'now' => $now,
                    'product_id' => $productId,
                ]);

                if ($deductStock->rowCount() === 0) {
                    throw new ApiException(sprintf('Stock for %s was depleted by another order.', $item['product']['name']), 422);
                }
            }

            $orderNumber = sprintf('PR-%s', strtoupper(substr(bin2hex(random_bytes(6)), 0, 10)));
            $createdAt = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);
            $insertOrder = $pdo->prepare(
                'INSERT INTO orders (user_id, order_number, cart_token, customer_name, customer_email, phone, address, subtotal, service_fee, total, status, created_at)
                 VALUES (:user_id, :order_number, :cart_token, :customer_name, :customer_email, :phone, :address, :subtotal, :service_fee, :total, :status, :created_at)'
            );
            $insertOrder->execute([
                'user_id' => $userId,
                'order_number' => $orderNumber,
                'cart_token' => $cartToken,
                'customer_name' => $customerName,
                'customer_email' => $customerEmail,
                'phone' => $phone,
                'address' => $address,
                'subtotal' => $cart['subtotal'],
                'service_fee' => $cart['serviceFee'],
                'total' => $cart['total'],
                'status' => 'processing',
                'created_at' => $createdAt,
            ]);

            $orderId = (int) $pdo->lastInsertId();
            $insertItem = $pdo->prepare(
                'INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
                 VALUES (:order_id, :product_id, :product_name, :unit_price, :quantity, :line_total)'
            );

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

            $this->paymentProcessor->capture($orderNumber, (int) $cart['total']);

            $pdo->commit();
        } catch (\Throwable $exception) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $exception;
        }

        $this->cartService->clearCart($cartToken);

        $orderData = $this->findByOrderNumber($orderNumber);
        $this->emailService->sendOrderConfirmation($orderData);

        return $orderData;
    }

    public function findByOrderNumber(string $orderNumber, string $cartToken = '', string $email = '', bool $isAdmin = false): array
    {
        $pdo = $this->database->connection();
        $orderStatement = $pdo->prepare(
            'SELECT order_number, cart_token, customer_name, customer_email, phone, address, subtotal, service_fee, total, status, created_at
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

        $pdo = $this->database->connection();
        $pdo->exec('BEGIN IMMEDIATE TRANSACTION');

        try {
            $stmt = $pdo->prepare('SELECT status, paid_at FROM orders WHERE order_number = :reference');
            $stmt->execute(['reference' => $reference]);
            $order = $stmt->fetch();

            if ($order === false) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                return ['status' => 'order_not_found'];
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

            $pdo->commit();

            // Webhooks get data from Paystack, bypass email check.
            $orderData = $this->findByOrderNumber($reference, '', '', true);
            $this->emailService->sendOrderConfirmation($orderData);

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
}
