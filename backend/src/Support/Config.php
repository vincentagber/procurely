<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

final class Config
{
    private const SERVICE_FEE_KOBO = 350000;
    private const SERVICE_FEE_THRESHOLD_KOBO = 10000000;
    private const VAT_PERCENTAGE = 7.5;
    private const SHIPPING_FLAT_KOBO = 2000000;
    private const FREE_SHIPPING_THRESHOLD_KOBO = 10000000;

    public static function serviceFee(int $subtotalKobo): int
    {
        return $subtotalKobo >= self::FREE_SHIPPING_THRESHOLD_KOBO ? 0 : self::SERVICE_FEE_KOBO;
    }

    public static function vat(int $subtotalKobo): int
    {
        return (int) round($subtotalKobo * (self::VAT_PERCENTAGE / 100));
    }

    public static function shippingFee(int $subtotalKobo): int
    {
        return $subtotalKobo >= self::FREE_SHIPPING_THRESHOLD_KOBO ? 0 : self::SHIPPING_FLAT_KOBO;
    }

    public static function freeShippingThreshold(): int
    {
        return self::FREE_SHIPPING_THRESHOLD_KOBO;
    }

    public static function vatPercentage(): float
    {
        return self::VAT_PERCENTAGE;
    }
}
