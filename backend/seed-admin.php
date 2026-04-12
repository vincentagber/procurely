<?php
declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Procurely\Api\Support\Database;

Dotenv::createImmutable(__DIR__)->safeLoad();

$databasePath = $_ENV['DATABASE_PATH'] ?? 'storage/procurely.sqlite';
if (!str_starts_with($databasePath, DIRECTORY_SEPARATOR)) {
    $databasePath = __DIR__ . '/' . ltrim($databasePath, '/');
}

// Boot the Database class — this triggers migration/schema creation
$database = new Database($databasePath);
$pdo = $database->connection();

$email    = 'admin@procurely.com';
$password = 'Apassword123!';
$fullName = 'Procurely Admin';
$uuid     = \Ramsey\Uuid\Uuid::uuid7()->toString();
$now      = (new DateTimeImmutable())->format(DateTimeImmutable::ATOM);

$hash = password_hash($password, PASSWORD_ARGON2ID, [
    'memory_cost' => 65536,
    'time_cost'   => 4,
    'threads'     => 3,
]);

// Remove existing admin if any
$pdo->prepare('DELETE FROM users WHERE email = :email')->execute(['email' => $email]);

// Insert admin user
$pdo->prepare('
    INSERT INTO users (uuid, full_name, email, password_hash, wallet_balance, created_at, updated_at)
    VALUES (:uuid, :full_name, :email, :password_hash, 0, :created_at, :updated_at)
')->execute([
    'uuid'          => $uuid,
    'full_name'     => $fullName,
    'email'         => $email,
    'password_hash' => $hash,
    'created_at'    => $now,
    'updated_at'    => $now,
]);

$userId = (int) $pdo->lastInsertId();

// Fetch admin role
$roleStmt = $pdo->prepare('SELECT id FROM roles WHERE name = :name LIMIT 1');
$roleStmt->execute(['name' => 'admin']);
$role = $roleStmt->fetch(PDO::FETCH_ASSOC);

if (!$role) {
    echo "ERROR: 'admin' role not found in database. Schema may not have run.\n";
    exit(1);
}

// Assign role
$pdo->prepare('
    INSERT OR IGNORE INTO user_roles (user_id, role_id, assigned_at)
    VALUES (:user_id, :role_id, :assigned_at)
')->execute([
    'user_id'     => $userId,
    'role_id'     => $role['id'],
    'assigned_at' => $now,
]);

echo "✅ Admin user created successfully!\n";
echo "   Email:    {$email}\n";
echo "   Password: {$password}\n";
echo "   UUID:     {$uuid}\n";
echo "   Role:     admin\n";
