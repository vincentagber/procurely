<?php

declare(strict_types=1);

namespace Procurely\Api\Support;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;

/**
 * Authorization Middleware
 * 
 * Enforces role-based permissions on API endpoints.
 * Usage: ->add(new AuthorizationMiddleware(['order.read.all'], ['admin', 'support']))
 * 
 * Permission check: User must have ALL required permissions
 * Role check: User must have at least ONE of the required roles
 * Admin role bypasses all permission checks
 */
final class AuthorizationMiddleware implements MiddlewareInterface
{
    /**
     * @param array $requiredPermissions Array of permission names required
     * @param array $requiredRoles Array of role names that can access (optional, if empty uses permissions)
     * @param bool $requireOwnership If true, user can only access their own resources
     */
    public function __construct(
        private readonly array $requiredPermissions = [],
        private readonly array $requiredRoles = [],
        private readonly bool $requireOwnership = false,
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $user = $request->getAttribute('user');
        
        // Authentication check
        if (!$user) {
            return JsonResponder::error(new Response(), 'Authentication required', 401);
        }

        $userRoles = $user['roles'] ?? [];
        $userPermissions = $user['permissions'] ?? [];

        // Admin bypass - admin has full access to everything
        if (in_array('admin', $userRoles)) {
            return $handler->handle($request);
        }

        // Role-based access check (if roles are specified)
        if (!empty($this->requiredRoles)) {
            $hasAllowedRole = false;
            foreach ($this->requiredRoles as $role) {
                if (in_array($role, $userRoles)) {
                    $hasAllowedRole = true;
                    break;
                }
            }
            if (!$hasAllowedRole) {
                $this->logUnauthorizedAccess($request, $user, 'role_check_failed');
                return JsonResponder::error(new Response(), 'Insufficient role privileges', 403);
            }
        }

        // Permission-based access check
        if (!empty($this->requiredPermissions)) {
            foreach ($this->requiredPermissions as $permission) {
                if (!in_array($permission, $userPermissions)) {
                    $this->logUnauthorizedAccess($request, $user, 'permission_check_failed');
                    return JsonResponder::error(new Response(), 'Insufficient permissions', 403);
                }
            }
        }

        // Ownership check (for resources like own orders, own profile, etc.)
        if ($this->requireOwnership) {
            $userId = $user['id'] ?? null;
            $resourceUserId = $this->extractResourceUserId($request);
            
            if ($userId !== null && $resourceUserId !== null && $userId !== $resourceUserId) {
                $this->logUnauthorizedAccess($request, $user, 'ownership_check_failed');
                return JsonResponder::error(new Response(), 'Access denied: can only access own resources', 403);
            }
        }

        return $handler->handle($request);
    }

    /**
     * Extract user ID from the request resource (order, profile, etc.)
     */
    private function extractResourceUserId(ServerRequestInterface $request): ?int
    {
        // Try to get user_id from route arguments
        $routeArgs = $request->getAttribute('routeContext');
        if (is_array($routeArgs) && isset($routeArgs['user_id'])) {
            return (int) $routeArgs['user_id'];
        }

        // Try to get from parsed body
        $body = $request->getParsedBody();
        if (is_array($body) && isset($body['user_id'])) {
            return (int) $body['user_id'];
        }

        return null;
    }

    /**
     * Log unauthorized access attempts for security auditing
     */
    private function logUnauthorizedAccess(
        ServerRequestInterface $request,
        array $user,
        string $reason
    ): void {
        try {
            $pdo = Database::getInstance()->connection();
            $stmt = $pdo->prepare("
                INSERT INTO audit_logs (user_id, action, resource_type, details, ip_address, created_at)
                VALUES (:user_id, :action, :resource_type, :details, :ip_address, :created_at)
            ");
            
            $stmt->execute([
                'user_id' => $user['id'] ?? null,
                'action' => 'unauthorized_access_attempt',
                'resource_type' => 'api_endpoint',
                'details' => json_encode([
                    'reason' => $reason,
                    'path' => $request->getUri()->getPath(),
                    'method' => $request->getMethod(),
                    'user_roles' => $user['roles'] ?? [],
                    'user_permissions' => $user['permissions'] ?? [],
                ]),
                'ip_address' => $request->getServerParams()['REMOTE_ADDR'] ?? null,
                'created_at' => (new \DateTimeImmutable())->format('Y-m-d H:i:s'),
            ]);
        } catch (\Exception $e) {
            // Silently fail - don't break the request if audit logging fails
        }
    }
}