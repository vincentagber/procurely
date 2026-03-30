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
            mkdir($directory, 0750, true);
        }

        $this->connection = new PDO(sprintf('sqlite:%s', $this->databasePath));
        $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->connection->exec('PRAGMA foreign_keys = ON');
        $this->connection->exec('PRAGMA journal_mode = WAL');

        $this->migrate($this->connection);
        $this->seedInventory($this->connection);
        $this->seedAdmin($this->connection);
        $this->seedCustomer($this->connection);

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
              token TEXT NOT NULL UNIQUE,
              created_at TEXT NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
            CREATE INDEX IF NOT EXISTS idx_user_tokens_token ON user_tokens (token);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
            CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
            CREATE INDEX IF NOT EXISTS idx_password_reset_email ON password_reset_requests (email, expires_at DESC);
            CREATE INDEX IF NOT EXISTS idx_cart_items_cart_token ON cart_items (cart_token);
            CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders (order_number);
            CREATE INDEX IF NOT EXISTS idx_orders_cart_token ON orders (cart_token);
            CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests (email);
            CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
            CREATE INDEX IF NOT EXISTS idx_rate_limits_reset ON rate_limits (reset_at);
            CREATE INDEX IF NOT EXISTS idx_wishlist_items_token ON wishlist_items (wishlist_token);
            CREATE INDEX IF NOT EXISTS idx_wishlist_items_product ON wishlist_items (product_id);
            CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
            CREATE INDEX IF NOT EXISTS idx_inventory_updated ON inventory (updated_at);
            SQL
        );
    }

    private function seedInventory(PDO $pdo): void
    {
        $products = [
            'p_1', 'p_2', 'p_3', 'p_4', 'p_5', 'p_6', 'p_7', 'p_8', 'p_9', 'p_10',
            'p_11', 'p_12'
        ];
        
        $now = (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM);
        $stmt = $pdo->prepare('INSERT OR IGNORE INTO inventory (product_id, stock_level, updated_at) VALUES (?, 100, ?)');
        foreach ($products as $id) {
            $stmt->execute([$id, $now]);
        }
    }

    private function seedAdmin(PDO $pdo): void
    {
        $now = (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM);
        $uuid = 'admin-user-id'; // Simplified for seed
        $email = 'admin@procurely.com';
        $fullName = 'Admin User';
        $passwordHash = password_hash('Apassword123!', PASSWORD_BCRYPT, ['cost' => 12]);

        $stmt = $pdo->prepare('INSERT OR IGNORE INTO users (uuid, full_name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, "admin", ?)');
        $stmt->execute([$uuid, $fullName, $email, $passwordHash, $now]);
    }

    private function seedCustomer(PDO $pdo): void
    {
        $now = (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM);
        $uuid = 'customer-user-id';
        $email = 'customer@procurely.com';
        $fullName = 'Sample Customer';
        $passwordHash = password_hash('Cpassword123!', PASSWORD_BCRYPT, ['cost' => 12]);

        $stmt = $pdo->prepare('INSERT OR IGNORE INTO users (uuid, full_name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, "user", ?)');
        $stmt->execute([$uuid, $fullName, $email, $passwordHash, $now]);
    }
}
