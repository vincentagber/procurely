<?php
$host = 'useprocurely.com';
$db   = 'usepwtzr_procurely';
$user = 'usepwtzr_procurely';
$pass = 'Ka8Ucl5P9A)L';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     echo "Connected to database successfully.\n";
     
     $sqlFile = '/Users/macbookpro/Desktop/Procurely/procurely_setup.sql';
     if (!file_exists($sqlFile)) {
         die("SQL file not found at $sqlFile\n");
     }
     
     $sql = file_get_contents($sqlFile);
     
     // Split SQL into individual statements
     // Simple split by ; followed by newline, though not perfect for all cases
     // Better to just execute the whole thing if PDO supports it, but some drivers don't
     
     echo "Executing SQL script...\n";
     $pdo->exec($sql);
     echo "Database updated successfully!\n";
     
} catch (\PDOException $e) {
     die("Database error: " . $e->getMessage() . "\n");
}
