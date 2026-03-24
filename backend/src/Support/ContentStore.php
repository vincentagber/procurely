<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

final class ContentStore
{
    private ?array $content = null;

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
        foreach ($this->products() as $product) {
            if (($product['id'] ?? null) === $id) {
                return $product;
            }
        }

        return null;
    }

    public function productBySlug(string $slug): ?array
    {
        foreach ($this->products() as $product) {
            if (($product['slug'] ?? null) === $slug) {
                return $product;
            }
        }

        return null;
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
