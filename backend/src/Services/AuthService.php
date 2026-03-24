<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use PDO;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\Input;
use Ramsey\Uuid\Uuid;

final class AuthService
{
    public function __construct(
        private readonly Database $database,
        private readonly bool $debugMode = false,
    ) {
    }

    public function register(array $payload): array
    {
        $fullName = Input::requiredString($payload, 'fullName', 'Full name', 120);
        $email = Input::email($payload, 'email', 'email address');
        $password = (string) ($payload['password'] ?? '');

        if (trim($password) === '') {
            throw new ApiException('Password is required.', 422, ['field' => 'password']);
        }

        if (mb_strlen($password) < 8) {
            throw new ApiException('Password must be at least 8 characters.', 422, ['field' => 'password']);
        }

        if (mb_strlen($password) > 72) {
            throw new ApiException('Password must be 72 characters or fewer.', 422, ['field' => 'password']);
        }

        $pdo = $this->database->connection();
        $existing = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $existing->execute(['email' => $email]);

        if ($existing->fetch() !== false) {
            throw new ApiException('An account with this email already exists.', 409);
        }

        $createdAt = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);
        $uuid = Uuid::uuid7()->toString();
        $statement = $pdo->prepare(
            'INSERT INTO users (uuid, full_name, email, password_hash, created_at) VALUES (:uuid, :full_name, :email, :password_hash, :created_at)'
        );
        $statement->execute([
            'uuid' => $uuid,
            'full_name' => $fullName,
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'created_at' => $createdAt,
        ]);

        $userId = (int) $pdo->lastInsertId();
        $token = $this->issueToken($pdo, $userId);

        return [
            'token' => $token,
            'user' => [
                'id' => $uuid,
                'fullName' => $fullName,
                'email' => $email,
            ],
        ];
    }

    public function login(array $payload): array
    {
        $email = Input::email($payload, 'email', 'email address');
        $password = (string) ($payload['password'] ?? '');

        if ($password === '') {
            throw new ApiException('Password is required.', 422, ['field' => 'password']);
        }

        $pdo = $this->database->connection();
        $statement = $pdo->prepare('SELECT id, uuid, full_name, email, password_hash FROM users WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);
        $user = $statement->fetch();

        if ($user === false || !password_verify($password, (string) $user['password_hash'])) {
            throw new ApiException('Invalid email or password.', 401);
        }

        $token = $this->issueToken($pdo, (int) $user['id']);

        return [
            'token' => $token,
            'user' => [
                'id' => $user['uuid'],
                'fullName' => $user['full_name'],
                'email' => $user['email'],
            ],
        ];
    }

    public function forgotPassword(array $payload): array
    {
        $email = Input::email($payload, 'email', 'email address');
        $pdo = $this->database->connection();
        $lookup = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $lookup->execute(['email' => $email]);

        if ($lookup->fetch() === false) {
            return [
                'message' => 'Reset instructions have been prepared for this email address.',
            ];
        }

        $token = bin2hex(random_bytes(16));
        $createdAt = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);
        $cleanup = $pdo->prepare('DELETE FROM password_reset_requests WHERE email = :email');
        $cleanup->execute(['email' => $email]);
        $statement = $pdo->prepare(
            'INSERT INTO password_reset_requests (email, token, created_at) VALUES (:email, :token, :created_at)'
        );
        $statement->execute([
            'email' => $email,
            'token' => $token,
            'created_at' => $createdAt,
        ]);

        $response = [
            'message' => 'Reset instructions have been prepared for this email address.',
        ];

        if ($this->debugMode) {
            $response['resetTokenPreview'] = $token;
        }

        return $response;
    }

    private function issueToken(PDO $pdo, int $userId): string
    {
        $token = bin2hex(random_bytes(32));
        $createdAt = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);
        $statement = $pdo->prepare('INSERT INTO user_tokens (user_id, token, created_at) VALUES (:user_id, :token, :created_at)');
        $statement->execute([
            'user_id' => $userId,
            'token' => $token,
            'created_at' => $createdAt,
        ]);

        return $token;
    }
}
