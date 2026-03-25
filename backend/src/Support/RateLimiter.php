<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;

/**
 * In-memory sliding-window rate limiter backed by APCu.
 * Falls back to a no-op if APCu is not available (development without apcu extension).
 *
 * CRITICAL-2 FIX: Protects auth endpoints from brute-force and credential-stuffing.
 */
final class RateLimiter
{
    private string $prefix;

    public function __construct(
        private readonly int $maxRequests,
        private readonly int $windowSeconds,
        string $prefix = 'rl',
    ) {
        $this->prefix = $prefix;
    }

    public function middleware(): \Closure
    {
        return function (ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
            if (!extension_loaded('apcu') || !apcu_enabled()) {
                return $handler->handle($request);
            }

            $ip = $this->resolveIp($request);
            $key = sprintf('%s:%s', $this->prefix, $ip);
            $now = time();
            $windowStart = $now - $this->windowSeconds;

            // Retrieve existing request timestamps
            $timestamps = apcu_fetch($key);
            if (!is_array($timestamps)) {
                $timestamps = [];
            }

            // Slide the window: remove timestamps outside the window
            $timestamps = array_filter($timestamps, static fn(int $ts): bool => $ts > $windowStart);
            $timestamps[] = $now;

            apcu_store($key, array_values($timestamps), $this->windowSeconds + 1);

            if (count($timestamps) > $this->maxRequests) {
                $response = new Response();
                $retryAfter = $this->windowSeconds - ($now - min($timestamps));
                $body = json_encode([
                    'error' => [
                        'message' => 'Too many requests. Please slow down.',
                        'details' => [],
                    ],
                ], JSON_THROW_ON_ERROR);

                $response->getBody()->write($body);

                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withHeader('Retry-After', (string) max(1, $retryAfter))
                    ->withHeader('X-RateLimit-Limit', (string) $this->maxRequests)
                    ->withHeader('X-RateLimit-Remaining', '0')
                    ->withStatus(429);
            }

            $response = $handler->handle($request);

            return $response
                ->withHeader('X-RateLimit-Limit', (string) $this->maxRequests)
                ->withHeader('X-RateLimit-Remaining', (string) max(0, $this->maxRequests - count($timestamps)));
        };
    }

    private function resolveIp(ServerRequestInterface $request): string
    {
        $serverParams = $request->getServerParams();

        // Trust X-Forwarded-For only if explicitly configured (behind a trusted proxy)
        // For safety, default to REMOTE_ADDR which cannot be spoofed at the TCP level
        return (string) ($serverParams['REMOTE_ADDR'] ?? '0.0.0.0');
    }
}
