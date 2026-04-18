<?php

declare(strict_types=1);

use Dotenv\Dotenv;
use Procurely\Api\Services\AuthService;
use Procurely\Api\Services\CartService;
use Procurely\Api\Services\CatalogService;
use Procurely\Api\Services\EngagementService;
use Procurely\Api\Services\OrderService;
use Procurely\Api\Support\ApiException;
use Procurely\Api\Support\ContentStore;
use Procurely\Api\Support\Database;
use Procurely\Api\Support\JsonResponder;
use Procurely\Api\Support\RateLimiter;
use Procurely\Api\Support\RequestData;
use Procurely\Api\Support\Storage;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Factory\AppFactory;
use Slim\Psr7\Response;

require __DIR__ . '/../vendor/autoload.php';

$rootPath = dirname(__DIR__);

if (file_exists($rootPath . '/.env')) {
    Dotenv::createImmutable($rootPath)->safeLoad();
}

$debug = filter_var($_ENV['APP_DEBUG'] ?? 'false', FILTER_VALIDATE_BOOL);
$frontendUrl = $_ENV['FRONTEND_URL'] ?? 'http://localhost:3000';
$databasePath = $_ENV['DATABASE_PATH'] ?? 'storage/procurely.sqlite';

if (!str_starts_with($databasePath, DIRECTORY_SEPARATOR)) {
    $databasePath = $rootPath . '/' . ltrim($databasePath, '/');
}

$database = new Database($databasePath);
$contentStore = new ContentStore(dirname($rootPath) . '/shared/content/procurely.json', $database);
$catalogService = new CatalogService($database, $contentStore);
$emailService = new \Procurely\Api\Support\EmailService($rootPath);
$authService = new AuthService($database, $emailService, $debug);
$notificationService = new \Procurely\Api\Services\NotificationService($database);
$cartService = new CartService($database, $contentStore);
$paymentProcessor = new \Procurely\Api\Support\PaystackPaymentProcessor();
$emailService = new \Procurely\Api\Support\EmailService($rootPath);
$orderService = new OrderService($database, $cartService, $paymentProcessor, $emailService, $notificationService);
$engagementService = new EngagementService($database);
$wishlistService = new \Procurely\Api\Services\WishlistService($database, $contentStore);
$accountService = new \Procurely\Api\Services\AccountService($database);
$storage = new Storage($rootPath);
$adminService = new \Procurely\Api\Services\AdminService($database, $contentStore, $storage);

$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->add(new \Procurely\Api\Support\AuthMiddleware($authService));

// ─── Direct limits for intensive operations ──────────────────────────────────
$authRateLimit = (new RateLimiter($database, 10, 60, 'auth'))->middleware();
$orderRateLimit = (new RateLimiter($database, 5, 60, 'order'))->middleware();
$searchRateLimit = (new RateLimiter($database, 30, 60, 'search'))->middleware();

// ─── Middleware ──────────────────────────────────────────────────────────────
$adminMiddleware = function (ServerRequestInterface $request, $handler) use ($authService): ResponseInterface {
    $authHeader = $request->getHeaderLine('Authorization');
    $token = str_starts_with($authHeader, 'Bearer ') ? substr($authHeader, 7) : '';

    if ($token === '') {
        throw new ApiException('Authorization token required.', 401);
    }

    $user = $authService->resolveToken($token);
    if (!$user || $user['role'] !== 'admin') {
        throw new ApiException('Forbidden: Admin access only.', 403);
    }

    return $handler->handle($request);
};

// ─── API Routes Group ──────────────────────────────────────────────────────────
$app->group('/api', function (\Slim\Routing\RouteCollectorProxy $group) use (
    $catalogService, $authService, $notificationService, $accountService,
    $cartService, $wishlistService, $orderService, $paymentProcessor,
    $adminService, $engagementService, $adminMiddleware, $authRateLimit,
    $orderRateLimit, $searchRateLimit, $database
) {
    // ─── Health check ─────────────────────────────────────────────────────────────
    $group->get('', static function (ServerRequestInterface $request, ResponseInterface $response): ResponseInterface {
        return JsonResponder::success($response, ['message' => 'Procurely API is running.']);
    });

    // ─── Catalog ───────────────────────────────────────────────────────────────────
    $group->get('/homepage', static function (ServerRequestInterface $request, ResponseInterface $response) use ($catalogService): ResponseInterface {
        return JsonResponder::success($response, $catalogService->homepage());
    });

    $group->get('/products', static function (ServerRequestInterface $request, ResponseInterface $response) use ($catalogService): ResponseInterface {
        return JsonResponder::success($response, $catalogService->listProducts(RequestData::query($request)));
    })->add($searchRateLimit);

    $group->get('/products/{slug}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($catalogService): ResponseInterface {
        return JsonResponder::success($response, $catalogService->productBySlug((string) ($args['slug'] ?? '')));
    });

    // ─── Auth ──────────────────────────────────────────────────────────────────────
    $group->post('/auth/register', static function (ServerRequestInterface $request, ResponseInterface $response) use ($authService): ResponseInterface {
        $data = $authService->register(RequestData::body($request));
        $token = $data['token'] ?? '';
        
        $cookie = sprintf('procurely_auth_token=%s; Max-Age=2592000; Path=/; HttpOnly; SameSite=Lax; Secure', $token);
        
        return JsonResponder::success($response->withHeader('Set-Cookie', $cookie), $data, 201);
    })->add($authRateLimit);

    $group->post('/auth/login', static function (ServerRequestInterface $request, ResponseInterface $response) use ($authService): ResponseInterface {
        $data = $authService->login(RequestData::body($request));
        $token = $data['token'] ?? '';
        
        $cookie = sprintf('procurely_auth_token=%s; Max-Age=2592000; Path=/; HttpOnly; SameSite=Lax; Secure', $token);

        return JsonResponder::success($response->withHeader('Set-Cookie', $cookie), $data);
    })->add($authRateLimit);

    $group->post('/auth/forgot-password', static function (ServerRequestInterface $request, ResponseInterface $response) use ($authService): ResponseInterface {
        return JsonResponder::success($response, $authService->forgotPassword(RequestData::body($request)));
    })->add($authRateLimit);

    $group->post('/auth/logout', static function (ServerRequestInterface $request, ResponseInterface $response) use ($authService, $database): ResponseInterface {
        $clearCookie = 'procurely_auth_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Secure';
        $response = $response->withHeader('Set-Cookie', $clearCookie);

        $user = $request->getAttribute('user');
        if (!$user) {
            return JsonResponder::success($response, ['message' => 'Logged out successfully.']);
        }

        $authHeader = $request->getHeaderLine('Authorization');
        $token = str_starts_with($authHeader, 'Bearer ') ? substr($authHeader, 7) : '';
        
        if ($token === '') {
            $cookies = $request->getCookieParams();
            $token = (string) ($cookies['procurely_auth_token'] ?? '');
        }

        $result = $authService->logout($database->connection(), $token);

        return JsonResponder::success($response, $result);
    });

    $group->get('/auth/me', static function (ServerRequestInterface $request, ResponseInterface $response): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) {
            throw new ApiException('Authentication required.', 401);
        }

        return JsonResponder::success($response, [
            'user' => [
                'id' => $user['uuid'],
                'fullName' => $user['full_name'],
                'email' => $user['email'],
                'roles' => $user['roles'],
                'permissions' => $user['permissions'],
                'walletBalance' => (int) ($user['wallet_balance'] ?? 0),
            ]
        ]);
    })->add($authRateLimit);

    $group->patch('/auth/profile', static function (ServerRequestInterface $request, ResponseInterface $response) use ($authService): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) {
            throw new ApiException('Authentication required.', 401);
        }

        $body = RequestData::body($request);
        $updated = $authService->updateProfile((int) $user['id'], $body);

        return JsonResponder::success($response, [
            'user' => $updated,
            'message' => 'Profile updated successfully.'
        ]);
    })->add($authRateLimit);

    // ─── Notifications ─────────────────────────────────────────────────────────────
    $group->get('/notifications', static function (ServerRequestInterface $request, ResponseInterface $response) use ($notificationService): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) {
            throw new ApiException('Authentication required.', 401);
        }

        return JsonResponder::success($response, $notificationService->getUserNotifications((int) $user['id']));
    });

    $group->patch('/notifications/{id}/read', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($notificationService): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) {
            throw new ApiException('Authentication required.', 401);
        }

        $notificationService->markAsRead((int) $user['id'], (int) $args['id']);
        return JsonResponder::success($response, ['message' => 'Notification marked as read.']);
    });

    // ─── Account & Company ────────────────────────────────────────────────────────
    $group->get('/account/company', static function (ServerRequestInterface $request, ResponseInterface $response) use ($accountService): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) throw new ApiException('Authentication required.', 401);

        return JsonResponder::success($response, $accountService->getCompanyInfo($user['uuid']));
    });

    $group->patch('/account/company', static function (ServerRequestInterface $request, ResponseInterface $response) use ($accountService): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) throw new ApiException('Authentication required.', 401);

        return JsonResponder::success($response, $accountService->updateCompany($user['uuid'], RequestData::body($request)));
    });

    $group->get('/account/addresses', static function (ServerRequestInterface $request, ResponseInterface $response) use ($accountService): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) throw new ApiException('Authentication required.', 401);

        return JsonResponder::success($response, $accountService->getAddresses($user['uuid']));
    });

    $group->post('/account/addresses', static function (ServerRequestInterface $request, ResponseInterface $response) use ($accountService): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) throw new ApiException('Authentication required.', 401);

        return JsonResponder::success($response, $accountService->addAddress($user['uuid'], RequestData::body($request)));
    });

    $group->delete('/account/addresses/{id}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($accountService): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) throw new ApiException('Authentication required.', 401);

        return JsonResponder::success($response, $accountService->deleteAddress($user['uuid'], (int) $args['id']));
    });

    $group->get('/account/payment-methods', static function (ServerRequestInterface $request, ResponseInterface $response) use ($accountService): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) throw new ApiException('Authentication required.', 401);

        return JsonResponder::success($response, $accountService->getPaymentMethods($user['uuid']));
    });

    // ─── Cart ──────────────────────────────────────────────────────────────────────
    $group->get('/cart/{token}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($cartService): ResponseInterface {
        return JsonResponder::success($response, $cartService->getCart((string) ($args['token'] ?? '')));
    });

    $group->post('/cart/items', static function (ServerRequestInterface $request, ResponseInterface $response) use ($cartService): ResponseInterface {
        return JsonResponder::success($response, $cartService->addItem(RequestData::body($request)), 201);
    });

    $group->patch('/cart/items/{id}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($cartService): ResponseInterface {
        return JsonResponder::success($response, $cartService->updateItem((int) ($args['id'] ?? 0), RequestData::body($request)));
    });

    $group->delete('/cart/items/{id}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($cartService): ResponseInterface {
        $token = (string) (RequestData::query($request)['token'] ?? '');
        return JsonResponder::success($response, $cartService->removeItem((int) ($args['id'] ?? 0), $token));
    });

    // ─── Wishlist ──────────────────────────────────────────────────────────────────
    $group->get('/wishlist/{token}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($wishlistService): ResponseInterface {
        return JsonResponder::success($response, $wishlistService->getWishlist((string) ($args['token'] ?? '')));
    });

    $group->post('/wishlist/items', static function (ServerRequestInterface $request, ResponseInterface $response) use ($wishlistService): ResponseInterface {
        return JsonResponder::success($response, $wishlistService->addItem(RequestData::body($request)), 201);
    });

    $group->delete('/wishlist/items/{productId}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($wishlistService): ResponseInterface {
        $token = (string) (RequestData::query($request)['token'] ?? '');
        return JsonResponder::success($response, $wishlistService->removeItem((string) ($args['productId'] ?? ''), $token));
    });

    // ─── Orders ────────────────────────────────────────────────────────────────────
    $group->post('/checkout', static function (ServerRequestInterface $request, ResponseInterface $response) use ($orderService, $authService): ResponseInterface {
        $authHeader = $request->getHeaderLine('Authorization');
        $token = str_starts_with($authHeader, 'Bearer ') ? substr($authHeader, 7) : '';
        $userId = null;
        if ($token !== '') {
            $user = $authService->resolveToken($token);
            if ($user) $userId = (int) $user['id'];
        }
        return JsonResponder::success($response, $orderService->checkout(RequestData::body($request), $userId), 201);
    })->add($orderRateLimit);

    $group->post('/orders', static function (ServerRequestInterface $request, ResponseInterface $response) use ($orderService, $authService): ResponseInterface {
        $authHeader = $request->getHeaderLine('Authorization');
        $token = str_starts_with($authHeader, 'Bearer ') ? substr($authHeader, 7) : '';
        $userId = null;
        if ($token !== '') {
            $user = $authService->resolveToken($token);
            if ($user) $userId = (int) $user['id'];
        }
        return JsonResponder::success($response, $orderService->createOrder(RequestData::body($request), $userId), 201);
    })->add($orderRateLimit);

    // ─── Wallet ────────────────────────────────────────────────────────────────────
    $group->post('/wallet/fund', static function (ServerRequestInterface $request, ResponseInterface $response) use ($orderService): ResponseInterface {
        $user = $request->getAttribute('user');
        if (!$user) throw new ApiException('Authentication required.', 401);
        $body = RequestData::body($request);
        $amount = (int) ($body['amount'] ?? 0);
        if ($amount <= 0) throw new ApiException('Invalid funding amount.', 400);
        return JsonResponder::success($response, $orderService->initialiseWalletFunding((int) $user['id'], $amount));
    })->add($orderRateLimit);

    // ─── Payments ──────────────────────────────────────────────────────────────────
    $group->post('/payments/create-intent', static function (ServerRequestInterface $request, ResponseInterface $response) use ($paymentProcessor): ResponseInterface {
        $data = RequestData::body($request);
        $orderNumber = $data['orderNumber'] ?? '';
        $amount = (int) ($data['amount'] ?? 0);
        if ($orderNumber === '' || $amount <= 0) throw new ApiException('Invalid payment data.', 400);
        return JsonResponder::success($response, $paymentProcessor->createPaymentIntent($orderNumber, $amount));
    });

    $group->post('/payments/confirm-intent', static function (ServerRequestInterface $request, ResponseInterface $response) use ($paymentProcessor): ResponseInterface {
        $data = RequestData::body($request);
        $paymentIntentId = $data['paymentIntentId'] ?? '';
        if ($paymentIntentId === '') throw new ApiException('Payment intent ID required.', 400);
        return JsonResponder::success($response, ['success' => $paymentProcessor->confirmPaymentIntent($paymentIntentId)]);
    });

    $group->post('/webhooks/stripe', static function (ServerRequestInterface $request, ResponseInterface $response) use ($paymentProcessor, $orderService): ResponseInterface {
        $payload = (string) $request->getBody();
        $signature = $request->getHeaderLine('stripe-signature');
        $event = $paymentProcessor->processWebhook($payload, $signature);
        if ($event['event_type'] === 'payment_intent.succeeded') {
            $paymentIntent = $event['event_data'];
            $orderNumber = $paymentIntent->metadata->order_number ?? '';
            if ($orderNumber !== '') $orderService->markOrderPaid($orderNumber);
        }
        return $response->withStatus(200);
    });

    $group->post('/webhooks/paystack', static function (ServerRequestInterface $request, ResponseInterface $response) use ($orderService): ResponseInterface {
        $payload = (string) $request->getBody();
        $signature = $request->getHeaderLine('x-paystack-signature');
        $paystack = new \Procurely\Api\Support\Paystack();
        if (!$paystack->isValidSignature($payload, $signature)) throw new ApiException('Invalid signature', 401);
        $data = json_decode($payload, true);
        return JsonResponder::success($response, $orderService->handleWebhook($data));
    });

    $group->get('/orders/{orderNumber}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($orderService, $authService): ResponseInterface {
        $cartToken = (string) (RequestData::query($request)['cartToken'] ?? '');
        $email = (string) (RequestData::query($request)['email'] ?? '');
        $authHeader = $request->getHeaderLine('Authorization');
        $token = str_starts_with($authHeader, 'Bearer ') ? substr($authHeader, 7) : '';
        $isAdmin = false;
        if ($token !== '') {
            $user = $authService->resolveToken($token);
            if ($user && $user['role'] === 'admin') $isAdmin = true;
        }
        return JsonResponder::success($response, $orderService->findByOrderNumber((string) ($args['orderNumber'] ?? ''), $cartToken, $email, $isAdmin));
    });

    $group->get('/account/orders', static function (ServerRequestInterface $request, ResponseInterface $response) use ($orderService, $authService): ResponseInterface {
        $authHeader = $request->getHeaderLine('Authorization');
        $token = str_starts_with($authHeader, 'Bearer ') ? substr($authHeader, 7) : '';
        if ($token === '') throw new ApiException('Authorization token required.', 401);
        $user = $authService->resolveToken($token);
        if (!$user) throw new ApiException('Invalid or expired token.', 401);
        return JsonResponder::success($response, $orderService->getUserOrders((int) $user['id']));
    });

    // ─── Admin ────────────────────────────────────────────────────────────────────
    $group->get('/admin/stats', static function (ServerRequestInterface $request, ResponseInterface $response) use ($adminService): ResponseInterface {
        return JsonResponder::success($response, $adminService->getStats());
    })->add($adminMiddleware);

    $group->get('/admin/orders', static function (ServerRequestInterface $request, ResponseInterface $response) use ($adminService): ResponseInterface {
        $params = RequestData::query($request);
        return JsonResponder::success($response, $adminService->listOrders((int) ($params['limit'] ?? 50), (int) ($params['offset'] ?? 0)));
    })->add($adminMiddleware);

    $group->get('/admin/users', static function (ServerRequestInterface $request, ResponseInterface $response) use ($adminService): ResponseInterface {
        $params = RequestData::query($request);
        return JsonResponder::success($response, $adminService->listUsers((int) ($params['limit'] ?? 50), (int) ($params['offset'] ?? 0)));
    })->add($adminMiddleware);

    $group->delete('/admin/users/{uuid}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($adminService, $authService): ResponseInterface {
        $authHeader = $request->getHeaderLine('Authorization');
        $token = substr($authHeader, 7);
        $admin = $authService->resolveToken($token);
        return JsonResponder::success($response, $adminService->deleteUser((string) ($args['uuid'] ?? ''), (string) ($admin['uuid'] ?? '')));
    })->add($adminMiddleware);

    $group->patch('/admin/orders/{orderNumber}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($adminService): ResponseInterface {
        $body = RequestData::body($request);
        $status = (string) ($body['status'] ?? '');
        return JsonResponder::success($response, $adminService->updateOrderStatus((string) ($args['orderNumber'] ?? ''), $status));
    })->add($adminMiddleware);

    // ─── Admin Products ──────────────────────────────────────────────────────────
    $group->group('/admin', function (\Slim\Routing\RouteCollectorProxy $adminGroup) use ($adminService) {
        $adminGroup->get('/products', function (ServerRequestInterface $request, ResponseInterface $response) use ($adminService) {
            return JsonResponder::success($response, $adminService->listProducts());
        });

        $adminGroup->post('/images/upload', function (ServerRequestInterface $request, ResponseInterface $response) use ($adminService) {
            $files = $request->getUploadedFiles();
            if (empty($files['image'])) throw new ApiException('No image file uploaded.', 400);
            $file = $files['image'];
            $fileArray = [
                'name' => $file->getClientFilename(),
                'type' => $file->getClientMediaType(),
                'tmp_name' => $file->getFilePath(),
                'error' => $file->getError(),
                'size' => $file->getSize(),
            ];
            return JsonResponder::success($response, $adminService->uploadImage($fileArray));
        });

        $adminGroup->post('/products', function (ServerRequestInterface $request, ResponseInterface $response) use ($adminService) {
            return JsonResponder::success($response, $adminService->saveProduct(RequestData::body($request)), 201);
        });
    })->add($adminMiddleware);

    $group->put('/admin/products/{id}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($adminService): ResponseInterface {
        $body = RequestData::body($request);
        $body['id'] = (string) ($args['id'] ?? '');
        return JsonResponder::success($response, $adminService->saveProduct($body));
    })->add($adminMiddleware);

    $group->delete('/admin/products/{id}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($adminService): ResponseInterface {
        return JsonResponder::success($response, $adminService->deleteProduct((string) ($args['id'] ?? '')));
    })->add($adminMiddleware);

    // ─── Engagement ────────────────────────────────────────────────────────────────
    $group->post('/quotes', static function (ServerRequestInterface $request, ResponseInterface $response) use ($engagementService): ResponseInterface {
        return JsonResponder::success($response, $engagementService->requestQuote(RequestData::body($request)), 201);
    })->add($orderRateLimit);

    $group->post('/newsletter', static function (ServerRequestInterface $request, ResponseInterface $response) use ($engagementService): ResponseInterface {
        return JsonResponder::success($response, $engagementService->subscribe(RequestData::body($request)), 201);
    })->add($authRateLimit);
});

// ─── Error handler ─────────────────────────────────────────────────────────────
$errorMiddleware = $app->addErrorMiddleware($debug, true, true);
$errorMiddleware->setDefaultErrorHandler(
    static function (
        ServerRequestInterface $request,
        \Throwable $exception,
        bool $displayErrorDetails,
    ): ResponseInterface {
        $response = new Response();

        if ($exception instanceof ApiException) {
            return JsonResponder::error($response, $exception->getMessage(), $exception->statusCode(), $exception->details());
        }

        if ($exception instanceof \Slim\Exception\HttpException) {
            return JsonResponder::error($response, $exception->getMessage(), (int) $exception->getCode(), [
                'type' => $exception::class,
            ]);
        }

        $details = $displayErrorDetails ? [
            'type' => $exception::class,
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
        ] : [];

        return JsonResponder::error($response, 'Unexpected server error.', 500, $details);
    }
);

// ─── CORS Middleware ──────────────────────────────────────────────────────────
// This must be added LAST to wrap everything, including the ErrorMiddleware,
// ensuring CORS headers are present even on error responses.
$app->add(function (ServerRequestInterface $request, $handler) use ($frontendUrl, $debug): ResponseInterface {
    $origin = $request->getHeaderLine('Origin');
    $isLocal = str_contains($origin, 'localhost') || str_contains($origin, '127.0.0.1');
    $allowedOrigins = [$frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'];
    $responseOrigin = ($isLocal && $debug) ? $origin : (in_array($origin, $allowedOrigins, true) ? $origin : $frontendUrl);

    if ($request->getMethod() === 'OPTIONS') {
        $response = new Response();
        return $response
            ->withStatus(204)
            ->withHeader('Access-Control-Allow-Origin', $responseOrigin)
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Credentials', 'true')
            ->withHeader('Vary', 'Origin');
    }

    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', $responseOrigin)
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Credentials', 'true')
        ->withHeader('Vary', 'Origin');
});

$app->run();
