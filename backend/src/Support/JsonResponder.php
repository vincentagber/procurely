<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Psr\Http\Message\ResponseInterface;

final class JsonResponder
{
    public static function success(ResponseInterface $response, array $data, int $status = 200): ResponseInterface
    {
        return self::write($response, ['data' => $data], $status);
    }

    public static function error(ResponseInterface $response, string $message, int $status, array $details = []): ResponseInterface
    {
        return self::write(
            $response,
            [
                'error' => [
                    'message' => $message,
                    'details' => $details,
                ],
            ],
            $status,
        );
    }

    private static function write(ResponseInterface $response, array $payload, int $status): ResponseInterface
    {
        $response->getBody()->write(json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}
