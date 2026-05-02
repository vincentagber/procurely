<?php

declare(strict_types=1);

namespace Procurely\Api\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Procurely\Api\Support\Paystack;

final class PaystackTest extends TestCase
{
    private Paystack $paystack;

    protected function setUp(): void
    {
        $_ENV['PAYSTACK_SECRET_KEY'] = 'sk_test_abc123';
        $_ENV['APP_DEBUG'] = 'true';
        $this->paystack = new Paystack();
    }

    public function testValidSignature(): void
    {
        $payload = '{"event": "charge.success"}';
        $signature = hash_hmac('sha512', $payload, 'sk_test_abc123');
        $this->assertTrue($this->paystack->isValidSignature($payload, $signature));
    }

    public function testInvalidSignature(): void
    {
        $this->assertFalse($this->paystack->isValidSignature('{"event": "test"}', 'invalid_signature'));
    }

    public function testValidTimestamp(): void
    {
        $timestamp = (string) time();
        $this->assertTrue($this->paystack->isValidTimestamp($timestamp));
    }

    public function testExpiredTimestamp(): void
    {
        $timestamp = (string) (time() - 600);
        $this->assertFalse($this->paystack->isValidTimestamp($timestamp));
    }

    public function testEmptyTimestamp(): void
    {
        $this->assertFalse($this->paystack->isValidTimestamp(''));
    }

    public function testValidIpInDebugMode(): void
    {
        $_ENV['APP_DEBUG'] = 'true';
        $this->assertTrue($this->paystack->isValidIp('1.2.3.4'));
    }

    public function testValidIpInProduction(): void
    {
        $_ENV['APP_DEBUG'] = 'false';
        $this->assertTrue($this->paystack->isValidIp('52.31.139.75'));
    }

    public function testInvalidIpInProduction(): void
    {
        $_ENV['APP_DEBUG'] = 'false';
        $this->assertFalse($this->paystack->isValidIp('1.2.3.4'));
    }

    public function testEmptyIp(): void
    {
        $this->assertFalse($this->paystack->isValidIp(''));
    }

    public function testValidateWebhookSuccess(): void
    {
        $payload = '{"event": "charge.success"}';
        $signature = hash_hmac('sha512', $payload, 'sk_test_abc123');
        $timestamp = (string) time();

        $result = $this->paystack->validateWebhook($payload, $signature, $timestamp, '52.31.139.75');
        $this->assertTrue($result['valid']);
        $this->assertNull($result['reason']);
    }

    public function testValidateWebhookInvalidSignature(): void
    {
        $payload = '{"event": "charge.success"}';
        $timestamp = (string) time();

        $result = $this->paystack->validateWebhook($payload, 'invalid', $timestamp, '52.31.139.75');
        $this->assertFalse($result['valid']);
        $this->assertEquals('invalid_signature', $result['reason']);
    }

    public function testScrubRedactsSensitiveData(): void
    {
        $data = [
            'data' => [
                'authorization' => 'secret_auth_code',
                'customer' => ['email' => 'test@example.com'],
                'metadata' => ['order_id' => '123'],
                'reference' => 'ref_123',
            ],
        ];

        $scrubbed = Paystack::scrub($data);

        $this->assertEquals('[REDACTED]', $scrubbed['data']['authorization']);
        $this->assertEquals('[REDACTED]', $scrubbed['data']['customer']);
        $this->assertEquals('[REDACTED]', $scrubbed['data']['metadata']);
        $this->assertEquals('ref_123', $scrubbed['data']['reference']);
    }
}
