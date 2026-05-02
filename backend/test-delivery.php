<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Procurely\Api\Support\EmailService;

echo "=== Email Delivery Test ===\n\n";

// IMPORTANT: Replace with your actual email address for testing
$testEmail = 'vincentagber74@gmail.com'; // <-- PUT YOUR REAL EMAIL HERE

if ($testEmail === 'your-real-email@example.com') {
    echo "ERROR: Please edit this file and set your real email address on line 11.\n";
    exit(1);
}

$emailService = new EmailService(__DIR__);

// Test Order Confirmation
echo "Test 1: Sending Order Confirmation...\n";
$order = [
    'customerEmail' => $testEmail,
    'customerName' => 'Test User',
    'orderNumber' => 'PRC-TEST-' . time(),
    'total' => 10690000,
    'subtotal' => 10000000,
    'vat' => 750000,
    'shippingFee' => 0,
    'serviceFee' => 0,
    'status' => 'processing',
    'paymentMethod' => 'Paystack',
    'phone' => '08012345678',
    'items' => [
        ['productName' => 'Sharp Sand 20 Tons', 'quantity' => 20, 'lineTotal' => 8000000],
        ['productName' => 'Marine Plywood', 'quantity' => 10, 'lineTotal' => 2200000],
    ],
];

$emailService->sendOrderConfirmation($order);
echo "  ✓ Order confirmation sent to {$testEmail}\n";
echo "  ✓ Admin notification sent to sales@useprocurely.com\n\n";

// Test Payment Receipt
echo "Test 2: Sending Payment Receipt...\n";
$receiptOrder = [
    'customerEmail' => $testEmail,
    'customerName' => 'Test User',
    'orderNumber' => 'PRC-TEST-' . time(),
    'total' => 2357310,
    'paidAt' => date('Y-m-d H:i:s'),
];

$emailService->sendPaymentReceipt($receiptOrder);
echo "  ✓ Payment receipt sent to {$testEmail}\n\n";

// Test Status Update
echo "Test 3: Sending Status Update...\n";
$statusOrder = [
    'customerEmail' => $testEmail,
    'customerName' => 'Test User',
    'orderNumber' => 'PRC-TEST-' . time(),
    'status' => 'dispatched',
];

$emailService->sendOrderStatusUpdate($statusOrder, 'dispatched', 'processing');
echo "  ✓ Status update sent to {$testEmail}\n\n";

// Test Password Reset
echo "Test 4: Sending Password Reset...\n";
$emailService->sendPasswordReset($testEmail, 'https://procurely.com/reset?token=test123');
echo "  ✓ Password reset sent to {$testEmail}\n\n";

echo "=== All Tests Complete ===\n";
echo "Check your inbox (and spam folder) at: {$testEmail}\n";
echo "Check mail queue: mailq\n";
echo "Check mail log: " . __DIR__ . "/storage/emails.log\n";

// Show log
echo "\n=== Email Log ===\n";
$logPath = __DIR__ . '/storage/emails.log';
if (file_exists($logPath)) {
    echo file_get_contents($logPath);
}
