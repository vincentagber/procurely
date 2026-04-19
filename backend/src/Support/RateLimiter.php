<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;

/**
 * Sliding-window rate limiter using the database to persist hits.
 */
final class RateLimiter
{
    private string $prefix;

    public function __construct(
        private readonly Database $database,
        private readonly int $maxRequests,
        private readonly int $windowSeconds,
        string $prefix = 'rl',
    ) {
        $this->prefix = $prefix;
    }

    public function middleware(): \Closure
    {
        return function (ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
            $ip = $this->resolveIp($request);
            $key = sprintf('%s:%s', $this->prefix, $ip);
            $now = time();
            $resetAt = $now + $this->windowSeconds;

            $pdo = $this->database->connection();
            $pdo->beginTransaction();
            try {
                // Stochastic cleanup: Only delete old records 10% of the time to reduce DB load.
                if (random_int(1, 10) === 1) {
                    $pdo->exec('DELETE FROM rate_limits WHERE reset_at < ' . $now);
                }

                $stmt = $pdo->prepare('SELECT hits, reset_at FROM rate_limits WHERE `key` = :key LIMIT 1');
                $stmt->execute(['key' => $key]);
                $row = $stmt->fetch();

                if ($row === false) {
                    $insert = $pdo->prepare('INSERT INTO rate_limits (`key`, hits, reset_at) VALUES (:key, 1, :reset_at)');
                    $insert->execute(['key' => $key, 'reset_at' => $resetAt]);
                    $hits = 1;
                    $currentResetAt = $resetAt;
                } else {
                    $hits = (int) $row['hits'] + 1;
                    $currentResetAt = (int) $row['reset_at'];
                    $update = $pdo->prepare('UPDATE rate_limits SET hits = :hits WHERE `key` = :key');
                    $update->execute(['hits' => $hits, 'key' => $key]);
                }

                $pdo->commit();
            } catch (\Throwable $e) {
                $pdo->rollBack();
                // Fail open to avoid blocking users if DB is struggling, but log in real app
                return $handler->handle($request);
            }

            if ($hits > $this->maxRequests) {
                $response = new Response();
                $retryAfter = max(1, $currentResetAt - $now);
                $body = json_encode([
                    'error' => [
                        'message' => 'Too many requests. Please slow down.',
                        'details' => ['retryAfter' => $retryAfter],
                    ],
                ], JSON_THROW_ON_ERROR);

                $response->getBody()->write($body);

                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withHeader('Retry-After', (string) $retryAfter)
                    ->withHeader('X-RateLimit-Limit', (string) $this->maxRequests)
                    ->withHeader('X-RateLimit-Remaining', '0')
                    ->withStatus(429);
            }

            $response = $handler->handle($request);

            return $response
                ->withHeader('X-RateLimit-Limit', (string) $this->maxRequests)
                ->withHeader('X-RateLimit-Remaining', (string) max(0, $this->maxRequests - $hits));
        };
    }

    private function resolveIp(ServerRequestInterface $request): string
    {
        $serverParams = $request->getServerParams();
        $ip = (string) ($serverParams['REMOTE_ADDR'] ?? '0.0.0.0');

        // Check for common proxy headers (X-Forwarded-For)
        // Note: In highly secure environments, you should only trust this if you know the proxy.
        // For a general fix, we'll take the first IP in the list.
        $forwardedFor = $request->getHeaderLine('X-Forwarded-For');
        if ($forwardedFor !== '') {
            $ips = array_map('trim', explode(',', $forwardedFor));
            $ip = $ips[0] ?? $ip;
        }

        return $ip;
    }
}
