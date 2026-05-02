<?php

declare(strict_types=1);

namespace Procurely\Api\Tests\Unit;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Procurely\Api\Support\Input;
use Procurely\Api\Support\ApiException;

final class InputValidationTest extends TestCase
{
    #[Test]
    public function testRequiredStringValid(): void
    {
        $result = Input::requiredString(['name' => 'John'], 'name', 'Name', 100);
        $this->assertEquals('John', $result);
    }

    #[Test]
    public function testRequiredStringMissing(): void
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('Name is required.');
        Input::requiredString([], 'name', 'Name', 100);
    }

    #[Test]
    public function testRequiredStringTooLong(): void
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('Name must be 100 characters or fewer.');
        Input::requiredString(['name' => str_repeat('a', 101)], 'name', 'Name', 100);
    }

    #[Test]
    public function testEmailValid(): void
    {
        $result = Input::email(['email' => 'test@example.com'], 'email', 'Email');
        $this->assertEquals('test@example.com', $result);
    }

    #[Test]
    public function testEmailInvalid(): void
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('A valid email is required.');
        Input::email(['email' => 'not-an-email'], 'email', 'Email');
    }

    #[Test]
    public function testPhoneValid(): void
    {
        $result = Input::phone(['phone' => '+2348012345678'], 'phone', 'Phone');
        $this->assertEquals('+2348012345678', $result);
    }

    #[Test]
    public function testCartTokenValid(): void
    {
        $result = Input::cartToken(['cartToken' => 'abc123def456']);
        $this->assertEquals('abc123def456', $result);
    }

    #[Test]
    public function testProductIdValid(): void
    {
        $result = Input::productId(['productId' => 'prod-123']);
        $this->assertEquals('prod-123', $result);
    }

    #[Test]
    public function testIntRangeValid(): void
    {
        $result = Input::intRange(5, 'Quantity', 1, 10, 1);
        $this->assertEquals(5, $result);
    }

    #[Test]
    public function testIntRangeDefaultForNull(): void
    {
        $result = Input::intRange(null, 'Quantity', 1, 10, 5);
        $this->assertEquals(5, $result);
    }

    #[Test]
    public function testIntRangeDefaultForEmpty(): void
    {
        $result = Input::intRange('', 'Quantity', 1, 10, 5);
        $this->assertEquals(5, $result);
    }

    #[Test]
    public function testIntRangeBelowMinThrows(): void
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('Quantity must be between 1 and 10.');
        Input::intRange(0, 'Quantity', 1, 10, 1);
    }

    #[Test]
    public function testIntRangeAboveMaxThrows(): void
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('Quantity must be between 1 and 10.');
        Input::intRange(100, 'Quantity', 1, 10, 1);
    }

    #[Test]
    public function testEnumValid(): void
    {
        $result = Input::enum('card', ['card', 'bank', 'cod'], 'Payment method', 'card');
        $this->assertEquals('card', $result);
    }

    #[Test]
    public function testEnumDefaultForEmpty(): void
    {
        $result = Input::enum('', ['card', 'bank', 'cod'], 'Payment method', 'bank');
        $this->assertEquals('bank', $result);
    }

    #[Test]
    public function testEnumInvalidThrows(): void
    {
        $this->expectException(ApiException::class);
        $this->expectExceptionMessage('Payment method must be one of: card, bank, cod.');
        Input::enum('invalid', ['card', 'bank', 'cod'], 'Payment method', 'card');
    }
}
