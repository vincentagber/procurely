SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- ---------------------------------------------------------
-- Table structure for users
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(50),
  `whatsapp` VARCHAR(50),
  `password_hash` VARCHAR(255) NOT NULL,
  `wallet_balance` BIGINT DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` VALUES(1,'018ed3d0-3770-711e-a131-0164c0556855','Procurely Admin','admin@procurely.com',NULL,NULL,'$2y$12$Vn4xphquyHU4fXolPTUU3uTYN6cN2cunQB8hJoYuiXGihcVYshWQ6',0,'2026-04-21 19:17:34','2026-04-21 19:17:34');

-- ---------------------------------------------------------
-- Table structure for roles
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` VALUES(1,'admin','Full system access','2026-04-21 19:17:34');
INSERT INTO `roles` VALUES(2,'customer','Standard customer access','2026-04-21 19:17:34');

-- ---------------------------------------------------------
-- Table structure for permissions
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `permissions` VALUES(1,'user.create','Create users','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(2,'user.read','Read user data','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(3,'user.update','Update users','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(4,'user.delete','Delete users','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(5,'product.create','Create products','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(6,'product.read','Read products','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(7,'product.update','Update products','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(8,'product.delete','Delete products','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(9,'order.create','Create orders','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(10,'order.read','Read orders','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(11,'order.update','Update orders','2026-04-21 19:17:34');
INSERT INTO `permissions` VALUES(12,'order.delete','Delete orders','2026-04-21 19:17:34');

-- ---------------------------------------------------------
-- Table structure for user_roles
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  `assigned_at` DATETIME NOT NULL,
  `assigned_by` INT,
  PRIMARY KEY (`user_id`, `role_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `user_roles` VALUES(1,1,'2026-04-21 19:17:34',NULL);

-- ---------------------------------------------------------
-- Table structure for role_permissions
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  `assigned_at` DATETIME NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `role_permissions` VALUES(1,9,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,12,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,10,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,11,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,5,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,8,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,6,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,7,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,1,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,4,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,2,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(1,3,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(2,9,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(2,10,'2026-04-21 19:17:34');
INSERT INTO `role_permissions` VALUES(2,6,'2026-04-21 19:17:34');

-- ---------------------------------------------------------
-- Table structure for user_sessions
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE `user_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `session_token_hash` VARCHAR(128) NOT NULL UNIQUE,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL,
  `last_activity` DATETIME NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `user_sessions` VALUES(1,1,'8d9cd68cfaa01d9f82e38708940b54f43521f14b2d2a5f54a893afe1d31d2226',NULL,NULL,'2026-05-21 19:17:34','2026-04-21 19:17:34','2026-04-21 19:17:34');
INSERT INTO `user_sessions` VALUES(2,1,'7d3e1ae1d4ef48cf0f2a0faadd9f9bbc73f0ac6bcbb40338471d76c660c29afb',NULL,NULL,'2026-05-21 19:26:19','2026-04-21 19:26:19','2026-04-21 19:26:19');

-- ---------------------------------------------------------
-- Table structure for audit_logs
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `action` VARCHAR(100) NOT NULL,
  `resource` VARCHAR(100) NOT NULL,
  `resource_id` VARCHAR(100),
  `old_values` JSON,
  `new_values` JSON,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `created_at` DATETIME NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Table structure for notifications
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `data` JSON,
  `read_at` DATETIME,
  `created_at` DATETIME NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `notifications` VALUES(1,1,'order.new','New Order Received','Order PR-BD3DAC73CC from Test User for N632.75','{"orderId":"PR-BD3DAC73CC"}','2026-04-21 20:03:14','2026-04-21 19:24:04');
INSERT INTO `notifications` VALUES(2,1,'order.new','New Order Received','Order PR-6D525D9858 from Vincent Agber for N433.88','{"orderId":"PR-6D525D9858"}','2026-04-21 20:03:08','2026-04-21 20:01:43');

-- ---------------------------------------------------------
-- Table structure for password_reset_requests
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `password_reset_requests`;
CREATE TABLE `password_reset_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token_hash` VARCHAR(128) NOT NULL UNIQUE,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Table structure for rate_limits
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `rate_limits`;
CREATE TABLE `rate_limits` (
  `key` VARCHAR(255) NOT NULL,
  `hits` INT NOT NULL DEFAULT 1,
  `reset_at` BIGINT NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `rate_limits` VALUES('auth:::1',1,1776799114);
INSERT INTO `rate_limits` VALUES('search:::1',4,1776799232);
INSERT INTO `rate_limits` VALUES('order:::1',2,1776799470);
INSERT INTO `rate_limits` VALUES('auth:127.0.0.1',8,1776799638);
INSERT INTO `rate_limits` VALUES('order:127.0.0.1',3,1776801015);

-- ---------------------------------------------------------
-- Table structure for categories
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Table structure for products
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` VARCHAR(50) PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `short_description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `price` BIGINT NOT NULL,
  `image` TEXT,
  `badge` VARCHAR(50),
  `featured` TINYINT DEFAULT 0,
  `homepage_slot` VARCHAR(50),
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `products` VALUES('sharp-sand','sharp-sand','Procurely Sharp Sand','A premium quality sand','Sand & Aggregates',18500,'/assets/design/product-sharp-sand.png','new',1,'best-seller','2026-04-21 19:17:43','2026-04-21 19:17:43');
INSERT INTO `products` VALUES('marine-boards','marine-boards','Procurely Marine Boards','A premium quality boards','Wood & Boards',14500,'/assets/design/product-marine-board.png','',1,'best-seller','2026-04-21 19:17:43','2026-04-21 19:17:43');
INSERT INTO `products` VALUES('granite','granite','Granite (3/4 & 1/2)','Premium aggregates','Sand & Aggregates',45000,'/assets/design/product-granite.png','',1,'best-seller','2026-04-21 19:17:43','2026-04-21 19:17:43');
INSERT INTO `products` VALUES('cement-50kg','cement-50kg','Procurely Cement 50kg','A premium bulk cement','Cement & Concrete',6800,'/assets/design/product-cement.png','',1,'best-seller','2026-04-21 19:17:43','2026-04-21 19:17:43');
INSERT INTO `products` VALUES('plaster-sand','plaster-sand','Procurely Plaster Sand','A premium quality sand','Sand & Aggregates',14500,'/assets/design/product-plaster-sand.png','',0,'explore','2026-04-21 19:17:43','2026-04-21 19:17:43');
INSERT INTO `products` VALUES('rebars','rebars','Procurely Rebars','Premium high quality iron','Steel & Rebars',45000,'/assets/design/product-rebar.png','',0,'explore','2026-04-21 19:17:43','2026-04-21 19:17:43');
INSERT INTO `products` VALUES('rebars-bulk','rebars-bulk','Procurely Rebars Bulk Lot','Premium high quality iron','Steel & Rebars',46500,'/assets/design/product-rebar-rack.png','new',0,'explore','2026-04-21 19:17:43','2026-04-21 19:17:43');
INSERT INTO `products` VALUES('marine-board-plus','marine-board-plus','Procurely Marine Board','A premium quality board','Wood & Boards',18500,'/assets/design/product-marine-board-sand.png','',0,'explore','2026-04-21 19:17:43','2026-04-21 19:17:43');

-- ---------------------------------------------------------
-- Table structure for cart_items
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cart_token` VARCHAR(255) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `quantity` INT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `cart_items` VALUES(1,'test-token-123','sharp-sand',2,'2026-04-21 19:23:28','2026-04-21 19:23:28');
INSERT INTO `cart_items` VALUES(2,'b9e1b664-b261-4a84-849b-18994237216f','marine-boards',1,'2026-04-21 19:26:13','2026-04-21 19:26:13');

-- ---------------------------------------------------------
-- Table structure for orders
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `cart_token` VARCHAR(255) NOT NULL UNIQUE,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `subtotal` BIGINT NOT NULL,
  `vat` BIGINT DEFAULT 0,
  `shipping_fee` BIGINT DEFAULT 0,
  `service_fee` BIGINT NOT NULL,
  `total` BIGINT NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `paid_at` DATETIME,
  `created_at` DATETIME NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'card',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `orders` VALUES(1,NULL,'PR-BD3DAC73CC','test-token-123','Test User','test@example.com','08012345678','123 Test St, Lagos',37000,2775,20000,3500,63275,'processing',NULL,'2026-04-21 19:24:04','card');
INSERT INTO `orders` VALUES(2,1,'PR-6D525D9858','2147fad2-38fa-409e-b134-74ec61a2f4c8','Vincent Agber','vincentagber74@gmail.com','08177148582','Lagos Nigeria, Lagos Ikeja',18500,1388,20000,3500,43388,'pending_delivery',NULL,'2026-04-21 20:01:43','cod');

-- ---------------------------------------------------------
-- Table structure for order_items
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `unit_price` BIGINT NOT NULL,
  `quantity` INT NOT NULL,
  `line_total` BIGINT NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `order_items` VALUES(1,1,'sharp-sand','Procurely Sharp Sand',18500,2,37000);
INSERT INTO `order_items` VALUES(2,2,'marine-board-plus','Procurely Marine Board',18500,1,18500);

-- ---------------------------------------------------------
-- Table structure for quote_requests
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `quote_requests`;
CREATE TABLE `quote_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `project_location` VARCHAR(255) NOT NULL,
  `boq_notes` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Table structure for newsletter_subscribers
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `newsletter_subscribers`;
CREATE TABLE `newsletter_subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Table structure for inventory
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `product_id` VARCHAR(50) PRIMARY KEY,
  `stock_level` INT NOT NULL DEFAULT 0,
  `updated_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `inventory` VALUES('sharp-sand',98,'2026-04-21 19:24:04');
INSERT INTO `inventory` VALUES('marine-boards',100,'2026-04-21 19:17:43');
INSERT INTO `inventory` VALUES('granite',100,'2026-04-21 19:17:43');
INSERT INTO `inventory` VALUES('cement-50kg',100,'2026-04-21 19:17:43');
INSERT INTO `inventory` VALUES('plaster-sand',100,'2026-04-21 19:17:43');
INSERT INTO `inventory` VALUES('rebars',100,'2026-04-21 19:17:43');
INSERT INTO `inventory` VALUES('rebars-bulk',100,'2026-04-21 19:17:43');
INSERT INTO `inventory` VALUES('marine-board-plus',99,'2026-04-21 20:01:43');

-- ---------------------------------------------------------
-- Table structure for user_addresses
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `user_addresses`;
CREATE TABLE `user_addresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_uuid` VARCHAR(36) NOT NULL,
  `label` VARCHAR(100) NOT NULL,
  `address` TEXT NOT NULL,
  `is_default` TINYINT DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Table structure for user_payment_methods
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `user_payment_methods`;
CREATE TABLE `user_payment_methods` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_uuid` VARCHAR(36) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `provider` VARCHAR(100) NOT NULL,
  `last4` VARCHAR(4) NOT NULL,
  `is_default` TINYINT DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Table structure for user_company_info
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `user_company_info`;
CREATE TABLE `user_company_info` (
  `user_uuid` VARCHAR(36) PRIMARY KEY,
  `company_name` VARCHAR(255),
  `tax_id` VARCHAR(100),
  `business_type` VARCHAR(100),
  `email` VARCHAR(255),
  `whatsapp` VARCHAR(50),
  `address` TEXT,
  `updated_at` DATETIME NOT NULL,
  FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Table structure for wishlist_items
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `wishlist_items`;
CREATE TABLE `wishlist_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `wishlist_token` VARCHAR(255) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `created_at` DATETIME NOT NULL,
  UNIQUE(`wishlist_token`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_uuid ON users (uuid);
CREATE INDEX idx_users_created_at ON users (created_at);
CREATE INDEX idx_roles_name ON roles (name);
CREATE INDEX idx_permissions_name ON permissions (name);
CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions (role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions (permission_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions (user_id);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions (session_token_hash);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions (expires_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs (action);
CREATE INDEX idx_audit_logs_resource ON audit_logs (resource);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);
CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_type ON notifications (type);
CREATE INDEX idx_notifications_read_at ON notifications (read_at);
CREATE INDEX idx_notifications_created_at ON notifications (created_at);
CREATE INDEX idx_password_reset_user_id ON password_reset_requests (user_id);
CREATE INDEX idx_password_reset_token_hash ON password_reset_requests (token_hash);
CREATE INDEX idx_password_reset_expires_at ON password_reset_requests (expires_at);
CREATE INDEX idx_rate_limits_reset_at ON rate_limits (reset_at);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_featured ON products (featured);
CREATE INDEX idx_products_slot ON products (homepage_slot);
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_cart_items_cart_token ON cart_items (cart_token);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_cart_token ON orders (cart_token);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
