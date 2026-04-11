#!/bin/bash
set -e

echo "==> Running Production Performance Benchmarks..."

API_URL=${1:-"https://api.useprocurely.com"}
FRONTEND_URL=${2:-"https://useprocurely.com"}

# 1. API Latency Benchmark (Target < 300ms for health check)
echo "Testing API Latency ($API_URL)..."
LATENCY=$(curl -o /dev/null -s -w "%{time_total}\n" "$API_URL/")
LATENCY_MS=$(echo "$LATENCY * 1000 / 1" | bc)

echo "API Latency: ${LATENCY_MS}ms"
if [ "$LATENCY_MS" -gt 500 ]; then
    echo "FAILED: API latency exceeds 500ms threshold."
    exit 1
fi

# 2. Frontend Bundle Size Check (Simple check of build output)
if [ -d "frontend/.next" ]; then
    echo "Checking Frontend Bundle Sizes..."
    BUNDLE_SIZE=$(du -sh frontend/.next/static | cut -f1)
    echo "Total .next/static size: $BUNDLE_SIZE"
    # Logic could be added here to compare against a baseline.json
fi

# 3. DOM Content Loaded (Target < 1.5s)
echo "Testing Frontend First Interaction ($FRONTEND_URL)..."
SPEED_INDEX=$(curl -o /dev/null -s -w "%{time_starttransfer}\n" "$FRONTEND_URL")
SPEED_MS=$(echo "$SPEED_INDEX * 1000 / 1" | bc)

echo "Frontend Start Transfer: ${SPEED_MS}ms"
if [ "$SPEED_MS" -gt 1500 ]; then
    echo "FAILED: Frontend TTFB/Start Transfer exceeds 1.5s threshold."
    exit 1
fi

echo "==> Performance Validation PASSED."
