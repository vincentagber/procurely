# Procurely

Procurely is a split-stack procurement commerce build with:

- `frontend/`: Next.js 16, Tailwind CSS 4, Framer Motion
- `backend/`: PHP 8.4, Slim 4, SQLite
- `shared/content/procurely.json`: shared design/content payload used by both sides

The UI was reconstructed from the provided exported design screens in this workspace:

- `Homepage.png`
- `Signup.png`
- `Log In.jpg`
- `Forgot password.png`

## Run Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://127.0.0.1:3000`.

### Backend

```bash
cd backend
cp .env.example .env
composer install
php scripts/init-db.php
php -S 127.0.0.1:8000 -t public
```

The API runs on `http://127.0.0.1:8000`.

## Verification

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
composer dump-autoload
php scripts/init-db.php
find src public scripts -name '*.php' -print0 | xargs -0 -n 1 php -l
```

## Main Features

- Pixel-aligned homepage and auth screens based on the supplied design exports
- Framer Motion driven reveal animations, drawers, and hover interactions
- Procurement catalog, BOQ/contact drawer, cart drawer, and checkout flow
- PHP API for homepage content, auth, cart, checkout, quote requests, and newsletter signup
- Shared content model across frontend fallback rendering and backend responses

## Notes

- Design-specific imagery in `frontend/public/assets/design/` is extracted from the provided exports via `scripts/extract-design-assets.py`.
- Because the raw Figma file was not available in the workspace, some values such as font family and a few hidden interaction states were inferred from the exported images.
