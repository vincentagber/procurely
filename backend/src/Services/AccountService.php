<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use PDO;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\Input;

final class AccountService
{
    public function __construct(
        private readonly Database $database,
    ) {
    }

    public function getCompanyInfo(string $userUuid): ?array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT * FROM user_company_info WHERE user_uuid = :uuid');
        $stmt->execute(['uuid' => $userUuid]);
        $info = $stmt->fetch();

        return $info !== false ? $info : null;
    }

    public function updateCompany(string $userUuid, array $payload): array
    {
        $name = (string) ($payload['name'] ?? '');
        $taxId = (string) ($payload['taxId'] ?? '');
        $businessType = (string) ($payload['businessType'] ?? '');
        $email = (string) ($payload['email'] ?? '');
        $whatsapp = (string) ($payload['whatsapp'] ?? '');
        $address = (string) ($payload['address'] ?? '');

        $pdo = $this->database->connection();
        $updatedAt = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);

        $stmt = $pdo->prepare('
            INSERT INTO user_company_info (user_uuid, company_name, tax_id, business_type, email, whatsapp, address, updated_at)
            VALUES (:uuid, :name, :tax_id, :type, :email, :whatsapp, :address, :updated_at)
            ON CONFLICT(user_uuid) DO UPDATE SET
                company_name = excluded.company_name,
                tax_id = excluded.tax_id,
                business_type = excluded.business_type,
                email = excluded.email,
                whatsapp = excluded.whatsapp,
                address = excluded.address,
                updated_at = excluded.updated_at
        ');

        // Handle MySQL ON DUPLICATE KEY UPDATE syntax if needed
        $driver = $_ENV['DB_DRIVER'] ?? 'sqlite';
        if ($driver === 'mysql') {
            $stmt = $pdo->prepare('
                INSERT INTO user_company_info (user_uuid, company_name, tax_id, business_type, email, whatsapp, address, updated_at)
                VALUES (:uuid, :name, :tax_id, :type, :email, :whatsapp, :address, :updated_at)
                ON DUPLICATE KEY UPDATE
                    company_name = VALUES(company_name),
                    tax_id = VALUES(tax_id),
                    business_type = VALUES(business_type),
                    email = VALUES(email),
                    whatsapp = VALUES(whatsapp),
                    address = VALUES(address),
                    updated_at = VALUES(updated_at)
            ');
        }

        $stmt->execute([
            'uuid' => $userUuid,
            'name' => $name,
            'tax_id' => $taxId,
            'type' => $businessType,
            'email' => $email,
            'whatsapp' => $whatsapp,
            'address' => $address,
            'updated_at' => $updatedAt,
        ]);

        return ['message' => 'Company information updated successfully.'];
    }

    public function getAddresses(string $userUuid): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT * FROM user_addresses WHERE user_uuid = :uuid ORDER BY is_default DESC, created_at DESC');
        $stmt->execute(['uuid' => $userUuid]);
        return $stmt->fetchAll();
    }

    public function addAddress(string $userUuid, array $payload): array
    {
        $label = Input::requiredString($payload, 'label', 'Label', 100);
        $address = Input::requiredString($payload, 'address', 'Address', 500);
        $isDefault = (int) ($payload['isDefault'] ?? 0);

        $pdo = $this->database->connection();
        $createdAt = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);

        if ($isDefault === 1) {
            $pdo->prepare('UPDATE user_addresses SET is_default = 0 WHERE user_uuid = :uuid')
                ->execute(['uuid' => $userUuid]);
        }

        $stmt = $pdo->prepare('
            INSERT INTO user_addresses (user_uuid, label, address, is_default, created_at)
            VALUES (:uuid, :label, :address, :is_default, :created_at)
        ');
        $stmt->execute([
            'uuid' => $userUuid,
            'label' => $label,
            'address' => $address,
            'is_default' => $isDefault,
            'created_at' => $createdAt,
        ]);

        return ['id' => (int) $pdo->lastInsertId(), 'message' => 'Address added successfully.'];
    }

    public function deleteAddress(string $userUuid, int $addressId): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('DELETE FROM user_addresses WHERE id = :id AND user_uuid = :uuid');
        $stmt->execute(['id' => $addressId, 'uuid' => $userUuid]);

        return ['message' => 'Address deleted successfully.'];
    }

    public function getPaymentMethods(string $userUuid): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT * FROM user_payment_methods WHERE user_uuid = :uuid ORDER BY is_default DESC, created_at DESC');
        $stmt->execute(['uuid' => $userUuid]);
        return $stmt->fetchAll();
    }
}
