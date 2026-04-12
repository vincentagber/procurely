<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

/**
 * Telemetry and Observability inspired by Brendan Gregg and Kelsey Hightower.
 * Provides structured logging and performance tracking.
 */
final class Telemetry
{
    private static array $timers = [];

    public static function start(string $label): void
    {
        self::$timers[$label] = microtime(true);
    }

    public static function stop(string $label): float
    {
        if (!isset(self::$timers[$label])) {
            return 0.0;
        }

        $duration = microtime(true) - self::$timers[$label];
        unset(self::$timers[$label]);

        return round($duration * 1000, 2); // ms
    }

    public static function log(string $level, string $message, array $context = []): void
    {
        $logEntry = [
            'timestamp' => (new \DateTimeImmutable())->format(\DateTimeImmutable::RFC3339_EXTENDED),
            'level' => strtoupper($level),
            'message' => $message,
            'context' => $context,
            'runtime' => [
                'memory_usage_mb' => round(memory_get_usage() / 1024 / 1024, 2),
                'php_version' => PHP_VERSION,
                'sapi' => PHP_SAPI,
            ]
        ];

        // In a real systems environment, we'd ship this to a collector (Prometheus/Fluentd).
        // For now, we write to a structured log file in storage.
        $logFile = dirname(__DIR__, 2) . '/storage/logs/api-' . date('Y-m-d') . '.log';
        if (!is_dir(dirname($logFile))) {
            mkdir(dirname($logFile), 0755, true);
        }

        file_put_contents($logFile, json_encode($logEntry) . PHP_EOL, FILE_APPEND);
    }

    public static function info(string $message, array $context = []): void
    {
        self::log('info', $message, $context);
    }

    public static function error(string $message, array $context = []): void
    {
        self::log('error', $message, $context);
    }
}
