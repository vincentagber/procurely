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
        private readonly \Procurely\Api\Support\Storage $storage,
    ) {
    }

    public function uploadImage(array $file): array
    {
        $url = $this->storage->save($file);
        return ['url' => $url];
    }

    public function getStats(): array
    {
        $pdo = $this->database->connection();

        // Optimized query: Single pass over the data where possible, 
        // though subqueries are often fine for small/medium SQLite DBs.
        $sql = '
            SELECT 
                (SELECT COUNT(id) FROM orders) as totalOrders,
                (SELECT COUNT(id) FROM users) as totalUsers,
                (SELECT SUM(total) FROM orders WHERE status = "paid") as totalRevenue,
                (SELECT COUNT(id) FROM quote_requests) as pendingQuotes
        ';
        
        $stats = $pdo->query($sql)->fetch();

        return [
            'totalOrders' => (int) ($stats['totalOrders'] ?? 0),
            'totalUsers' => (int) ($stats['totalUsers'] ?? 0),
            'totalRevenue' => (int) ($stats['totalRevenue'] ?? 0),
            'pendingQuotes' => (int) ($stats['pendingQuotes'] ?? 0),
        ];
    }

    public function listOrders(int $limit = 50, int $offset = 0): array
    {
        // Enforce safety limits
        $limit = max(1, min(100, $limit));
        $offset = max(0, $offset);

        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('
            SELECT order_number, customer_name, customer_email, total, status, created_at 
            FROM orders 
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function listUsers(int $limit = 50, int $offset = 0): array
    {
        // Enforce safety limits
        $limit = max(1, min(100, $limit));
        $offset = max(0, $offset);

        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('
            SELECT u.uuid, u.full_name, u.email, u.created_at, GROUP_CONCAT(r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            GROUP BY u.id
            ORDER BY u.created_at DESC 
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();

        return array_map(function (array $user): array {
            $user['roles'] = $user['roles'] ? explode(',', (string) $user['roles']) : [];
            return $user;
        }, $stmt->fetchAll());
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

    public function deleteUser(string $uuid, string $adminUuid): array
    {
        if ($uuid === $adminUuid) {
            throw new ApiException('You cannot delete your own administrative account.', 403);
        }

        $pdo = $this->database->connection();
        $pdo->beginTransaction();

        try {
            // Remove active sessions first
            $deleteSessions = $pdo->prepare('
                DELETE FROM user_sessions 
                WHERE user_id = (SELECT id FROM users WHERE uuid = :uuid)
            ');
            $deleteSessions->execute(['uuid' => $uuid]);

            // Delete the user record
            $deleteUser = $pdo->prepare('DELETE FROM users WHERE uuid = :uuid');
            $deleteUser->execute(['uuid' => $uuid]);

            if ($deleteUser->rowCount() === 0) {
                throw new ApiException('User identity not found in registry.', 404);
            }

            $pdo->commit();
            return ['message' => 'User identity successfully purged from registry.'];
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }
}
