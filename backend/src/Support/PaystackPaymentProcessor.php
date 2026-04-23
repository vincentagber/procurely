<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

/**
 * Robust Paystack Payment Processor with Circuit Breaker and Production-grade error handling.
 */
final class PaystackPaymentProcessor implements PaymentProcessorInterface
{
    private const FAILURE_THRESHOLD = 5;
    private const RECOVERY_TIMEOUT_SECONDS = 60;
    
    private string $secretKey;

    public function __construct(
        private readonly Database $database
    ) {
        $this->secretKey = $_ENV['PAYSTACK_SECRET_KEY'] ?? '';
        
        if ($this->secretKey === '') {
            // Log as critical for production monitoring
            error_log('[Procurely] CRITICAL: PAYSTACK_SECRET_KEY is missing in environment.');
            throw new \RuntimeException('Payment gateway configuration is missing.');
        }
    }

    /**
     * Initialize a real Paystack transaction.
     */
    public function createPaymentIntent(string $orderNumber, int $amountCents, string $customerEmail = '', string $currency = 'NGN'): array
    {
        if ($this->isCircuitOpen()) {
            throw new ApiException('Payment gateway is temporarily unavailable. Please try again in a minute.', 503);
        }

        $url = "https://api.paystack.co/transaction/initialize";
        
        // Ensure email is valid or use fallback
        if ($customerEmail === '' || !filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
            $customerEmail = 'info@useprocurely.com';
        }

        $fields = [
            'reference' => $orderNumber,
            'amount' => $amountCents, // Kobo
            'currency' => strtoupper($currency),
            'email' => $customerEmail,
            'metadata' => [
                'order_number' => $orderNumber,
                'client' => 'Procurely E-commerce'
            ]
        ];

        try {
            $response = $this->postRequest($url, $fields);
            
            if (!($response['status'] ?? false)) {
                throw new \RuntimeException($response['message'] ?? 'Paystack initialization failed.');
            }

            return [
                'authorization_url' => $response['data']['authorization_url'],
                'access_code' => $response['data']['access_code'],
                'reference' => $response['data']['reference'],
            ];
        } catch (\Throwable $e) {
            $this->recordFailure();
            throw new ApiException('Payment gateway communication error.', 502);
        }
    }

    /**
     * Verify a Paystack transaction status.
     */
    public function confirmPaymentIntent(string $paymentIntentId): bool
    {
        $url = "https://api.paystack.co/transaction/verify/" . rawurlencode($paymentIntentId);

        try {
            $response = $this->getRequest($url);
            return ($response['status'] ?? false) && ($response['data']['status'] ?? '') === 'success';
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Capture method - for Paystack, this validates the final success state.
     */
    public function capture(string $orderNumber, int $amountCents, string $customerEmail = ''): bool
    {
        return $this->confirmPaymentIntent($orderNumber);
    }

    /**
     * Circuit Breaker: Prevents cascading failures if Paystack API is down.
     */
    private function isCircuitOpen(): bool
    {
        try {
            $pdo = $this->database->connection();
            $stmt = $pdo->prepare('SELECT hits, reset_at FROM rate_limits WHERE `key` = "cb:paystack" LIMIT 1');
            $stmt->execute();
            $row = $stmt->fetch();

            if ($row === false) {
                return false;
            }

            $failures = (int) $row['hits'];
            $lastFailure = (int) $row['reset_at'];

            if ($failures >= self::FAILURE_THRESHOLD) {
                if (time() - $lastFailure < self::RECOVERY_TIMEOUT_SECONDS) {
                    return true; 
                }
                // Auto-reset after timeout
                $pdo->prepare('DELETE FROM rate_limits WHERE `key` = "cb:paystack"')->execute();
            }
        } catch (\PDOException) {
            // If database is failing, don't let it block payment intent (degrade gracefully)
        }

        return false;
    }

    private function recordFailure(): void
    {
        try {
            $pdo = $this->database->connection();
            $isMysql = ($_ENV['DB_DRIVER'] ?? 'sqlite') === 'mysql';
            $key = "cb:paystack";
            $now = time();

            $sql = $isMysql 
                ? "INSERT INTO rate_limits (`key`, hits, reset_at) VALUES (:key, 1, :now) ON DUPLICATE KEY UPDATE hits = hits + 1, reset_at = VALUES(reset_at)"
                : "INSERT INTO rate_limits (`key`, hits, reset_at) VALUES (:key, 1, :now) ON CONFLICT(`key`) DO UPDATE SET hits = hits + 1, reset_at = excluded.reset_at";

            $stmt = $pdo->prepare($sql);
            $stmt->execute(['key' => $key, 'now' => $now]);
        } catch (\PDOException) {
            // Fail silently on logging
        }
    }

    private function postRequest(string $url, array $fields): array
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $this->secretKey,
            "Content-Type: application/json",
            "Cache-Control: no-cache"
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

        $result = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new \RuntimeException($error);
        }

        return json_decode($result ?: '{}', true);
    }

    private function getRequest(string $url): array
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $this->secretKey,
            "Content-Type: application/json",
            "Cache-Control: no-cache"
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result ?: '{}', true);
    }
}
