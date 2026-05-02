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
        private readonly \Procurely\Api\Support\EmailService $emailService,
        private readonly NotificationService $notificationService,
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
            LEFT JOIN user_roles ur ON u.uuid = ur.user_uuid
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

    private const VALID_STATUSES = [
        'pending',
        'processing',
        'paid',
        'fulfilled',
        'dispatched',
        'delivered',
        'cancelled',
        'refunded',
        'pending_delivery',
    ];

    private const ALLOWED_TRANSITIONS = [
        'processing' => ['paid', 'fulfilled', 'cancelled'],
        'paid' => ['fulfilled', 'cancelled', 'refunded'],
        'fulfilled' => ['dispatched', 'cancelled'],
        'dispatched' => ['delivered', 'cancelled'],
        'delivered' => ['refunded'],
        'pending_delivery' => ['paid', 'delivered', 'cancelled'],
        'pending' => ['processing', 'cancelled'],
        'cancelled' => [],
        'refunded' => [],
    ];

    public function updateOrderStatus(string $orderNumber, string $status): array
    {
        if (!in_array($status, self::VALID_STATUSES, true)) {
            throw new ApiException('Invalid order status. Allowed: ' . implode(', ', self::VALID_STATUSES), 422);
        }

        $pdo = $this->database->connection();

        $check = $pdo->prepare('SELECT status, customer_email, customer_name, total FROM orders WHERE order_number = :order_number LIMIT 1');
        $check->execute(['order_number' => $orderNumber]);
        $current = $check->fetch();

        if ($current === false) {
            throw new ApiException('Order not found.', 404);
        }

        $oldStatus = (string) $current['status'];

        if ($oldStatus === $status) {
            return ['message' => 'Order status is already set to this value.', 'oldStatus' => $oldStatus, 'newStatus' => $status];
        }

        $allowed = self::ALLOWED_TRANSITIONS[$oldStatus] ?? [];
        if (!in_array($status, $allowed, true)) {
            $validTargets = $allowed !== [] ? implode(', ', $allowed) : 'none (terminal state)';
            throw new ApiException(
                sprintf('Invalid state transition from "%s" to "%s". Allowed transitions: %s.', $oldStatus, $status, $validTargets),
                422
            );
        }

        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $updateFields = ['status' => $status];
        if ($status === 'paid' && $oldStatus !== 'paid') {
            $updateFields['paid_at'] = $now;
        }
        if (in_array($status, ['cancelled', 'refunded'], true)) {
            $updateFields['paid_at'] = null;
        }

        $setClause = implode(', ', array_map(fn($k) => "$k = :$k", array_keys($updateFields)));
        $stmt = $pdo->prepare("UPDATE orders SET {$setClause} WHERE order_number = :order_number");
        $stmt->execute(array_merge($updateFields, ['order_number' => $orderNumber]));

        $auditStmt = $pdo->prepare('
            INSERT INTO audit_logs (user_id, action, resource, resource_id, old_values, new_values, created_at)
            SELECT u.id, "order.status_changed", "order", :order_number, :old_values, :new_values, :created_at
            FROM users u JOIN user_sessions us ON u.id = us.user_id
            WHERE us.token = :admin_token AND us.expires_at > :now
            LIMIT 1
        ');
        $auditStmt->execute([
            'order_number' => $orderNumber,
            'old_values' => json_encode(['status' => $oldStatus]),
            'new_values' => json_encode(['status' => $status]),
            'created_at' => $now,
            'admin_token' => $this->getAdminToken(),
            'now' => $now
        ]);

        if ($status === 'cancelled' && !in_array($oldStatus, ['cancelled', 'processing'], true)) {
            $this->restoreInventory($orderNumber, $pdo);
        }

        try {
            $orderData = $this->getOrderDataForNotification($orderNumber, $pdo);
            $this->emailService->sendOrderStatusUpdate($orderData, $status, $oldStatus);

            $stmt = $pdo->prepare('SELECT user_id FROM orders WHERE order_number = :order_number LIMIT 1');
            $stmt->execute(['order_number' => $orderNumber]);
            $orderRow = $stmt->fetch();
            if ($orderRow && $orderRow['user_id']) {
                $this->notificationService->createNotification(
                    (int) $orderRow['user_id'],
                    'order.status_changed',
                    sprintf('Order %s Status Updated', $orderNumber),
                    sprintf('Your order status changed from "%s" to "%s".', $oldStatus, $status),
                    ['orderId' => $orderNumber, 'oldStatus' => $oldStatus, 'newStatus' => $status]
                );
            }
        } catch (\Throwable $e) {
            \Procurely\Api\Support\Telemetry::error('Status update notification failed', ['error' => $e->getMessage()]);
        }

        return ['message' => 'Order status updated.', 'oldStatus' => $oldStatus, 'newStatus' => $status];
    }

    public function getAllowedTransitions(string $currentStatus): array
    {
        return self::ALLOWED_TRANSITIONS[$currentStatus] ?? [];
    }

    private function getOrderDataForNotification(string $orderNumber, PDO $pdo): array
    {
        $stmt = $pdo->prepare('
            SELECT order_number, customer_name, customer_email, phone, total, status, payment_method
            FROM orders WHERE order_number = :order_number LIMIT 1
        ');
        $stmt->execute(['order_number' => $orderNumber]);
        $order = $stmt->fetch();

        return [
            'orderNumber' => $order['order_number'],
            'customerName' => $order['customer_name'],
            'customerEmail' => $order['customer_email'],
            'phone' => $order['phone'],
            'total' => (int) $order['total'],
            'status' => $order['status'],
            'paymentMethod' => $order['payment_method'] ?? 'card',
        ];
    }

    private function restoreInventory(string $orderNumber, PDO $pdo): void
    {
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        
        // Get order items
        $itemsStmt = $pdo->prepare('
            SELECT oi.product_id, oi.quantity 
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE o.order_number = :order_number
        ');
        $itemsStmt->execute(['order_number' => $orderNumber]);
        $items = $itemsStmt->fetchAll();
        
        // Restore stock
        $restoreStmt = $pdo->prepare('
            UPDATE inventory 
            SET stock_level = stock_level + :qty, updated_at = :now 
            WHERE product_id = :product_id
        ');
        
        foreach ($items as $item) {
            $restoreStmt->execute([
                'qty' => $item['quantity'],
                'now' => $now,
                'product_id' => $item['product_id']
            ]);
        }
    }

    // ─── Product Management ───────────────────────────────────────────────────

    public function listProducts(int $limit = 50, int $offset = 0): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('
            SELECT p.*, COALESCE(i.stock_level, 0) as stock_level 
            FROM products p 
            LEFT JOIN inventory i ON p.id = i.product_id 
            ORDER BY p.name ASC 
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();

        return array_map([$this->contentStore, 'normalizeProduct'], $stmt->fetchAll());
    }

    public function saveProduct(array $payload): array
    {
        $name = trim((string) ($payload['name'] ?? ''));
        if ($name === '') {
            throw new ApiException('Product name is required.', 422);
        }

        // Convert price from Naira to kobo for internal storage.
        // Admin forms and API clients send price in Naira (e.g., 18500 = ₦18,500).
        // Internal system stores all monetary values in kobo (smallest currency unit).
        $priceNaira = (int) ($payload['price'] ?? 0);
        if ($priceNaira <= 0) {
            throw new ApiException('Product price must be a positive number.', 422);
        }
        $price = $priceNaira * 100;

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
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $isMysql = ($_ENV['DB_DRIVER'] ?? 'sqlite') === 'mysql';
        $sql = $isMysql 
            ? 'INSERT IGNORE INTO inventory (product_id, stock_level, updated_at) VALUES (?, ?, ?)'
            : 'INSERT OR IGNORE INTO inventory (product_id, stock_level, updated_at) VALUES (?, ?, ?)';

        $stmt = $pdo->prepare($sql);
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
