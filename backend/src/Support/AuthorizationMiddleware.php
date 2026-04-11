<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;

final class AuthorizationMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly array $requiredPermissions,
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $user = $request->getAttribute('user');
        if (!$user) {
            return JsonResponder::error(new Response(), 'Authentication required', 401);
        }

        $userPermissions = $user['permissions'] ?? [];
        foreach ($this->requiredPermissions as $permission) {
            if (!in_array($permission, $userPermissions)) {
                return JsonResponder::error(new Response(), 'Insufficient permissions', 403);
            }
        }

        return $handler->handle($request);
    }
}