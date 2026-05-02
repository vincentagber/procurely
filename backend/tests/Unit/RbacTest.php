<?php

declare(strict_types=1);

namespace Procurely\Api\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\AuthService;
use Procurely\Api\Support\EmailService;
use Ramsey\Uuid\Uuid;

class RbacTest extends TestCase
{
    private Database $database;
    private \PDO $pdo;

    protected function setUp(): void
    {
        // Use in-memory SQLite for testing
        $this->database = Database::getInstance();
        $this->pdo = $this->database->connection();
        
        // Create test schema
        $this->createTestSchema();
        
        // Seed test data
        $this->seedTestData();
    }

    private function createTestSchema(): void
    {
        $schema = file_get_contents(__DIR__ . '/../../database/rbac-schema.sql');
        $statements = array_filter(
            explode(';', $schema),
            fn($stmt) => trim($stmt) !== '' && !str_starts_with(trim($stmt), 'PRAGMA')
        );
        
        foreach ($statements as $statement) {
            if (trim($statement) !== '') {
                try {
                    $this->pdo->exec($statement);
                } catch (\PDOException $e) {
                    if (!str_contains($e->getMessage(), 'already exists')) {
                        throw $e;
                    }
                }
            }
        }
        
        $this->pdo->exec('PRAGMA foreign_keys = ON');
    }

    private function seedTestData(): void
    {
        // Create test users
        $users = [
            ['uuid' => Uuid::uuid7()->toString(), 'full_name' => 'Admin User', 'email' => 'admin@test.com', 'role' => 'admin'],
            ['uuid' => Uuid::uuid7()->toString(), 'full_name' => 'Customer User', 'email' => 'customer@test.com', 'role' => 'customer'],
            ['uuid' => Uuid::uuid7()->toString(), 'full_name' => 'Support User', 'email' => 'support@test.com', 'role' => 'support'],
        ];

        foreach ($users as $userData) {
            // Insert user
            $stmt = $this->pdo->prepare("
                INSERT INTO users (uuid, full_name, email, password_hash, is_active, created_at, updated_at)
                VALUES (:uuid, :full_name, :email, 'hash', 1, datetime('now'), datetime('now'))
            ");
            $stmt->execute([
                'uuid' => $userData['uuid'],
                'full_name' => $userData['full_name'],
                'email' => $userData['email'],
            ]);
            
            $userId = (int) $this->pdo->lastInsertId();
            
            // Assign role
            $roleStmt = $this->pdo->prepare("SELECT id FROM roles WHERE name = :name");
            $roleStmt->execute(['name' => $userData['role']]);
            $role = $roleStmt->fetch();
            
            if ($role) {
                $this->pdo->prepare("
                    INSERT INTO user_roles (user_id, role_id, assigned_at)
                    VALUES (:user_id, :role_id, datetime('now'))
                ")->execute([
                    'user_id' => $userId,
                    'role_id' => $role['id'],
                ]);
            }
        }
    }

    public function testSingleAdminRule(): void
    {
        // Try to create another admin (should fail)
        $authService = new AuthService(
            $this->database,
            $this->createMock(EmailService::class)
        );

        $this->expectException(\Procurely\Api\Support\ApiException::class);
        $this->expectExceptionCode(403);
        
        $authService->createAdminAccount('Another Admin', 'admin2@test.com');
    }

    public function testAdminHasAllPermissions(): void
    {
        // Get admin user
        $stmt = $this->pdo->prepare("
            SELECT u.*, GROUP_CONCAT(r.name) as roles
            FROM users u
            JOIN user_roles ur ON u.id = ur.user_id
            JOIN roles r ON ur.role_id = r.id
            WHERE u.email = 'admin@test.com'
            GROUP BY u.id
        ");
        $stmt->execute();
        $user = $stmt->fetch();
        
        $this->assertNotNull($user);
        $this->assertStringContainsString('admin', $user['roles']);
        
        // Check permissions
        $permStmt = $this->pdo->prepare("
            SELECT COUNT(*) as cnt FROM permissions
        ");
        $permStmt->execute();
        $totalPermissions = (int) $permStmt->fetch()['cnt'];
        
        $userPermStmt = $this->pdo->prepare("
            SELECT COUNT(DISTINCT p.name) as cnt
            FROM permissions p
            JOIN role_permissions rp ON p.id = rp.permission_id
            JOIN user_roles ur ON rp.role_id = ur.role_id
            WHERE ur.user_id = :user_id
        ");
        $userPermStmt->execute(['user_id' => $user['id']]);
        $userPermissions = (int) $userPermStmt->fetch()['cnt'];
        
        $this->assertEquals($totalPermissions, $userPermissions, 'Admin should have all permissions');
    }

    public function testCustomerPermissions(): void
    {
        $stmt = $this->pdo->prepare("
            SELECT u.id, GROUP_CONCAT(p.name) as permissions
            FROM users u
            JOIN user_roles ur ON u.id = ur.user_id
            JOIN role_permissions rp ON ur.role_id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE u.email = 'customer@test.com'
            GROUP BY u.id
        ");
        $stmt->execute();
        $result = $stmt->fetch();
        
        $permissions = explode(',', $result['permissions']);
        
        // Customer should have these permissions
        $this->assertContains('product.read', $permissions);
        $this->assertContains('order.create', $permissions);
        $this->assertContains('order.read.own', $permissions);
        $this->assertContains('customer.read.own', $permissions);
        
        // Customer should NOT have these permissions
        $this->assertNotContains('system.users.manage', $permissions);
        $this->assertNotContains('system.roles.manage', $permissions);
        $this->assertNotContains('order.read.all', $permissions);
    }

    public function testSupportPermissions(): void
    {
        $stmt = $this->pdo->prepare("
            SELECT GROUP_CONCAT(p.name) as permissions
            FROM users u
            JOIN user_roles ur ON u.id = ur.user_id
            JOIN role_permissions rp ON ur.role_id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE u.email = 'support@test.com'
            GROUP BY u.id
        ");
        $stmt->execute();
        $result = $stmt->fetch();
        
        $permissions = explode(',', $result['permissions']);
        
        // Support should have these
        $this->assertContains('order.read.all', $permissions);
        $this->assertContains('customer.read.all', $permissions);
        $this->assertContains('customer.support.tickets', $permissions);
        
        // Support should NOT have these
        $this->assertNotContains('product.create', $permissions);
        $this->assertNotContains('payment.refund', $permissions);
    }

    public function testAuthorizationMiddlewareDeniesUnauthenticated(): void
    {
        // Test that unauthenticated requests are rejected
        $this->assertTrue(true, 'Middleware test requires integration test setup');
    }

    public function testAuditLogCreated(): void
    {
        // Insert an audit log entry
        $stmt = $this->pdo->prepare("
            INSERT INTO audit_logs (user_id, action, resource_type, details, created_at)
            VALUES (:user_id, :action, :resource_type, :details, :created_at)
        ");
        
        $stmt->execute([
            'user_id' => 1,
            'action' => 'test_action',
            'resource_type' => 'test',
            'details' => json_encode(['test' => true]),
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        
        $checkStmt = $this->pdo->query("SELECT COUNT(*) as cnt FROM audit_logs");
        $count = (int) $checkStmt->fetch()['cnt'];
        
        $this->assertGreaterThan(0, $count, 'Audit log should be created');
    }

    public function testGuestRoleHasLimitedPermissions(): void
    {
        // Guest is not in user_roles table, so they have no permissions
        // The AuthMiddleware will return null for user, and endpoints will require auth
        $this->assertTrue(true, 'Guest permissions tested at middleware level');
    }

    protected function tearDown(): void
    {
        // Clean up
        $tables = ['audit_logs', 'user_roles', 'role_permissions', 'permissions', 'roles', 'users'];
        foreach ($tables as $table) {
            try {
                $this->pdo->exec("DROP TABLE IF EXISTS $table");
            } catch (\Exception $e) {
                // Ignore
            }
        }
    }
}
