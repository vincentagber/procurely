<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use PDO;
use Procurely\Api\Support\Database;

final class NotificationService
{
    public function __construct(
        private readonly Database $database,
    ) {
    }

    public function getUserNotifications(int $userId): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('
            SELECT id, type, title, message, data, created_at
            FROM notifications
            WHERE user_id = :user_id AND read_at IS NULL
            ORDER BY created_at DESC
            LIMIT 50
        ');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function markAsRead(int $userId, int $notificationId): void
    {
        $pdo = $this->database->connection();
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        
        $stmt = $pdo->prepare('
            UPDATE notifications
            SET read_at = :now
            WHERE id = :id AND user_id = :user_id
        ');
        $stmt->execute([
            'now' => $now,
            'id' => $notificationId, 
            'user_id' => $userId
        ]);
    }

    public function createNotification(int $userId, string $type, string $title, ?string $message = null, ?array $data = null): void
    {
        $pdo = $this->database->connection();
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        
        $stmt = $pdo->prepare('
            INSERT INTO notifications (user_id, type, title, message, data, created_at)
            VALUES (:user_id, :type, :title, :message, :data, :created_at)
        ');
        $stmt->execute([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data ? json_encode($data) : null,
            'created_at' => $now,
        ]);
    }
}