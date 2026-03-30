<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\ContentStore;
use Procurely\Api\Support\Database;

final class AdminService
{
    public function __construct(
        private readonly Database $database,
        private readonly ContentStore $contentStore,
    ) {
    }

    public function getStats(): array
    {
        $pdo = $this->database->connection();

        $totalOrders = (int) $pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn();
        $totalUsers = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
        $totalRevenue = (int) $pdo->query('SELECT SUM(total) FROM orders WHERE status = "paid"')->fetchColumn();
        $pendingQuotes = (int) $pdo->query('SELECT COUNT(*) FROM quote_requests')->fetchColumn();

        return [
            'totalOrders' => $totalOrders,
            'totalUsers' => $totalUsers,
            'totalRevenue' => $totalRevenue,
            'pendingQuotes' => $pendingQuotes,
        ];
    }

    public function listOrders(int $limit = 50, int $offset = 0): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT :limit OFFSET :offset');
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function listUsers(int $limit = 50, int $offset = 0): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT uuid, full_name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT :limit OFFSET :offset');
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function updateOrderStatus(string $orderNumber, string $status): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('UPDATE orders SET status = :status WHERE order_number = :order_number');
        $stmt->execute(['status' => $status, 'order_number' => $orderNumber]);

        return ['message' => 'Order status updated.'];
    }

    // ─── Product Management ───────────────────────────────────────────────────

    public function listProducts(): array
    {
        return $this->contentStore->products();
    }

    public function saveProduct(array $payload): array
    {
        $name = trim((string) ($payload['name'] ?? ''));
        if ($name === '') {
            throw new ApiException('Product name is required.', 422);
        }

        $price = (int) ($payload['price'] ?? 0);
        if ($price <= 0) {
            throw new ApiException('Product price must be a positive number.', 422);
        }

        // Generate slug + id from name if not provided
        $slug = trim((string) ($payload['slug'] ?? ''));
        if ($slug === '') {
            $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $name) ?? $name);
            $slug = trim($slug, '-');
        }

        $id = trim((string) ($payload['id'] ?? ''));
        if ($id === '') {
            $id = $slug;
        }

        $product = [
            'id'               => $id,
            'slug'             => $slug,
            'name'             => $name,
            'shortDescription' => trim((string) ($payload['shortDescription'] ?? '')),
            'category'         => trim((string) ($payload['category'] ?? 'General')),
            'collection'       => trim((string) ($payload['collection'] ?? '')),
            'price'            => $price,
            'currency'         => 'NGN',
            'image'            => trim((string) ($payload['image'] ?? '/assets/design/product-placeholder.png')),
            'badge'            => trim((string) ($payload['badge'] ?? '')),
            'featured'         => (bool) ($payload['featured'] ?? false),
            'homepageSlot'     => trim((string) ($payload['homepageSlot'] ?? '')),
        ];

        $saved = $this->contentStore->saveProduct($product);

        // Ensure inventory entry exists for new products
        $pdo = $this->database->connection();
        $now = (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM);
        $stmt = $pdo->prepare('INSERT OR IGNORE INTO inventory (product_id, stock_level, updated_at) VALUES (?, ?, ?)');
        $stmt->execute([$id, (int) ($payload['stockLevel'] ?? 100), $now]);

        return $saved;
    }

    public function deleteProduct(string $id): array
    {
        $this->contentStore->deleteProduct($id);
        return ['message' => 'Product deleted.'];
    }
}
