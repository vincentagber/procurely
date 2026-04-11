<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Procurely\Api\Services\AuthService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final class AuthMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly AuthService $authService,
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $authHeader = $request->getHeaderLine('Authorization');
        if (!str_starts_with($authHeader, 'Bearer ')) {
            return $handler->handle($request);
        }

        $token = substr($authHeader, 7);
        $user = $this->authService->resolveToken($token);

        if ($user) {
            $request = $request->withAttribute('user', $user);
        }

        return $handler->handle($request);
    }
}