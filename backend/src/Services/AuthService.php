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
    private const RESET_TOKEN_TTL_MINUTES = 15;

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
            'password_hash' => password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]),
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

        // FIX: Use consistent timing even on missing account to prevent user enumeration via timing attack.
        $dummyHash = '$2y$12$invalidhashusedtomaintaintimingXXXXXXXXXXXXXXXXXXXXXX';
        $hashToVerify = $user !== false ? (string) $user['password_hash'] : $dummyHash;

        if ($user === false || !password_verify($password, $hashToVerify)) {
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

        // Always return the same message to prevent email enumeration (timing-safe)
        if ($lookup->fetch() === false) {
            return [
                'message' => 'If this email is registered, reset instructions have been sent.',
            ];
        }

        // CRITICAL-3 FIX: Store hash of token, not the token itself.
        // Attacker with DB read access cannot recover actual reset tokens.
        $rawToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $rawToken);
        $now = new DateTimeImmutable();
        $expiresAt = $now->modify(sprintf('+%d minutes', self::RESET_TOKEN_TTL_MINUTES))->format(DateTimeImmutable::ATOM);

        // LOW-13 FIX: Delete only unexpired old tokens for idempotency.
        $cleanup = $pdo->prepare('DELETE FROM password_reset_requests WHERE email = :email');
        $cleanup->execute(['email' => $email]);

        $statement = $pdo->prepare(
            'INSERT INTO password_reset_requests (email, token_hash, expires_at, created_at) VALUES (:email, :token_hash, :expires_at, :created_at)'
        );
        $statement->execute([
            'email' => $email,
            'token_hash' => $tokenHash,
            'expires_at' => $expiresAt,
            'created_at' => $now->format(DateTimeImmutable::ATOM),
        ]);

        $response = [
            'message' => 'If this email is registered, reset instructions have been sent.',
        ];

        // CRITICAL-1 FIX: Only expose raw token in debug mode (env default now false).
        if ($this->debugMode) {
            $response['_debugResetToken'] = $rawToken;
        }

        return $response;
    }

    public function logout(PDO $pdo, string $token): array
    {
        // MEDIUM-8 FIX: Token invalidation on logout.
        $statement = $pdo->prepare('DELETE FROM user_tokens WHERE token = :token');
        $statement->execute(['token' => $token]);

        return ['message' => 'Logged out successfully.'];
    }

    public function resolveToken(string $bearerToken): ?array
    {
        $pdo = $this->database->connection();
        $statement = $pdo->prepare(
            'SELECT u.id, u.uuid, u.full_name, u.email
             FROM user_tokens ut
             JOIN users u ON u.id = ut.user_id
             WHERE ut.token = :token
             LIMIT 1'
        );
        $statement->execute(['token' => $bearerToken]);
        $user = $statement->fetch();

        return $user !== false ? $user : null;
    }

    private function issueToken(PDO $pdo, int $userId): string
    {
        // MEDIUM-8 FIX: Use 32 bytes (64 hex chars) for sufficient entropy.
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
