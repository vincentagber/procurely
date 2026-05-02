<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Procurely\Api\Support\EmailService;

echo "=== Mail Configuration Check ===\n";
echo "sendmail_path: " . ini_get('sendmail_path') . "\n";
echo "mail.add_x_header: " . ini_get('mail.add_x_header') . "\n";
echo "SMTP (Windows): " . ini_get('SMTP') . "\n\n";

// Test if sendmail works
echo "=== Testing sendmail directly ===\n";
$sendmail = ini_get('sendmail_path') ?: '/usr/sbin/sendmail -t -i';
echo "Using: $sendmail\n\n";

// Test 1: Simple mail() test
echo "=== Test 1: Simple plain text email ===\n";
$to = 'test@example.com'; // Replace with your actual email for testing
$subject = 'Procurely Mail Test - ' . date('Y-m-d H:i:s');
$message = "This is a test email from Procurely.\n\nSent at: " . date('Y-m-d H:i:s');
$headers = "From: sales@useprocurely.com\r\n" .
           "Reply-To: sales@useprocurely.com\r\n" .
           "X-Mailer: PHP/" . phpversion();

$result = @mail($to, $subject, $message, $headers);
echo "mail() result: " . ($result ? 'TRUE (accepted for delivery)' : 'FALSE (failed)') . "\n";

if (!$result) {
    $error = error_get_last();
    echo "Last error: " . print_r($error, true) . "\n";
}

// Test 2: HTML email test
echo "\n=== Test 2: HTML email ===\n";
$headersHtml = "From: Procurely <sales@useprocurely.com>\r\n" .
               "Reply-To: sales@useprocurely.com\r\n" .
               "MIME-Version: 1.0\r\n" .
               "Content-Type: text/html; charset=UTF-8\r\n" .
               "X-Mailer: PHP/" . phpversion();

$htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif;">
    <h1 style="color: #1e40af;">Procurely Mail Test</h1>
    <p>This is an <strong>HTML test email</strong> from Procurely.</p>
    <p>Sent at: <?= date('Y-m-d H:i:s') ?></p>
    <div style="background: #f0fdf4; padding: 16px; border-radius: 8px;">
        <p style="margin: 0; color: #166534;">If you can read this, HTML emails are working!</p>
    </div>
</body>
</html>
HTML;

$result2 = @mail($to, 'Procurely HTML Test', $htmlBody, $headersHtml);
echo "HTML mail() result: " . ($result2 ? 'TRUE (accepted for delivery)' : 'FALSE (failed)') . "\n";

// Test 3: EmailService test
echo "\n=== Test 3: EmailService Order Confirmation ===\n";
try {
    $emailService = new EmailService(__DIR__);

    $testOrder = [
        'customerEmail' => $to,
        'customerName' => 'Test User',
        'orderNumber' => 'PRC-TEST-' . time(),
        'total' => 10690000, // in kobo
        'subtotal' => 10000000,
        'vat' => 750000,
        'shippingFee' => 0,
        'serviceFee' => 0,
        'status' => 'processing',
        'paymentMethod' => 'Paystack',
        'items' => [
            [
                'productName' => 'Sharp Sand 20 Tons',
                'quantity' => 20,
                'lineTotal' => 8000000,
            ],
            [
                'productName' => 'Marine Plywood',
                'quantity' => 10,
                'lineTotal' => 2200000,
            ],
        ],
    ];

    $emailService->sendOrderConfirmation($testOrder);
    echo "Order confirmation email sent (check log at: storage/emails.log)\n";

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}

// Check mail log
echo "\n=== Mail Log ===\n";
$logPath = __DIR__ . '/storage/emails.log';
if (file_exists($logPath)) {
    echo file_get_contents($logPath);
} else {
    echo "No log file found at $logPath\n";
}

echo "\n=== Done ===\n";
echo "NOTE: On macOS, postfix handles local mail delivery.\n";
echo "To check mail queue: sudo mailq\n";
echo "To start postfix if not running: sudo postfix start\n";
