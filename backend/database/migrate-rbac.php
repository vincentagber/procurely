#!/usr/bin/env php
<?php

declare(strict_types=1);

/**
 * RBAC Database Migration Script
 * 
 * Handles both SQLite and MySQL database migrations for RBAC schema
 * Usage: php migrate-rbac.php [--fresh] [--seed]
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Procurely\Api\Support\Database;

echo "=== Procurely RBAC Migration ===\n\n";

// Load environment
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$db = Database::getInstance();
$pdo = $db->connection();

$fresh = in_array('--fresh', $argv);
$seed = in_array('--seed', $argv);
$isSqlite = str_contains($pdo->getAttribute(PDO::ATTR_DRIVER_NAME), 'sqlite');

if ($fresh) {
    echo "⚠ WARNING: --fresh flag will DROP existing RBAC tables!\n";
    echo "Press Ctrl+C to cancel, or wait 5 seconds to continue...\n";
    sleep(5);
}

// Define tables in order (respecting foreign keys)
$tables = [
    'audit_logs',
    'user_roles', 
    'role_permissions',
    'permissions',
    'roles',
];

if ($fresh && $isSqlite) {
    echo "Dropping existing tables...\n";
    $pdo->exec('PRAGMA foreign_keys = OFF');
    foreach (array_reverse($tables) as $table) {
        $pdo->exec("DROP TABLE IF EXISTS $table");
        echo "  ✓ Dropped $table\n";
    }
    $pdo->exec('PRAGMA foreign_keys = ON');
}

// Run the schema
echo "\nRunning RBAC schema...\n";
$schema = file_get_contents(__DIR__ . '/rbac-schema.sql');

if ($isSqlite) {
    $statements = array_filter(
        explode(';', $schema),
        fn($stmt) => trim($stmt) !== '' && !str_starts_with(trim($stmt), 'PRAGMA')
    );
    
    $pdo->exec('PRAGMA foreign_keys = ON');
    
    foreach ($statements as $statement) {
        if (trim($statement) !== '') {
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                if (!str_contains($e->getMessage(), 'already exists')) {
                    echo "  ✗ Error: " . $e->getMessage() . "\n";
                }
            }
        }
    }
} else {
    // MySQL - need to convert SQLite syntax
    echo "  → MySQL detected. Converting schema...\n";
    
    // Replace SQLite syntax with MySQL
    $mysqlSchema = str_replace(
        ['INTEGER PRIMARY KEY AUTOINCREMENT', 'DATETIME', 'BOOLAN', 'AUTOINCREMENT'],
        ['INT PRIMARY KEY AUTO_INCREMENT', 'DATETIME', 'TINYINT(1)', 'AUTO_INCREMENT'],
        $schema
    );
    
    $statements = array_filter(
        explode(';', $mysqlSchema),
        fn($stmt) => trim($stmt) !== '' && !str_starts_with(trim($stmt), 'PRAGMA')
    );
    
    foreach ($statements as $statement) {
        if (trim($statement) !== '') {
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                if (!str_contains($e->getMessage(), 'already exists')) {
                    echo "  ✗ Error: " . $e->getMessage() . "\n";
                }
            }
        }
    }
}

echo "  ✓ Schema migrated successfully.\n";

// Verify tables
echo "\nVerifying tables...\n";
foreach ($tables as $table) {
    try {
        $count = $pdo->query("SELECT COUNT(*) as cnt FROM $table")->fetch()['cnt'];
        echo "  ✓ $table: $count records\n";
    } catch (PDOException $e) {
        echo "  ✗ $table: " . $e->getMessage() . "\n";
    }
}

// Seed additional test data if requested
if ($seed) {
    echo "\nSeeding additional test data...\n";
    
    // Create test users with different roles
    $testUsers = [
        ['Test Customer', 'customer@test.com', 'customer'],
        ['Test Support', 'support@test.com', 'support'],
        ['Test Warehouse', 'warehouse@test.com', 'warehouse'],
    ];
    
    foreach ($testUsers as [$name, $email, $role]) {
        try {
            $uuid = Ramsey\Uuid\Uuid::uuid7()->toString();
            $pdo->prepare("
                INSERT OR IGNORE INTO users (uuid, full_name, email, password_hash, is_active, created_at, updated_at)
                VALUES (:uuid, :name, :email, 'hash', 1, datetime('now'), datetime('now'))
            ")->execute([
                'uuid' => $uuid,
                'name' => $name,
                'email' => $email,
            ]);
            
            $userId = $pdo->query("SELECT id FROM users WHERE email = '$email'")->fetch()['id'];
            $roleId = $pdo->query("SELECT id FROM roles WHERE name = '$role'")->fetch()['id'];
            
            $pdo->prepare("INSERT OR IGNORE INTO user_roles (user_id, role_id, assigned_at) VALUES (:uid, :rid, datetime('now'))")
                ->execute(['uid' => $userId, 'rid' => $roleId]);
            
            echo "  ✓ Created $role user: $email\n";
        } catch (Exception $e) {
            echo "  ✗ Failed to create $role: " . $e->getMessage() . "\n";
        }
    }
}

echo "\n=== Migration Complete ===\n";
