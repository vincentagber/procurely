<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

/**
 * Payment Processor Interface
 */
interface PaymentProcessorInterface
{
    /**
     * Capture a payment for the given order.
     */
    public function capture(string $orderNumber, int $amountCents, string $customerEmail = ''): bool;

    /**
     * Create a payment intent.
     */
    public function createPaymentIntent(string $orderNumber, int $amountCents, string $customerEmail = '', string $currency = 'NGN'): array;

    /**
     * Confirm a payment intent.
     */
    public function confirmPaymentIntent(string $paymentIntentId): bool;
}