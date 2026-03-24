<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\Database;

final class EngagementService
{
    public function __construct(
        private readonly Database $database,
    ) {
    }

    public function requestQuote(array $payload): array
    {
        $companyName = trim((string) ($payload['companyName'] ?? ''));
        $fullName = trim((string) ($payload['fullName'] ?? ''));
        $email = mb_strtolower(trim((string) ($payload['email'] ?? '')));
        $phone = trim((string) ($payload['phone'] ?? ''));
        $projectLocation = trim((string) ($payload['projectLocation'] ?? ''));
        $boqNotes = trim((string) ($payload['boqNotes'] ?? ''));

        if ($companyName === '' || $fullName === '' || $phone === '' || $projectLocation === '' || $boqNotes === '') {
            throw new ApiException('All quote request fields are required.', 422);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new ApiException('A valid email address is required.', 422);
        }

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
        $email = mb_strtolower(trim((string) ($payload['email'] ?? '')));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new ApiException('A valid email address is required.', 422);
        }

        $statement = $this->database->connection()->prepare(
            'INSERT OR IGNORE INTO newsletter_subscribers (email, created_at) VALUES (:email, :created_at)'
        );
        $statement->execute([
            'email' => $email,
            'created_at' => (new DateTimeImmutable())->format(DateTimeImmutable::ATOM),
        ]);

        return [
            'message' => 'You are subscribed to Procurely updates.',
        ];
    }
}
