<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\ContentStore;

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

$jsonPath = dirname($rootPath) . '/shared/content/procurely.json';
if (!file_exists($jsonPath)) {
    echo "JSON content file not found at $jsonPath\n";
    exit(1);
}

$content = json_decode(file_get_contents($jsonPath), true);
$products = $content['products'] ?? [];

echo "Migrating " . count($products) . " products to SQLite...\n";

$pdo->beginTransaction();

try {
    $stmt = $pdo->prepare('INSERT OR REPLACE INTO products (id, slug, name, short_description, category, price, image, badge, featured, homepage_slot, created_at, updated_at) VALUES (:id, :slug, :name, :short_description, :category, :price, :image, :badge, :featured, :homepage_slot, :created_at, :updated_at)');
    
    $invStmt = $pdo->prepare('INSERT OR IGNORE INTO inventory (product_id, stock_level, updated_at) VALUES (:product_id, 100, :updated_at)');
    
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
    $passwordHash = password_hash('Apassword123!', PASSWORD_BCRYPT, ['cost' => 12]);
    $pdo->prepare('INSERT OR IGNORE INTO users (uuid, full_name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, "admin", ?)')
        ->execute(['admin-user-id', 'Admin User', 'admin@useprocurely.com', $passwordHash, $now]);

    $custHash = password_hash('Cpassword123!', PASSWORD_BCRYPT, ['cost' => 12]);
    $pdo->prepare('INSERT OR IGNORE INTO users (uuid, full_name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, "user", ?)')
        ->execute(['customer-user-id', 'Sample Customer', 'customer@useprocurely.com', $custHash, $now]);

    $pdo->commit();
    echo "Migration completed successfully!\n";
} catch (Exception $e) {
    $pdo->rollBack();
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
