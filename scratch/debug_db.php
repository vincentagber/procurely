<?php
require __DIR__ . '/../backend/vendor/autoload.php';
use Dotenv\Dotenv;
use Procurely\Api\Support\Database;

$rootPath = dirname(__DIR__) . '/backend';
Dotenv::createImmutable($rootPath)->safeLoad();

$databasePath = $_ENV['DATABASE_PATH'] ?? 'storage/procurely.sqlite';
$db = new Database($databasePath);
try {
    $db->connection();
    echo "Success!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    // echo "Trace: " . $e->getTraceAsString() . "\n";
}
