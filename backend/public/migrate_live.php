<?php
/**
 * DATABASE MIGRATION BRIDGE
 * Path: https://useprocurely.com/migrate_live.php
 * Instructions: 
 * 1. Push this file to your public_html folder.
 * 2. Visit the URL above in your browser.
 * 3. Delete this file immediately after execution for security.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Production Credentials (Hardcoded for single-use migration)
$host = 'localhost'; // cPanel local host
$db   = 'usepwtzr_procurely';
$user = 'usepwtzr_procurely';
$pass = 'Ka8Ucl5P9A)L';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

echo "<h2>Procurely Database Migration</h2>";

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     echo "<p style='color:green;'>✅ Connected to live database successfully.</p>";
     
     // The SQL content generated previously
     $sql = <<<SQL
-- Procurely E-commerce Production Database Schema
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(15, 2) NOT NULL DEFAULT '0.00',
  `category_id` INT(11) UNSIGNED DEFAULT NULL,
  `sku` VARCHAR(50) UNIQUE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_category_id` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT(11) UNSIGNED NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_product_id` (`product_id`),
  CONSTRAINT `fk_image_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categories` (`id`, `name`, `description`, `slug`) VALUES
(1, 'Building Materials', 'Core construction materials.', 'building-materials'),
(2, 'Electricals', 'Cables and wiring.', 'electricals')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO `products` (`id`, `name`, `description`, `price`, `category_id`, `sku`) VALUES
(1, 'Dangote Cement 50kg', 'Premium Portland cement.', 7800.00, 1, 'CEM-001'),
(2, 'Copper Wire 2.5mm', 'Pure copper wiring.', 45000.00, 2, 'ELE-002')
ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price);

SQL;

     echo "<p>🔄 Executing schema synchronization...</p>";
     $pdo->exec($sql);
     echo "<p style='color:green; font-weight:bold;'>🚀 SUCCESS! Live database updated with production schema and sample data.</p>";
     echo "<p style='color:red;'>⚠️ Please delete <code>migrate_live.php</code> from your server immediately.</p>";
     
} catch (\PDOException $e) {
     echo "<p style='color:red;'>❌ Database error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
