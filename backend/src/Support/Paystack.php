<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

final class Paystack
{
    private readonly string $secretKey;

    public function __construct(string $secretKey = '')
    {
        $this->secretKey = $_ENV['PAYSTACK_SECRET_KEY'] ?? 'sk_test_procurely_mock_key';
    }

    public function isValidSignature(string $payload, string $signature): bool
    {
        return $signature === hash_hmac('sha512', $payload, $this->secretKey);
    }

    /**
     * Redacts PII and sensitive tokens from Paystack response data for logging.
     */
    public static function scrub(array $data): array
    {
        $sensitiveFields = ['authorization', 'customer', 'metadata'];
        foreach ($sensitiveFields as $field) {
            if (isset($data['data'][$field])) {
                $data['data'][$field] = '[REDACTED]';
            }
        }
        return $data;
    }
}
