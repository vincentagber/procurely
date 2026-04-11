#!/bin/bash
set -e

echo "==> Validating project structure and environment dependencies..."

# Architecture check
if [ ! -f "frontend/package.json" ]; then echo "Missing frontend/package.json"; exit 1; fi
if [ ! -f "backend/composer.json" ]; then echo "Missing backend/composer.json"; exit 1; fi
if [ ! -f "backend/public/index.php" ]; then echo "Missing API Front controller"; exit 1; fi

# Hardcoded credentials check
if grep -q "DB_PASS=" backend/.env.example; then
    # Allowed in example but should not contain valid production passwords
    echo "Info: Ensure .env.example contains no real production passwords."
fi

# We don't want floating console.logs leaking sensitive info to client side
echo "==> Running static code analysis wrapper..."
if grep -r "console.log(" frontend/app; then
    echo "Warning: console.logs found in frontend/app directory. Please verify they are not leaking data."
    # We could exit 1 here if policy dictates zero tolerance
    # exit 1
fi

echo "==> Pre-flight env validation OK."
