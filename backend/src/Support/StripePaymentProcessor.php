<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Stripe\StripeClient;
use Stripe\Exception\ApiErrorException;

/**
 * Stripe Payment Processor for handling payment intents and confirmations.
 */
final class StripePaymentProcessor implements PaymentProcessorInterface
{
    private StripeClient $stripe;
    private string $webhookSecret;

    public function __construct(string $apiKey = '', string $webhookSecret = '')
    {
        $key = $apiKey ?: ($_ENV['STRIPE_SECRET_KEY'] ?? '');
        $webhook = $webhookSecret ?: ($_ENV['STRIPE_WEBHOOK_SECRET'] ?? '');

        if ($key === '') {
            throw new \RuntimeException('STRIPE_SECRET_KEY is required.');
        }

        $this->stripe = new StripeClient($key);
        $this->webhookSecret = $webhook;
    }

    /**
     * Create a payment intent for the given order.
     */
    public function createPaymentIntent(string $orderNumber, int $amountCents, string $currency = 'usd'): array
    {
        try {
            $paymentIntent = $this->stripe->paymentIntents->create([
                'amount' => $amountCents,
                'currency' => $currency,
                'metadata' => [
                    'order_number' => $orderNumber,
                ],
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            return [
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
            ];
        } catch (ApiErrorException $e) {
            throw new ApiException('Failed to create payment intent: ' . $e->getMessage(), 502);
        }
    }

    /**
     * Confirm a payment intent.
     */
    public function confirmPaymentIntent(string $paymentIntentId): bool
    {
        try {
            $paymentIntent = $this->stripe->paymentIntents->retrieve($paymentIntentId);

            if ($paymentIntent->status === 'succeeded') {
                return true;
            }

            // If not already confirmed, confirm it
            if ($paymentIntent->status === 'requires_confirmation') {
                $this->stripe->paymentIntents->confirm($paymentIntentId);
                return true;
            }

            return false;
        } catch (ApiErrorException $e) {
            throw new ApiException('Failed to confirm payment: ' . $e->getMessage(), 502);
        }
    }

    /**
     * Capture a payment (for manual capture if needed).
     */
    public function capture(string $orderNumber, int $amountCents): bool
    {
        // For simplicity, we'll assume payment intents are set to auto-capture
        // In a real implementation, you might want to create and then capture separately
        // For now, this method will be called after payment intent confirmation
        return true;
    }

    /**
     * Verify and process webhook events.
     */
    public function processWebhook(string $payload, string $signature): array
    {
        try {
            $event = \Stripe\Webhook::constructEvent($payload, $signature, $this->webhookSecret);
        } catch (\UnexpectedValueException $e) {
            throw new ApiException('Invalid webhook payload', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            throw new ApiException('Invalid webhook signature', 400);
        }

        return [
            'event_type' => $event->type,
            'event_data' => $event->data->object,
        ];
    }

    /**
     * Refund a payment.
     */
    public function refund(string $paymentIntentId, ?int $amountCents = null): bool
    {
        try {
            $refundParams = [
                'payment_intent' => $paymentIntentId,
            ];

            if ($amountCents !== null) {
                $refundParams['amount'] = $amountCents;
            }

            $this->stripe->refunds->create($refundParams);
            return true;
        } catch (ApiErrorException $e) {
            throw new ApiException('Failed to process refund: ' . $e->getMessage(), 502);
        }
    }
}