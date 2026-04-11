<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Procurely\Api\Support\Database;
use Procurely\Api\Services\CatalogService;
use Procurely\Api\Support\ContentStore;

$rootPath = dirname(__DIR__);
if (file_exists($rootPath . '/.env')) {
    Dotenv::createImmutable($rootPath)->load();
}

echo "Starting Database Migration and Seeding...\n";

try {
    $db = new Database('storage/procurely.sqlite'); // The constructor saves the path, but driver=mysql in .env will override to MySQL
    $pdo = $db->connection();
    echo "✔ Connection established and migrations executed.\n";

    // Seed products from procurely.json
    $contentPath = dirname($rootPath) . '/shared/content/procurely.json';
    if (file_exists($contentPath)) {
        $store = new ContentStore($contentPath);
        $content = json_decode(file_get_contents($contentPath), true);
        
        if (isset($content['products']) && is_array($content['products'])) {
            echo "Seeding " . count($content['products']) . " products...\n";
            
            $stmt = $pdo->prepare("
                INSERT INTO products (id, slug, name, short_description, category, price, image, badge, featured, homepage_slot, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    name = VALUES(name), 
                    short_description = VALUES(short_description), 
                    price = VALUES(price),
                    updated_at = VALUES(updated_at)
            ");
            
            $now = date('Y-m-d H:i:s');
            foreach ($content['products'] as $product) {
                $stmt->execute([
                    $product['id'],
                    $product['slug'],
                    $product['name'],
                    $product['shortDescription'],
                    $product['category'],
                    $product['price'],
                    $product['image'] ?? null,
                    $product['badge'] ?? null,
                    $product['featured'] ? 1 : 0,
                    $product['homepageSlot'] ?? null,
                    $now,
                    $now
                ]);
            }
            echo "✔ Products seeded successfully.\n";
        }
    }

    echo "Database is ready for production.\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
