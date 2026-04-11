<?php

namespace Procurely\Api\Repositories;

/**
 * Repository for User authentication and data
 */
class UserRepository extends BaseRepository
{
    public function findById(int $id): ?array
    {
        return $this->fetchOne('users', 'id', $id);
    }

    public function findByEmail(string $email): ?array
    {
        return $this->fetchOne('users', 'email', $email);
    }

    public function findByUuid(string $uuid): ?array
    {
        return $this->fetchOne('users', 'uuid', $uuid);
    }

    public function create(array $data): int
    {
        $sql = "INSERT INTO users (uuid, full_name, email, password_hash, role, created_at) 
                VALUES (:uuid, :full_name, :email, :password, :role, NOW())";
        
        $this->execute($sql, [
            'uuid' => $data['uuid'] ?? bin2hex(random_bytes(16)),
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'password' => $data['password_hash'],
            'role' => $data['role'] ?? 'user',
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = ['id' => $id];

        foreach (['full_name', 'email', 'role'] as $key) {
            if (isset($data[$key])) {
                $fields[] = "{$key} = :{$key}";
                $params[$key] = $data[$key];
            }
        }

        if (empty($fields)) return false;

        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
        $this->execute($sql, $params);
        return true;
    }
}
