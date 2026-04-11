# Procurely CI/CD Pipeline Documentation

This document outlines the automated validation system designed for the Procurely Ecommerce platform. The pipeline ensures every commit meets production-readiness standards before reaching `https://useprocurely.com`.

## Pipeline Overview

The pipeline is triggered on every `push` to `main` or `develop` and on every `pull_request`. It is divided into four main stages:

1.  **Backend Validation**: Runs PHPUnit tests, verifies API structure, and database integrity (MySQL compatibility).
2.  **Frontend Quality**: Runs Lints, checks build validity, and monitors bundle sizes.
3.  **E2E Critical Workflows**: Uses Playwright to walk through the real user experience (Cart, Navigation, Broken Links).
4.  **Automated Deployment**: If all checks pass and the branch is `main`, the code is deployed to cPanel via SSH/Rsync with post-deploy smoke tests.

## Running Tests Locally

### Backend (PHP)
```bash
cd backend
composer install
vendor/bin/phpunit
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run lint
npm run build
```

### E2E (Playwright)
```bash
cd frontend
npx playwright install
npx playwright test
```

## Adding New Tests

### Adding a new API Test
Add a new method with the `/** @test */` annotation in `backend/tests/Feature/ApiTest.php`. 
Target status codes, JSON structures, and database side-effects.

### Adding a new E2E Workflow
Create or update a `.spec.ts` file in `frontend/tests/e2e/`. 
Use the `page.goto()` and `expect()` APIs to validate UI behavior.

## Performance Thresholds
The pipeline enforces strict performance baselines in `.github/scripts/performance-check.sh`:
*   **API Latency**: Must be < 500ms.
*   **Frontend TTFB**: Must be < 1500ms.

## Troubleshooting Pipeline Failures

1.  **Backend Fails**: Check the PHPUnit output. Usually caused by a schema mismatch or an unhandled API edge case.
2.  **E2E Fails**: Download the `playwright-report` artifact from the GitHub Action run. It contains screenshots and traces of exactly what the browser saw at the moment of failure.
3.  **Deployment Fails**: Verify that the SSH secrets (`CPANEL_SSH_KEY`, etc.) are correctly set in the GitHub Repository Settings -> Secrets and Variables -> Actions.

## Fail-Fast Policy
The pipeline is configured with `set -e`. Any single failure in a lint, test, or build step will immediately terminate the pipeline and block deployment. No partial successes are permitted.
