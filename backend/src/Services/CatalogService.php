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
        $products = $this->contentStore->products();
        $slot = Input::string($filters['slot'] ?? '');
        $query = mb_strtolower(Input::string($filters['q'] ?? ''));
        $ids = Input::csvList($filters['ids'] ?? '');
        $category = mb_strtolower(Input::string($filters['category'] ?? ''));
        $featured = Input::boolOrNull($filters['featured'] ?? null, 'Featured flag');
        $minPrice = Input::intRange($filters['minPrice'] ?? null, 'Minimum price', 0, 100000000, 0);
        $maxPrice = Input::intRange($filters['maxPrice'] ?? null, 'Maximum price', 0, 100000000, 100000000);
        $sort = Input::enum(
            $filters['sort'] ?? null,
            ['relevance', 'price-asc', 'price-desc', 'name-asc', 'name-desc'],
            'Sort order',
            $query !== '' ? 'relevance' : 'name-asc',
        );
        $limit = Input::intRange($filters['limit'] ?? null, 'Limit', 1, 48, count($products) > 0 ? min(count($products), 48) : 24);
        $page = Input::intRange($filters['page'] ?? null, 'Page', 1, 1000, 1);

        if ($minPrice > $maxPrice) {
            throw new ApiException('Minimum price cannot exceed maximum price.', 422);
        }

        if ($slot !== '') {
            $products = array_values(
                array_filter(
                    $products,
                    static fn (array $product): bool => ($product['homepageSlot'] ?? '') === $slot,
                ),
            );
        }

        if ($category !== '') {
            $products = array_values(
                array_filter(
                    $products,
                    static fn (array $product): bool => mb_strtolower((string) ($product['category'] ?? '')) === $category,
                ),
            );
        }

        if ($featured !== null) {
            $products = array_values(
                array_filter(
                    $products,
                    static fn (array $product): bool => (bool) ($product['featured'] ?? false) === $featured,
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

        $products = array_values(
            array_filter(
                $products,
                static fn (array $product): bool => (int) ($product['price'] ?? 0) >= $minPrice
                    && (int) ($product['price'] ?? 0) <= $maxPrice,
            ),
        );

        if ($query !== '') {
            $products = array_values(
                array_filter(
                    $products,
                    fn (array $product): bool => $this->scoreProduct($product, $query) > 0,
                ),
            );
        }

        usort(
            $products,
            function (array $left, array $right) use ($sort, $query): int {
                return match ($sort) {
                    'price-asc' => ((int) ($left['price'] ?? 0)) <=> ((int) ($right['price'] ?? 0)),
                    'price-desc' => ((int) ($right['price'] ?? 0)) <=> ((int) ($left['price'] ?? 0)),
                    'name-desc' => strcmp((string) ($right['name'] ?? ''), (string) ($left['name'] ?? '')),
                    'relevance' => $query === ''
                        ? strcmp((string) ($left['name'] ?? ''), (string) ($right['name'] ?? ''))
                        : $this->scoreProduct($right, $query) <=> $this->scoreProduct($left, $query),
                    default => strcmp((string) ($left['name'] ?? ''), (string) ($right['name'] ?? '')),
                };
            }
        );

        $offset = ($page - 1) * $limit;

        return array_slice($products, $offset, $limit);
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
