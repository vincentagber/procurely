<?php

namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\ContentStore;
use Procurely\Api\Services\CatalogService;
use Procurely\Api\Services\AuthService;
use PDO;

class ApiTest extends TestCase
{
    private Database $db;
    private PDO $pdo;

    protected function setUp(): void
    {
        // Use environment variables for test DB (MySQL in CI, SQLite locally)
        $this->db = new Database('storage/test.sqlite');
        $this->pdo = $this->db->connection();
        
        // Clean up tables before each test if using MySQL to ensure clean slate
        // In this slim setup, Database->connection() runs migrate automatically.
    }

    /** @test */
    public function database_schema_is_functional_and_tables_exist()
    {
        $tables = ['users', 'products', 'orders', 'order_items', 'cart_items'];
        
        foreach ($tables as $table) {
            $stmt = $this->pdo->query("SELECT 1 FROM $table LIMIT 1");
            $this->assertNotFalse($stmt, "Table '$table' should exist in the database.");
        }
    }

    /** @test */
    public function homepage_api_returns_correct_structure()
    {
        // Mock requirements
        $contentStore = new ContentStore(__DIR__ . '/../../../shared/content/procurely.json');
        $catalog = new CatalogService($this->db, $contentStore);
        
        $data = $catalog->homepage();
        
        $this->assertArrayHasKey('site', $data);
        $this->assertArrayHasKey('navigation', $data);
        $this->assertArrayHasKey('hero', $data);
        $this->assertEquals('Procurely', $data['site']['name']);
    }

    /** @test */
    public function product_catalog_can_be_queried()
    {
        $contentStore = new ContentStore(__DIR__ . '/../../../shared/content/procurely.json');
        $catalog = new CatalogService($this->db, $contentStore);
        
        $products = $catalog->listProducts(['q' => 'sand']);
        
        $this->assertIsArray($products);
        // Even if empty, it should be an array. If we have seed data, we could assert count > 0.
    }

    /** @test */
    public function user_registration_constraint_validation()
    {
        $auth = new AuthService($this->db, true);
        
        // Test missing fields
        $this->expectException(\Procurely\Api\Support\ApiException::class);
        $auth->register(['email' => 'test@example.com']); // Missing fullName and password
    }

    /** @test */
    public function critical_migration_integrity_check()
    {
        // Verify that we can't insert a user with a duplicate email (Unique constraint test)
        $uuid = 'test-uuid-' . uniqid();
        $this->pdo->exec("INSERT INTO users (uuid, full_name, email, password_hash, created_at) VALUES ('$uuid', 'Test User', 'dup@example.com', 'hash', '2024-01-01')");
        
        $this->expectException(\PDOException::class);
        $this->pdo->exec("INSERT INTO users (uuid, full_name, email, password_hash, created_at) VALUES ('other-uuid', 'Other User', 'dup@example.com', 'hash', '2024-01-01')");
    }
}
