<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

/**
 * Functional Paystack Payment Processor with Circuit Breaker.
 * This implementation connects to the live Paystack API and handles 
 * real transactions, eliminating all mock behaviors.
 */
final class PaymentProcessor implements PaymentProcessorInterface
{
    private const FAILURE_THRESHOLD = 5;
    private const RECOVERY_TIMEOUT_SECONDS = 60;
    
    private string $secretKey;

    public function __construct(
        private readonly Database $database
    ) {
        $this->secretKey = $_ENV['PAYSTACK_SECRET_KEY'] ?? '';
        if ($this->secretKey === '') {
            throw new \RuntimeException('Critical: PAYSTACK_SECRET_KEY environment variable is missing.');
        }
    }

    /**
     * Create a real Paystack payment transaction.
     */
    public function createPaymentIntent(string $orderNumber, int $amountCents, string $customerEmail = '', string $currency = 'NGN'): array
    {
        if ($this->isCircuitOpen()) {
            throw new ApiException('Payment gateway is currently experiencing high latency. Please retry in 60 seconds.', 503);
        }

        $url = "https://api.paystack.co/transaction/initialize";
        $fields = [
            'reference' => $orderNumber,
            'amount' => $amountCents, // Paystack amount is in kobo (Subunit)
            'currency' => strtoupper($currency),
            'email' => $customerEmail ?: 'info@useprocurely.com',
            'metadata' => [
                'order_number' => $orderNumber,
                'source' => 'Procurely E-commerce'
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
                // Maintain compatibility with existing intent-based UI
                'client_secret' => $response['data']['access_code'],
                'payment_intent_id' => $response['data']['reference']
            ];
        } catch (\Throwable $e) {
            $this->recordFailure();
            throw new ApiException('Failed to reach payment gateway: ' . $e->getMessage(), 502);
        }
    }

    /**
     * Confirm/Verify a Paystack transaction status.
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
     * Circuit Breaker Logic
     */
    private function isCircuitOpen(): bool
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT hits, reset_at FROM rate_limits WHERE `key` = "cb:payment" LIMIT 1');
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
            $pdo->exec('DELETE FROM rate_limits WHERE `key` = "cb:payment"');
        }

        return false;
    }

    private function recordFailure(): void
    {
        $pdo = $this->database->connection();
        $isMysql = ($_ENV['DB_DRIVER'] ?? 'sqlite') === 'mysql';
        $key = "cb:payment";
        $now = time();

        if ($isMysql) {
            $sql = "INSERT INTO rate_limits (`key`, hits, reset_at) 
                    VALUES (:key, 1, :now) 
                    ON DUPLICATE KEY UPDATE hits = hits + 1, reset_at = VALUES(reset_at)";
        } else {
            $sql = "INSERT INTO rate_limits (`key`, hits, reset_at) 
                    VALUES (:key, 1, :now) 
                    ON CONFLICT(`key`) DO UPDATE SET hits = hits + 1, reset_at = excluded.reset_at";
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute(['key' => $key, 'now' => $now]);
    }

    private function postRequest(string $url, array $fields): array
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $this->secretKey,
            "Content-Type: application/json"
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $result = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return json_decode($result ?: '{}', true);
    }

    private function getRequest(string $url): array
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $this->secretKey,
            "Content-Type: application/json"
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result ?: '{}', true);
    }
}
