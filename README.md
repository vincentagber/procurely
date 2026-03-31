# 🏗️ Procurely | Modern Enterprise Procurement Hub

Procurely is a production-grade, full-stack procurement and e-commerce platform engineered for high-performance administrative oversight and secure partner-driven transactions. Built with a focus on data integrity, cryptographic security, and low-latency operational streams.

---

## 💎 Core Architecture & Features

### 🏢 Enterprise Administration (Partner Registry)
*   **Audit-First Identity Hub**: A high-fidelity "Partner Registry" allowing administrators to manage authenticated entities with precision.
*   **Bulk Command Processing**: Select multiple partners for collective actions, including mass identity termination and data audits.
*   **High-Resolution Data Export**: Integrated CSV/Excel export tool for selected or filtered datasets, supporting professional spreadsheet reporting.
*   **Operational Ledger**: Real-time monitoring of all procurement protocols with active status tracking (Processing, Settled, Dispatched, Terminated).

### ⚡ Performance & Scalability
*   **SQL-Driven Catalog**: Optimized backend filtering and pagination using SQLite atomic transactions. Replaces traditional in-memory array manipulation for sub-100ms response times on large datasets.
*   **Dynamic UX**: Built with Next.js 15 and Framer Motion for a fluid, premium interaction experience.
*   **Search Console**: Long-width command search bar with real-time filtering across all data tabs.

### 🛡️ Security & Integrity
*   **Cryptographic Sessioning**: Implementing SHA-256 session token hashing with mandatory 30-day rotation. Active sessions are hashed in the database to prevent hijacking even in the event of a data breach.
*   **Production HTTPS Enforcement**: Strict frontend-to-backend communication protocol that prohibits plaintext HTTP in production environments.
*   **Rate-Limiting Infrastructure**: Multi-layered rate-limiting middleware applied to all sensitive endpoints (Auth, Quotes, Newsletters).
*   **Atomic Transactions**: ACID-compliant order processing ensures stock levels and checkout states are never corrupted during concurrent high-volume events.

---

## 🛠️ Technology Stack

### **Frontend**
*   **Framework**: Next.js 15 (App Router / Turbopack)
*   **Animations**: Framer Motion
*   **Iconography**: Lucide React
*   **Styling**: Modern TailwindCSS / PostCSS
*   **State Management**: React Context & Hooks

### **Backend**
*   **Engine**: PHP 8.4 (Slim 4 Micro-Framework)
*   **Database**: SQLite (WAL & Synchronous Mode)
*   **Compliance**: PSR-7, PSR-11, and PHP 8.4 strict typing
*   **Authentication**: Custom SHA-256 Token Bearer Authentication

---

## 🚀 Quick Start & Installation

### **1. Backend Setup**
```bash
cd backend
composer install
cp .env.example .env
# Set DATABASE_PATH=storage/procurely.sqlite
php -S localhost:8000 -t public
```

### **2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### **3. Database Migration**
To seed the initial product catalog and admin accounts:
```bash
php scripts/migrate.php
```

---

## 🔑 Administrative Credentials (Initial Seed)
| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@procurely.com` | `Apassword123!` |
| **Sample Customer** | `customer@procurely.com` | `Apassword123!` |

---

## 👤 Credits
Developed significantly by **Vincent Agber**. 

---

## ⚖️ License
This project is licensed under the MIT License.
