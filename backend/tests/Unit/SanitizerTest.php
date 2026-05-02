<?php

declare(strict_types=1);

namespace Procurely\Api\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Procurely\Api\Support\Sanitizer;

final class SanitizerTest extends TestCase
{
    public function testRemoveNullBytes(): void
    {
        $input = "hello\x00world";
        $result = Sanitizer::clean($input);
        $this->assertStringNotContainsString("\x00", $result);
        $this->assertEquals('helloworld', $result);
    }

    public function testStripTags(): void
    {
        $input = '<script>alert("xss")</script>hello';
        $result = Sanitizer::clean($input);
        $this->assertStringNotContainsString('<script>', $result);
    }

    public function testCleanArray(): void
    {
        $input = [
            'name' => '<b>John</b>',
            'email' => 'test@example.com',
        ];
        $result = Sanitizer::clean($input);
        $this->assertStringNotContainsString('<b>', $result['name']);
    }

    public function testNestedArrayCleaning(): void
    {
        $input = [
            'user' => [
                'name' => '<script>evil</script>',
            ],
        ];
        $result = Sanitizer::clean($input);
        $this->assertStringNotContainsString('<script>', $result['user']['name']);
    }

    public function testCleanNormalString(): void
    {
        $input = 'Hello, World!';
        $result = Sanitizer::clean($input);
        $this->assertEquals('Hello, World!', $result);
    }
}
