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
            mkdir($directory, 0777, true);
        }

        $this->connection = new PDO(sprintf('sqlite:%s', $this->databasePath));
        $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $this->connection->exec('PRAGMA foreign_keys = ON');

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
              token TEXT NOT NULL,
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
              order_number TEXT NOT NULL UNIQUE,
              cart_token TEXT NOT NULL,
              customer_name TEXT NOT NULL,
              customer_email TEXT NOT NULL,
              phone TEXT NOT NULL,
              address TEXT NOT NULL,
              subtotal INTEGER NOT NULL,
              service_fee INTEGER NOT NULL,
              total INTEGER NOT NULL,
              status TEXT NOT NULL,
              created_at TEXT NOT NULL
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
            SQL
        );
    }
}
