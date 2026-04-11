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

        $driver = $_ENV['DB_DRIVER'] ?? 'sqlite';

        if ($driver === 'mysql') {
            $host = $_ENV['DB_HOST'] ?? 'localhost';
            $name = $_ENV['DB_NAME'] ?? 'procurely';
            $user = $_ENV['DB_USER'] ?? 'root';
            $pass = $_ENV['DB_PASS'] ?? '';
            $port = $_ENV['DB_PORT'] ?? '3306';

            $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);
            $this->connection = new PDO($dsn, $user, $pass);
        } else {
            $directory = dirname($this->databasePath);
            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }
            $this->connection = new PDO(sprintf('sqlite:%s', $this->databasePath));
            $this->connection->exec('PRAGMA foreign_keys = ON');
            $this->connection->exec('PRAGMA journal_mode = WAL');
            $this->connection->exec('PRAGMA synchronous = NORMAL');
        }

        $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        $this->migrate($this->connection, $driver);
        
        return $this->connection;
    }

    private function migrate(PDO $pdo, string $driver): void
    {
        $isMysql = $driver === 'mysql';
        $pk = $isMysql ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
        $text = $isMysql ? 'LONGTEXT' : 'TEXT';
        $dateTime = $isMysql ? 'DATETIME' : 'TEXT';

        $pdo->exec(
            <<<SQL
            CREATE TABLE IF NOT EXISTS users (
              id $pk,
              uuid VARCHAR(36) NOT NULL UNIQUE,
              full_name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL UNIQUE,
              password_hash VARCHAR(255) NOT NULL,
              role VARCHAR(20) NOT NULL DEFAULT "user",
              created_at $dateTime NOT NULL
            );

            CREATE TABLE IF NOT EXISTS user_tokens (
              id $pk,
              user_id INT NOT NULL,
              token_hash VARCHAR(255) NOT NULL UNIQUE,
              expires_at $dateTime NOT NULL,
              created_at $dateTime NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS products (
              id VARCHAR(50) PRIMARY KEY,
              slug VARCHAR(100) NOT NULL UNIQUE,
              name VARCHAR(255) NOT NULL,
              short_description $text NOT NULL,
              category VARCHAR(100) NOT NULL,
              price BIGINT NOT NULL,
              image $text,
              badge VARCHAR(50),
              featured TINYINT DEFAULT 0,
              homepage_slot VARCHAR(50),
              created_at $dateTime NOT NULL,
              updated_at $dateTime NOT NULL
            );

            CREATE TABLE IF NOT EXISTS password_reset_requests (
              id $pk,
              email VARCHAR(255) NOT NULL,
              token_hash VARCHAR(255) NOT NULL,
              expires_at $dateTime NOT NULL,
              created_at $dateTime NOT NULL
            );

            CREATE TABLE IF NOT EXISTS cart_items (
              id $pk,
              cart_token VARCHAR(255) NOT NULL,
              product_id VARCHAR(50) NOT NULL,
              quantity INT NOT NULL,
              created_at $dateTime NOT NULL,
              updated_at $dateTime NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
              id $pk,
              user_id INT,
              order_number VARCHAR(50) NOT NULL UNIQUE,
              cart_token VARCHAR(255) NOT NULL UNIQUE,
              customer_name VARCHAR(255) NOT NULL,
              customer_email VARCHAR(255) NOT NULL,
              phone VARCHAR(50) NOT NULL,
              address $text NOT NULL,
              subtotal BIGINT NOT NULL,
              service_fee BIGINT NOT NULL,
              total BIGINT NOT NULL,
              status VARCHAR(50) NOT NULL,
              paid_at $dateTime,
              created_at $dateTime NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS order_items (
              id $pk,
              order_id INT NOT NULL,
              product_id VARCHAR(50) NOT NULL,
              product_name VARCHAR(255) NOT NULL,
              unit_price BIGINT NOT NULL,
              quantity INT NOT NULL,
              line_total BIGINT NOT NULL,
              FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS quote_requests (
              id $pk,
              company_name VARCHAR(255) NOT NULL,
              full_name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL,
              phone VARCHAR(50) NOT NULL,
              project_location VARCHAR(255) NOT NULL,
              boq_notes $text NOT NULL,
              created_at $dateTime NOT NULL
            );

            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
              id $pk,
              email VARCHAR(255) NOT NULL UNIQUE,
              created_at $dateTime NOT NULL
            );

            CREATE TABLE IF NOT EXISTS inventory (
              product_id VARCHAR(50) PRIMARY KEY,
              stock_level INT NOT NULL DEFAULT 0,
              updated_at $dateTime NOT NULL
            );

            CREATE TABLE IF NOT EXISTS rate_limits (
                `key` VARCHAR(255) NOT NULL,
                hits INT NOT NULL DEFAULT 1,
                reset_at BIGINT NOT NULL,
                PRIMARY KEY (`key`)
            );

            CREATE TABLE IF NOT EXISTS wishlist_items (
              id $pk,
              wishlist_token VARCHAR(255) NOT NULL,
              product_id VARCHAR(50) NOT NULL,
              created_at $dateTime NOT NULL,
              UNIQUE(wishlist_token, product_id)
            );

            CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens (user_id);
            CREATE INDEX IF NOT EXISTS idx_user_tokens_hash ON user_tokens (token_hash);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
            CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
            CREATE INDEX IF NOT EXISTS idx_products_featured ON products (featured);
            CREATE INDEX IF NOT EXISTS idx_products_slot ON products (homepage_slot);
            CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
            CREATE INDEX IF NOT EXISTS idx_password_reset_email ON password_reset_requests (email);
            CREATE INDEX IF NOT EXISTS idx_cart_items_cart_token ON cart_items (cart_token);
            CREATE INDEX IF NOT EXISTS idx_rate_limits_reset ON rate_limits (reset_at);
            SQL
        );
    }
}

