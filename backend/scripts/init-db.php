<?php

declare(strict_types=1);

use Dotenv\Dotenv;
use Procurely\Api\Support\Database;

require dirname(__DIR__) . '/vendor/autoload.php';

$rootPath = dirname(__DIR__);

if (file_exists($rootPath . '/.env')) {
    Dotenv::createImmutable($rootPath)->safeLoad();
}

$databasePath = $_ENV['DATABASE_PATH'] ?? 'storage/procurely.sqlite';

if (!str_starts_with($databasePath, DIRECTORY_SEPARATOR)) {
    $databasePath = $rootPath . '/' . ltrim($databasePath, '/');
}

$database = new Database($databasePath);
$database->connection();

echo sprintf("Database ready at %s\n", $databasePath);
