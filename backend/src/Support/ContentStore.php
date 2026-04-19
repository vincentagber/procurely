<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

final class ContentStore
{
    private ?array $content = null;
    private ?array $productsById = null;
    private ?array $productsBySlug = null;

    private readonly Database $database;

    public function __construct(
        private readonly string $contentPath,
        ?Database $database = null
    ) {
        $this->database = $database ?? new Database(dirname($this->contentPath, 3) . '/backend/' . ($_ENV['DATABASE_PATH'] ?? 'storage/procurely.sqlite'));
    }

    public function all(): array
    {
        if ($this->content !== null) {
            $this->content['products'] = $this->products();
            return $this->content;
        }

        if (!file_exists($this->contentPath)) {
            $this->content = [
                'products' => [],
                'site' => ['name' => 'Procurely', 'logoDark' => '', 'logoLight' => ''],
                'navigation' => ['primaryLinks' => [], 'socialLinks' => [], 'accountLinks' => []],
                'footer' => ['address' => [], 'accountLinks' => [], 'quickLinks' => []],
            ];
        } else {
            $this->content = json_decode(file_get_contents($this->contentPath), true) ?: [];
        }

        $this->content['products'] = $this->products();

        // Auto-seed database from JSON if it's empty (MySQL Migration)
        if (empty($this->content['products'])) {
            $jsonContent = json_decode(file_get_contents($this->contentPath), true) ?: [];
            if (!empty($jsonContent['products'])) {
                foreach ($jsonContent['products'] as $p) {
                    $this->saveProduct($p);
                }
                $this->content['products'] = $this->products();
            }
        }

        return $this->content;
    }

    public function products(): array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->query('SELECT * FROM products ORDER BY name ASC');
        $rows = $stmt->fetchAll();

        return array_map([$this, 'normalizeProduct'], $rows);
    }

    public function productById(string $id): ?array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        return $row !== false ? $this->normalizeProduct($row) : null;
    }

    public function productBySlug(string $slug): ?array
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('SELECT * FROM products WHERE slug = :slug LIMIT 1');
        $stmt->execute(['slug' => $slug]);
        $row = $stmt->fetch();

        return $row !== false ? $this->normalizeProduct($row) : null;
    }

    public function productsByIds(array $ids): array
    {
        if (empty($ids)) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id IN ($placeholders)");
        $stmt->execute(array_values($ids));

        return array_map([$this, 'normalizeProduct'], $stmt->fetchAll());
    }

    public function saveProduct(array $product): array
    {
        $pdo = $this->database->connection();
        $now = (new \DateTimeImmutable())->format(\DateTimeImmutable::ATOM);

        $isMysql = ($_ENV['DB_DRIVER'] ?? 'sqlite') === 'mysql';
        $sql = $isMysql 
            ? 'REPLACE INTO products (id, slug, name, short_description, category, price, image, badge, featured, homepage_slot, created_at, updated_at) 
               VALUES (:id, :slug, :name, :short_description, :category, :price, :image, :badge, :featured, :homepage_slot, :created_at, :updated_at)'
            : 'INSERT OR REPLACE INTO products (id, slug, name, short_description, category, price, image, badge, featured, homepage_slot, created_at, updated_at) 
               VALUES (:id, :slug, :name, :short_description, :category, :price, :image, :badge, :featured, :homepage_slot, :created_at, :updated_at)';

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            'id' => (string) ($product['id'] ?? \Ramsey\Uuid\Uuid::uuid7()->toString()),
            'slug' => (string) ($product['slug'] ?? $this->slugify($product['name'])),
            'name' => (string) $product['name'],
            'short_description' => (string) ($product['shortDescription'] ?? ''),
            'category' => (string) ($product['category'] ?? 'General'),
            'price' => (int) ($product['price'] ?? 0),
            'image' => (string) ($product['image'] ?? ''),
            'badge' => (string) ($product['badge'] ?? ''),
            'featured' => (int) ($product['featured'] ?? 0),
            'homepage_slot' => (string) ($product['homepageSlot'] ?? ''),
            'created_at' => $product['createdAt'] ?? $now,
            'updated_at' => $now,
        ]);

        return $this->productById((string) $product['id']);
    }

    public function deleteProduct(string $id): void
    {
        $pdo = $this->database->connection();
        $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() === 0) {
            throw new ApiException('Product not found.', 404);
        }
    }

    public function normalizeProduct(array $row): array
    {
        return [
            'id' => $row['id'],
            'slug' => $row['slug'],
            'name' => $row['name'],
            'shortDescription' => $row['short_description'],
            'category' => $row['category'],
            'price' => (int) $row['price'],
            'image' => $row['image'],
            'badge' => $row['badge'],
            'featured' => (bool) $row['featured'],
            'homepageSlot' => $row['homepage_slot'],
            'createdAt' => $row['created_at'],
            'updatedAt' => $row['updated_at'],
        ];
    }

    private function slugify(string $text): string
    {
        return mb_strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $text), '-'));
    }
}
