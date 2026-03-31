<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use PDO;

final class Database
{
    private ?PDO $connection = null;

    public function __construct(
        private readonly string $databasePath,
    ) {
    }

    public function connection(): PDO
    {
        if ($this->connection instanceof PDO) {
            return $this->connection;
        }

        $directory = dirname($this->databasePath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $this->connection = new PDO(sprintf('sqlite:%s', $this->databasePath));
        $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->connection->exec('PRAGMA foreign_keys = ON');
        $this->connection->exec('PRAGMA journal_mode = WAL');
        $this->connection->exec('PRAGMA synchronous = NORMAL');

        $this->migrate($this->connection);
        
        return $this->connection;
    }

    private function migrate(PDO $pdo): void
    {
        $pdo->exec(
            <<<SQL
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              uuid TEXT NOT NULL UNIQUE,
              full_name TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE,
              password_hash TEXT NOT NULL,
              role TEXT NOT NULL DEFAULT "user",
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS user_tokens (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              token_hash TEXT NOT NULL UNIQUE,
              expires_at TEXT NOT NULL,
              created_at TEXT NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS products (
              id TEXT PRIMARY KEY,
              slug TEXT NOT NULL UNIQUE,
              name TEXT NOT NULL,
              short_description TEXT NOT NULL,
              category TEXT NOT NULL,
              price INTEGER NOT NULL,
              image TEXT,
              badge TEXT,
              featured INTEGER DEFAULT 0,
              homepage_slot TEXT,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS password_reset_requests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              email TEXT NOT NULL,
              token_hash TEXT NOT NULL,
              expires_at TEXT NOT NULL,
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS cart_items (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              cart_token TEXT NOT NULL,
              product_id TEXT NOT NULL,
              quantity INTEGER NOT NULL,
              created_at TEXT NOT NULL,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER,
              order_number TEXT NOT NULL UNIQUE,
              cart_token TEXT NOT NULL UNIQUE,
              customer_name TEXT NOT NULL,
              customer_email TEXT NOT NULL,
              phone TEXT NOT NULL,
              address TEXT NOT NULL,
              subtotal INTEGER NOT NULL,
              service_fee INTEGER NOT NULL,
              total INTEGER NOT NULL,
              status TEXT NOT NULL,
              paid_at TEXT,
              created_at TEXT NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            );

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

            CREATE TABLE IF NOT EXISTS quote_requests (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              company_name TEXT NOT NULL,
              full_name TEXT NOT NULL,
              email TEXT NOT NULL,
              phone TEXT NOT NULL,
              project_location TEXT NOT NULL,
              boq_notes TEXT NOT NULL,
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              email TEXT NOT NULL UNIQUE,
              created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS inventory (
              product_id TEXT PRIMARY KEY,
              stock_level INTEGER NOT NULL DEFAULT 0,
              updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS rate_limits (
                key TEXT NOT NULL,
                hits INTEGER NOT NULL DEFAULT 1,
                reset_at INTEGER NOT NULL,
                PRIMARY KEY (key)
            );

            CREATE TABLE IF NOT EXISTS wishlist_items (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              wishlist_token TEXT NOT NULL,
              product_id TEXT NOT NULL,
              created_at TEXT NOT NULL,
              UNIQUE(wishlist_token, product_id)
            );

            CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens (user_id);
            CREATE INDEX IF NOT EXISTS idx_user_tokens_hash ON user_tokens (token_hash);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
            CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
            CREATE INDEX IF NOT EXISTS idx_products_featured ON products (featured);
            CREATE INDEX IF NOT EXISTS idx_products_slot ON products (homepage_slot);
            CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
            CREATE INDEX IF NOT EXISTS idx_password_reset_email ON password_reset_requests (email, expires_at DESC);
            CREATE INDEX IF NOT EXISTS idx_cart_items_cart_token ON cart_items (cart_token);
            CREATE INDEX IF NOT EXISTS idx_rate_limits_reset ON rate_limits (reset_at);
            SQL
        );
    }
}
