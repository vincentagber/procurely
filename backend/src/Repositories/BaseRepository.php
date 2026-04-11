<?php

namespace Procurely\Api\Repositories;

use PDO;
use Procurely\Api\Support\Database;

/**
 * Base Repository for common database operations
 */
abstract class BaseRepository
{
    protected PDO $db;

    public function __construct(Database $database)
    {
        $this->db = $database->connection();
    }

    /**
     * Executes a prepared statement and returns the result
     */
    protected function execute(string $sql, array $params = []): \PDOStatement
    {
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (\PDOException $e) {
            // Log error in production
            error_log("Database Error: " . $e->getMessage());
            throw new \Exception("A database error occurred. Please try again later.");
        }
    }

    /**
     * Fetch a single record by a unique column
     */
    protected function fetchOne(string $table, string $column, mixed $value): ?array
    {
        $sql = "SELECT * FROM {$table} WHERE {$column} = :val LIMIT 1";
        $stmt = $this->execute($sql, ['val' => $value]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
