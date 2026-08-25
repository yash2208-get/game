# Nexora — Skill gaming, elevated

Nexora is an enterprise-ready skill-gaming starter built with a **React 19 + Vite frontend** and a **Laravel 12 + PHP 8.3 API** backed by **MySQL 8.4 and Redis**. The frontend is React **JavaScript** (not TypeScript), as requested.

The included dashboard is a high-fidelity responsive product surface: games, tournaments, leaderboard, wallet, friends and achievements are interactive and powered by a reusable component system. It is intentionally seeded with realistic presentation data so the UI can be reviewed before services are connected.

## Run the React frontend

```bash
npm install
npm run dev
```

Open the Vite preview shown in Arena, or `http://localhost:5173` locally. The Vite config proxies `/api` to Laravel at `http://127.0.0.1:8000`; browser code only uses relative API URLs.

## Run Laravel + MySQL + Redis

Requirements: PHP 8.3+, Composer 2, MySQL 8, Redis and the PHP extensions `pdo_mysql`, `redis`, `intl`, `zip`.

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=8000
```

For the full local stack, from the repository root:

```bash
docker compose up --build
```

This starts the frontend on `:5173`, API on `:8000`, MySQL on `:3306`, Redis on `:6379`, and a separate queue worker. Set a production `APP_KEY`, secrets and payment provider keys before deployment; do not use the example credentials in production.

## Project map

```text
src/                         React JavaScript SPA and premium gaming UI
  App.jsx                    dashboard views, navigation, modals and interactions
  styles.css                 responsive dark / neon design system
  api.js                     Axios API client with Sanctum bearer support
  store.js                   Redux Toolkit UI and wallet slices
backend/
  app/Http/Controllers/Api   versioned REST endpoints
  app/Models                 Eloquent domain models
  app/Services               transactional wallet service
  database/migrations        MySQL 8 schema with indexes and constraints
  routes/api.php             `/api/v1` routes
  app/Providers/Filament     admin panel registration point
docs/ERD.md                  Mermaid ER diagram and integrity rules
docs/openapi.yaml            API documentation source
Dockerfile                   production static frontend image
docker-compose.yml           frontend, API, MySQL, Redis and queue
```

## Security and operations

- Laravel Sanctum bearer tokens, hashed passwords, OTP/reset extension points and CSRF-safe stateful API middleware.
- API throttle: 120 requests/minute per authenticated user plus a 20 requests/minute IP guard for abuse-sensitive traffic.
- Wallet debits/credits use MySQL transactions and row locks; payment intents are deliberately isolated behind a provider adapter.
- Eloquent parameter binding protects query inputs; request validation is applied at the controller boundary.
- Redis is used for cache, queues and broadcasting. Tournament settlement and bonus expiry are scheduled in `routes/console.php`.
- Add Laravel Reverb or a Socket.IO gateway behind the same origin for game events (`room.joined`, `match.state`, `match.finished`). The frontend dependency is already included.
- Filament is registered at `/admin`; install its panel in a fresh Laravel runtime with `php artisan filament:install --panels`, then add Resources for users, games, tournaments, wallets, KYC, coupons, CMS, reports and roles.

## Production checklist

1. Configure MySQL credentials, Redis TLS/auth, `APP_KEY`, `APP_URL`, CORS and Sanctum stateful domains.
2. Add a payment gateway webhook with signature verification and idempotency keys before enabling deposits/withdrawals.
3. Configure object storage for avatars/KYC, antivirus scanning and a private disk for identity documents.
4. Configure Reverb/WebSocket auth, queue supervisors, scheduler (`php artisan schedule:work`) and Horizon if desired.
5. Run `php artisan migrate --force`, `php artisan config:cache`, `php artisan route:cache`, tests and a database backup before release.
6. Configure Filament roles/permissions, audit-log retention, KYC review SLAs, responsible gaming limits and regional legal compliance.

## Commands

```bash
# frontend
npm run build
npm run preview

# backend
php artisan test
php artisan migrate:fresh --seed
php artisan schedule:list
```

This repository is a production-grade foundation and UI shell. Game engines, payment providers, KYC vendor and regional compliance rules should be wired as isolated adapters before real-money launch.
