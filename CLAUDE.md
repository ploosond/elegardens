# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                 # Next.js dev server (needs Postgres running, see below)
pnpm build               # production build (output: standalone)
pnpm lint                # biome check
pnpm format              # biome format --write
pnpm payload <cmd>       # Payload CLI, e.g. `pnpm payload migrate`, `pnpm payload generate:types`
pnpm seed:all            # seeds employees, pots, products, globals (in that order)
pnpm seed:products       # individual seeds: :products :employees :pots :globals

docker compose -f docker-compose.dev.yml up postgres -d   # Postgres 17 on :5432 for local dev
docker compose -f docker-compose.prod.yml up -d --build    # full prod stack (app + Postgres on :5433)
```

Compose v2 (`docker compose`, no hyphen). The prod VPS has no `docker-compose` v1 binary.

pnpm is enforced (`only-allow pnpm` in postinstall) and pinned via `packageManager` in `package.json`, which corepack honours locally and in the Docker build. `pnpm-workspace.yaml` is not a workspace definition — it carries only the `allowBuilds` approvals that let native dependencies (`sharp` above all) run their install scripts. Both Docker stages that run `pnpm install` copy it; without it `sharp` installs without its binary and Payload image processing breaks. There is no test suite.

Seed scripts accept a `--clear` flag (or `SEED_CLEAR=true`) to wipe the collection first: `pnpm seed:all -- --clear`. They upsert by unique key via `scripts/seed-utils.ts`, reading JSON from `data/`.

After changing any collection/global field, regenerate `src/payload-types.ts` with `pnpm payload generate:types` — the whole codebase imports types from there.

## Architecture

Next.js 15 App Router + Payload CMS 3 in a **single process**. Payload mounts its admin UI and REST/GraphQL API inside the Next app under `src/app/(payload)/`; the public site lives under `src/app/(frontend)/[locale]/`. Custom (non-Payload) API routes live in `src/app/api/`.

**Payload config**: `src/payload.config.ts` registers 11 collections (`src/collections/`) and 4 globals (`src/globals/`), Postgres adapter with `prodMigrations` from `src/migrations/`, Resend email adapter, and lexical richtext. That single adapter sends **every** outbound mail — order mails, contact form, newsletter, and Payload auth/password-reset for both realms — from `RESEND_FROM_EMAIL` (`defaultFromName` is hardcoded). Sending from a domain unverified in Resend silently caps delivery to the Resend account owner, so customer-facing mail fails. Aliased as `@payload-config`; `@/*` maps to `src/*`.

**Two auth realms, both Payload-native:**
- `users` — admin panel users (`admin.user: Users.slug`).
- `clients` — B2B customers with their own login at `/[locale]/client/login`. `src/app/api/client/login/route.ts` calls `payload.login({ collection: 'clients' })` directly and sets the `payload-token` cookie itself, with `secure` driven by `COOKIE_SECURE` (must be `false` for HTTP/IP-only deploys). A `beforeLogin` hook on `Clients` rejects accounts whose `status !== 'active'`.

Server-side auth checks go through `src/lib/auth-client.ts` (`getAuthenticatedClient` / `requireClientAuth`). Note it does an HTTP fetch to `${SERVER_URL}/api/client/me` forwarding the request cookies — so `SERVER_URL` must be reachable from the server itself, or these checks silently return null (unauthenticated).

Collection-level `access` functions are the real authorization boundary (e.g. `Clients.read` returns a `{ id: { equals: user.id } }` query for clients, `true` for admins). Prefer relying on them over ad-hoc checks in route handlers.

**i18n**: `next-intl` with locales `de` (default) and `en`. `src/middleware.ts` wraps `createMiddleware(routing)` and excludes `api`, `admin`, `_next`, `_vercel`. UI strings live in `messages/{de,en}.json` and are read via `useTranslations` / `getTranslations`.

CMS content is **not** localized with Payload's localization feature. Instead, collections and globals define parallel suffixed fields (`description_en` / `description_de`, `roots_title_en` / `roots_title_de`) and components pick between them with `locale === 'de' ? x_de : x_en`. Adding a translatable field means adding both suffixed variants and both meta variants where the `Products.beforeChange` hook auto-fills `metaTitle_*` / `metaDescription_*`.

**Orders flow**: cart is client-side only (`src/contexts/CartContext.tsx`, persisted to `localStorage` under `client_cart`, holds `product` and/or `pot` items). Submitting hits `src/app/api/orders/`, which creates an `orders` doc. `Orders` hooks generate the order number (client prefix + date + ISO week) and trigger emails via `src/lib/email/order-email-service.ts` with templates in `src/lib/email/templates/`; `src/lib/excel/order-excel-generator.ts` builds the ExcelJS attachment. Order status changes are detected in `afterChange` by comparing `doc.status` against the `previousDoc` Payload passes in; every transition to a different status emails the client via `sendOrderStatusEmail`, with per-status copy (all five statuses, both locales) in `templates/order-status-changed.ts`. Only `confirmed` attaches the Excel sheet — see `statusIncludesExcelAttachment`. Do not reintroduce the old approach of stashing the previous status on `req` in `beforeChange`: it was gated on `data.id`, which Payload does not put in `data` on an update, so the block never ran and the previous status was always `undefined`.

**Data fetching** in frontend pages is mostly `fetch(`${NEXT_PUBLIC_PAYLOAD_URL}/api/...`)` from server components (not the local `getPayload` API), so `NEXT_PUBLIC_PAYLOAD_URL` must be a working absolute URL in every environment. Custom API routes under `src/app/api/` do use `getPayload({ config: configPromise })` directly.

**Media**: `Media` collection uses Payload's built-in `upload: true` with local disk storage — no S3. In production the `/app/media` directory is a Docker volume (`media_data`); `/media` is gitignored. Deleting the volume loses all uploads.

**Migrations**: `src/migrations/index.ts` exports the ordered array consumed by `prodMigrations`. Adding a migration means generating it (`pnpm payload migrate:create`) and registering it in that index file. On a fresh prod database run `pnpm payload migrate` before seeding.

## Conventions

Biome 2 handles lint + format (2-space, single quotes not enforced — existing files mix quote styles). The `next` and `react` lint domains are on; `suspicious/noUnknownAtRules` is off for Tailwind 4 at-rules. Tailwind 4 via `@tailwindcss/postcss`, no tailwind.config — theme lives in `src/app/(frontend)/[locale]/globals.css`.
