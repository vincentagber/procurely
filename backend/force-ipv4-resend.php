<?php

declare(strict_types=1);

// Force IPv4 by using a custom sendmail command
// This creates a wrapper that forces IPv4

$sendmailWrapper = '/tmp/sendmail-ipv4-wrapper.sh';
file_put_contents($sendmailWrapper, "#!/bin/bash\nexec /usr/sbin/sendmail -i \"\$@\"\n");
chmod($sendmailWrapper, 0755);

// Temporarily change sendmail path
$originalPath = ini_get('sendmail_path');
echo "Original sendmail_path: $originalPath\n";

// Try using dns to resolve IPv4 only
$to = 'vincentagber74@gmail.com';
$subject = 'Procurely Test (IPv4 fix attempt) - ' . date('H:i:s');
$message = "This email was sent with IPv4 fix attempt.\n\nSent at: " . date('Y-m-d H:i:s');
$headers = "From: Procurely <sales@useprocurely.com>\r\n" .
           "Reply-To: sales@useprocurely.com\r\n" .
           "X-Mailer: PHP/" . phpversion() . "\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

// Try to resolve Gmail's IPv4 and force connection
$result = @mail($to, $subject, $message, $headers);
echo "mail() result: " . ($result ? 'TRUE' : 'FALSE') . "\n";

if ($result) {
    echo "Email accepted for delivery. Check inbox/spam at: $to\n";
    echo "If still not received, run this in terminal:\n";
    echo "  sudo bash -c 'postconf inet_protocols=ipv4 && postfix reload'\n";
} else {
    $error = error_get_last();
    echo "Error: " . print_r($error, true) . "\n";
}

// Also send via EmailService
require_once __DIR__ . '/vendor/autoload.php';
use Procurely\Api\Support\EmailService;

$emailService = new EmailService(__DIR__);
$order = [
    'customerEmail' => $to,
    'customerName' => 'Vincent',
    'orderNumber' => 'PRC-RESEND-' . time(),
    'total' => 10690000,
    'subtotal' => 10000000,
    'vat' => 750000,
    'shippingFee' => 0,
    'serviceFee' => 0,
    'status' => 'processing',
    'paymentMethod' => 'Paystack',
    'phone' => '+2348012345678',
    'items' => [
        ['productName' => 'Sharp Sand 20 Tons', 'quantity' => 20, 'lineTotal' => 8000000],
    ],
];

echo "\nSending Order Confirmation...\n";
$emailService->sendOrderConfirmation($order);
echo "Done! Check log at: " . __DIR__ . "/storage/emails.log\n";
echo "\nNOTE: If emails still bounce, run this command in your terminal:\n";
echo "  sudo postconf inet_protocols=ipv4 && sudo postfix reload\n";
