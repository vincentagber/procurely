<?php

declare(strict_types=1);

namespace Procurely\Api\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Procurely\Api\Support\Config;

final class ConfigTest extends TestCase
{
    public function testServiceFeeBelowThreshold(): void
    {
        $subtotal = 500000;
        $this->assertEquals(350000, Config::serviceFee($subtotal));
    }

    public function testServiceFeeAtThreshold(): void
    {
        $subtotal = 10000000;
        $this->assertEquals(0, Config::serviceFee($subtotal));
    }

    public function testServiceFeeAboveThreshold(): void
    {
        $subtotal = 15000000;
        $this->assertEquals(0, Config::serviceFee($subtotal));
    }

    public function testVatCalculation(): void
    {
        $subtotal = 1000000;
        $expected = 75000;
        $this->assertEquals($expected, Config::vat($subtotal));
    }

    public function testShippingFeeBelowThreshold(): void
    {
        $subtotal = 500000;
        $this->assertEquals(2000000, Config::shippingFee($subtotal));
    }

    public function testShippingFeeAboveThreshold(): void
    {
        $subtotal = 10000000;
        $this->assertEquals(0, Config::shippingFee($subtotal));
    }

    public function testVatPercentage(): void
    {
        $this->assertEquals(7.5, Config::vatPercentage());
    }

    public function testFreeShippingThreshold(): void
    {
        $this->assertEquals(10000000, Config::freeShippingThreshold());
    }
}
