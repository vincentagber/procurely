<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

final class Paystack
{
    private readonly string $secretKey;
    private const WEBHOOK_TTL_SECONDS = 300; // 5 minutes
    private const PAYSTACK_IPS = [
        '52.31.139.75',
        '52.49.173.169', 
        '52.214.14.220',
        '127.0.0.1',  // For local testing
        '::1'           // IPv6 localhost
    ];

    public function __construct(string $secretKey = '')
    {
        $key = $_ENV['PAYSTACK_SECRET_KEY'] ?? '';
        
        $isDebug = filter_var($_ENV['APP_DEBUG'] ?? 'false', FILTER_VALIDATE_BOOLEAN);
        
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

    public function isValidTimestamp(string $timestampHeader): bool
    {
        if ($timestampHeader === '') {
            return false;
        }

        $timestamp = (int) $timestampHeader;
        $now = time();
        
        // Allow 5 minute window
        return abs($now - $timestamp) <= self::WEBHOOK_TTL_SECONDS;
    }

    public function isValidIp(string $ip): bool
    {
        if ($ip === '') {
            return false;
        }

        // In debug mode, allow all IPs
        $isDebug = filter_var($_ENV['APP_DEBUG'] ?? 'false', FILTER_VALIDATE_BOOLEAN);
        if ($isDebug) {
            return true;
        }

        return in_array($ip, self::PAYSTACK_IPS, true);
    }

    public function validateWebhook(string $payload, string $signature, string $ip): array
    {
        // Check IP
        if (!$this->isValidIp($ip)) {
            Telemetry::error('Webhook from unauthorized IP', ['ip' => $ip]);
            return ['valid' => false, 'reason' => 'unauthorized_ip'];
        }

        // Check signature
        if (!$this->isValidSignature($payload, $signature)) {
            Telemetry::error('Webhook signature invalid');
            return ['valid' => false, 'reason' => 'invalid_signature'];
        }

        return ['valid' => true, 'reason' => null];
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
