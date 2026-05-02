#!/usr/bin/env php
<?php

declare(strict_types=1);

/**
 * RBAC Verification Script
 * 
 * Verifies that the RBAC system is properly set up:
 * - Checks all tables exist
 * - Verifies admin account exists
 * - Validates role-permission assignments
 * - Tests single admin constraint
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Procurely\Api\Support\Database;

echo "=== Procurely RBAC Verification ===\n\n";

$db = new Database(__DIR__ . '/../' . ($_ENV['DATABASE_PATH'] ?? 'storage/procurely.sqlite'));
$pdo = $db->connection();
$isSqlite = str_contains($pdo->getAttribute(PDO::ATTR_DRIVER_NAME), 'sqlite');

if ($isSqlite) {
    $pdo->exec('PRAGMA foreign_keys = ON');
}

$allPassed = true;

// =============================================
// Test 1: Check Tables Exist
// =============================================
echo "Test 1: Checking RBAC tables...\n";

$tables = ['roles', 'permissions', 'role_permissions', 'user_roles', 'audit_logs'];
foreach ($tables as $table) {
    try {
        $pdo->query("SELECT 1 FROM $table LIMIT 1");
        echo "  ✓ Table '$table' exists\n";
    } catch (PDOException $e) {
        echo "  ✗ Table '$table' missing!\n";
        $allPassed = false;
    }
}

// =============================================
// Test 2: Check System Roles
// =============================================
echo "\nTest 2: Checking system roles...\n";

$expectedRoles = ['admin', 'customer', 'guest', 'support', 'warehouse', 'finance'];
$rolesStmt = $pdo->query("SELECT name FROM roles");
$existingRoles = array_column($rolesStmt->fetchAll(), 'name');

foreach ($expectedRoles as $role) {
    if (in_array($role, $existingRoles)) {
        echo "  ✓ Role '$role' exists\n";
    } else {
        echo "  ✗ Role '$role' missing!\n";
        $allPassed = false;
    }
}

// =============================================
// Test 3: Check Admin Account
// =============================================
echo "\nTest 3: Checking admin account...\n";

$adminStmt = $pdo->query("
    SELECT u.email, u.is_active, r.name as role
    FROM users u
    JOIN user_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
");
$admins = $adminStmt->fetchAll();

if (count($admins) === 0) {
    echo "  ✗ No admin account found!\n";
    $allPassed = false;
} elseif (count($admins) > 1) {
    echo "  ✗ Multiple admin accounts found (" . count($admins) . ")! Only one allowed.\n";
    $allPassed = false;
} else {
    $admin = $admins[0];
    echo "  ✓ Admin account found: " . $admin['email'] . "\n";
    echo "    Status: " . ($admin['is_active'] ? 'Active' : 'Inactive') . "\n";
}

// =============================================
// Test 4: Check Permissions
// =============================================
echo "\nTest 4: Checking permissions...\n";

$permStmt = $pdo->query("SELECT COUNT(*) as cnt FROM permissions");
$permCount = (int) $permStmt->fetch()['cnt'];
echo "  ✓ Total permissions defined: $permCount\n";

if ($permCount < 20) {
    echo "  ⚠ Warning: Expected at least 20 permissions\n";
}

// =============================================
// Test 5: Check Role-Permission Assignments
// =============================================
echo "\nTest 5: Checking role-permission assignments...\n";

$rolePermStmt = $pdo->query("
    SELECT r.name as role, COUNT(rp.permission_id) as perm_count
    FROM roles r
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    GROUP BY r.id
");

while ($row = $rolePermStmt->fetch()) {
    echo "  ✓ Role '" . $row['role'] . "': " . $row['perm_count'] . " permissions\n";
}

// =============================================
// Test 6: Check Admin Has All Permissions
// =============================================
echo "\nTest 6: Verifying admin has all permissions...\n";

$adminPermStmt = $pdo->query("
    SELECT COUNT(DISTINCT p.id) as admin_perms
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN roles r ON rp.role_id = r.id
    WHERE r.name = 'admin'
");
$adminPermCount = (int) $adminPermStmt->fetch()['admin_perms'];

$totalPermStmt = $pdo->query("SELECT COUNT(*) as cnt FROM permissions");
$totalPerm = (int) $totalPermStmt->fetch()['cnt'];

if ($adminPermCount === $totalPerm) {
    echo "  ✓ Admin has all $totalPerm permissions\n";
} else {
    echo "  ✗ Admin has $adminPermCount out of $totalPerm permissions\n";
    $allPassed = false;
}

// =============================================
// Test 7: Check Audit Logs Table
// =============================================
echo "\nTest 7: Checking audit logs...\n";

try {
    $logStmt = $pdo->query("SELECT COUNT(*) as cnt FROM audit_logs");
    $logCount = (int) $logStmt->fetch()['cnt'];
    echo "  ✓ Audit logs table ready ($logCount entries)\n";
} catch (PDOException $e) {
    echo "  ✗ Audit logs table issue: " . $e->getMessage() . "\n";
    $allPassed = false;
}

// =============================================
// Summary
// =============================================
echo "\n" . str_repeat("=", 50) . "\n";
if ($allPassed) {
    echo "✓ ALL CHECKS PASSED! RBAC system is properly configured.\n";
} else {
    echo "✗ Some checks failed. Please review the issues above.\n";
}
echo str_repeat("=", 50) . "\n\n";

// Output credentials if admin exists
if (count($admins) === 1) {
    echo "Admin Login Credentials:\n";
    echo "  Email: vincentagber74@gmail.com\n";
    echo "  Password: [Set via password reset]\n";
    echo "  Role: Administrator (full access)\n\n";
}

echo "Next Steps:\n";
echo "  1. If admin password is pending, check email for reset link\n";
echo "  2. Run tests: php vendor/bin/phpunit tests/Unit/RbacTest.php\n";
echo "  3. Review routes in backend/public/index.php for permission enforcement\n\n";
