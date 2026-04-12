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
            $host = $_ENV['DB_HOST'] ?? '';
            $name = $_ENV['DB_NAME'] ?? 'procurely';
            $user = $_ENV['DB_USER'] ?? '';
            $pass = $_ENV['DB_PASS'] ?? '';
            $port = $_ENV['DB_PORT'] ?? '3306';

            if ($host === '' || $user === '') {
                throw new \RuntimeException('DB_HOST and DB_USER are required for MySQL connection.');
            }

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
            
            // Add NOW() function for SQLite compatibility
            $this->connection->sqliteCreateFunction('NOW', fn() => date('Y-m-d H:i:s'));
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
        $bigPk = $isMysql ? 'BIGINT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
        $text = $isMysql ? 'LONGTEXT' : 'TEXT';
        $dateTime = $isMysql ? 'DATETIME' : 'TEXT';
        $insertIgnore = $isMysql ? 'INSERT IGNORE' : 'INSERT OR IGNORE';
        $onConflict = $isMysql ? 'ON CONFLICT(key) DO UPDATE SET hits = hits + 1, reset_at = $now' : 'ON CONFLICT(key) DO UPDATE SET hits = hits + 1, reset_at = excluded.reset_at';
        $now = $isMysql ? 'NOW()' : "datetime('now')";

        $pdo->exec(
            <<<SQL
            CREATE TABLE IF NOT EXISTS users (
              id $pk,
              uuid VARCHAR(36) NOT NULL UNIQUE,
              full_name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL UNIQUE,
              password_hash VARCHAR(255) NOT NULL,
              wallet_balance BIGINT DEFAULT 0,
              created_at $dateTime NOT NULL,
              updated_at $dateTime NOT NULL
            );

            CREATE TABLE IF NOT EXISTS roles (
              id $pk,
              name VARCHAR(50) NOT NULL UNIQUE,
              description $text,
              created_at $dateTime NOT NULL
            );

            CREATE TABLE IF NOT EXISTS permissions (
              id $pk,
              name VARCHAR(100) NOT NULL UNIQUE,
              description $text,
              created_at $dateTime NOT NULL
            );

            CREATE TABLE IF NOT EXISTS user_roles (
              user_id INT NOT NULL,
              role_id INT NOT NULL,
              assigned_at $dateTime NOT NULL,
              assigned_by INT,
              PRIMARY KEY (user_id, role_id),
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
              FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
              FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS role_permissions (
              role_id INT NOT NULL,
              permission_id INT NOT NULL,
              assigned_at $dateTime NOT NULL,
              PRIMARY KEY (role_id, permission_id),
              FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
              FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS user_sessions (
              id $pk,
              user_id INT NOT NULL,
              session_token_hash VARCHAR(128) NOT NULL UNIQUE,
              ip_address VARCHAR(45),
              user_agent $text,
              expires_at $dateTime NOT NULL,
              created_at $dateTime NOT NULL,
              last_activity $dateTime NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS audit_logs (
              id $bigPk,
              user_id INT,
              action VARCHAR(100) NOT NULL,
              resource VARCHAR(100) NOT NULL,
              resource_id VARCHAR(100),
              old_values JSON,
              new_values JSON,
              ip_address VARCHAR(45),
              user_agent $text,
              created_at $dateTime NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS notifications (
              id $bigPk,
              user_id INT NOT NULL,
              type VARCHAR(50) NOT NULL,
              title VARCHAR(255) NOT NULL,
              message $text,
              data JSON,
              read_at $dateTime,
              created_at $dateTime NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS password_reset_requests (
              id $pk,
              user_id INT NOT NULL,
              token_hash VARCHAR(128) NOT NULL UNIQUE,
              expires_at $dateTime NOT NULL,
              created_at $dateTime NOT NULL,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS rate_limits (
                `key` VARCHAR(255) NOT NULL,
                hits INT NOT NULL DEFAULT 1,
                reset_at BIGINT NOT NULL,
                PRIMARY KEY (`key`)
            );

            CREATE TABLE IF NOT EXISTS categories (
              id $pk,
              name VARCHAR(255) NOT NULL,
              slug VARCHAR(100) NOT NULL UNIQUE,
              description $text,
              created_at $dateTime NOT NULL
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

            CREATE TABLE IF NOT EXISTS wishlist_items (
              id $pk,
              wishlist_token VARCHAR(255) NOT NULL,
              product_id VARCHAR(50) NOT NULL,
              created_at $dateTime NOT NULL,
              UNIQUE(wishlist_token, product_id)
            );

            -- Indexes
            CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
            CREATE INDEX IF NOT EXISTS idx_users_uuid ON users (uuid);
            CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);
            CREATE INDEX IF NOT EXISTS idx_roles_name ON roles (name);
            CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions (name);
            CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles (user_id);
            CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles (role_id);
            CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions (role_id);
            CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions (permission_id);
            CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions (user_id);
            CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions (session_token_hash);
            CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions (expires_at);
            CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs (user_id);
            CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
            CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs (resource);
            CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at);
            CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
            CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications (type);
            CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications (read_at);
            CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at);
            CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset_requests (user_id);
            CREATE INDEX IF NOT EXISTS idx_password_reset_token_hash ON password_reset_requests (token_hash);
            CREATE INDEX IF NOT EXISTS idx_password_reset_expires_at ON password_reset_requests (expires_at);
            CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON rate_limits (reset_at);
            CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
            CREATE INDEX IF NOT EXISTS idx_products_featured ON products (featured);
            CREATE INDEX IF NOT EXISTS idx_products_slot ON products (homepage_slot);
            CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
            CREATE INDEX IF NOT EXISTS idx_cart_items_cart_token ON cart_items (cart_token);

            -- Insert default roles and permissions if not exist
            $insertIgnore INTO roles (name, description, created_at) VALUES 
            ('admin', 'Full system access', $now),
            ('customer', 'Standard customer access', $now);

            $insertIgnore INTO permissions (name, description, created_at) VALUES 
            ('user.create', 'Create users', $now),
            ('user.read', 'Read user data', $now),
            ('user.update', 'Update users', $now),
            ('user.delete', 'Delete users', $now),
            ('product.create', 'Create products', $now),
            ('product.read', 'Read products', $now),
            ('product.update', 'Update products', $now),
            ('product.delete', 'Delete products', $now),
            ('order.create', 'Create orders', $now),
            ('order.read', 'Read orders', $now),
            ('order.update', 'Update orders', $now),
            ('order.delete', 'Delete orders', $now);

            -- Assign permissions to admin role
            $insertIgnore INTO role_permissions (role_id, permission_id, assigned_at)
            SELECT r.id, p.id, $now FROM roles r, permissions p WHERE r.name = 'admin';

            -- Assign basic permissions to customer role
            $insertIgnore INTO role_permissions (role_id, permission_id, assigned_at)
            SELECT r.id, p.id, $now FROM roles r, permissions p 
            WHERE r.name = 'customer' AND p.name IN ('product.read', 'order.create', 'order.read');
            SQL
        );
    }
}

