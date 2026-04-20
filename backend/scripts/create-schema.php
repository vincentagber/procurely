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

$pdo->exec('
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uuid TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT \'user\',
  wallet_balance INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS user_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_description TEXT LONGTEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  image LONGTEXT,
  badge TEXT,
  featured INTEGER DEFAULT 0,
  homepage_slot TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS inventory (
  product_id TEXT PRIMARY KEY,
  stock_level INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_token TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  order_number TEXT NOT NULL UNIQUE,
  cart_token TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address LONGTEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  service_fee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL,
  paid_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  line_total INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS wishlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wishlist_token TEXT NOT NULL,
  product_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(wishlist_token, product_id)
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS quote_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_location TEXT NOT NULL,
  boq_notes LONGTEXT NOT NULL,
  created_at TEXT NOT NULL
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);
');

$pdo->exec('
CREATE TABLE IF NOT EXISTS rate_limits (
  `key` TEXT NOT NULL,
  hits INTEGER NOT NULL DEFAULT 1,
  reset_at INTEGER NOT NULL,
  PRIMARY KEY (`key`)
);
');

echo "Database schema created.\n";