<?php

namespace Procurely\Api\Repositories;

/**
 * Repository for Product data management
 */
class ProductRepository extends BaseRepository
{
    public function findById(string|int $id): ?array
    {
        return $this->fetchOne('products', 'id', $id);
    }

    public function findByCategory(int $categoryId): array
    {
        $sql = "SELECT * FROM products WHERE category_id = :category_id ORDER BY created_at DESC";
        return $this->execute($sql, ['category_id' => $categoryId])->fetchAll();
    }

    public function search(array $filters): array
    {
        $sql = "SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE 1=1";
        $params = [];

        if (!empty($filters['name'])) {
            $sql .= " AND p.name LIKE :name";
            $params['name'] = '%' . $filters['name'] . '%';
        }

        if (isset($filters['min_price'])) {
            $sql .= " AND p.price >= :min_price";
            $params['min_price'] = $filters['min_price'];
        }

        if (isset($filters['max_price'])) {
            $sql .= " AND p.price <= :max_price";
            $params['max_price'] = $filters['max_price'];
        }

        if (!empty($filters['category_id'])) {
            $sql .= " AND p.category_id = :cat_id";
            $params['cat_id'] = $filters['category_id'];
        }

        $sql .= " ORDER BY p.created_at DESC";
        return $this->execute($sql, $params)->fetchAll();
    }

    public function create(array $data): string
    {
        $sql = "INSERT INTO products (id, slug, name, short_description, category_id, price, image, badge, featured, homepage_slot, created_at, updated_at) 
                VALUES (:id, :slug, :name, :short_desc, :cat_id, :price, :image, :badge, :featured, :slot, NOW(), NOW())";
        
        $this->execute($sql, [
            'id' => $data['id'],
            'slug' => $data['slug'],
            'name' => $data['name'],
            'short_desc' => $data['short_description'],
            'cat_id' => $data['category_id'] ?? null,
            'price' => $data['price'],
            'image' => $data['image'] ?? null,
            'badge' => $data['badge'] ?? null,
            'featured' => $data['featured'] ?? 0,
            'slot' => $data['homepage_slot'] ?? null,
        ]);

        return $data['id'];
    }
}
