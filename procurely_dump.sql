-- Procurely Database Dump
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Additional tables omitted for brevity in this generator, but included in full below...
CREATE TABLE IF NOT EXISTS password_reset_requests (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL, token_hash VARCHAR(255) NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cart_items (id INT AUTO_INCREMENT PRIMARY KEY, cart_token VARCHAR(255) NOT NULL, product_id VARCHAR(50) NOT NULL, quantity INT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, order_number VARCHAR(50) NOT NULL UNIQUE, cart_token VARCHAR(255) NOT NULL UNIQUE, customer_name VARCHAR(255) NOT NULL, customer_email VARCHAR(255) NOT NULL, phone VARCHAR(50) NOT NULL, address LONGTEXT NOT NULL, subtotal BIGINT NOT NULL, service_fee BIGINT NOT NULL, total BIGINT NOT NULL, status VARCHAR(50) NOT NULL, paid_at DATETIME, created_at DATETIME NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT NOT NULL, product_id VARCHAR(50) NOT NULL, product_name VARCHAR(255) NOT NULL, unit_price BIGINT NOT NULL, quantity INT NOT NULL, line_total BIGINT NOT NULL, FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quote_requests (id INT AUTO_INCREMENT PRIMARY KEY, company_name VARCHAR(255) NOT NULL, full_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(50) NOT NULL, project_location VARCHAR(255) NOT NULL, boq_notes LONGTEXT NOT NULL, created_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE, created_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inventory (product_id VARCHAR(50) PRIMARY KEY, stock_level INT NOT NULL DEFAULT 0, updated_at DATETIME NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rate_limits (`key` VARCHAR(255) NOT NULL, hits INT NOT NULL DEFAULT 1, reset_at BIGINT NOT NULL, PRIMARY KEY (`key`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS wishlist_items (id INT AUTO_INCREMENT PRIMARY KEY, wishlist_token VARCHAR(255) NOT NULL, product_id VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL, UNIQUE(wishlist_token, product_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


SET FOREIGN_KEY_CHECKS = 1;


-- Procurely E-commerce Production Database Schema
-- Optimized for cPanel/phpMyAdmin Deployment
-- Last Updated: 2026-04-11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. CATEGORIES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. PRODUCTS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(15, 2) NOT NULL DEFAULT '0.00',
  `category_id` INT(11) UNSIGNED DEFAULT NULL,
  `stock_quantity` INT(11) DEFAULT 0,
  `sku` VARCHAR(50) UNIQUE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category_id` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. PRODUCT IMAGES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT(11) UNSIGNED NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `is_primary` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_product_id` (`product_id`),
  CONSTRAINT `fk_image_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. USERS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. USER PROFILES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `user_id` INT(11) UNSIGNED PRIMARY KEY,
  `preferences` JSON DEFAULT NULL,
  `purchase_history` JSON DEFAULT NULL,
  `settings` JSON DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. SAMPLE DATA INSERTION (CATEGORIES)
-- --------------------------------------------------------
INSERT INTO `categories` (`id`, `name`, `description`, `slug`) VALUES
(1, 'Building Materials', 'Core construction materials including cement, sand, and bricks.', 'building-materials'),
(2, 'Electricals', 'Cables, lightings, and circuit breakers.', 'electricals'),
(3, 'Plumbing', 'Pipes, fittings, and bathroom fixtures.', 'plumbing'),
(4, 'Heavy Equipment', 'Rental and purchase of site machinery.', 'heavy-equipment')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- --------------------------------------------------------
-- 7. SAMPLE DATA INSERTION (PRODUCTS)
-- --------------------------------------------------------
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category_id`, `sku`) VALUES
(1, 'Dangote Cement 50kg', 'Premium grade 42.5R Portland cement for all construction needs.', 7800.00, 1, 'CEM-DAN-001'),
(2, 'Copper Wire 2.5mm', 'High conductivity pure copper wire for residential wiring.', 45000.00, 2, 'ELE-COP-002'),
(3, 'PVC Pipe 4 inch', 'Durable 4-inch PVC pipe for drainage and waste systems.', 5400.00, 3, 'PLU-PVC-003'),
(4, 'Industrial Steel Rebar 12mm', 'High-tensile strength steel rods for concrete reinforcement.', 8500.00, 1, 'STE-REB-004')
ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price);
