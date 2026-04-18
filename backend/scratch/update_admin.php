<?php
$dbPath = __DIR__ . '/../storage/procurely.sqlite';
$pdo = new PDO('sqlite:' . $dbPath);

$email = 'admin@procurely.com';
$password = 'Apassword123!';
$hash = password_hash($password, PASSWORD_ARGON2ID, [
    'memory_cost' => 65536,
    'time_cost' => 4,
    'threads' => 3
]);

$stmt = $pdo->prepare('UPDATE users SET email = :email, password_hash = :hash WHERE id = 1');
$stmt->execute(['email' => $email, 'hash' => $hash]);

echo "Updated admin user to $email with password $password\n";
