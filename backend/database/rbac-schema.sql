-- =============================================
-- Procurely RBAC Database Schema
-- Version: 1.0.0
-- Last Updated: 2026-05-02
-- =============================================

-- Enable foreign key constraints for SQLite
PRAGMA foreign_keys = ON;

-- =============================================
-- Roles Table
-- Defines all system roles with hierarchy support
-- =============================================
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_role_id INTEGER NULL,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- =============================================
-- Permissions Table
-- Defines all granular permissions in the system
-- =============================================
CREATE TABLE IF NOT EXISTS permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(resource_type, action)
);

-- =============================================
-- Role Permissions (Many-to-Many)
-- Links roles to their permissions
-- =============================================
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    assigned_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- =============================================
-- User Roles (Many-to-Many)
-- Assigns roles to users (using uuid to match users table)
-- =============================================
CREATE TABLE IF NOT EXISTS user_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_uuid VARCHAR(36) NOT NULL,
    role_id INTEGER NOT NULL,
    assigned_by VARCHAR(36) NULL,
    assigned_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_uuid, role_id),
    FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(uuid) ON DELETE SET NULL
);

-- =============================================
-- Audit Logs
-- Tracks all security-relevant events
-- =============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_uuid VARCHAR(36) NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE SET NULL
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_uuid ON user_roles(user_uuid);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_uuid ON audit_logs(user_uuid);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- =============================================
-- Insert System Roles
-- =============================================
INSERT OR IGNORE INTO roles (name, display_name, description, is_system_role) VALUES
('admin', 'Administrator', 'Full system access - single user only (Vincent Agber)', 1),
('customer', 'Customer', 'Registered customer with standard user permissions', 1),
('guest', 'Guest', 'Unauthenticated user with public access only', 1),
('support', 'Support Agent', 'Customer service team - view customers and manage support tickets', 0),
('warehouse', 'Warehouse Staff', 'Fulfillment operations - view orders and update delivery status', 0),
('finance', 'Finance Team', 'Financial operations - view orders, invoices, and generate reports', 0);

-- =============================================
-- Insert Permissions
-- =============================================
-- Product permissions
INSERT OR IGNORE INTO permissions (name, display_name, description, resource_type, action) VALUES
('product.read', 'View Products', 'Browse and view product catalog, details, pricing', 'product', 'read'),
('product.create', 'Create Products', 'Add new products to catalog', 'product', 'create'),
('product.update', 'Update Products', 'Edit existing product information', 'product', 'update'),
('product.delete', 'Delete Products', 'Remove products from catalog', 'product', 'delete'),
('product.inventory', 'Manage Inventory', 'View and update product inventory levels', 'product', 'inventory');

-- Order permissions
INSERT OR IGNORE INTO permissions (name, display_name, description, resource_type, action) VALUES
('order.create', 'Create Orders', 'Place new orders', 'order', 'create'),
('order.read.own', 'View Own Orders', 'View own order history and details', 'order', 'read.own'),
('order.read.all', 'View All Orders', 'View all customer orders (staff only)', 'order', 'read.all'),
('order.update.own', 'Update Own Orders', 'Cancel or modify own pending orders', 'order', 'update.own'),
('order.update.status', 'Update Order Status', 'Update order fulfillment status', 'order', 'update.status'),
('order.invoice.read', 'View Invoices', 'View and download invoices', 'order', 'invoice.read');

-- Customer permissions
INSERT OR IGNORE INTO permissions (name, display_name, description, resource_type, action) VALUES
('customer.read.own', 'View Own Profile', 'View own account profile and data', 'customer', 'read.own'),
('customer.update.own', 'Update Own Profile', 'Update own profile information', 'customer', 'update.own'),
('customer.read.all', 'View All Customers', 'View all customer accounts (staff only)', 'customer', 'read.all'),
('customer.support.tickets', 'Manage Support Tickets', 'View and respond to customer support tickets', 'customer', 'support.tickets');

-- Payment permissions
INSERT OR IGNORE INTO permissions (name, display_name, description, resource_type, action) VALUES
('payment.create', 'Make Payments', 'Initiate payments for orders', 'payment', 'create'),
('payment.read.own', 'View Own Payments', 'View own payment history', 'payment', 'read.own'),
('payment.read.all', 'View All Payments', 'View all payment records (finance only)', 'payment', 'read.all'),
('payment.refund', 'Issue Refunds', 'Issue refunds to customers (finance only)', 'payment', 'refund');

-- System permissions
INSERT OR IGNORE INTO permissions (name, display_name, description, resource_type, action) VALUES
('system.users.manage', 'Manage Users', 'Create, update, or deactivate user accounts', 'system', 'users.manage'),
('system.roles.manage', 'Manage Roles', 'Assign or modify user roles and permissions', 'system', 'roles.manage'),
('system.logs.view', 'View Audit Logs', 'Access system audit logs and analytics', 'system', 'logs.view'),
('system.config.update', 'Update System Config', 'Modify system configuration settings', 'system', 'config.update'),
('system.reports.financial', 'View Financial Reports', 'Generate and view financial reports', 'system', 'reports.financial');

-- =============================================
-- Assign Permissions to Roles
-- =============================================

-- Guest Role Permissions (public access only)
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'guest' AND p.name IN ('product.read');

-- Customer Role Permissions (inherits guest + authenticated user permissions)
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'customer' AND p.name IN (
    'product.read',
    'order.create',
    'order.read.own',
    'order.update.own',
    'order.invoice.read',
    'customer.read.own',
    'customer.update.own',
    'payment.create',
    'payment.read.own'
);

-- Support Role Permissions (customer + support-specific)
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'support' AND p.name IN (
    'product.read',
    'order.read.all',
    'order.update.status',
    'customer.read.all',
    'customer.support.tickets'
);

-- Warehouse Role Permissions
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'warehouse' AND p.name IN (
    'product.read',
    'product.inventory',
    'order.read.all',
    'order.update.status'
);

-- Finance Role Permissions
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'finance' AND p.name IN (
    'product.read',
    'order.read.all',
    'order.invoice.read',
    'customer.read.all',
    'payment.read.all',
    'payment.refund',
    'system.reports.financial'
);

-- Admin Role Permissions (FULL ACCESS - all permissions)
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin';
