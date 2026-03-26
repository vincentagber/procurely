<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

/**
 * Simulated Payment Processor with Circuit Breaker implementation.
 */
final class PaymentProcessor
{
    private const FAILURE_THRESHOLD = 3;
    private const RECOVERY_TIMEOUT_SECONDS = 30;

    public function __construct(
        private readonly Database $database
    ) {
    }

    /**
     * Simulate a payment capture with circuit breaker.
     */
    public function capture(string $orderNumber, int $amountCents): bool
    {
        if ($this->isCircuitOpen()) {
            throw new ApiException('Payment gateway is currently unavailable. Please try again later.', 503);
        }

        try {
            // Simulate external network latency with 1s timeout
            // In real code: $ch = curl_init(); curl_setopt($ch, CURLOPT_TIMEOUT, 2); ...
            
            // Simulation: 10% chance of a "hang" or "failure"
            if (random_int(1, 100) > 90) {
                throw new \RuntimeException('Gateway Timeout');
            }

            return true;
        } catch (\Throwable $e) {
            $this->recordFailure();
            throw new ApiException('Payment processing failed. Please retry.', 502);
        }
    }

    private function isCircuitOpen(): bool
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT hits, reset_at FROM rate_limits WHERE key = "cb:payment" LIMIT 1');
        $stmt->execute();
        $row = $stmt->fetch();

        if ($row === false) {
            return false;
        }

        $failures = (int) $row['hits'];
        $lastFailure = (int) $row['reset_at'];

        if ($failures >= self::FAILURE_THRESHOLD) {
            if (time() - $lastFailure < self::RECOVERY_TIMEOUT_SECONDS) {
                return true; // Circuit is TRIPped
            }
            // Half-open: reset failures to 0 to allow trial
            $pdo->exec('DELETE FROM rate_limits WHERE key = "cb:payment"');
        }

        return false;
    }

    private function recordFailure(): void
    {
        $pdo = $this->database->connection();
        $key = "cb:payment";
        $now = time();

        $pdo->exec("INSERT INTO rate_limits (key, hits, reset_at) 
                    VALUES ('$key', 1, $now) 
                    ON CONFLICT(key) DO UPDATE SET hits = hits + 1, reset_at = $now");
    }
}
