<?php

require_once __DIR__ . '/backend/src/Support/Database.php';
require_once __DIR__ . '/backend/src/Repositories/BaseRepository.php';
require_once __DIR__ . '/backend/src/Repositories/ProductRepository.php';
require_once __DIR__ . '/backend/src/Repositories/UserRepository.php';
require_once __DIR__ . '/backend/src/Repositories/CategoryRepository.php';

use Procurely\Api\Support\Database;
use Procurely\Api\Repositories\ProductRepository;
use Procurely\Api\Repositories\UserRepository;
use Procurely\Api\Repositories\CategoryRepository;

require_once __DIR__ . '/backend/vendor/autoload.php';

use Dotenv\Dotenv;
Dotenv::createImmutable(__DIR__ . '/backend')->safeLoad();

// 1. Initialize Database
$db = new Database(__DIR__ . '/backend/storage/procurely.sqlite');

// 2. Instantiate Repositories
$productRepo = new ProductRepository($db);
$userRepo = new UserRepository($db);
$categoryRepo = new CategoryRepository($db);

try {
    // --- EXAMPLE 1: Create a Category & Product ---
    $catId = $categoryRepo->create('Premium Tools', 'premium-tools', 'High-end industrial tools');
    
    $catName = 'Premium Tools';
    
    $productId = $productRepo->create([
        'id' => 'drill-xt-500',
        'slug' => 'drill-xt-500',
        'name' => 'Industrial Drill XT-500',
        'short_description' => 'Power drill for heavy duty',
        'category' => $catName,
        'price' => 1250000, // stored as kobo/cents
    ]);

    echo "Product created: " . $productId . "\n";

    // --- EXAMPLE 2: Filter Products by Category ---
    $products = $productRepo->findByCategory($catName);
    foreach ($products as $p) {
        echo "Found: " . $p['name'] . " - N" . ($p['price'] / 100) . "\n";
    }

    // --- EXAMPLE 3: Secure User Retrieval ---
    $user = $userRepo->findByEmail('admin@useprocurely.com');
    if ($user) {
         echo "Welcome back, " . $user['full_name'] . "\n";
    }

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
