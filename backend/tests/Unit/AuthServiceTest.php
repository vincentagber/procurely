<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Services\AuthService;
use Procurely\Api\Support\EmailService;

class AuthServiceTest extends TestCase
{
    private Database $db;
    private AuthService $authService;

    protected function setUp(): void
    {
        if (file_exists('storage/test.sqlite')) {
            unlink('storage/test.sqlite');
        }

        $this->db = new Database('storage/test.sqlite');
        $emailService = new EmailService(__DIR__ . '/../../');
        $this->authService = new AuthService($this->db, $emailService, true);
    }

    #[Test]
    public function register_requires_full_name()
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('Full name is required.');

        $this->authService->register([
            'email' => 'test@example.com',
            'password' => 'TestPassword123!',
        ]);
    }

    #[Test]
    public function register_requires_valid_email()
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('A valid email address is required.');

        $this->authService->register([
            'fullName' => 'Test User',
            'email' => 'not-an-email',
            'password' => 'TestPassword123!',
        ]);
    }

    #[Test]
    public function register_requires_minimum_password_length()
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('Password must be at least 8 characters.');

        $this->authService->register([
            'fullName' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'short',
        ]);
    }

    #[Test]
    public function register_returns_token_and_user_data()
    {
        $result = $this->authService->register([
            'fullName' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'TestPassword123!',
        ]);

        $this->assertArrayHasKey('token', $result);
        $this->assertArrayHasKey('user', $result);
        $this->assertEquals('Test User', $result['user']['fullName']);
        $this->assertEquals('test@example.com', $result['user']['email']);
        $this->assertContains('customer', $result['user']['roles']);
    }

    #[Test]
    public function register_prevents_duplicate_email()
    {
        $this->authService->register([
            'fullName' => 'First User',
            'email' => 'duplicate@example.com',
            'password' => 'TestPassword123!',
        ]);

        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('An account with this email already exists.');

        $this->authService->register([
            'fullName' => 'Second User',
            'email' => 'duplicate@example.com',
            'password' => 'AnotherPassword123!',
        ]);
    }

    #[Test]
    public function login_with_invalid_credentials_fails()
    {
        $this->authService->register([
            'fullName' => 'Test User',
            'email' => 'login@example.com',
            'password' => 'TestPassword123!',
        ]);

        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('Invalid email or password.');

        $this->authService->login([
            'email' => 'login@example.com',
            'password' => 'WrongPassword',
        ]);
    }

    #[Test]
    public function login_with_valid_credentials_returns_token()
    {
        $this->authService->register([
            'fullName' => 'Test User',
            'email' => 'login@example.com',
            'password' => 'TestPassword123!',
        ]);

        $result = $this->authService->login([
            'email' => 'login@example.com',
            'password' => 'TestPassword123!',
        ]);

        $this->assertArrayHasKey('token', $result);
        $this->assertEquals('Test User', $result['user']['fullName']);
    }

    #[Test]
    public function login_with_nonexistent_email_fails_safely()
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('Invalid email or password.');

        $this->authService->login([
            'email' => 'nonexistent@example.com',
            'password' => 'AnyPassword123!',
        ]);
    }

    #[Test]
    public function update_profile_checks_email_uniqueness()
    {
        $user1 = $this->authService->register([
            'fullName' => 'First User',
            'email' => 'user1@example.com',
            'password' => 'TestPassword123!',
        ]);

        $this->authService->register([
            'fullName' => 'Second User',
            'email' => 'user2@example.com',
            'password' => 'TestPassword123!',
        ]);

        $pdo = $this->db->connection();
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => 'user1@example.com']);
        $user1Id = (int) $stmt->fetchColumn();

        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('This email is already in use by another account.');

        $this->authService->updateProfile($user1Id, [
            'fullName' => 'Updated User',
            'email' => 'user2@example.com',
        ]);
    }
}
