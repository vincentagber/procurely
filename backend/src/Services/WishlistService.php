<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use PDO;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\ContentStore;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\Input;

final class WishlistService
{
    public function __construct(
        private readonly Database $database,
        private readonly ContentStore $contentStore,
    ) {
    }

    public function getWishlist(string $token): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT product_id FROM wishlist_items WHERE wishlist_token = :token ORDER BY created_at DESC');
        $stmt->execute(['token' => $token]);
        $rows = $stmt->fetchAll();

        $productIds = array_column($rows, 'product_id');
        $products = $this->contentStore->productsByIds($productIds);

        // Maintain original order
        $lookup = array_column($products, null, 'id');
        $result = [];
        foreach ($productIds as $id) {
            if (isset($lookup[$id])) {
                $result[] = $lookup[$id];
            }
        }

        return [
            'wishlistToken' => $token,
            'items' => $result,
        ];
    }

    public function addItem(array $payload): array
    {
        $token = Input::requiredString($payload, 'wishlistToken', 'Wishlist token', 64);
        $productId = Input::requiredString($payload, 'productId', 'Product ID', 64);

        $pdo = $this->database->connection();
        $createdAt = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);

        $stmt = $pdo->prepare('INSERT OR IGNORE INTO wishlist_items (wishlist_token, product_id, created_at) VALUES (:token, :product_id, :created_at)');
        $stmt->execute([
            'token' => $token,
            'product_id' => $productId,
            'created_at' => $createdAt,
        ]);

        return $this->getWishlist($token);
    }

    public function removeItem(string $productId, string $token): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('DELETE FROM wishlist_items WHERE wishlist_token = :token AND product_id = :product_id');
        $stmt->execute([
            'token' => $token,
            'product_id' => $productId,
        ]);

        return $this->getWishlist($token);
    }
}
