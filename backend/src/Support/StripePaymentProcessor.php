<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Stripe\Event;
use Stripe\Stripe;
use Stripe\Webhook;

final class StripePaymentProcessor implements PaymentProcessorInterface
{
    private const WEBHOOK_TTL_SECONDS = 300;
    private const STRIPE_IPS = [
        '54.187.174.169',
        '54.187.205.235',
        '54.187.216.72',
        '127.0.0.1',
        '::1',
    ];

    private string $secretKey;
    private string $webhookSecret;

    public function __construct(
        private readonly Database $database
    ) {
        $this->secretKey = $_ENV['STRIPE_SECRET_KEY'] ?? '';
        $this->webhookSecret = $_ENV['STRIPE_WEBHOOK_SECRET'] ?? '';

        if ($this->secretKey === '') {
            throw new \RuntimeException('STRIPE_SECRET_KEY is missing.');
        }

        Stripe::setApiKey($this->secretKey);
    }

    public function createPaymentIntent(string $orderNumber, int $amountCents, string $customerEmail = '', string $currency = 'NGN'): array
    {
        $params = [
            'amount' => $amountCents,
            'currency' => strtolower($currency),
            'metadata' => [
                'order_number' => $orderNumber,
                'client' => 'Procurely E-commerce',
            ],
        ];

        if ($customerEmail !== '' && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
            $params['receipt_email'] = $customerEmail;
        }

        $intent = \Stripe\PaymentIntent::create($params);

        return [
            'client_secret' => $intent->client_secret,
            'payment_intent_id' => $intent->id,
            'status' => $intent->status,
        ];
    }

    public function confirmPaymentIntent(string $paymentIntentId): bool
    {
        try {
            $intent = \Stripe\PaymentIntent::retrieve($paymentIntentId);
            return $intent->status === 'succeeded';
        } catch (\Throwable $e) {
            Telemetry::error('Stripe confirmation failed', ['intent_id' => $paymentIntentId, 'error' => $e->getMessage()]);
            return false;
        }
    }

    public function capture(string $orderNumber, int $amountCents, string $customerEmail = ''): bool
    {
        // For Stripe, capture requires a payment_intent_id, not order_number.
        // This method is a fallback; primary flow uses confirmPaymentIntent directly.
        Telemetry::info('Stripe capture called with order_number (fallback)', ['order_number' => $orderNumber]);
        return false;
    }

    public function processWebhook(string $payload, string $sigHeader): array
    {
        if ($this->webhookSecret === '') {
            throw new \RuntimeException('STRIPE_WEBHOOK_SECRET is not configured.');
        }

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $this->webhookSecret
            );

            return [
                'event_type' => $event->type,
                'event_data' => $event->data->object,
                'event_id' => $event->id,
            ];
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Telemetry::error('Stripe webhook signature verification failed', ['error' => $e->getMessage()]);
            throw new ApiException('Invalid webhook signature.', 401);
        } catch (\Throwable $e) {
            Telemetry::error('Stripe webhook processing error', ['error' => $e->getMessage()]);
            throw new ApiException('Webhook processing failed.', 500);
        }
    }

    public static function isValidIp(string $ip): bool
    {
        $isDebug = filter_var($_ENV['APP_DEBUG'] ?? 'false', FILTER_VALIDATE_BOOLEAN);
        if ($isDebug) {
            return true;
        }

        return in_array($ip, self::STRIPE_IPS, true);
    }
}
