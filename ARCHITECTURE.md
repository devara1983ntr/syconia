# SYCONIA — Technical Architecture

| Field | Value |
|---|---|
| Document | ARCHITECTURE.md · v1.0.1 · 2026-09-03 |
| Status | Target architecture. **No application code exists yet in this repository** — every element below is `[REQUIRED]` unless marked `[EXISTING]` (brand assets) or `[PROPOSED]`. |

---

## 1. Architecture style — hybrid

SYCONIA uses a **hybrid architecture**: a Next.js application that unifies (a) **server-rendered, CDN-cached frontend delivery** (App Router, RSC), (b) a **co-located backend plane** (Route Handlers acting as the internal API), and (c) an **asynchronous platform plane** (scheduled ingestion jobs + rollups) that talks to external sources. One deployable, three planes, clean seams:

```
                    ┌────────────────────────────────────────────────┐
                    │                CDN / EDGE (HTTPS)              │
                    └───────────────┬────────────────────────────────┘
                                    │
              ┌─────────────────────▼──────────────────────┐
              │        NEXT.JS APP (App Router, TS strict) │
              │  ┌──────────────┐  ┌─────────────────────┐ │
              │  │ RENDER PLANE │  │  API PLANE          │ │
              │  │ RSC pages    │  │ /api/* route        │ │
              │  │ + client     │  │  handlers (zod,     │ │
              │  │  islands     │  │  rate limit, auth)  │ │
              │  └──────┬───────┘  └─────────┬───────────┘ │
              │         │      Drizzle ORM   │             │
              │  ┌──────▼────────────────────▼───────────┐ │
              │  │            POSTGRESQL 16+             │ │
              │  └───────────────────────────────────────┘ │
              │  ┌───────────────────────────────────────┐ │
              │  │  JOBS PLANE (cron): sync adapters,    │ │
              │  │  availability probes, rollups, purge  │ │
              │  └───────────────┬───────────────────────┘ │
              └──────────────────┼─────────────────────────┘
                                 │ HTTPS, allowlisted hosts only
                    ┌────────────▼─────────────────┐
                    │  EXTERNAL SOURCES (official   │
                    │  embed APIs / feeds)          │
                    └───────────────────────────────┘
```

## 2. Technology stack (locked)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 15+ (App Router)** `[REQUIRED]` | RSC + streaming, ISR/tag revalidation, route handlers, middleware for age-gate enforcement |
| Language | **TypeScript 5 (strict)** `[REQUIRED]` | End-to-end type safety; `noUncheckedIndexedAccess` on |
| Database | **PostgreSQL 16+** (Neon primary; self-hosted alt) `[REQUIRED]` | tsvector + pg_trgm search, JSONB, row-level durability |
| ORM | **Drizzle ORM + drizzle-kit** `[REQUIRED]` (approved library #1) | Typed SQL, migrations as code, zero-runtime overhead |
| Animation | **`motion` (Framer Motion, `motion/react`)** `[REQUIRED]` (user-selected) | Transform/opacity-only animation, layout transitions, reduced-motion aware |
| Client data | **TanStack Query v5** `[REQUIRED]` (approved library #2) | Cursor-paginated infinite queries, caching, retries for client islands |
| Styling | Tailwind CSS v4 (token layer only) `[REQUIRED]` | Implements DESIGN-SYSTEM tokens; no ad-hoc colors |
| Validation | Zod `[REQUIRED]` | Every API boundary + DTO validation |
| Icons | lucide-react + official brand SVG/PNGs `[REQUIRED]` | Licensed icon set + official assets only |
| Fonts | next/font self-hosted OFL fonts (Fraunces serif / Inter sans) `[REQUIRED]` | Legal licensing (SIL OFL); zero layout shift; brand-guidelines typography direction |
| Testing | Vitest, Testing Library, Playwright, axe-core `[REQUIRED]` | TESTING.md |
| Hosting | Vercel + Neon (primary) / Docker + VPS (alt) `[REQUIRED]` | DEPLOYMENT.md |

Prohibited: jQuery, moment, CSS-in-RN-style runtimes, untyped `any` escapes, hard-coded brand colors outside the token layer.

## 3. Repository layout (target)

```
/                          # repo root — all project .md specs (this suite)
/branding/                 # [EXISTING] official brand assets (copied from /uploads)
  syconia-primary-logo.png, syconia-symbol-only.png, syconia-monochrome-light.png,
  syconia-app-icon.png, syconia-favicon.png, syconia-brand-guidelines.pdf
/docs/                     # DOCUMENTATION-INDEX.md, LEGAL-COMPLIANCE.md, generated PDF
/.skills/ui-ux-pro-max/    # [EXISTING] cloned UI/UX Pro Max design skill (dev aid; git-ignored)
/app                       # [REQUIRED] Next.js App Router
  (public)/                # age-gated public route group
    page.tsx               # home
    search/page.tsx
    categories/page.tsx, categories/[slug]/page.tsx
    tags/page.tsx, tags/[slug]/page.tsx
    watch/[slug]/page.tsx
    (legal)/terms|privacy|dmca|2257|cookies|about|contact/page.tsx
    offline/page.tsx
  admin/                   # noindex route group; its own layout+auth guard
    login/page.tsx, page.tsx (dashboard), videos/, categories/, tags/,
    sources/, mappings/, takedowns/, settings/, audit/
  api/                     # route handlers (API.md)
  sitemap.ts, robots.ts, not-found.tsx, error.tsx, global-error.tsx
/components                # design-system primitives + composites (DESIGN-SYSTEM §13)
  /ui (primitives)  /layout (header, drawer, footer)  /player (shell)
  /cards (VideoCard…)  /states (Empty, Error, Skeleton…)  /admin
/lib                       # db (drizzle), adapters/, auth/, rate-limit/, cache/,
                           # analytics/, validation/ (zod schemas), seo/, env.ts
/middleware.ts             # age-gate + security headers + admin auth seam
/drizzle                   # migrations + relational schema
/tests                     # unit / integration / e2e (Playwright) per TESTING.md
/scripts                   # sync runner entry, seed-* (structure only, no fake data),
                           # purge/rollup jobs, ci/no-placeholder-gate.sh
```

## 4. Rendering strategy per route

| Route | Strategy | Cache | Reason |
|---|---|---|---|
| `/` | ISR (120s) + streaming | CDN, tag `home` | Fast LCP, fresh rails |
| `/search` | SSR first page + client pages 2+ | no-store (dynamic) | Query freshness; crawlers get p1 only, `noindex` on parameterized URLs |
| `/categories`, `/categories/[slug]`, `/tags/[slug]` | ISR 300s | tags `taxonomy:*` | Stable, cache-heavy |
| `/watch/[slug]` | ISR 600s (shell only; embed lazy) | tag `video:{id}` | Instant watch start; hide purge <60s |
| Legal/about | Static (SG) | immutable-ish | Never changes unannounced |
| `/admin/**` | Dynamic SSR, `noindex`, auth-guarded | private | Fresh ops data |
| `/api/*` | Route handlers | 30s where safe (PRD2 §5) | Data plane |

Error boundaries: `error.tsx` per route group; `global-error.tsx` last resort; player failures isolated in the stage region only (ERROR-STATES.md).

## 5. Backend/server architecture

- **API plane** = Next.js Route Handlers under `/app/api`, thin controllers: parse (Zod) → authorize (age cookie / admin session) → rate-limit → service (`/lib/services`) → respond. No business logic in handlers.
- **Services layer**: `catalogService` (list/get/related), `searchService`, `taxonomyService`, `ingestService`, `analyticsService`, `takedownService`, `adminService`. Pure functions over Drizzle — unit-testable without HTTP.
- **Jobs plane**: `scripts/jobs/*` invoked by platform cron (Vercel Cron / GitHub Actions / system crontab on VPS): `sync-sources` (per-source, isolated), `probe-availability`, `rollup-daily`, `purge-expired`, `refresh-trending`. All idempotent, all write `sync_runs`/`audit_log` rows, all kill-switchable via `system_settings`.
- **Middleware** (edge): ① age-cookie enforcement on public content + `/api` (PRD FR-1), ② security headers (SECURITY.md §4), ③ admin session redirect, ④ request-id injection for log correlation.

## 6. Adapter architecture (external sources)

- `/lib/adapters/<sourceSlug>/` — one module per approved source exporting: `manifest` (host allowlist, rate budget, capability set), `fetchPage(cursor)`, `fetchItem(id)`, `normalize(raw): NormalizedVideo`, `probe(item): availability`. Registry pattern: `adapters/index.ts` resolves slug → module; adding a source = code-reviewed module + admin enable (never runtime-registered).
- **SSRF hard seam:** the outbound HTTP client (single wrapper in `/lib/adapters/http.ts`) refuses any URL whose host is not in that adapter's manifest allowlist; DNS resolved and re-checked (against private CIDRs) before connect; timeouts 10s; response size cap 5MB; no redirects across hosts. (SECURITY.md §8.)
- Normalization per PRD2 §6; anything unknown is quarantined to `metadata jsonb`, never rendered un-sanitized.
- **Embed rendering:** server components validate `embed.url` against the source manifest before emitting the iframe; attributes locked: `sandbox="allow-scripts allow-same-origin allow-presentation"`, `allowfullscreen`, `referrerpolicy="strict-origin-when-cross-origin"`, `loading="lazy"`. No third-party `<script>` ever loads on our origin.

## 7. Data flow — watch session
1. RSC renders watch shell from DB (ISR) with reserved 16:9 stage → 2. client island initializes embed per adapter capability set → 3. anonymous session id (cookie `sy_sid`, uuid v4, 30d) ties beacons → 4. quartile beacons POST `/api/events/watch` (batched, `keepalive` on hide) → 5. rollups nightly. No PII anywhere in the chain.

## 8. Caching architecture
Layered: CDN/ISR (tag purge via `revalidateTag`) → route-handler micro-cache → Drizzle prepared statements → TanStack Query client cache. TTLs and invalidation events: single source of truth in PRD2 §5. Invariant: **admin hide/takedown purges `video:{id}` + listing tags and is effective ≤60s end-to-end** (E2E-verified).

## 9. Rate limiting & abuse controls
Sliding-window counters (Upstash Redis on Vercel path; Postgres-backed fallback on VPS path) keyed by truncated IP + route class: `suggest` 60/min, `search` 30/min, `events` 120/min, `report` 5/hour, admin login 5/15min then lockout. 429 + `Retry-After`; client backs off with jitter. Full policy: SECURITY.md §10.

## 10. Validation strategy
Zod schemas shared by client forms and server handlers (single definition in `/lib/validation`). Defense in depth: HTML sanitize (server) for any source text rendered as HTML (we render as text nodes by default — React escaping — plus a strict sanitizer for the rare rich field), URL validation at adapter boundary and again at render boundary (double-check).

## 11. Logging, monitoring, error boundaries
- Structured JSON logs, one line per request: `{ts, level, requestId, route, status, ms, source?, code?}`. No PII, no full IPs (truncation rule PRD2 §9). Log levels: `error` (page failure, adapter hard failure), `warn` (breaker half-open, rate-limit hits, normalization drift), `info` (sync summaries), `debug` (dev only, stripped in prod).
- Uptime/health: `/api/health` (liveness: process) and `/api/ready` (readiness: DB ping + breaker states). External uptime monitor pings 60s `[REQUIRED]`; on-call alert channel documented in SOP.md §9.
- Client error reporting: window `onerror` → beacon to `/api/events/client-error` (throttled 5/session, no stack in URL, sampled).

## 12. Environment configuration
All configuration via environment variables validated at boot by `/lib/env.ts` (Zod; process exits on invalid — fail-closed):

| Var | Purpose |
|---|---|
| `DATABASE_URL`, `DATABASE_POOL_URL` | Postgres (direct/pooled) |
| `AGE_SECRET`, `CURSOR_SECRET`, `SESSION_SECRET` | HMAC signing keys (age cookie, cursors, admin sessions) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (argon2) | Admin bootstrap credential |
| `CRON_SECRET` | Job endpoint auth |
| `SOURCE_<SLUG>_KEY` | Per-source API keys (only for sources requiring them) |
| `SITE_URL`, `SITE_NAME=SYCONIA` | Canonical/SEO |
| `LOG_LEVEL`, `RATE_LIMIT_*` | Ops tuning |

No secret ever reaches client bundles (`server-only` imports; CI secret-scan gate G-6).

## 13. Deployment & CI/CD seams
Build pipeline, environments (preview/staging/prod), migration policy (drizzle-kit generate → review → apply in deploy), rollback: [CI-CD.md](./CI-CD.md) and [DEPLOYMENT.md](./DEPLOYMENT.md). HTTPS terminated at platform edge (HSTS enforced); no plaintext listener anywhere.

## 14. Build vs buy decisions
| Need | Decision | Why |
|---|---|---|
| Search | Postgres tsvector + pg_trgm | No extra service at this catalog scale; upgrade path to external search engine noted `[PROPOSED]` >200k items |
| Rate limiting | Upstash Redis (Vercel) / PG table (VPS) | Managed simplicity vs self-host parity |
| Thumbnails proxy | next/image with remotePatterns allowlist | Optimization + SSRF-safe, no media storage (caches transforms only — never source video/media) |
| Analytics | First-party pipeline (F-12) | Privacy posture + zero third-party script risk |

## 15. Architectural invariants (audited per release)
1. No media file storage anywhere in the system (static analysis gate G-7 also greps for mp4/m3u8 writes). 2. No route renders content without the age cookie. 3. No third-party scripts on our origin. 4. All external egress via the allowlisted adapter client. 5. All admin mutations audited. 6. Tokens are the only color source. 7. No placeholder/mock data (G-7). 8. Every feature ships with its four states (loading/empty/error/offline).
