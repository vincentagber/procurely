<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use Procurely\Api\Support\Database;

final class AdminService
{
    public function __construct(
        private readonly Database $database,
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
}
