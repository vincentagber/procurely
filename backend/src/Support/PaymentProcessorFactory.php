<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

/**
 * Factory for creating payment processors based on configuration or user preference.
 */
final class PaymentProcessorFactory
{
    public function __construct(
        private readonly Database $database
    ) {
    }

    /**
     * Create a payment processor instance.
     */
    public function create(string $gateway = 'paystack'): PaymentProcessorInterface
    {
        return match (strtolower($gateway)) {
            'paystack' => new PaystackPaymentProcessor($this->database),
            'manual'   => new ManualPaymentProcessor(),
            // 'stripe' => new StripePaymentProcessor($this->database), 
            default => throw new \InvalidArgumentException(sprintf('Payment gateway "%s" is not supported.', $gateway)),
        };
    }
}
