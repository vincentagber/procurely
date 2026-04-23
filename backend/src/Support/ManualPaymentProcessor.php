<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

/**
 * Manual Payment Processor for methods like Bank Transfer or Cash on Delivery
 * that require administrative verification.
 */
final class ManualPaymentProcessor implements PaymentProcessorInterface
{
    public function createPaymentIntent(string $orderNumber, int $amountCents, string $customerEmail = '', string $currency = 'NGN'): array
    {
        return [
            'status' => 'pending_manual_verification',
            'order_number' => $orderNumber,
            'message' => 'Please complete your transfer to the company account provided.'
        ];
    }

    public function confirmPaymentIntent(string $paymentIntentId): bool
    {
        // Manual payments are never auto-confirmed via API
        return false;
    }

    public function capture(string $orderNumber, int $amountCents, string $customerEmail = ''): bool
    {
        // Manual capture happens via Admin panel status updates
        return true;
    }
}
