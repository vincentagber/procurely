<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\ContentStore;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\Input;

final class CartService
{
    public function __construct(
        private readonly Database $database,
        private readonly ContentStore $contentStore,
    ) {
    }

    public function getCart(string $cartToken): array
    {
        $cartToken = Input::cartToken(['cartToken' => $cartToken]);

        $statement = $this->database->connection()->prepare(
            'SELECT id, cart_token, product_id, quantity FROM cart_items WHERE cart_token = :cart_token ORDER BY id ASC'
        );
        $statement->execute(['cart_token' => $cartToken]);
        $rows = $statement->fetchAll();

        $productIds = array_map(fn($row) => (string)$row['product_id'], $rows);
        $products = $this->contentStore->productsByIds($productIds);
        $productsLookup = array_column($products, null, 'id');

        $items = [];
        $subtotal = 0;

        foreach ($rows as $row) {
            $product = $productsLookup[(string)$row['product_id']] ?? null;

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
        
        // Centralized business rules for VAT and Shipping
        $vat = round($subtotal * 0.075); // 7.5% VAT
        $shippingFee = $subtotal > 0 ? 20000 : 0; // Flat N20k shipping for active carts

        return [
            'cartToken' => $cartToken,
            'items' => $items,
            'subtotal' => $subtotal,
            'vat' => (int) $vat,
            'shippingFee' => (int) $shippingFee,
            'serviceFee' => $serviceFee,
            'total' => $subtotal + $vat + $shippingFee + $serviceFee,
        ];
    }

    public function addItem(array $payload): array
    {
        $cartToken = Input::cartToken($payload);
        $productId = Input::productId($payload);
        $quantity = Input::intRange($payload['quantity'] ?? null, 'Quantity', 1, 100, 1);

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
        $timestamp = (new DateTimeImmutable())->format('Y-m-d H:i:s');
        $item = $existing->fetch();

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
        if ($itemId <= 0) {
            throw new ApiException('Cart item ID is invalid.', 422);
        }

        $quantity = Input::intRange($payload['quantity'] ?? null, 'Quantity', 1, 100, 1);
        $cartToken = Input::cartToken($payload);

        $statement = $this->database->connection()->prepare('UPDATE cart_items SET quantity = :quantity, updated_at = :updated_at WHERE id = :id AND cart_token = :cart_token');
        $statement->execute([
            'quantity' => $quantity,
            'updated_at' => (new DateTimeImmutable())->format('Y-m-d H:i:s'),
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
        if ($itemId <= 0) {
            throw new ApiException('Cart item ID is invalid.', 422);
        }

        $cartToken = Input::cartToken(['cartToken' => $cartToken]);

        $statement = $this->database->connection()->prepare('DELETE FROM cart_items WHERE id = :id AND cart_token = :cart_token');
        $statement->execute([
            'id' => $itemId,
            'cart_token' => $cartToken,
        ]);

        if ($statement->rowCount() === 0) {
            throw new ApiException('Cart item not found.', 404);
        }

        return $this->getCart($cartToken);
    }

    public function mergeCarts(string $sourceToken, string $destinationToken): array
    {
        if ($sourceToken === $destinationToken || $sourceToken === '') {
            return $this->getCart($destinationToken);
        }

        $pdo = $this->database->connection();
        
        // 1. Get all items from the source (guest) cart
        $stmt = $pdo->prepare('SELECT product_id, quantity FROM cart_items WHERE cart_token = :source_token');
        $stmt->execute(['source_token' => $sourceToken]);
        $sourceItems = $stmt->fetchAll();

        if (empty($sourceItems)) {
            return $this->getCart($destinationToken);
        }

        $timestamp = (new DateTimeImmutable())->format('Y-m-d H:i:s');

        foreach ($sourceItems as $item) {
            $productId = $item['product_id'];
            $quantity = (int) $item['quantity'];

            // 2. Check if the item already exists in the destination (user) cart
            $existing = $pdo->prepare('SELECT id, quantity FROM cart_items WHERE cart_token = :dest_token AND product_id = :product_id LIMIT 1');
            $existing->execute([
                'dest_token' => $destinationToken,
                'product_id' => $productId,
            ]);
            $existingItem = $existing->fetch();

            if ($existingItem !== false) {
                // Update quantity
                $update = $pdo->prepare('UPDATE cart_items SET quantity = :quantity, updated_at = :updated_at WHERE id = :id');
                $update->execute([
                    'quantity' => (int) $existingItem['quantity'] + $quantity,
                    'updated_at' => $timestamp,
                    'id' => $existingItem['id'],
                ]);
            } else {
                // Insert new item
                $insert = $pdo->prepare(
                    'INSERT INTO cart_items (cart_token, product_id, quantity, created_at, updated_at) VALUES (:cart_token, :product_id, :quantity, :created_at, :updated_at)'
                );
                $insert->execute([
                    'cart_token' => $destinationToken,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ]);
            }
        }

        // 3. Clear the source cart
        $this->clearCart($sourceToken);

        return $this->getCart($destinationToken);
    }

    public function clearCart(string $cartToken): void
    {
        $statement = $this->database->connection()->prepare('DELETE FROM cart_items WHERE cart_token = :cart_token');
        $statement->execute(['cart_token' => $cartToken]);
    }
}
