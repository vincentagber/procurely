<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use PDO;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\Telemetry;

final class ReconciliationService
{
    public function __construct(
        private readonly Database $database,
    ) {
    }

    public function isWebhookProcessed(string $eventId, string $gateway): bool
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT id FROM webhook_events WHERE event_id = :event_id AND gateway = :gateway LIMIT 1');
        $stmt->execute([
            'event_id' => $eventId,
            'gateway' => $gateway,
        ]);

        return $stmt->fetch() !== false;
    }

    public function recordWebhookEvent(string $eventId, string $eventType, string $gateway, string $payloadHash, string $status = 'processed'): void
    {
        $pdo = $this->database->connection();
        $now = (new DateTimeImmutable())->format('Y-m-d H:i:s');

        $stmt = $pdo->prepare('
            INSERT INTO webhook_events (event_id, event_type, gateway, payload_hash, processed_at, status, created_at)
            VALUES (:event_id, :event_type, :gateway, :payload_hash, :processed_at, :status, :created_at)
        ');
        $stmt->execute([
            'event_id' => $eventId,
            'event_type' => $eventType,
            'gateway' => $gateway,
            'payload_hash' => $payloadHash,
            'processed_at' => $now,
            'status' => $status,
            'created_at' => $now,
        ]);
    }

    public function logPayment(
        string $gateway,
        string $gatewayReference,
        int $amountCents,
        string $status,
        ?string $orderNumber = null,
        string $currency = 'NGN',
        ?array $metadata = null,
    ): void {
        $pdo = $this->database->connection();
        $now = (new DateTimeImmutable())->format('Y-m-d H:i:s');

        $stmt = $pdo->prepare('
            INSERT INTO payment_logs (order_number, gateway, gateway_reference, amount, currency, status, metadata, created_at)
            VALUES (:order_number, :gateway, :gateway_reference, :amount, :currency, :status, :metadata, :created_at)
        ');
        $stmt->execute([
            'order_number' => $orderNumber,
            'gateway' => $gateway,
            'gateway_reference' => $gatewayReference,
            'amount' => $amountCents,
            'currency' => $currency,
            'status' => $status,
            'metadata' => $metadata !== null ? json_encode($metadata) : null,
            'created_at' => $now,
        ]);
    }

    public function recordWalletTransaction(
        int $userId,
        string $type,
        int $amountCents,
        int $balanceAfter,
        ?string $reference = null,
        ?string $description = null,
    ): void {
        $pdo = $this->database->connection();
        $now = (new DateTimeImmutable())->format('Y-m-d H:i:s');

        $stmt = $pdo->prepare('
            INSERT INTO wallet_transactions (user_id, type, amount, balance_after, reference, description, created_at)
            VALUES (:user_id, :type, :amount, :balance_after, :reference, :description, :created_at)
        ');
        $stmt->execute([
            'user_id' => $userId,
            'type' => $type,
            'amount' => $amountCents,
            'balance_after' => $balanceAfter,
            'reference' => $reference,
            'description' => $description,
            'created_at' => $now,
        ]);
    }

    public function reconcile(): array
    {
        $pdo = $this->database->connection();

        $inconsistencies = [];

        $stmt = $pdo->prepare('
            SELECT pl.order_number, pl.gateway, pl.gateway_reference, pl.amount as paid_amount, pl.status as payment_status,
                   o.total as order_total, o.status as order_status, o.paid_at
            FROM payment_logs pl
            LEFT JOIN orders o ON pl.order_number = o.order_number
            WHERE pl.status = "success"
        ');
        $stmt->execute();
        $payments = $stmt->fetchAll();

        foreach ($payments as $payment) {
            if ($payment['order_number'] === null) {
                $inconsistencies[] = [
                    'type' => 'orphan_payment',
                    'gateway_reference' => $payment['gateway_reference'],
                    'gateway' => $payment['gateway'],
                    'amount' => $payment['paid_amount'],
                    'message' => 'Successful payment with no matching order',
                ];
                continue;
            }

            if ((int) $payment['paid_amount'] !== (int) $payment['order_total']) {
                $inconsistencies[] = [
                    'type' => 'amount_mismatch',
                    'order_number' => $payment['order_number'],
                    'paid_amount' => $payment['paid_amount'],
                    'order_total' => $payment['order_total'],
                    'message' => sprintf(
                        'Payment amount (%d) does not match order total (%d)',
                        $payment['paid_amount'],
                        $payment['order_total']
                    ),
                ];
            }

            if ($payment['order_status'] !== 'paid' && $payment['payment_status'] === 'success') {
                $inconsistencies[] = [
                    'type' => 'unpaid_order',
                    'order_number' => $payment['order_number'],
                    'payment_status' => $payment['payment_status'],
                    'order_status' => $payment['order_status'],
                    'message' => 'Payment succeeded but order not marked as paid',
                ];
            }
        }

        $isMysql = ($_ENV['DB_DRIVER'] ?? 'sqlite') === 'mysql';
        $stmt = $pdo->prepare($isMysql
            ? 'SELECT o.order_number, o.total, o.status, o.payment_method, o.paid_at
               FROM orders o
               WHERE o.status = "processing"
                 AND o.payment_method = "card"
                 AND o.paid_at IS NULL
                 AND o.created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)'
            : 'SELECT o.order_number, o.total, o.status, o.payment_method, o.paid_at
               FROM orders o
               WHERE o.status = "processing"
                 AND o.payment_method = "card"
                 AND o.paid_at IS NULL
                 AND o.created_at < datetime("now", "-1 hour")'
        );
        $stmt->execute();
        $staleOrders = $stmt->fetchAll();

        foreach ($staleOrders as $order) {
            $inconsistencies[] = [
                'type' => 'stale_pending_order',
                'order_number' => $order['order_number'],
                'age' => 'over 1 hour',
                'message' => 'Card order still pending payment after 1+ hour',
            ];
        }

        return [
            'total_payments_checked' => count($payments),
            'total_stale_orders' => count($staleOrders),
            'inconsistencies' => $inconsistencies,
            'inconsistency_count' => count($inconsistencies),
        ];
    }

    public function getPaymentLogs(int $limit = 50, int $offset = 0): array
    {
        $pdo = $this->database->connection();

        $stmt = $pdo->prepare('
            SELECT COUNT(*) as total FROM payment_logs
        ');
        $stmt->execute();
        $total = (int) $stmt->fetchColumn();

        $stmt = $pdo->prepare('
            SELECT * FROM payment_logs ORDER BY created_at DESC LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $logs = $stmt->fetchAll();

        return [
            'data' => $logs,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
        ];
    }

    public function getWalletTransactions(int $userId, int $limit = 50, int $offset = 0): array
    {
        $pdo = $this->database->connection();

        $stmt = $pdo->prepare('
            SELECT COUNT(*) as total FROM wallet_transactions WHERE user_id = :user_id
        ');
        $stmt->execute(['user_id' => $userId]);
        $total = (int) $stmt->fetchColumn();

        $stmt = $pdo->prepare('
            SELECT * FROM wallet_transactions
            WHERE user_id = :user_id
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $transactions = $stmt->fetchAll();

        return [
            'data' => $transactions,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
        ];
    }
}
