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

$contentStore = new ContentStore(dirname($rootPath) . '/shared/content/procurely.json');
$database = new Database($databasePath);
$catalogService = new CatalogService($contentStore);
$authService = new AuthService($database, $debug);
$cartService = new CartService($database, $contentStore);
$orderService = new OrderService($database, $cartService);
$engagementService = new EngagementService($database);

$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->options('/{routes:.+}', static fn (ServerRequestInterface $request, ResponseInterface $response): ResponseInterface => $response);

// ─── CORS ─────────────────────────────────────────────────────────────────────
// MEDIUM-10 FIX: Validate origin against allowlist instead of blindly echoing.
$app->add(function (ServerRequestInterface $request, $handler) use ($frontendUrl): ResponseInterface {
    $response = $request->getMethod() === 'OPTIONS' ? new Response() : $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', $frontendUrl)
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Credentials', 'true')
        ->withHeader('Vary', 'Origin');
});

// ─── Rate limiter helper closure ───────────────────────────────────────────────
/**
 * Apply a tight rate limit to a single route group.
 * CRITICAL-2 FIX: Auth endpoints limited to 10 req/min per IP.
 */
$authRateLimit = (new RateLimiter(10, 60, 'auth'))->middleware();

// ─── Health ────────────────────────────────────────────────────────────────────
$app->get('/api/health', static function (ServerRequestInterface $request, ResponseInterface $response): ResponseInterface {
    return JsonResponder::success($response, ['status' => 'ok']);
});

// ─── Catalog ───────────────────────────────────────────────────────────────────
$app->get('/api/homepage', static function (ServerRequestInterface $request, ResponseInterface $response) use ($catalogService): ResponseInterface {
    return JsonResponder::success($response, $catalogService->homepage());
});

$app->get('/api/products', static function (ServerRequestInterface $request, ResponseInterface $response) use ($catalogService): ResponseInterface {
    return JsonResponder::success($response, $catalogService->listProducts(RequestData::query($request)));
});

$app->get('/api/products/{slug}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($catalogService): ResponseInterface {
    return JsonResponder::success($response, $catalogService->productBySlug((string) ($args['slug'] ?? '')));
});

// ─── Auth (rate-limited) ───────────────────────────────────────────────────────
$app->post('/api/auth/register', static function (ServerRequestInterface $request, ResponseInterface $response) use ($authService): ResponseInterface {
    return JsonResponder::success($response, $authService->register(RequestData::body($request)), 201);
})->add($authRateLimit);

$app->post('/api/auth/login', static function (ServerRequestInterface $request, ResponseInterface $response) use ($authService): ResponseInterface {
    return JsonResponder::success($response, $authService->login(RequestData::body($request)));
})->add($authRateLimit);

$app->post('/api/auth/forgot-password', static function (ServerRequestInterface $request, ResponseInterface $response) use ($authService): ResponseInterface {
    return JsonResponder::success($response, $authService->forgotPassword(RequestData::body($request)));
})->add($authRateLimit);

// MEDIUM-8 FIX: Logout endpoint to invalidate token.
$app->post('/api/auth/logout', static function (ServerRequestInterface $request, ResponseInterface $response) use ($authService, $database): ResponseInterface {
    $authHeader = $request->getHeaderLine('Authorization');
    $token = str_starts_with($authHeader, 'Bearer ') ? substr($authHeader, 7) : '';

    if ($token === '') {
        throw new ApiException('Authorization token required.', 401);
    }

    return JsonResponder::success($response, $authService->logout($database->connection(), $token));
});

// ─── Cart ──────────────────────────────────────────────────────────────────────
$app->get('/api/cart/{token}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($cartService): ResponseInterface {
    return JsonResponder::success($response, $cartService->getCart((string) ($args['token'] ?? '')));
});

$app->post('/api/cart/items', static function (ServerRequestInterface $request, ResponseInterface $response) use ($cartService): ResponseInterface {
    return JsonResponder::success($response, $cartService->addItem(RequestData::body($request)), 201);
});

$app->patch('/api/cart/items/{id}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($cartService): ResponseInterface {
    return JsonResponder::success($response, $cartService->updateItem((int) ($args['id'] ?? 0), RequestData::body($request)));
});

$app->delete('/api/cart/items/{id}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($cartService): ResponseInterface {
    $token = (string) (RequestData::query($request)['token'] ?? '');

    return JsonResponder::success($response, $cartService->removeItem((int) ($args['id'] ?? 0), $token));
});

// ─── Orders ────────────────────────────────────────────────────────────────────
$app->post('/api/checkout', static function (ServerRequestInterface $request, ResponseInterface $response) use ($orderService): ResponseInterface {
    return JsonResponder::success($response, $orderService->checkout(RequestData::body($request)), 201);
});

// HIGH-4 FIX: cartToken query param now required to match the order before returning PII.
$app->get('/api/orders/{orderNumber}', static function (ServerRequestInterface $request, ResponseInterface $response, array $args) use ($orderService): ResponseInterface {
    $cartToken = (string) (RequestData::query($request)['cartToken'] ?? '');

    return JsonResponder::success($response, $orderService->findByOrderNumber(
        (string) ($args['orderNumber'] ?? ''),
        $cartToken,
    ));
});

// ─── Engagement ────────────────────────────────────────────────────────────────
$app->post('/api/quotes', static function (ServerRequestInterface $request, ResponseInterface $response) use ($engagementService): ResponseInterface {
    return JsonResponder::success($response, $engagementService->requestQuote(RequestData::body($request)), 201);
});

$app->post('/api/newsletter', static function (ServerRequestInterface $request, ResponseInterface $response) use ($engagementService): ResponseInterface {
    return JsonResponder::success($response, $engagementService->subscribe(RequestData::body($request)), 201);
});

// ─── Error handler ─────────────────────────────────────────────────────────────
$errorMiddleware = $app->addErrorMiddleware($debug, true, true);
$errorMiddleware->setDefaultErrorHandler(
    static function (
        ServerRequestInterface $request,
        Throwable $exception,
        bool $displayErrorDetails,
    ): ResponseInterface {
        $response = new Response();

        if ($exception instanceof ApiException) {
            return JsonResponder::error($response, $exception->getMessage(), $exception->statusCode(), $exception->details());
        }

        // CRITICAL-1 related: Never leak exception class or stack traces in production.
        $details = $displayErrorDetails ? ['type' => $exception::class] : [];

        return JsonResponder::error($response, 'Unexpected server error.', 500, $details);
    }
);

$app->run();
