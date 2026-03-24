<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Psr\Http\Message\ServerRequestInterface;

final class RequestData
{
    public static function body(ServerRequestInterface $request): array
    {
        $parsed = $request->getParsedBody();

        return is_array($parsed) ? $parsed : [];
    }

    public static function query(ServerRequestInterface $request): array
    {
        return $request->getQueryParams();
    }
}
