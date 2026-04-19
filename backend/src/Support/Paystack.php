<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

final class Paystack
{
    private readonly string $secretKey;

    public function __construct(string $secretKey = '')
    {
        $key = $_ENV['PAYSTACK_SECRET_KEY'] ?? '';
        
        $isDebug = filter_var($_ENV['APP_DEBUG'] ?? 'false', FILTER_VALIDATE_BOOL);
        
        if ($key === '') {
            throw new \RuntimeException('PAYSTACK_SECRET_KEY is required.');
        }

        $this->secretKey = $key;
    }

    public function isValidSignature(string $payload, string $signature): bool
    {
        $expected = hash_hmac('sha512', $payload, $this->secretKey);
        return hash_equals($expected, $signature);
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
