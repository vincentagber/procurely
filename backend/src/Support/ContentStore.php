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
}
