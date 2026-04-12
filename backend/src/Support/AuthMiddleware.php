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
        $token = '';

        if (str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        } else {
            // Check cookies as fallback (allows HttpOnly session management)
            $cookies = $request->getCookieParams();
            $token = (string) ($cookies['procurely_auth_token'] ?? '');
        }

        if ($token === '') {
            return $handler->handle($request);
        }

        $user = $this->authService->resolveToken($token);

        if ($user) {
            $request = $request->withAttribute('user', $user);
        }

        return $handler->handle($request);
    }
}