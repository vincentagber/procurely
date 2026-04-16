<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\Input;

final class EngagementService
{
    public function __construct(
        private readonly Database $database,
    ) {
    }

    public function requestQuote(array $payload): array
    {
        $companyName = Input::requiredString($payload, 'companyName', 'Company name', 120);
        $fullName = Input::requiredString($payload, 'fullName', 'Full name', 120);
        $email = Input::email($payload, 'email', 'email address');
        $phone = Input::phone($payload, 'phone', 'phone number');
        $projectLocation = Input::requiredString($payload, 'projectLocation', 'Project location', 160);
        $boqNotes = Input::requiredString($payload, 'boqNotes', 'BOQ notes', 2000, false);

        $statement = $this->database->connection()->prepare(
            'INSERT INTO quote_requests (company_name, full_name, email, phone, project_location, boq_notes, created_at)
             VALUES (:company_name, :full_name, :email, :phone, :project_location, :boq_notes, :created_at)'
        );
        $statement->execute([
            'company_name' => $companyName,
            'full_name' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'project_location' => $projectLocation,
            'boq_notes' => $boqNotes,
            'created_at' => (new DateTimeImmutable())->format(DateTimeImmutable::ATOM),
        ]);

        return [
            'message' => 'Your BOQ request has been received. A material expert will reach out shortly.',
        ];
    }

    public function subscribe(array $payload): array
    {
        $email = Input::email($payload, 'email', 'email address');

        $isMysql = ($_ENV['DB_DRIVER'] ?? 'sqlite') === 'mysql';
        $sql = $isMysql 
            ? 'INSERT IGNORE INTO newsletter_subscribers (email, created_at) VALUES (:email, :created_at)'
            : 'INSERT OR IGNORE INTO newsletter_subscribers (email, created_at) VALUES (:email, :created_at)';

        $statement = $this->database->connection()->prepare($sql);
        $statement->execute([
            'email' => $email,
            'created_at' => (new DateTimeImmutable())->format(DateTimeImmutable::ATOM),
        ]);

        return [
            'message' => $statement->rowCount() > 0
                ? 'You are subscribed to Procurely updates.'
                : 'This email is already subscribed to Procurely updates.',
        ];
    }
}
