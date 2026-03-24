<?php

declare(strict_types=1);

namespace Procurely\Api\Services;

use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\ContentStore;

final class CatalogService
{
    public function __construct(
        private readonly ContentStore $contentStore,
    ) {
    }

    public function homepage(): array
    {
        return $this->contentStore->all();
    }

    public function listProducts(array $filters = []): array
    {
        $products = $this->contentStore->products();
        $slot = trim((string) ($filters['slot'] ?? ''));
        $query = mb_strtolower(trim((string) ($filters['q'] ?? '')));
        $ids = array_values(array_filter(array_map('trim', explode(',', (string) ($filters['ids'] ?? '')))));

        if ($slot !== '') {
            $products = array_values(
                array_filter(
                    $products,
                    static fn (array $product): bool => ($product['homepageSlot'] ?? '') === $slot,
                ),
            );
        }

        if ($ids !== []) {
            $lookup = array_flip($ids);
            $products = array_values(
                array_filter(
                    $products,
                    static fn (array $product): bool => isset($lookup[$product['id'] ?? '']),
                ),
            );
        }

        if ($query !== '') {
            $products = array_values(
                array_filter(
                    $products,
                    static fn (array $product): bool => str_contains(
                        mb_strtolower(sprintf(
                            '%s %s %s',
                            $product['name'] ?? '',
                            $product['shortDescription'] ?? '',
                            $product['category'] ?? '',
                        )),
                        $query,
                    ),
                ),
            );
        }

        return $products;
    }

    public function productBySlug(string $slug): array
    {
        $product = $this->contentStore->productBySlug($slug);

        if ($product === null) {
            throw new ApiException('Product not found.', 404);
        }

        return $product;
    }
}
