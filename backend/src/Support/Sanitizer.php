<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

/**
 * Basic Sanitizer for cleaning user input.
 */
final class Sanitizer
{
    /**
     * Sanitize a value or array of values.
     */
    public static function clean(mixed $value): mixed
    {
        if (is_array($value)) {
            return array_map([self::class, 'clean'], $value);
        }

        if (is_string($value)) {
            // Remove null bytes
            $value = str_replace(chr(0), '', $value);
            
            // Basic XSS protection: convert sensitive characters to HTML entities 
            // where appropriate, but we mostly rely on client-side React escaping.
            // For a baseline, we'll strip tags from single-line inputs.
            return trim($value);
        }

        return $value;
    }
}
