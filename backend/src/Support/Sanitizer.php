<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

/**
 * Production-grade Sanitizer for cleaning user input and preventing XSS.
 */
final class Sanitizer
{
    /**
     * Sanitize a value or array of values recursively.
     */
    public static function clean(mixed $value): mixed
    {
        if (is_array($value)) {
            return array_map([self::class, 'clean'], $value);
        }

        if (is_string($value)) {
            // 1. Remove null bytes (prevent directory traversal/null byte injection)
            $value = str_replace(chr(0), '', $value);
            
            // 2. Trim whitespace
            $value = trim($value);

            // 3. Strip HTML tags to prevent XSS
            $value = strip_tags($value);
        }

        return $value;
    }

    /**
     * Strictly strip tags and escape for plain-text contexts.
     */
    public static function strict(string $value): string
    {
        return htmlspecialchars(strip_tags($value), ENT_QUOTES, 'UTF-8');
    }
}
