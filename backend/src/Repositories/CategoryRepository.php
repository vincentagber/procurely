<?php

namespace Procurely\Api\Repositories;

/**
 * Repository for Categories
 */
class CategoryRepository extends BaseRepository
{
    public function findAll(): array
    {
        $sql = "SELECT * FROM categories ORDER BY name ASC";
        return $this->execute($sql)->fetchAll();
    }

    public function findByIdWithProducts(int $id): ?array
    {
        $category = $this->fetchOne('categories', 'id', $id);
        if (!$category) return null;

        $sql = "SELECT * FROM products WHERE category_id = :id";
        $category['products'] = $this->execute($sql, ['id' => $id])->fetchAll();
        
        return $category;
    }

    public function create(string $name, string $slug, string $description = ''): int
    {
        $sql = "INSERT INTO categories (name, slug, description, created_at) VALUES (:name, :slug, :desc, :created_at)";
        $this->execute($sql, ['name' => $name, 'slug' => $slug, 'desc' => $description, 'created_at' => date('Y-m-d H:i:s')]);
        return (int) $this->db->lastInsertId();
    }
}
