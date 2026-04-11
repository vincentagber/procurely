<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use Procurely\Api\Support\ContentStore;

echo "Generating SQL Dump for cPanel Import...\n";

$sql = "-- Procurely Database Dump\n";
$sql .= "SET NAMES utf8mb4;\n";
$sql .= "SET FOREIGN_KEY_CHECKS = 0;\n\n";

// Table Schemas (MySQL Syntax)
$sql .= "CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n";

$sql .= "CREATE TABLE IF NOT EXISTS user_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n";

$sql .= "CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  short_description LONGTEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  price BIGINT NOT NULL,
  image LONGTEXT,
  badge VARCHAR(50),
  featured TINYINT DEFAULT 0,
  homepage_slot VARCHAR(50),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n";

$sql .= "-- Additional tables omitted for brevity in this generator, but included in full below...\n";

// ... adding the rest of the tables from Database.php refactored earlier
$tables = [
    "password_reset_requests" => "id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL, token_hash VARCHAR(255) NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME NOT NULL",
    "cart_items" => "id INT AUTO_INCREMENT PRIMARY KEY, cart_token VARCHAR(255) NOT NULL, product_id VARCHAR(50) NOT NULL, quantity INT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL",
    "orders" => "id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, order_number VARCHAR(50) NOT NULL UNIQUE, cart_token VARCHAR(255) NOT NULL UNIQUE, customer_name VARCHAR(255) NOT NULL, customer_email VARCHAR(255) NOT NULL, phone VARCHAR(50) NOT NULL, address LONGTEXT NOT NULL, subtotal BIGINT NOT NULL, service_fee BIGINT NOT NULL, total BIGINT NOT NULL, status VARCHAR(50) NOT NULL, paid_at DATETIME, created_at DATETIME NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL",
    "order_items" => "id INT AUTO_INCREMENT PRIMARY KEY, order_id INT NOT NULL, product_id VARCHAR(50) NOT NULL, product_name VARCHAR(255) NOT NULL, unit_price BIGINT NOT NULL, quantity INT NOT NULL, line_total BIGINT NOT NULL, FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE",
    "quote_requests" => "id INT AUTO_INCREMENT PRIMARY KEY, company_name VARCHAR(255) NOT NULL, full_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(50) NOT NULL, project_location VARCHAR(255) NOT NULL, boq_notes LONGTEXT NOT NULL, created_at DATETIME NOT NULL",
    "newsletter_subscribers" => "id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, created_at DATETIME NOT NULL",
    "inventory" => "product_id VARCHAR(50) PRIMARY KEY, stock_level INT NOT NULL DEFAULT 0, updated_at DATETIME NOT NULL",
    "rate_limits" => "`key` VARCHAR(255) NOT NULL, hits INT NOT NULL DEFAULT 1, reset_at BIGINT NOT NULL, PRIMARY KEY (`key`)",
    "wishlist_items" => "id INT AUTO_INCREMENT PRIMARY KEY, wishlist_token VARCHAR(255) NOT NULL, product_id VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL, UNIQUE(wishlist_token, product_id)"
];

foreach ($tables as $name => $schema) {
    $sql .= "CREATE TABLE IF NOT EXISTS $name ($schema) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n";
}

// Product Seeding
$contentPath = dirname(__DIR__) . '/shared/content/procurely.json';
if (file_exists($contentPath)) {
    $content = json_decode(file_get_contents($contentPath), true);
    if (isset($content['products'])) {
        $now = date('Y-m-d H:i:s');
        foreach ($content['products'] as $p) {
            $sql .= sprintf(
                "INSERT INTO products (id, slug, name, short_description, category, price, image, badge, featured, homepage_slot, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %d, %s, %s, %d, %s, '%s', '%s') ON DUPLICATE KEY UPDATE updated_at = '%s';\n",
                var_export($p['id'], true),
                var_export($p['slug'], true),
                var_export($p['name'], true),
                var_export($p['shortDescription'], true),
                var_export($p['category'], true),
                $p['price'],
                var_export($p['image'] ?? null, true),
                var_export($p['badge'] ?? null, true),
                $p['featured'] ? 1 : 0,
                var_export($p['homepageSlot'] ?? null, true),
                $now, $now, $now
            );
        }
    }
}

$sql .= "\nSET FOREIGN_KEY_CHECKS = 1;\n";

file_put_contents(dirname(__DIR__) . '/procurely_dump.sql', $sql);
echo "✔ SQL Dump generated: procurely_dump.sql\n";
