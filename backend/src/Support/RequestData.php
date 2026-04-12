<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Psr\Http\Message\ServerRequestInterface;

final class RequestData
{
    public static function body(ServerRequestInterface $request): array
    {
        $parsed = $request->getParsedBody();

        if ($parsed === null) {
            return [];
        }

        if (!is_array($parsed) || array_is_list($parsed)) {
            throw new ApiException('Request body must be a JSON object.', 400);
        }

        return (array) Sanitizer::clean($parsed);
    }

    public static function query(ServerRequestInterface $request): array
    {
        return (array) Sanitizer::clean($request->getQueryParams());
    }
}
