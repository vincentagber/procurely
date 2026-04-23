<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use DateTimeImmutable;
use PDO;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\EmailService;
use Procurely\Api\Support\Input;
use Ramsey\Uuid\Uuid;

final class AuthService
{
    private const RESET_TOKEN_TTL_MINUTES = 15;

    public function __construct(
        private readonly Database $database,
        private readonly EmailService $emailService,
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

        $createdAt = (new DateTimeImmutable())->format('Y-m-d H:i:s');
        $uuid = Uuid::uuid7()->toString();
        $statement = $pdo->prepare(
            'INSERT INTO users (uuid, full_name, email, password_hash, wallet_balance, created_at, updated_at) VALUES (:uuid, :full_name, :email, :password_hash, 0, :created_at, :updated_at)'
        );
        $statement->execute([
            'uuid' => $uuid,
            'full_name' => $fullName,
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_ARGON2ID, [
                'memory_cost' => 65536,
                'time_cost' => 4,
                'threads' => 3
            ]),
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);

        $userId = (int) $pdo->lastInsertId();

        // Assign default customer role
        $roleStmt = $pdo->prepare('SELECT id FROM roles WHERE name = :name LIMIT 1');
        $roleStmt->execute(['name' => 'customer']);
        $role = $roleStmt->fetch();
        if ($role) {
            $pdo->prepare('INSERT INTO user_roles (user_id, role_id, assigned_at) VALUES (:user_id, :role_id, :assigned_at)')
                ->execute([
                    'user_id' => $userId,
                    'role_id' => $role['id'],
                    'assigned_at' => $createdAt,
                ]);
        }

        $token = $this->issueToken($pdo, $userId);

        return [
            'token' => $token,
            'user' => [
                'id' => $uuid,
                'fullName' => $fullName,
                'email' => $email,
                'roles' => ['customer'],
                'permissions' => ['product.read', 'order.create', 'order.read'],
                'walletBalance' => 0,
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
        $statement = $pdo->prepare('
            SELECT u.id, u.uuid, u.full_name, u.email, u.password_hash, u.wallet_balance, GROUP_CONCAT(r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.email = :email
            GROUP BY u.id
            LIMIT 1
        ');
        $statement->execute(['email' => $email]);
        $user = $statement->fetch();

        $dummyHash = '$argon2id$v=19$m=65536,t=4,p=3$invalidhashusedtomaintaintimingXXXXXXXXXXXXXXXXXXXXXX';
        $hashToVerify = $user !== false ? (string) $user['password_hash'] : $dummyHash;

        if ($user === false || !password_verify($password, $hashToVerify)) {
            throw new ApiException('Invalid email or password.', 401);
        }

        $token = $this->issueToken($pdo, (int) $user['id']);

        $roles = !empty($user['roles']) ? explode(',', (string)$user['roles']) : [];
        $permissions = $this->getUserPermissions($pdo, (int) $user['id']);

        return [
            'token' => $token,
            'user' => [
                'id' => $user['uuid'],
                'fullName' => $user['full_name'],
                'email' => $user['email'],
                'roles' => $roles,
                'permissions' => $permissions,
                'walletBalance' => (int) ($user['wallet_balance'] ?? 0),
            ],
        ];
    }

    public function resetPassword(array $payload): array
    {
        $token = (string) ($payload['token'] ?? '');
        $password = (string) ($payload['password'] ?? '');

        if ($token === '') {
            throw new ApiException('Reset token is required.', 422);
        }

        if (mb_strlen($password) < 8) {
            throw new ApiException('Password must be at least 8 characters.', 422);
        }

        $pdo = $this->database->connection();
        $tokenHash = hash('sha256', $token);
        $now = (new DateTimeImmutable())->format('Y-m-d H:i:s');

        $stmt = $pdo->prepare('
            SELECT user_id FROM password_reset_requests 
            WHERE token_hash = :token_hash AND expires_at > :now 
            LIMIT 1
        ');
        $stmt->execute(['token_hash' => $tokenHash, 'now' => $now]);
        $request = $stmt->fetch();

        if ($request === false) {
            throw new ApiException('Invalid or expired reset token.', 422);
        }

        $userId = (int) $request['user_id'];
        $passwordHash = password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 3
        ]);

        $pdo->beginTransaction();
        try {
            $update = $pdo->prepare('UPDATE users SET password_hash = :hash, updated_at = :now WHERE id = :id');
            $update->execute(['hash' => $passwordHash, 'now' => $now, 'id' => $userId]);

            $cleanup = $pdo->prepare('DELETE FROM password_reset_requests WHERE user_id = :id');
            $cleanup->execute(['id' => $userId]);

            // Revoke all active sessions for security
            $revoke = $pdo->prepare('DELETE FROM user_sessions WHERE user_id = :id');
            $revoke->execute(['id' => $userId]);

            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }

        return ['message' => 'Password has been reset successfully.'];
    }

    public function forgotPassword(array $payload): array
    {
        $email = Input::email($payload, 'email', 'email address');
        $pdo = $this->database->connection();
        $lookup = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $lookup->execute(['email' => $email]);
        $user = $lookup->fetch();

        // Always return the same message to prevent email enumeration (timing-safe)
        if ($user === false) {
            return [
                'message' => 'If this email is registered, reset instructions have been sent.',
            ];
        }

        // Store a hash of the token to prevent recovery via database access.
        $rawToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $rawToken);
        $now = new DateTimeImmutable();
        $expiresAt = $now->modify(sprintf('+%d minutes', self::RESET_TOKEN_TTL_MINUTES))->format('Y-m-d H:i:s');

        $cleanup = $pdo->prepare('DELETE FROM password_reset_requests WHERE user_id = :user_id');
        $cleanup->execute(['user_id' => $user['id']]);

        $statement = $pdo->prepare(
            'INSERT INTO password_reset_requests (user_id, token_hash, expires_at, created_at) VALUES (:user_id, :token_hash, :expires_at, :created_at)'
        );
        $statement->execute([
            'user_id' => $user['id'],
            'token_hash' => $tokenHash,
            'expires_at' => $expiresAt,
            'created_at' => $now->format('Y-m-d H:i:s'),
        ]);

        // Send reset email
        $frontendUrl = $_ENV['FRONTEND_URL'] ?? '';
        if ($frontendUrl === '') {
            throw new \RuntimeException('FRONTEND_URL is not configured.');
        }

        $resetLink = $frontendUrl . '/auth/reset-password?token=' . $rawToken;
        $this->emailService->sendPasswordReset($email, $resetLink);

        $response = [
            'message' => 'If this email is registered, reset instructions have been sent.',
        ];

        return $response;
    }

    public function logout(PDO $pdo, string $token): array
    {
        $tokenHash = hash('sha256', $token);
        $statement = $pdo->prepare('DELETE FROM user_sessions WHERE session_token_hash = :token_hash');
        $statement->execute(['token_hash' => $tokenHash]);

        return ['message' => 'Logged out successfully.'];
    }

    public function updateProfile(int $userId, array $payload): array
    {
        $fullName = Input::requiredString($payload, 'fullName', 'Full name', 120);
        $email = Input::email($payload, 'email', 'email address');
        $phone = (string) ($payload['phone'] ?? '');
        $whatsapp = (string) ($payload['whatsapp'] ?? '');

        $pdo = $this->database->connection();

        // Check if email is already taken by another user
        $check = $pdo->prepare('SELECT id FROM users WHERE email = :email AND id != :id LIMIT 1');
        $check->execute(['email' => $email, 'id' => $userId]);

        if ($check->fetch() !== false) {
            throw new ApiException('This email is already in use by another account.', 409, ['field' => 'email']);
        }

        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $stmt = $pdo->prepare('UPDATE users SET full_name = :full_name, email = :email, phone = :phone, whatsapp = :whatsapp, updated_at = :now WHERE id = :id');
        $stmt->execute([
            'full_name' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'whatsapp' => $whatsapp,
            'now' => $now,
            'id' => $userId,
        ]);

        $user = $pdo->prepare('
            SELECT u.uuid, u.full_name, u.email, u.phone, u.whatsapp, u.wallet_balance, GROUP_CONCAT(r.name) as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            WHERE u.id = :id
            GROUP BY u.id
            LIMIT 1
        ');
        $user->execute(['id' => $userId]);
        $updated = $user->fetch();

        $roles = $updated['roles'] ? explode(',', $updated['roles']) : [];
        $permissions = $this->getUserPermissions($pdo, $userId);

        return [
            'id' => $updated['uuid'],
            'fullName' => $updated['full_name'],
            'email' => $updated['email'],
            'phone' => $updated['phone'],
            'whatsapp' => $updated['whatsapp'],
            'roles' => $roles,
            'permissions' => $permissions,
            'walletBalance' => (int) ($updated['wallet_balance'] ?? 0),
        ];
    }

    private function getUserPermissions(PDO $pdo, int $userId): array
    {
        $stmt = $pdo->prepare('
            SELECT DISTINCT p.name
            FROM permissions p
            JOIN role_permissions rp ON p.id = rp.permission_id
            JOIN user_roles ur ON rp.role_id = ur.role_id
            WHERE ur.user_id = :user_id
        ');
        $stmt->execute(['user_id' => $userId]);
        return array_column($stmt->fetchAll(), 'name');
    }

    public function resolveToken(string $bearerToken): ?array
    {
        $tokenHash = hash('sha256', $bearerToken);
        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        
        $pdo = $this->database->connection();
        $statement = $pdo->prepare(
            'SELECT u.id, u.uuid, u.full_name, u.email, u.wallet_balance, GROUP_CONCAT(r.name) as roles
             FROM user_sessions us
             JOIN users u ON u.id = us.user_id
             LEFT JOIN user_roles ur ON u.id = ur.user_id
             LEFT JOIN roles r ON ur.role_id = r.id
             WHERE us.session_token_hash = :token_hash AND us.expires_at > :now
             GROUP BY u.id
             LIMIT 1'
        );
        $statement->execute(['token_hash' => $tokenHash, 'now' => $now]);
        $user = $statement->fetch();

        if ($user) {
            $user['roles'] = !empty($user['roles']) ? explode(',', (string)$user['roles']) : [];
            $user['permissions'] = $this->getUserPermissions($pdo, (int) $user['id']);
        }

        return $user !== false ? $user : null;
    }

    private function issueToken(PDO $pdo, int $userId): string
    {
        $token = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);
        $now = new \DateTimeImmutable();
        $createdAt = $now->format('Y-m-d H:i:s');
        $expiresAt = $now->modify('+30 days')->format('Y-m-d H:i:s');

        $statement = $pdo->prepare('INSERT INTO user_sessions (user_id, session_token_hash, expires_at, created_at, last_activity) VALUES (:user_id, :token_hash, :expires_at, :created_at, :last_activity)');
        $statement->execute([
            'user_id' => $userId,
            'token_hash' => $tokenHash,
            'expires_at' => $expiresAt,
            'created_at' => $createdAt,
            'last_activity' => $createdAt,
        ]);

        return $token;
    }
}
