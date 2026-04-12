<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

/**
 * Paystack Payment Processor handling transaction initialization and verification.
 */
final class PaystackPaymentProcessor implements PaymentProcessorInterface
{
    private string $secretKey;

    public function __construct(string $secretKey = '')
    {
        $key = $secretKey ?: ($_ENV['PAYSTACK_SECRET_KEY'] ?? '');

        if ($key === '') {
            throw new \RuntimeException('PAYSTACK_SECRET_KEY is required.');
        }

        $this->secretKey = $key;
    }

    /**
     * Initialize a Paystack transaction.
     */
    public function createPaymentIntent(string $orderNumber, int $amountCents, string $customerEmail = '', string $currency = 'NGN'): array
    {
        
        // Actually, let's look at the OrderService to see if we can get the email.
        
        $url = "https://api.paystack.co/transaction/initialize";
        
        $fields = [
            'reference' => $orderNumber,
            'amount' => $amountCents,
            'currency' => strtoupper($currency),
            'email' => $customerEmail ?: 'info@useprocurely.com',
            'metadata' => [
                'order_number' => $orderNumber
            ]
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $this->secretKey,
            "Cache-Control: no-cache",
            "Content-Type: application/json"
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new ApiException('Paystack API Error: ' . $error, 502);
        }

        $response = json_decode($result, true);

        if (!($response['status'] ?? false)) {
            throw new ApiException('Paystack Initialization Failed: ' . ($response['message'] ?? 'Unknown error'), 502);
        }

        return [
            'authorization_url' => $response['data']['authorization_url'],
            'access_code' => $response['data']['access_code'],
            'reference' => $response['data']['reference'],
        ];
    }

    /**
     * Verify a Paystack transaction.
     */
    public function confirmPaymentIntent(string $reference): bool
    {
        $url = "https://api.paystack.co/transaction/verify/" . rawurlencode($reference);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer " . $this->secretKey,
            "Cache-Control: no-cache",
        ]);

        $result = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new ApiException('Paystack Verification Error: ' . $error, 502);
        }

        $response = json_decode($result, true);

        return ($response['status'] ?? false) && ($response['data']['status'] ?? '') === 'success';
    }

    /**
     * Capture method (required by interface).
     */
    public function capture(string $orderNumber, int $amountCents, string $customerEmail = ''): bool
    {
        // In Paystack, capture is usually automatic or handled via separate capture API 
        // if using "charge" vs "capture". For this simple integration, we return true.
        return true;
    }
}
