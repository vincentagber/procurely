<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\ContentStore;
use Procurely\Api\Support\Database;

final class CartService
{
    public function __construct(
        private readonly Database $database,
        private readonly ContentStore $contentStore,
    ) {
    }

    public function getCart(string $cartToken): array
    {
        if (trim($cartToken) === '') {
            throw new ApiException('Cart token is required.', 422);
        }

        $statement = $this->database->connection()->prepare(
            'SELECT id, cart_token, product_id, quantity FROM cart_items WHERE cart_token = :cart_token ORDER BY id ASC'
        );
        $statement->execute(['cart_token' => $cartToken]);
        $rows = $statement->fetchAll();

        $items = [];
        $subtotal = 0;

        foreach ($rows as $row) {
            $product = $this->contentStore->productById((string) $row['product_id']);

            if ($product === null) {
                continue;
            }

            $quantity = (int) $row['quantity'];
            $lineTotal = (int) $product['price'] * $quantity;
            $subtotal += $lineTotal;

            $items[] = [
                'id' => (int) $row['id'],
                'cartToken' => $row['cart_token'],
                'quantity' => $quantity,
                'lineTotal' => $lineTotal,
                'product' => $product,
            ];
        }

        $serviceFee = $subtotal >= 100000 ? 0 : ($subtotal > 0 ? 3500 : 0);

        return [
            'cartToken' => $cartToken,
            'items' => $items,
            'subtotal' => $subtotal,
            'serviceFee' => $serviceFee,
            'total' => $subtotal + $serviceFee,
        ];
    }

    public function addItem(array $payload): array
    {
        $cartToken = trim((string) ($payload['cartToken'] ?? ''));
        $productId = trim((string) ($payload['productId'] ?? ''));
        $quantity = max(1, (int) ($payload['quantity'] ?? 1));

        if ($cartToken === '') {
            throw new ApiException('Cart token is required.', 422);
        }

        $product = $this->contentStore->productById($productId);

        if ($product === null) {
            throw new ApiException('Product not found.', 404);
        }

        $pdo = $this->database->connection();
        $existing = $pdo->prepare('SELECT id, quantity FROM cart_items WHERE cart_token = :cart_token AND product_id = :product_id LIMIT 1');
        $existing->execute([
            'cart_token' => $cartToken,
            'product_id' => $productId,
        ]);
        $item = $existing->fetch();
        $timestamp = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);

        if ($item !== false) {
            $update = $pdo->prepare('UPDATE cart_items SET quantity = :quantity, updated_at = :updated_at WHERE id = :id');
            $update->execute([
                'quantity' => (int) $item['quantity'] + $quantity,
                'updated_at' => $timestamp,
                'id' => $item['id'],
            ]);
        } else {
            $insert = $pdo->prepare(
                'INSERT INTO cart_items (cart_token, product_id, quantity, created_at, updated_at) VALUES (:cart_token, :product_id, :quantity, :created_at, :updated_at)'
            );
            $insert->execute([
                'cart_token' => $cartToken,
                'product_id' => $productId,
                'quantity' => $quantity,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ]);
        }

        return $this->getCart($cartToken);
    }

    public function updateItem(int $itemId, array $payload): array
    {
        $quantity = max(1, (int) ($payload['quantity'] ?? 1));
        $cartToken = trim((string) ($payload['cartToken'] ?? ''));

        if ($cartToken === '') {
            throw new ApiException('Cart token is required.', 422);
        }

        $statement = $this->database->connection()->prepare('UPDATE cart_items SET quantity = :quantity, updated_at = :updated_at WHERE id = :id AND cart_token = :cart_token');
        $statement->execute([
            'quantity' => $quantity,
            'updated_at' => (new DateTimeImmutable())->format(DateTimeImmutable::ATOM),
            'id' => $itemId,
            'cart_token' => $cartToken,
        ]);

        if ($statement->rowCount() === 0) {
            throw new ApiException('Cart item not found.', 404);
        }

        return $this->getCart($cartToken);
    }

    public function removeItem(int $itemId, string $cartToken): array
    {
        if (trim($cartToken) === '') {
            throw new ApiException('Cart token is required.', 422);
        }

        $statement = $this->database->connection()->prepare('DELETE FROM cart_items WHERE id = :id AND cart_token = :cart_token');
        $statement->execute([
            'id' => $itemId,
            'cart_token' => $cartToken,
        ]);

        return $this->getCart($cartToken);
    }

    public function clearCart(string $cartToken): void
    {
        $statement = $this->database->connection()->prepare('DELETE FROM cart_items WHERE cart_token = :cart_token');
        $statement->execute(['cart_token' => $cartToken]);
    }
}
