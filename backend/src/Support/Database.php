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

    /**
     * Executes a callback within a database transaction.
     * Inspired by Jim Gray's ACID principles.
     */
    public function transaction(callable $callback): mixed
    {
        $pdo = $this->connection();
        
        // Use BEGIN IMMEDIATE for SQLite to prevent contention
        $pdo->exec($_ENV['DB_DRIVER'] === 'mysql' ? 'START TRANSACTION' : 'BEGIN IMMEDIATE TRANSACTION');

        try {
            $result = $callback($pdo);
            $pdo->commit();
            return $result;
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
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
            $this->connection = new PDO($dsn, $user, $pass, [
                PDO::ATTR_TIMEOUT => 5, // 5 seconds connection timeout
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            ]);
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

        $isMysql = $driver === 'mysql';

        // Migration check moved to initialization block below
        

        // Self-healing migration: check if the core users table exists
        $shouldMigrate = false;
        try {
            $this->connection->query("SELECT 1 FROM users LIMIT 1");
        } catch (\PDOException) {
            $shouldMigrate = true;
        }

        if ($shouldMigrate) {
          $this->migrate($this->connection, $driver);
          // Still update the local flag for dual-check
          $initFlag = dirname($this->databasePath) . '/.initialized';
          @file_put_contents($initFlag, date('Y-m-d H:i:s'));
        }
        
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
        $onConflict = $isMysql 
            ? 'ON DUPLICATE KEY UPDATE hits = hits + 1, reset_at = VALUES(reset_at)' 
            : 'ON CONFLICT(`key`) DO UPDATE SET hits = hits + 1, reset_at = excluded.reset_at';
        $now = $isMysql ? 'NOW()' : "datetime('now')";
        $isoNow = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        $sql = <<<SQL
            CREATE TABLE IF NOT EXISTS users (
              id $pk,
              uuid VARCHAR(36) NOT NULL UNIQUE,
              full_name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL UNIQUE,
              phone VARCHAR(50),
              whatsapp VARCHAR(50),
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
              vat BIGINT DEFAULT 0,
              shipping_fee BIGINT DEFAULT 0,
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

            CREATE TABLE IF NOT EXISTS user_addresses (
              id $pk,
              user_uuid VARCHAR(36) NOT NULL,
              label VARCHAR(100) NOT NULL,
              address $text NOT NULL,
              is_default TINYINT DEFAULT 0,
              created_at $dateTime NOT NULL,
              FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS user_payment_methods (
              id $pk,
              user_uuid VARCHAR(36) NOT NULL,
              type VARCHAR(50) NOT NULL,
              provider VARCHAR(100) NOT NULL,
              last4 VARCHAR(4) NOT NULL,
              is_default TINYINT DEFAULT 0,
              created_at $dateTime NOT NULL,
              FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS user_company_info (
              user_uuid VARCHAR(36) PRIMARY KEY,
              company_name VARCHAR(255),
              tax_id VARCHAR(100),
              business_type VARCHAR(100),
              email VARCHAR(255),
              whatsapp VARCHAR(50),
              address $text,
              updated_at $dateTime NOT NULL,
              FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS wishlist_items (
              id $pk,
              wishlist_token VARCHAR(255) NOT NULL,
              product_id VARCHAR(50) NOT NULL,
              created_at $dateTime NOT NULL,
              UNIQUE(wishlist_token, product_id)
            );

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
            CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
            CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
            CREATE INDEX IF NOT EXISTS idx_orders_cart_token ON orders (cart_token);

            $insertIgnore INTO roles (name, description, created_at) VALUES 
            ('admin', 'Full system access', $now),
            ('customer', 'Standard customer access', $now);

            $insertIgnore INTO users (uuid, full_name, email, password_hash, wallet_balance, created_at, updated_at) VALUES
            ('018ed3d0-3770-711e-a131-0164c0556855', 'Procurely Admin', 'admin@procurely.com', '\$2y\$12\$Vn4xphquyHU4fXolPTUU3uTYN6cN2cunQB8hJoYuiXGihcVYshWQ6', 0, '$isoNow', '$isoNow');

            -- Link admin user to admin role (assumes id 1 if fresh, but better handled by service usually)
            -- However, for a seed, we can attempt a subquery link
            $insertIgnore INTO user_roles (user_id, role_id, assigned_at)
            SELECT u.id, r.id, $now FROM users u, roles r WHERE u.email = 'admin@procurely.com' AND r.name = 'admin';

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

            $insertIgnore INTO role_permissions (role_id, permission_id, assigned_at)
            SELECT r.id, p.id, $now FROM roles r, permissions p WHERE r.name = 'admin';

            $insertIgnore INTO role_permissions (role_id, permission_id, assigned_at)
            SELECT r.id, p.id, $now FROM roles r, permissions p 
            WHERE r.name = 'customer' AND p.name IN ('product.read', 'order.create', 'order.read');
SQL;

        // MySQL doesn't support CREATE INDEX IF NOT EXISTS directly.
        $indexes = [
            'idx_users_email' => 'CREATE INDEX idx_users_email ON users (email)',
            'idx_users_uuid' => 'CREATE INDEX idx_users_uuid ON users (uuid)',
            'idx_users_created_at' => 'CREATE INDEX idx_users_created_at ON users (created_at)',
            'idx_roles_name' => 'CREATE INDEX idx_roles_name ON roles (name)',
            'idx_permissions_name' => 'CREATE INDEX idx_permissions_name ON permissions (name)',
            'idx_user_roles_user_id' => 'CREATE INDEX idx_user_roles_user_id ON user_roles (user_id)',
            'idx_user_roles_role_id' => 'CREATE INDEX idx_user_roles_role_id ON user_roles (role_id)',
            'idx_role_permissions_role_id' => 'CREATE INDEX idx_role_permissions_role_id ON role_permissions (role_id)',
            'idx_role_permissions_permission_id' => 'CREATE INDEX idx_role_permissions_permission_id ON role_permissions (permission_id)',
            'idx_user_sessions_user_id' => 'CREATE INDEX idx_user_sessions_user_id ON user_sessions (user_id)',
            'idx_user_sessions_token_hash' => 'CREATE INDEX idx_user_sessions_token_hash ON user_sessions (session_token_hash)',
            'idx_user_sessions_expires_at' => 'CREATE INDEX idx_user_sessions_expires_at ON user_sessions (expires_at)',
            'idx_audit_logs_user_id' => 'CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id)',
            'idx_audit_logs_action' => 'CREATE INDEX idx_audit_logs_action ON audit_logs (action)',
            'idx_audit_logs_resource' => 'CREATE INDEX idx_audit_logs_resource ON audit_logs (resource)',
            'idx_audit_logs_created_at' => 'CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at)',
            'idx_notifications_user_id' => 'CREATE INDEX idx_notifications_user_id ON notifications (user_id)',
            'idx_notifications_type' => 'CREATE INDEX idx_notifications_type ON notifications (type)',
            'idx_notifications_read_at' => 'CREATE INDEX idx_notifications_read_at ON notifications (read_at)',
            'idx_notifications_created_at' => 'CREATE INDEX idx_notifications_created_at ON notifications (created_at)',
            'idx_password_reset_user_id' => 'CREATE INDEX idx_password_reset_user_id ON password_reset_requests (user_id)',
            'idx_password_reset_token_hash' => 'CREATE INDEX idx_password_reset_token_hash ON password_reset_requests (token_hash)',
            'idx_password_reset_expires_at' => 'CREATE INDEX idx_password_reset_expires_at ON password_reset_requests (expires_at)',
            'idx_rate_limits_reset_at' => 'CREATE INDEX idx_rate_limits_reset_at ON rate_limits (reset_at)',
            'idx_products_category' => 'CREATE INDEX idx_products_category ON products (category)',
            'idx_products_featured' => 'CREATE INDEX idx_products_featured ON products (featured)',
            'idx_products_slot' => 'CREATE INDEX idx_products_slot ON products (homepage_slot)',
            'idx_orders_user_id' => 'CREATE INDEX idx_orders_user_id ON orders (user_id)',
            'idx_cart_items_cart_token' => 'CREATE INDEX idx_cart_items_cart_token ON cart_items (cart_token)',
            'idx_order_items_order_id' => 'CREATE INDEX idx_order_items_order_id ON order_items (order_id)',
            'idx_orders_status' => 'CREATE INDEX idx_orders_status ON orders (status)',
            'idx_orders_cart_token' => 'CREATE INDEX idx_orders_cart_token ON orders (cart_token)',
        ];

        $statements = array_filter(array_map('trim', explode(';', $sql)));
        foreach ($statements as $stmt) {
            try {
                if ($stmt === '') continue;
                $pdo->exec($stmt);
            } catch (\PDOException $e) {
                throw new \RuntimeException(
                    "Database migration failed on statement:\n$stmt\nError: " . $e->getMessage(),
                    (int) $e->getCode(),
                    $e
                );
            }
        }

        foreach ($indexes as $name => $createSql) {
            try {
                if ($isMysql) {
                    $st = $pdo->prepare("SELECT COUNT(1) FROM information_schema.statistics WHERE table_schema = DATABASE() AND index_name = ?");
                    $st->execute([$name]);
                    if ((int)$st->fetchColumn() === 0) {
                        $pdo->exec($createSql);
                    }
                } else {
                    $pdo->exec(str_replace('CREATE INDEX', 'CREATE INDEX IF NOT EXISTS', $createSql));
                }
            } catch (\PDOException) {
                // Silent fail for indexes if they already exist
            }
        }
    }
}

