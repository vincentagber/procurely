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

    public function findByCategory(string $category): array
    {
        $sql = "SELECT * FROM products WHERE category = :category ORDER BY created_at DESC";
        return $this->execute($sql, ['category' => $category])->fetchAll();
    }

    public function search(array $filters): array
    {
        $sql = "SELECT p.* FROM products p WHERE 1=1";
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

        if (!empty($filters['category'])) {
            $sql .= " AND p.category = :category";
            $params['category'] = $filters['category'];
        }

        $sql .= " ORDER BY p.created_at DESC";
        return $this->execute($sql, $params)->fetchAll();
    }

    public function create(array $data): string
    {
        $sql = "INSERT INTO products (id, slug, name, short_description, category, price, image, badge, featured, homepage_slot, created_at, updated_at) 
                VALUES (:id, :slug, :name, :short_desc, :category, :price, :image, :badge, :featured, :slot, :created_at, :updated_at)";
        
        $now = date('Y-m-d H:i:s');
        $this->execute($sql, [
            'id' => $data['id'],
            'slug' => $data['slug'],
            'name' => $data['name'],
            'short_desc' => $data['short_description'],
            'category' => $data['category'] ?? 'General',
            'price' => $data['price'],
            'image' => $data['image'] ?? null,
            'badge' => $data['badge'] ?? null,
            'featured' => $data['featured'] ?? 0,
            'slot' => $data['homepage_slot'] ?? null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $data['id'];
    }
}
