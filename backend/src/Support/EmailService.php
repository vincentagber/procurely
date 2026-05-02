<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

final class EmailService
{
    private const LOG_FILE = 'storage/emails.log';

    public function __construct(
        private readonly string $rootPath,
    ) {
    }

    public function sendOrderConfirmation(array $order): void
    {
        $to = $order['customerEmail'];
        $subject = sprintf('Order Confirmation - %s', $order['orderNumber']);

        $itemsHtml = '';
        if (!empty($order['items'])) {
            foreach ($order['items'] as $item) {
                $itemsHtml .= sprintf(
                    '<tr><td style="padding: 8px 0;">%s x %d</td><td style="padding: 8px 0; text-align: right;">N%s</td></tr>',
                    htmlspecialchars($item['productName'] ?? $item['product_name'] ?? ''),
                    (int) ($item['quantity'] ?? 0),
                    number_format(($item['lineTotal'] ?? 0) / 100, 2)
                );
            }
        }

        $total = number_format($order['total'] / 100, 2);
        $subtotal = number_format(($order['subtotal'] ?? 0) / 100, 2);
        $vat = number_format(($order['vat'] ?? 0) / 100, 2);
        $shipping = number_format(($order['shippingFee'] ?? $order['shipping_fee'] ?? 0) / 100, 2);
        $serviceFee = number_format(($order['serviceFee'] ?? $order['service_fee'] ?? 0) / 100, 2);

        $paymentMethod = $order['paymentMethod'] ?? $order['payment_method'] ?? 'N/A';

        $orderNumber = htmlspecialchars($order['orderNumber']);
        $orderStatus = htmlspecialchars($order['status'] ?? '');
        $paymentMethod = htmlspecialchars($order['paymentMethod'] ?? $order['payment_method'] ?? 'N/A');

        $body = $this->buildHtmlTemplate(
            'Order Confirmed',
            sprintf('Hi %s,', htmlspecialchars($order['customerName'])),
            <<<HTML
            <p>Your order <strong>{$orderNumber}</strong> has been placed successfully.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <thead><tr style="border-bottom: 2px solid #e5e7eb;"><th style="text-align: left; padding: 8px 0;">Item</th><th style="text-align: right; padding: 8px 0;">Amount</th></tr></thead>
                <tbody>{$itemsHtml}</tbody>
                <tfoot>
                    <tr style="border-top: 1px solid #e5e7eb;"><td style="padding: 8px 0;">Subtotal</td><td style="padding: 8px 0; text-align: right;">N{$subtotal}</td></tr>
                    <tr><td style="padding: 4px 0;">VAT (7.5%)</td><td style="padding: 4px 0; text-align: right;">N{$vat}</td></tr>
                    <tr><td style="padding: 4px 0;">Shipping</td><td style="padding: 4px 0; text-align: right;">N{$shipping}</td></tr>
                    <tr><td style="padding: 4px 0;">Service Fee</td><td style="padding: 4px 0; text-align: right;">N{$serviceFee}</td></tr>
                    <tr style="border-top: 2px solid #e5e7eb; font-weight: bold;"><td style="padding: 12px 0;">Total</td><td style="padding: 12px 0; text-align: right; font-size: 18px;">N{$total}</td></tr>
                </tfoot>
            </table>
            <p><strong>Status:</strong> {$orderStatus}<br/>
            <strong>Payment Method:</strong> {$paymentMethod}</p>
            <p>Thank you for choosing Procurely!</p>
            HTML,
            sprintf('Order %s - N%s', $order['orderNumber'], $total)
        );

        $this->sendEmail($to, $subject, $body, true);
        $this->sendAdminNotification($order);
    }

    public function sendPaymentReceipt(array $order): void
    {
        $to = $order['customerEmail'];
        $subject = sprintf('Payment Receipt - %s', $order['orderNumber']);

        $total = number_format($order['total'] / 100, 2);
        $paidAt = $order['paidAt'] ?? $order['paid_at'] ?? date('Y-m-d H:i:s');

        $body = $this->buildHtmlTemplate(
            'Payment Receipt',
            sprintf('Hi %s,', htmlspecialchars($order['customerName'])),
            <<<HTML
            <p>We have received your payment for order <strong>{$order['orderNumber']}</strong>.</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0; color: #166534;"><strong>Payment Status:</strong> Confirmed<br/>
                <strong>Amount Paid:</strong> N{$total}<br/>
                <strong>Payment Date:</strong> {$paidAt}<br/>
                <strong>Order Number:</strong> {$order['orderNumber']}</p>
            </div>
            <p>You can track your order status in your Procurely account.</p>
            HTML,
            sprintf('Payment Receipt - N%s', $total)
        );

        $this->sendEmail($to, $subject, $body, true);
    }

    public function sendOrderStatusUpdate(array $order, string $newStatus, string $previousStatus): void
    {
        $to = $order['customerEmail'];
        $subject = sprintf('Order Status Update - %s', $order['orderNumber']);

        $statusMessages = [
            'processing' => 'Your order is being processed.',
            'paid' => 'Payment has been confirmed.',
            'fulfilled' => 'Your order has been fulfilled and is being prepared for dispatch.',
            'dispatched' => 'Your order has been dispatched!',
            'delivered' => 'Your order has been delivered. Thank you for shopping with Procurely!',
            'cancelled' => 'Your order has been cancelled.',
        ];

        $message = $statusMessages[$newStatus] ?? sprintf('Your order status has been updated to: %s', ucfirst($newStatus));

        $body = $this->buildHtmlTemplate(
            'Order Status Update',
            sprintf('Hi %s,', htmlspecialchars($order['customerName'])),
            <<<HTML
            <p>Your order <strong>{$order['orderNumber']}</strong> status has been updated.</p>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0;"><strong>Previous Status:</strong> {$previousStatus}<br/>
                <strong>New Status:</strong> <span style="font-weight: bold; color: #1d4ed8;">{$newStatus}</span><br/><br/>
                {$message}</p>
            </div>
            HTML,
            sprintf('Order %s - %s', $order['orderNumber'], ucfirst($newStatus))
        );

        $this->sendEmail($to, $subject, $body, true);
    }

    public function sendPasswordReset(string $to, string $resetLink): void
    {
        $subject = 'Password Reset Request';

        $body = $this->buildHtmlTemplate(
            'Reset Your Password',
            'Hi,',
            <<<HTML
            <p>You requested a password reset for your Procurely account.</p>
            <div style="text-align: center; margin: 24px 0;">
                <a href="{$resetLink}" style="background: #2563eb; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This link will expire in 15 minutes. If you didn't request this, please ignore this email.</p>
            HTML,
            'Password Reset'
        );

        $this->sendEmail($to, $subject, $body, true);
    }

    public function sendAdminNotification(array $order): void
    {
        $to = 'sales@useprocurely.com';
        $subject = sprintf('New Order Received - %s', $order['orderNumber']);

        $total = number_format($order['total'] / 100, 2);
        $phone = $order['phone'] ?? 'N/A';
        $orderNumber = $order['orderNumber'];
        $customerName = $order['customerName'];
        $customerEmail = $order['customerEmail'];
        $status = $order['status'];
        $body = $this->buildHtmlTemplate(
            'New Order Alert',
            'A new order has been placed:',
            <<<HTML
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 4px 0; color: #6b7280;">Order Number</td><td style="padding: 4px 0;"><strong>{$orderNumber}</strong></td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280;">Customer</td><td style="padding: 4px 0;">{$customerName} ({$customerEmail})</td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280;">Phone</td><td style="padding: 4px 0;">{$phone}</td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280;">Amount</td><td style="padding: 4px 0; font-weight: bold; color: #166534;">N{$total}</td></tr>
                <tr><td style="padding: 4px 0; color: #6b7280;">Status</td><td style="padding: 4px 0;">{$status}</td></tr>
            </table>
            HTML,
            sprintf('Order %s - N%s', $orderNumber, $total)
        );

        $this->sendEmail($to, $subject, $body, true);
    }

    private function buildHtmlTemplate(string $title, string $greeting, string $content, ?string $headerBadge = null): string
    {
        $badgeHtml = $headerBadge ? sprintf('<span style="background: #eff6ff; color: #1d4ed8; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">%s</span>', htmlspecialchars($headerBadge)) : '';

        return <<<HTML
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;"><tr><td style="padding: 32px 0;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <tr><td style="background: #1e40af; padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0 0 8px; font-size: 24px;">Procurely</h1>
                        {$badgeHtml}
                    </td></tr>
                    <tr><td style="padding: 32px;">
                        <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">{$title}</h2>
                        <p style="margin: 0 0 16px; color: #374151; font-size: 16px;">{$greeting}</p>
                        {$content}
                    </td></tr>
                    <tr><td style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">&copy; 2026 Procurely. All rights reserved.</p>
                    </td></tr>
                </table>
            </td></tr></table>
        </body>
        </html>
        HTML;
    }

    private function sendEmail(string $to, string $subject, string $body, bool $isHtml = false): void
    {
        $fromEmail = $_ENV['MAIL_FROM_ADDRESS'] ?? 'sales@useprocurely.com';
        $fromName = $_ENV['MAIL_FROM_NAME'] ?? 'Procurely';

        $headers = [
            'From' => sprintf('%s <%s>', $fromName, $fromEmail),
            'Reply-To' => $fromEmail,
            'X-Mailer' => 'PHP/' . phpversion(),
        ];

        if ($isHtml) {
            $headers['MIME-Version'] = '1.0';
            $headers['Content-Type'] = 'text/html; charset=UTF-8';
        } else {
            $headers['Content-Type'] = 'text/plain; charset=UTF-8';
        }

        $headerString = '';
        foreach ($headers as $key => $value) {
            $headerString .= sprintf("%s: %s\r\n", $key, $value);
        }

        $success = @mail($to, $subject, $body, $headerString);

        if ($success) {
            $this->logEmail($to, $subject, $isHtml ? '[HTML Email]' : $body, 'sent');
        } else {
            $error = error_get_last();
            $errorMsg = $error ? $error['message'] : 'mail() failed';
            $this->logEmail($to, $subject, $isHtml ? '[HTML Email]' : $body, 'failed: ' . $errorMsg);
        }
    }

    private function logEmail(string $to, string $subject, string $body, string $status = 'logged'): void
    {
        $entry = sprintf(
            "[%s] Status: %s | To: %s | Subject: %s\n",
            (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM),
            $status,
            $to,
            $subject
        );

        $logPath = $this->rootPath . '/' . self::LOG_FILE;
        $dir = dirname($logPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($logPath, $entry, FILE_APPEND);
    }
}
