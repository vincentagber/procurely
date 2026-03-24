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
    ) {
    }

    public function checkout(array $payload): array
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
        $pdo->beginTransaction();

        try {
            $orderNumber = sprintf('PR-%s', strtoupper(substr(bin2hex(random_bytes(6)), 0, 10)));
            $createdAt = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);
            $insertOrder = $pdo->prepare(
                'INSERT INTO orders (order_number, cart_token, customer_name, customer_email, phone, address, subtotal, service_fee, total, status, created_at)
                 VALUES (:order_number, :cart_token, :customer_name, :customer_email, :phone, :address, :subtotal, :service_fee, :total, :status, :created_at)'
            );
            $insertOrder->execute([
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

            $pdo->commit();
        } catch (\Throwable $exception) {
            $pdo->rollBack();
            throw $exception;
        }

        $this->cartService->clearCart($cartToken);

        return $this->findByOrderNumber($orderNumber);
    }

    public function findByOrderNumber(string $orderNumber): array
    {
        $pdo = $this->database->connection();
        $orderStatement = $pdo->prepare('SELECT * FROM orders WHERE order_number = :order_number LIMIT 1');
        $orderStatement->execute(['order_number' => $orderNumber]);
        $order = $orderStatement->fetch();

        if ($order === false) {
            throw new ApiException('Order not found.', 404);
        }

        $itemsStatement = $pdo->prepare('SELECT product_id, product_name, unit_price, quantity, line_total FROM order_items WHERE order_id = :order_id');
        $itemsStatement->execute(['order_id' => $order['id']]);

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
}
