<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

final class ContentStore
{
    private ?array $content = null;
    private ?array $productsById = null;
    private ?array $productsBySlug = null;

    public function __construct(
        private readonly string $contentPath,
    ) {
    }

    public function all(): array
    {
        if ($this->content !== null) {
            return $this->content;
        }

        $raw = file_get_contents($this->contentPath);

        if ($raw === false) {
            throw new ApiException('Unable to read shared content payload.', 500);
        }

        $decoded = json_decode($raw, true, flags: JSON_THROW_ON_ERROR);

        if (!is_array($decoded)) {
            throw new ApiException('Invalid shared content payload.', 500);
        }

        return $this->content = $decoded;
    }

    public function products(): array
    {
        return $this->all()['products'] ?? [];
    }

    public function productById(string $id): ?array
    {
        if ($this->productsById === null) {
            $this->buildIndexes();
        }

        return $this->productsById[$id] ?? null;
    }

    public function productBySlug(string $slug): ?array
    {
        if ($this->productsBySlug === null) {
            $this->buildIndexes();
        }

        return $this->productsBySlug[$slug] ?? null;
    }

    private function buildIndexes(): void
    {
        $this->productsById = [];
        $this->productsBySlug = [];

        foreach ($this->products() as $product) {
            if (isset($product['id'])) {
                $this->productsById[(string) $product['id']] = $product;
            }
            if (isset($product['slug'])) {
                $this->productsBySlug[(string) $product['slug']] = $product;
            }
        }
    }

    public function productsByIds(array $ids): array
    {
        $lookup = array_flip($ids);

        return array_values(
            array_filter(
                $this->products(),
                static fn (array $product): bool => isset($lookup[$product['id'] ?? '']),
            ),
        );
    }

    /**
     * Persist a new or updated product into the content JSON file.
     */
    public function saveProduct(array $product): array
    {
        $content = $this->all();
        $products = $content['products'] ?? [];

        $existingIndex = null;
        foreach ($products as $i => $p) {
            if (($p['id'] ?? '') === $product['id']) {
                $existingIndex = $i;
                break;
            }
        }

        if ($existingIndex !== null) {
            $products[$existingIndex] = $product;
        } else {
            $products[] = $product;
        }

        $content['products'] = array_values($products);
        $this->content = $content;
        $this->productsById = null;
        $this->productsBySlug = null;

        $encoded = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($encoded === false || file_put_contents($this->contentPath, $encoded) === false) {
            throw new ApiException('Failed to persist product data.', 500);
        }

        return $product;
    }

    /**
     * Remove a product by its ID from the content JSON file.
     */
    public function deleteProduct(string $id): void
    {
        $content = $this->all();
        $products = $content['products'] ?? [];

        $filtered = array_values(array_filter($products, static fn ($p) => ($p['id'] ?? '') !== $id));

        if (count($filtered) === count($products)) {
            throw new ApiException('Product not found.', 404);
        }

        $content['products'] = $filtered;
        $this->content = $content;
        $this->productsById = null;
        $this->productsBySlug = null;

        $encoded = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($encoded === false || file_put_contents($this->contentPath, $encoded) === false) {
            throw new ApiException('Failed to persist product data.', 500);
        }
    }
}
