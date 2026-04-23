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
            $isMysql = ($_ENV['DB_DRIVER'] ?? 'sqlite') === 'mysql';
            $sql = $isMysql 
                ? "INSERT INTO rate_limits (`key`, hits, reset_at) 
                   VALUES (:key, 1, :reset_at) 
                   ON DUPLICATE KEY UPDATE hits = hits + 1"
                : "INSERT INTO rate_limits (`key`, hits, reset_at) 
                   VALUES (:key, 1, :reset_at) 
                   ON CONFLICT(`key`) DO UPDATE SET hits = hits + 1";

            try {
                // Stochastic cleanup: Only delete old records 5% of the time to reduce DB load.
                if (random_int(1, 20) === 1) {
                    $pdo->exec('DELETE FROM rate_limits WHERE reset_at < ' . $now);
                }

                $stmt = $pdo->prepare($sql);
                $stmt->execute(['key' => $key, 'reset_at' => $resetAt]);

                // Fetch the updated count
                $stmt = $pdo->prepare('SELECT hits, reset_at FROM rate_limits WHERE `key` = :key LIMIT 1');
                $stmt->execute(['key' => $key]);
                $row = $stmt->fetch();
                $hits = (int) $row['hits'];
                $currentResetAt = (int) $row['reset_at'];
            } catch (\Throwable $e) {
                // Fail open
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
        
        // Priority list of headers for IP detection
        $ipSources = [
            'HTTP_X_FORWARDED_FOR',
            'HTTP_CLIENT_IP',
            'HTTP_X_REAL_IP',
            'REMOTE_ADDR'
        ];

        foreach ($ipSources as $source) {
            $ip = (string) ($serverParams[$source] ?? '');
            if ($ip !== '') {
                // Handle comma-separated lists from proxies
                $parts = explode(',', $ip);
                return trim($parts[0]);
            }
        }

        // Check PSR-7 headers as fallback if server params don't have them
        $forwardedFor = $request->getHeaderLine('X-Forwarded-For');
        if ($forwardedFor !== '') {
            $ips = explode(',', $forwardedFor);
            return trim($ips[0]);
        }

        return (string) ($serverParams['REMOTE_ADDR'] ?? '0.0.0.0');
    }
}
