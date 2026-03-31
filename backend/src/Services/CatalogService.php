<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\ContentStore;
use Procurely\Api\Support\Input;

final class CatalogService
{
    public function __construct(
        private readonly \Procurely\Api\Support\Database $database,
        private readonly ContentStore $contentStore,
    ) {
    }

    public function homepage(): array
    {
        return $this->contentStore->all();
    }

    public function listProducts(array $filters = []): array
    {
        $pdo = $this->database->connection();

        $sql = 'SELECT * FROM products WHERE 1=1';
        $params = [];

        $slot = Input::string($filters['slot'] ?? '');
        if ($slot !== '') {
            $sql .= ' AND homepage_slot = :slot';
            $params['slot'] = $slot;
        }

        $category = mb_strtolower(Input::string($filters['category'] ?? ''));
        if ($category !== '') {
            $sql .= ' AND LOWER(category) = :category';
            $params['category'] = $category;
        }

        $featured = Input::boolOrNull($filters['featured'] ?? null, 'Featured flag');
        if ($featured !== null) {
            $sql .= ' AND featured = :featured';
            $params['featured'] = $featured ? 1 : 0;
        }

        $query = mb_strtolower(Input::string($filters['q'] ?? ''));
        if ($query !== '') {
            $sql .= ' AND (LOWER(name) LIKE :q OR LOWER(short_description) LIKE :q OR LOWER(category) LIKE :q)';
            $params['q'] = '%' . $query . '%';
        }

        $minPrice = Input::intRange($filters['minPrice'] ?? null, 'Minimum price', 0, 100000000, 0);
        $maxPrice = Input::intRange($filters['maxPrice'] ?? null, 'Maximum price', 0, 100000000, 100000000);
        if ($minPrice > $maxPrice) {
            throw new ApiException('Minimum price cannot exceed maximum price.', 422);
        }

        $sql .= ' AND price >= :minPrice AND price <= :maxPrice';
        $params['minPrice'] = $minPrice;
        $params['maxPrice'] = $maxPrice;

        $ids = Input::csvList($filters['ids'] ?? '');
        if (!empty($ids)) {
            $placeholders = [];
            foreach ($ids as $i => $id) {
                $key = "id_$i";
                $placeholders[] = ":$key";
                $params[$key] = $id;
            }
            $sql .= ' AND id IN (' . implode(',', $placeholders) . ')';
        }

        $sort = Input::enum(
            $filters['sort'] ?? null,
            ['relevance', 'price-asc', 'price-desc', 'name-asc', 'name-desc'],
            'Sort order',
            $query !== '' ? 'relevance' : 'name-asc',
        );

        $orderBy = match ($sort) {
            'price-asc' => 'price ASC',
            'price-desc' => 'price DESC',
            'name-desc' => 'name DESC',
            default => 'name ASC',
        };
        $sql .= " ORDER BY $orderBy";

        $limit = Input::intRange($filters['limit'] ?? null, 'Limit', 1, 100, 24);
        $page = Input::intRange($filters['page'] ?? null, 'Page', 1, 1000, 1);
        $offset = ($page - 1) * $limit;

        $sql .= " LIMIT $limit OFFSET $offset";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return array_map([$this->contentStore, 'normalizeProduct'], $stmt->fetchAll());
    }

    public function productBySlug(string $slug): array
    {
        $product = $this->contentStore->productBySlug($slug);

        if ($product === null) {
            throw new ApiException('Product not found.', 404);
        }

        $stmt = $this->database->connection()->prepare('SELECT stock_level FROM inventory WHERE product_id = :id LIMIT 1');
        $stmt->execute(['id' => $product['id']]);
        $row = $stmt->fetch();

        $product['stockLevel'] = $row !== false ? (int) $row['stock_level'] : 0;

        return $product;
    }

    private function scoreProduct(array $product, string $query): int
    {
        if ($query === '') {
            return 0;
        }

        $name = mb_strtolower((string) ($product['name'] ?? ''));
        $description = mb_strtolower((string) ($product['shortDescription'] ?? ''));
        $category = mb_strtolower((string) ($product['category'] ?? ''));
        $haystack = sprintf('%s %s %s', $name, $description, $category);

        if (!str_contains($haystack, $query)) {
            return 0;
        }

        $score = 10;

        if ($name === $query) {
            $score += 100;
        } elseif (str_starts_with($name, $query)) {
            $score += 60;
        } elseif (str_contains($name, $query)) {
            $score += 40;
        }

        if (str_contains($description, $query)) {
            $score += 15;
        }

        if (str_contains($category, $query)) {
            $score += 10;
        }

        return $score;
    }
}
