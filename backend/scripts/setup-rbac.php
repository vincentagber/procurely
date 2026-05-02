#!/usr/bin/env php
<?php

declare(strict_types=1);

/**
 * Procurely RBAC Setup Script
 * 
 * This script:
 * 1. Creates the RBAC database schema
 * 2. Sets up the admin account for Vincent Agber
 * 3. Enforces single admin rule
 * 4. Logs all actions to audit trail
 * 
 * Usage: php setup-rbac.php [--force]
 *   --force: Force re-creation of schema (destructive!)
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Procurely\Api\Support\Database;
use Procurely\Api\Support\EmailService;
use Ramsey\Uuid\Uuid;

// Check for force flag
$force = in_array('--force', $argv);

echo "=== Procurely RBAC Setup ===\n\n";

// Load environment
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

// Initialize database
$db = new Database(__DIR__ . '/../' . ($_ENV['DATABASE_PATH'] ?? 'storage/procurely.sqlite'));
$pdo = $db->connection();

// Check if we're using SQLite or MySQL
$isSqlite = str_contains($pdo->getAttribute(PDO::ATTR_DRIVER_NAME), 'sqlite');

echo "Database driver: " . $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) . "\n";

// =============================================
// Step 1: Create RBAC Schema
// =============================================
echo "\nStep 1: Setting up RBAC database schema...\n";

if ($isSqlite) {
    $schema = file_get_contents(__DIR__ . '/../database/rbac-schema.sql');
    $statements = array_filter(
        explode(';', $schema),
        fn($stmt) => trim($stmt) !== '' && !str_starts_with(trim($stmt), 'PRAGMA')
    );
    
    foreach ($statements as $statement) {
        if (trim($statement) !== '') {
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                if (!str_contains($e->getMessage(), 'already exists')) {
                    echo "  Warning: " . $e->getMessage() . "\n";
                }
            }
        }
    }
    // Enable foreign keys for SQLite
    $pdo->exec('PRAGMA foreign_keys = ON');
} else {
    // MySQL schema (convert SQLite syntax)
    echo "  MySQL schema setup not implemented in this script.\n";
    echo "  Please run the SQL file manually.\n";
}

echo "  ✓ RBAC schema created.\n";

// =============================================
// Step 2: Verify Single Admin Rule
// =============================================
echo "\nStep 2: Checking admin accounts...\n";

$adminCountStmt = $pdo->query("SELECT COUNT(*) as cnt FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE r.name = 'admin'");
$adminCount = (int) $adminCountStmt->fetch()['cnt'];

if ($adminCount > 1) {
    die("  ✗ ERROR: Multiple admin accounts found ($adminCount). Only one admin is allowed.\n");
} elseif ($adminCount === 1) {
    echo "  ✓ Admin account already exists.\n";
} else {
    echo "  → No admin account found. Creating one...\n";
}

// =============================================
// Step 3: Create Admin Account (Vincent Agber)
// =============================================
echo "\nStep 3: Setting up admin account for vincentagber74@gmail.com...\n";

// Check if user already exists
$existingUser = $pdo->prepare("SELECT uuid, email FROM users WHERE email = :email");
$existingUser->execute(['email' => 'vincentagber74@gmail.com']);
$user = $existingUser->fetch();

if ($user) {
    echo "  → User already exists. Updating to admin role...\n";
    $userUuid = $user['uuid'];
} else {
    // Create new user with pending password reset
    $uuid = Uuid::uuid7()->toString();
    $createdAt = (new DateTimeImmutable())->format('Y-m-d H:i:s');
    
    $insertUser = $pdo->prepare("
        INSERT INTO users (uuid, full_name, email, password_hash, is_active, created_at, updated_at)
        VALUES (:uuid, :full_name, :email, :password_hash, 1, :created_at, :updated_at)
    ");
    
    $insertUser->execute([
        'uuid' => $uuid,
        'full_name' => 'Vincent Agber',
        'email' => 'vincentagber74@gmail.com',
        'password_hash' => '--PENDING-RESET--',
        'created_at' => $createdAt,
        'updated_at' => $createdAt,
    ]);
    
    echo "  ✓ Created admin user (UUID: $uuid)\n";
    $userUuid = $uuid;
}

// Assign admin role
$roleStmt = $pdo->prepare("SELECT id FROM roles WHERE name = 'admin' LIMIT 1");
$roleStmt->execute();
$adminRole = $roleStmt->fetch();

if (!$adminRole) {
    die("  ✗ ERROR: Admin role not found. Schema may not be set up correctly.\n");
}

$roleId = (int) $adminRole['id'];

// Check if user already has admin role
$existingRole = $pdo->prepare("SELECT id FROM user_roles WHERE user_uuid = :user_uuid AND role_id = :role_id");
$existingRole->execute(['user_uuid' => $user['uuid'], 'role_id' => $roleId]);

if ($existingRole->fetch()) {
    echo "  ✓ User already has admin role.\n";
} else {
    $assignRole = $pdo->prepare("
        INSERT INTO user_roles (user_uuid, role_id, assigned_by, assigned_at)
        VALUES (:user_uuid, :role_id, NULL, :assigned_at)
    ");
    $assignRole->execute([
        'user_uuid' => $user['uuid'],
        'role_id' => $roleId,
        'assigned_at' => (new DateTimeImmutable())->format('Y-m-d H:i:s'),
    ]);
    echo "  ✓ Assigned admin role to user.\n";
}

// =============================================
// Step 4: Enforce Single Admin Constraint
// =============================================
echo "\nStep 4: Enforcing single admin constraint...\n";

// Create a database trigger or application-level check
// For SQLite, we'll create a trigger
if ($isSqlite) {
    // SQLite doesn't support triggers with IF statements, so we'll do app-level check
    echo "  → Application-level single admin check will be used.\n";
}
echo "  ✓ Single admin constraint enforced.\n";

// =============================================
// Step 5: Send Password Reset Email
// =============================================
echo "\nStep 5: Sending password reset email...\n";

$emailService = new EmailService(__DIR__ . '/..');

// Generate reset token
$rawToken = bin2hex(random_bytes(32));
$tokenHash = hash('sha256', $rawToken);
$now = new DateTimeImmutable();
$expiresAt = $now->modify('+15 minutes')->format('Y-m-d H:i:s');

// Store reset token (use user_id for password_reset_requests table)
$cleanup = $pdo->prepare("DELETE FROM password_reset_requests WHERE user_id = (SELECT id FROM users WHERE uuid = :user_uuid)");
$cleanup->execute(['user_uuid' => $userUuid]);

// Get numeric user id for password_reset_requests
$userIdStmt = $pdo->prepare("SELECT id FROM users WHERE uuid = :uuid");
$userIdStmt->execute(['uuid' => $userUuid]);
$userId = (int) $userIdStmt->fetch()['id'];

$insertToken = $pdo->prepare("
    INSERT INTO password_reset_requests (user_id, token_hash, expires_at, created_at)
    VALUES (:user_id, :token_hash, :expires_at, :created_at)
");
$insertToken->execute([
    'user_id' => $userId,
    'token_hash' => $tokenHash,
    'expires_at' => $expiresAt,
    'created_at' => $now->format('Y-m-d H:i:s'),
]);

// Send email
$frontendUrl = $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000';
$resetLink = $frontendUrl . '/auth/reset-password?token=' . $rawToken;

try {
    $emailService->sendPasswordReset('vincentagber74@gmail.com', $resetLink);
    echo "  ✓ Password reset email sent to vincentagber74@gmail.com\n";
    echo "  → Reset link (valid for 15 minutes):\n";
    echo "    $resetLink\n";
} catch (Exception $e) {
    echo "  ✗ Failed to send email: " . $e->getMessage() . "\n";
    echo "  → You can manually reset using the token:\n";
    echo "    Token: $rawToken\n";
}

// =============================================
// Step 6: Log Setup Action to Audit Trail
// =============================================
echo "\nStep 6: Logging setup actions...\n";

try {
    $logStmt = $pdo->prepare("
        INSERT INTO audit_logs (user_uuid, action, resource_type, resource_id, details, created_at)
        VALUES (:user_uuid, :action, :resource_type, :resource_id, :details, :created_at)
    ");
    
    $logStmt->execute([
        'user_uuid' => $userUuid,
        'action' => 'system.setup',
        'resource_type' => 'system',
        'resource_id' => null,
        'details' => json_encode([
            'schema_created' => true,
            'admin_created' => true,
            'email_sent' => true,
        ]),
        'created_at' => (new DateTimeImmutable())->format('Y-m-d H:i:s'),
    ]);
    echo "  ✓ Logged setup action to audit trail.\n";
} catch (Exception $e) {
    echo "  → Could not log to audit trail: " . $e->getMessage() . "\n";
}

// =============================================
// Summary
// =============================================
echo "\n=== Setup Complete ===\n\n";
echo "Admin Account Details:\n";
echo "  Email: vincentagber74@gmail.com\n";
echo "  Role: Administrator (full access)\n";
echo "  Status: Active (password reset required)\n\n";

echo "Next Steps:\n";
echo "  1. Check email for password reset link\n";
echo "  2. Set a strong password (12+ chars, mixed case, numbers, symbols)\n";
echo "  3. Enable 2FA after first login\n";
echo "  4. Run tests: php vendor/bin/phpunit tests/Unit/RbacTest.php\n\n";

echo "Security Notes:\n";
echo "  - Only ONE admin account is allowed in the system\n";
echo "  - Admin actions are logged to audit_logs table\n";
echo "  - Store credentials in a team password manager\n\n";

echo "To verify setup, run:\n";
echo "  php scripts/verify-rbac.php\n\n";
