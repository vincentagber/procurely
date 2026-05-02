<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Procurely\Api\Services\AuthService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;

final class AdminMiddleware implements MiddlewareInterface
{
    public function __construct(
        private readonly AuthService $authService,
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $user = $request->getAttribute('user');

        if (!$user) {
            $authHeader = $request->getHeaderLine('Authorization');
            $token = str_starts_with($authHeader, 'Bearer ') ? substr($authHeader, 7) : '';

            if ($token === '') {
                return JsonResponder::error(new Response(), 'Authorization token required.', 401);
            }

            $user = $this->authService->resolveToken($token);
        }

        if (!$user || !isset($user['roles']) || !in_array('admin', (array) $user['roles'], true)) {
            return JsonResponder::error(new Response(), 'Forbidden: Admin access only.', 403);
        }

        return $handler->handle($request);
    }
}
