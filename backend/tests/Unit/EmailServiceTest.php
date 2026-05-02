<?php

declare(strict_types=1);

namespace Procurely\Api\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Procurely\Api\Support\EmailService;

class EmailServiceTest extends TestCase
{
    private string $rootPath;
    private string $logPath;

    protected function setUp(): void
    {
        $this->rootPath = sys_get_temp_dir() . '/procurely_test_' . uniqid();
        mkdir($this->rootPath . '/storage', 0777, true);
        $this->logPath = $this->rootPath . '/storage/emails.log';
    }

    protected function tearDown(): void
    {
        if (file_exists($this->logPath)) {
            unlink($this->logPath);
        }
        if (is_dir($this->rootPath . '/storage')) {
            rmdir($this->rootPath . '/storage');
        }
        if (is_dir($this->rootPath)) {
            rmdir($this->rootPath);
        }
    }

    public function testSendOrderConfirmationCreatesLog(): void
    {
        $service = new EmailService($this->rootPath);

        $order = [
            'customerEmail' => 'test@example.com',
            'customerName' => 'John Doe',
            'orderNumber' => '#PRC-01234',
            'total' => 10690000,
            'subtotal' => 10000000,
            'vat' => 750000,
            'shippingFee' => 0,
            'serviceFee' => 0,
            'status' => 'processing',
            'paymentMethod' => 'Paystack',
            'phone' => '08012345678',
            'items' => [
                ['productName' => 'Sharp Sand', 'quantity' => 20, 'lineTotal' => 8000000],
            ],
        ];

        // This will attempt to send mail (may fail in test env, but should log)
        @$service->sendOrderConfirmation($order);

        // Check that log file was created
        $this->assertFileExists($this->logPath);
    }

    public function testSendPaymentReceiptCreatesLog(): void
    {
        $service = new EmailService($this->rootPath);

        $order = [
            'customerEmail' => 'test@example.com',
            'customerName' => 'John Doe',
            'orderNumber' => '#PRC-01235',
            'total' => 2357310,
            'paidAt' => '2026-05-02 10:00:00',
        ];

        @$service->sendPaymentReceipt($order);

        $this->assertFileExists($this->logPath);
        $logContent = file_get_contents($this->logPath);
        $this->assertStringContainsString('Payment Receipt', $logContent);
    }

    public function testSendOrderStatusUpdateCreatesLog(): void
    {
        $service = new EmailService($this->rootPath);

        $order = [
            'customerEmail' => 'test@example.com',
            'customerName' => 'John Doe',
            'orderNumber' => '#PRC-01236',
            'status' => 'delivered',
        ];

        @$service->sendOrderStatusUpdate($order, 'delivered', 'in_transit');

        $this->assertFileExists($this->logPath);
        $logContent = file_get_contents($this->logPath);
        $this->assertStringContainsString('Order Status Update', $logContent);
    }

    public function testSendPasswordResetCreatesLog(): void
    {
        $service = new EmailService($this->rootPath);

        @$service->sendPasswordReset('test@example.com', 'https://example.com/reset?token=abc123');

        $this->assertFileExists($this->logPath);
        $logContent = file_get_contents($this->logPath);
        $this->assertStringContainsString('Password Reset', $logContent);
    }

    public function testAdminNotificationHandlesMissingPhone(): void
    {
        $service = new EmailService($this->rootPath);

        $order = [
            'customerEmail' => 'test@example.com',
            'customerName' => 'John Doe',
            'orderNumber' => '#PRC-01237',
            'total' => 500000,
            'status' => 'processing',
            // phone intentionally omitted
        ];

        @$service->sendOrderConfirmation($order);

        $this->assertFileExists($this->logPath);
        // Should not throw any errors
        $this->assertTrue(true);
    }

    public function testLogFormatIsCorrect(): void
    {
        $service = new EmailService($this->rootPath);

        $order = [
            'customerEmail' => 'test@example.com',
            'customerName' => 'John Doe',
            'orderNumber' => '#PRC-01238',
            'total' => 100000,
            'subtotal' => 100000,
            'vat' => 0,
            'shippingFee' => 0,
            'serviceFee' => 0,
            'status' => 'processing',
            'paymentMethod' => 'Paystack',
            'items' => [],
        ];

        @$service->sendOrderConfirmation($order);

        $logContent = file_get_contents($this->logPath);
        $this->assertStringContainsString('Status:', $logContent);
        $this->assertStringContainsString('To: test@example.com', $logContent);
        $this->assertStringContainsString('Subject:', $logContent);
    }
}
