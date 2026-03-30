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
        $body = sprintf(
            "Hi %s,\n\nYour order %s has been placed successfully.\nTotal: N%s\nStatus: %s\n\nThank you for choosing Procurely!",
            $order['customerName'],
            $order['orderNumber'],
            number_format($order['total'] / 100, 2),
            ucfirst($order['status'])
        );

        $this->logEmail($to, $subject, $body);

        // Notify Admin as well
        $this->sendAdminNotification($order);
    }

    public function sendAdminNotification(array $order): void
    {
        $to = 'admin@procurely.com';
        $subject = sprintf('New Order Received - %s', $order['orderNumber']);
        $body = sprintf(
            "New order from %s (%s).\nAmount: N%s\nOrder ID: %s",
            $order['customerName'],
            $order['customerEmail'],
            number_format($order['total'] / 100, 2),
            $order['orderNumber']
        );

        $this->logEmail($to, $subject, $body);
    }

    private function logEmail(string $to, string $subject, string $body): void
    {
        $entry = sprintf(
            "[%s]\nTo: %s\nSubject: %s\nBody: %s\n-----------------------------------\n",
            (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM),
            $to,
            $subject,
            $body
        );

        file_put_contents($this->rootPath . '/' . self::LOG_FILE, $entry, FILE_APPEND);
    }
}
