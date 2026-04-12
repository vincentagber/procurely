<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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

        $this->sendEmail($to, $subject, $body);

        // Notify Admin as well
        $this->sendAdminNotification($order);
    }

    public function sendAdminNotification(array $order): void
    {
        $to = 'sales@useprocurely.com';
        $subject = sprintf('New Order Received - %s', $order['orderNumber']);
        $body = sprintf(
            "New order from %s (%s).\nAmount: N%s\nOrder ID: %s",
            $order['customerName'],
            $order['customerEmail'],
            number_format($order['total'] / 100, 2),
            $order['orderNumber']
        );

        $this->sendEmail($to, $subject, $body);
    }

    public function sendPasswordReset(string $to, string $resetLink): void
    {
        $subject = 'Password Reset Request';
        $body = sprintf(
            "Hi,\n\nYou requested a password reset. Click the link below to reset your password:\n\n%s\n\nIf you didn't request this, please ignore this email.\n\nThank you,\nProcurely Team",
            $resetLink
        );

        $this->sendEmail($to, $subject, $body);
    }

    private function sendEmail(string $to, string $subject, string $body): void
    {
        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host = $_ENV['SMTP_HOST'] ?? '';
            $mail->SMTPAuth = true;
            $mail->Username = $_ENV['SMTP_USER'] ?? '';
            $mail->Password = $_ENV['SMTP_PASS'] ?? '';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = (int) ($_ENV['SMTP_PORT'] ?? 465);

            if ($mail->Host === '' || $mail->Username === '' || $mail->Password === '') {
                throw new \RuntimeException('SMTP configuration is incomplete.');
            }

            // Recipients
            $mail->setFrom('sales@useprocurely.com', 'Procurely');
            $mail->addAddress($to);

            // Content
            $mail->isHTML(false);
            $mail->Subject = $subject;
            $mail->Body = $body;

            $mail->send();

            $this->logEmail($to, $subject, $body, 'sent');
        } catch (Exception $e) {
            $this->logEmail($to, $subject, $body, 'failed: ' . $mail->ErrorInfo);
            // In production, you might want to throw or handle differently
        }
    }

    private function logEmail(string $to, string $subject, string $body, string $status = 'logged'): void
    {
        $entry = sprintf(
            "[%s] %s\nTo: %s\nSubject: %s\nBody: %s\n-----------------------------------\n",
            (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM),
            $status,
            $to,
            $subject,
            $body
        );

        file_put_contents($this->rootPath . '/' . self::LOG_FILE, $entry, FILE_APPEND);
    }
}
