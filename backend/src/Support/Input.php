<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

final class Input
{
    public static function requiredString(
        array $payload,
        string $field,
        string $label,
        int $maxLength = 255,
        bool $singleLine = true,
    ): string {
        $value = self::string($payload[$field] ?? '', $singleLine);

        if ($value === '') {
            throw new ApiException(sprintf('%s is required.', $label), 422, [
                'field' => $field,
            ]);
        }

        if (mb_strlen($value) > $maxLength) {
            throw new ApiException(sprintf('%s must be %d characters or fewer.', $label, $maxLength), 422, [
                'field' => $field,
            ]);
        }

        return $value;
    }

    public static function email(
        array $payload,
        string $field = 'email',
        string $label = 'Email address',
    ): string {
        $email = mb_strtolower(self::requiredString($payload, $field, $label, 254));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new ApiException(sprintf('A valid %s is required.', mb_strtolower($label)), 422, [
                'field' => $field,
            ]);
        }

        return $email;
    }

    public static function phone(
        array $payload,
        string $field = 'phone',
        string $label = 'Phone number',
    ): string {
        $phone = self::requiredString($payload, $field, $label, 24);

        if (!preg_match('/^\+?[0-9][0-9\s().-]{6,23}$/', $phone)) {
            throw new ApiException(sprintf('A valid %s is required.', mb_strtolower($label)), 422, [
                'field' => $field,
            ]);
        }

        return $phone;
    }

    public static function cartToken(array $payload, string $field = 'cartToken'): string
    {
        $token = self::requiredString($payload, $field, 'Cart token', 128);

        if (!preg_match('/^[A-Za-z0-9_-]{8,128}$/', $token)) {
            throw new ApiException('Cart token format is invalid.', 422, [
                'field' => $field,
            ]);
        }

        return $token;
    }

    public static function productId(array $payload, string $field = 'productId'): string
    {
        return self::requiredString($payload, $field, 'Product ID', 80);
    }

    public static function intRange(
        mixed $value,
        string $label,
        int $min,
        int $max,
        int $default,
    ): int {
        if ($value === null || $value === '') {
            return $default;
        }

        $intValue = filter_var($value, FILTER_VALIDATE_INT);

        if ($intValue === false || $intValue < $min || $intValue > $max) {
            throw new ApiException(sprintf('%s must be between %d and %d.', $label, $min, $max), 422);
        }

        return $intValue;
    }

    public static function boolOrNull(mixed $value, string $label): ?bool
    {
        if ($value === null || $value === '') {
            return null;
        }

        $boolValue = filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE);

        if ($boolValue === null) {
            throw new ApiException(sprintf('%s must be true or false.', $label), 422);
        }

        return $boolValue;
    }

    public static function csvList(mixed $value, int $maxItems = 50, int $maxLength = 80): array
    {
        $raw = trim((string) $value);

        if ($raw === '') {
            return [];
        }

        $items = array_values(array_filter(array_map(
            static fn (string $item): string => self::string($item),
            explode(',', $raw),
        )));

        if (count($items) > $maxItems) {
            throw new ApiException(sprintf('No more than %d IDs can be requested at once.', $maxItems), 422);
        }

        foreach ($items as $item) {
            if (mb_strlen($item) > $maxLength) {
                throw new ApiException('One or more requested IDs are invalid.', 422);
            }
        }

        return array_values(array_unique($items));
    }

    public static function enum(mixed $value, array $allowed, string $label, string $default): string
    {
        $normalized = self::string($value);

        if ($normalized === '') {
            return $default;
        }

        if (!in_array($normalized, $allowed, true)) {
            throw new ApiException(sprintf('%s must be one of: %s.', $label, implode(', ', $allowed)), 422);
        }

        return $normalized;
    }

    public static function string(mixed $value, bool $singleLine = true): string
    {
        $normalized = trim((string) $value);

        if ($normalized === '') {
            return '';
        }

        if ($singleLine) {
            $normalized = preg_replace('/\s+/u', ' ', $normalized) ?? $normalized;
            return Sanitizer::strict($normalized);
        } else {
            $normalized = preg_replace("/\r\n?/", "\n", $normalized) ?? $normalized;
            return htmlspecialchars(trim($normalized), ENT_QUOTES, 'UTF-8');
        }
    }
}
