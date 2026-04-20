<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Procurely\Api\Support\Database;

$rootPath = dirname(__DIR__);
if (file_exists($rootPath . '/.env')) {
    Dotenv::createImmutable($rootPath)->safeLoad();
}

$databasePath = $_ENV['DATABASE_PATH'] ?? 'storage/procurely.sqlite';
if (!str_starts_with($databasePath, DIRECTORY_SEPARATOR)) {
    $databasePath = $rootPath . '/' . ltrim($databasePath, '/');
}

$db = new Database($databasePath);
$pdo = $db->connection();
$isMysql = ($_ENV['DB_DRIVER'] ?? 'sqlite') === 'mysql';

$jsonPath = dirname($rootPath) . '/shared/content/procurely.json';
if (!file_exists($jsonPath)) {
    echo "JSON content file not found at $jsonPath\n";
    exit(1);
}

$content = json_decode(file_get_contents($jsonPath), true);
$products = $content['products'] ?? [];

echo "Migrating " . count($products) . " products to " . ($_ENV['DB_DRIVER'] ?? 'sqlite') . "...\n";

if (!$isMysql) {
    $pdo->exec('PRAGMA foreign_keys = OFF;');
}

$pdo->beginTransaction();

try {
    $insertProductSql = $isMysql 
        ? 'REPLACE INTO products (id, slug, name, short_description, category, price, image, badge, featured, homepage_slot, created_at, updated_at) VALUES (:id, :slug, :name, :short_description, :category, :price, :image, :badge, :featured, :homepage_slot, :created_at, :updated_at)'
        : 'INSERT OR REPLACE INTO products (id, slug, name, short_description, category, price, image, badge, featured, homepage_slot, created_at, updated_at) VALUES (:id, :slug, :name, :short_description, :category, :price, :image, :badge, :featured, :homepage_slot, :created_at, :updated_at)';
    
    $stmt = $pdo->prepare($insertProductSql);
    
    $insertInvSql = $isMysql 
        ? 'INSERT IGNORE INTO inventory (product_id, stock_level, updated_at) VALUES (:product_id, 100, :updated_at)'
        : 'INSERT OR REPLACE INTO inventory (product_id, stock_level, updated_at) VALUES (:product_id, 100, :updated_at)';
        
    $invStmt = $pdo->prepare($insertInvSql);
    
    $now = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);

    foreach ($products as $p) {
        $stmt->execute([
            'id' => (string) $p['id'],
            'slug' => (string) $p['slug'],
            'name' => (string) $p['name'],
            'short_description' => (string) ($p['shortDescription'] ?? ''),
            'category' => (string) ($p['category'] ?? 'Miscellaneous'),
            'price' => (int) ($p['price'] ?? 0),
            'image' => (string) ($p['image'] ?? ''),
            'badge' => (string) ($p['badge'] ?? ''),
            'featured' => (int) ($p['featured'] ?? 0),
            'homepage_slot' => (string) ($p['homepageSlot'] ?? ''),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        
        $invStmt->execute([
            'product_id' => (string) $p['id'],
            'updated_at' => $now,
        ]);
    }

    // Seed Admin & Customer if not exists
    $passwordHash = password_hash('Apassword123!', PASSWORD_ARGON2ID);
    
    $insertUserSql = $isMysql 
        ? 'INSERT IGNORE INTO users (uuid, full_name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
        : 'INSERT OR IGNORE INTO users (uuid, full_name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';

    $userStmt = $pdo->prepare($insertUserSql);
    
    // Admin (using consistent email from seed-admin.php)
    $adminEmail = 'admin@procurely.com';
    $userStmt->execute(['admin-user-id', 'Admin User', $adminEmail, $passwordHash, $now, $now]);
    $adminId = $pdo->lastInsertId();
    if (!$adminId || $adminId === '0' || $adminId === 0) {
        $st = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $st->execute([$adminEmail]);
        $adminId = $st->fetchColumn();
    }

    // Customer
    $customerEmail = 'customer@useprocurely.com';
    $userStmt->execute(['customer-user-id', 'Sample Customer', $customerEmail, $passwordHash, $now, $now]);
    $customerId = $pdo->lastInsertId();
    if (!$customerId || $customerId === '0' || $customerId === 0) {
        $st = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $st->execute([$customerEmail]);
        $customerId = $st->fetchColumn();
    }

    // Assign Roles
    $insertRoleSql = $isMysql 
        ? 'INSERT IGNORE INTO user_roles (user_id, role_id, assigned_at) VALUES (?, ?, ?)'
        : 'INSERT OR IGNORE INTO user_roles (user_id, role_id, assigned_at) VALUES (?, ?, ?)';
    
    $roleStmt = $pdo->prepare($insertRoleSql);
    
    // Get role IDs
    $st = $pdo->prepare('SELECT id FROM roles WHERE name = ?');
    $st->execute(['admin']);
    $adminRoleId = $st->fetchColumn();
    
    $st->execute(['customer']);
    $customerRoleId = $st->fetchColumn();

    if ($adminId && $adminRoleId) {
        $roleStmt->execute([$adminId, $adminRoleId, $now]);
    }
    if ($customerId && $customerRoleId) {
        $roleStmt->execute([$customerId, $customerRoleId, $now]);
    }

    $pdo->commit();
    if (!$isMysql) {
        $pdo->exec('PRAGMA foreign_keys = ON;');
    }
    echo "Migration completed successfully!\n";
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    if (!$isMysql) {
        $pdo->exec('PRAGMA foreign_keys = ON;');
    }
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
