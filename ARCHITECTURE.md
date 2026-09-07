# SYCONIA — Technical Architecture

| Field | Value |
|---|---|
| Document | ARCHITECTURE.md · v1.1.0 · 2026-09-03 (Android platform migration) |
| Status | Target architecture. **No application code exists yet in this repository** — every element below is `[REQUIRED]` unless marked `[EXISTING]` (brand assets) or `[PROPOSED]`. |

---

## 0. Architecture style — client/server (v1.1.0)

SYCONIA v1.1.0 uses a **client/server architecture**:

- **Android client (Kotlin + Jetpack Compose + Material 3)** — the public product surface: discovery, search, taxonomy, watch experience. Clean Architecture layers (`ui → domain → data`), MVVM + Unidirectional Data Flow, Coroutines/Flow, Hilt DI, Navigation Compose. Playback via a hardened WebView embed shell (official source embeds only — D-013). No media storage, no accounts.
- **Backend service (Node.js + TypeScript)** — the retained server plane: public JSON API (API.md §4), admin web console + admin API (§5), minimal legal/contact/share web surface, ingestion jobs, PostgreSQL 16+ via Drizzle ORM. It hosts **no public discovery web UI** (retired with the web client).
- **PostgreSQL 16+** — backend-only. Never embedded in the app.

**Platform boundaries (v1.1.0 — D-023):** Android is the **current primary client implementation target**. The web client is **historical/superseded** — its completed web-track M1 work (2026-09-05) is preserved in-tree at the repository root pending isolation under `/web` (task M0-T006; history preserved, nothing rewritten or deleted). The backend remains a separate server plane (Next.js in backend-only role + PostgreSQL via Drizzle; boundary `/backend`). **No Android implementation exists yet** — `/android` is a documented future boundary only until the foundation task M1-T001 explicitly begins.

```
┌────────────────────────┐        HTTPS (TLS, pinned config)        ┌──────────────────────────┐
│  ANDROID APP (Kotlin)  │ ───────────────────────────────────────► │   BACKEND SERVICE        │
│  Compose UI (M3 theme) │ ◄───────────── JSON API (§4) ───────────│  Node.js + TS            │
│  ViewModel/StateFlow   │                                          │  API · Admin web · Legal │
│  UseCase · Repository  │                                          │  Jobs (cron): sync,      │
│  Room/DataStore (only  │                                          │  probe, rollup, purge    │
│  where justified)      │                                          │  Drizzle → PostgreSQL 16+│
│  WebView embed shell   │                                          └───────────┬──────────────┘
└────────────────────────┘                                                      │ allowlisted egress only
                                                                    ┌───────────▼──────────────┐
                                                                    │ EXTERNAL SOURCES          │
                                                                    │ (official embeds/feeds)   │
                                                                    └───────────────────────────┘
```

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

### Client (Android) — locked
| Layer | Choice | Rationale |
|---|---|---|
| Language | **Kotlin** (JVM; strategy: pin current stable at scaffold — D-016) | Coroutines-native, null-safety, Compose |
| UI | **Jetpack Compose + Material 3** (BOM pinned at scaffold) | Declarative UI; M3 themed from SYCONIA tokens (DESIGN-SYSTEM §13) — no generic Material demo look |
| Architecture | **Clean Architecture + MVVM/UDF** | UI → ViewModel → UseCase → Repository → DataSources; domain free of Android UI deps |
| Async | **Coroutines + Flow** | Structured concurrency; StateFlow state exposure |
| DI | **Hilt** | Standard Android DI; compile-time graph validation |
| Navigation | **Navigation Compose** | Destinations, deep links (App Links), predictive back |
| Networking | **Retrofit 2 + OkHttp + kotlinx-serialization** (D-011) | Contract-first against API.md; TLS/network-security-config |
| Imaging | **Coil** (D-012) | Compose-native, allowlisted hosts |
| Playback | **WebView embed shell** (hardened, D-013) | Official source embeds are iframe/JS — WebView is the honest mechanism; capability chrome in Compose |
| Persistence | **DataStore** (prefs/session); **Room only where a task justifies it with evidence** (D-014) | No local media ever |
| Fonts | Bundled OFL **Fraunces + Inter** variable TTFs (from branding/fonts) | Licensing + brand typography; Compose font scaling |
| Min/target SDK | **minSdk 26; targetSdk = Play-current at release** (D-016) | Device coverage vs API level |
| Identity | **Application ID / namespace: `com.syconia.android`** · human-readable name **SYCONIA** — canonical (D-023) | One identity across documentation, future build config, App Links and release artifacts; alternate IDs prohibited |

### Backend (service) — retained from v1.0.2
| Layer | Choice | Rationale |
|---|---|---|
| Runtime | **Node.js 20+ / TypeScript 5 (strict)** | Retained server plane |
| Framework | **Next.js (backend-only role)** — API handlers, admin console, legal/contact web surface, share/OG pages; **no public discovery web UI** (D-010) | Preserves DATABASE/API/admin specs verbatim; least invention |
| Database / ORM | **PostgreSQL 16+ · Drizzle ORM + drizzle-kit** | Backend concern only — never in the app |
| Validation | Zod at every boundary | Unchanged |
| Jobs | Platform cron → job endpoints (registry §5) | Unchanged |
| Hosting | Vercel + Neon (primary) / Docker + VPS (alt) | DEPLOYMENT.md (B-003 unchanged) |

Prohibited: React/web code in the Android client; Android framework imports in domain layer; `Composable → Retrofit/Room` calls; untyped escapes; hard-coded brand colors outside the theme; libraries added without a recorded decision.

## 3. Repository layout (target — v1.1.0)

```
/                          # repo root — all project .md specs (this suite)
/branding/                 # [EXISTING] official brand assets (copied from /uploads)
  syconia-primary-logo.png, syconia-symbol-only.png, syconia-monochrome-light.png,
  syconia-app-icon.png, syconia-favicon.png, syconia-brand-guidelines.pdf
/docs/                     # DOCUMENTATION-INDEX.md, LEGAL-COMPLIANCE.md, generated PDF
/.skills/ui-ux-pro-max/    # [EXISTING] cloned UI/UX Pro Max design skill (dev aid; git-ignored)
/web                       # [FUTURE — M0-T006] historical web client implementation, isolated
                           #   (currently at repo root: components/, web-client-era configs & tests)
                           #   superseded as primary client; preserved for audit + M5 retained-surface
                           #   decisions; physical move deferred to M0-T006 — not performed yet
/android                   # [FUTURE — M1-T001] native Android client (Gradle multi-module)
                           #   NO implementation exists yet — documented boundary only
  app/                     # MainActivity, navigation graph, Hilt app, build variants
  core/common/             # result types, dispatchers, errors → E-state mapping
  core/designsystem/       # SyconiaTheme (M3 from tokens), typography, icons, components
  core/model/              # shared plain models (no framework deps)
  core/network/            # Retrofit/OkHttp/kotlinx-serialization, DTOs, API services
  core/security/           # network config, WebView hardening, secure prefs, keystore use
  core/ui/                 # shared composables: states (loading/empty/error/offline), chrome
  data/repository/         # repository implementations (remote + cache mappers)
  data/local/              # DataStore (session/age/settings); Room ONLY if task-justified
  domain/                  # use cases + repository contracts + domain models (pure Kotlin)
  feature/home|search|categories|tags|watch|settings|legal   # feature modules (UI+ViewModel)
/backend                   # [REQUIRED] retained server plane (Next.js backend-only role)
                           #   (physically: root app/ API+admin+legal surfaces, lib/, drizzle/,
                           #   scripts/ — no physical move authorized in this phase)
  /app/api/*               # API.md handlers (public §4 + admin §5)
  /app/admin/*             # admin web console (A-01…A-10, noindex, auth-guarded)
  /app/(legal)/*           # legal/contact web + /watch/[slug] OG share pages
  /lib                     # db (drizzle), adapters/, auth/, rate-limit/, cache/, validation/
  /drizzle                 # migrations + schema
  /scripts                 # jobs registry, ci/no-placeholder-gate.sh
/branding, /docs, /.ai     # unchanged
/.skills                   # git-ignored dev aid (unchanged)

Dependency direction (enforced by module graph + convention plugins + review):
`feature/* → core/* → domain ← data/*` — UI never touches Retrofit/Room/DTOs; domain has no Android UI imports; DTO→domain mapping only in data/; database entities never cross into presentation.
```

### Platform responsibility matrix (D-023)

| Concern | Web (`/web` — historical, superseded) | Android (`/android` — primary client target, future) | Backend (`/backend` — retained) |
|---|---|---|---|
| UI rendering | Browser (historical Next.js/React client) | Jetpack Compose + Material 3 | Admin/legal/share SSR surfaces only |
| Navigation | Web routing (historical) | Navigation Compose, Android back stack | API routing |
| Metadata/SEO | n/a (historical) | App Links deep links | Legal indexability, share/OG pages, admin noindex |
| Media playback | Historical embed approach | Hardened WebView embed shell (D-013) + Compose chrome | Server-side source adapters only |
| Local persistence | Browser storage (historical) | DataStore; Room only where task-justified (D-014); never media | PostgreSQL only |
| Accessibility | WCAG web (historical) | Android accessibility semantics | — |
| Release artifacts | Web deploy (historical) | Signed APK/AAB (M5; keys never committed) | Backend deploys (DEPLOYMENT.md) |
| Business logic | — | Presentation + domain layers (Clean Architecture) | Services, jobs, adapters, rate limiting, server security |

No responsibility is duplicated across the three planes; the Android column is the current implementation target, the Web column is preserved history.

### Android identity (canonical — D-023)

| Field | Value |
|---|---|
| Application name (human-readable) | **SYCONIA** |
| Application ID / namespace | **`com.syconia.android`** |
| Platform / language | Android · Kotlin |
| UI / design system | Jetpack Compose · Material 3 (SyconiaTheme from SYCONIA tokens) |
| Architecture | Clean Architecture · MVVM + UDF · Coroutines/Flow · Hilt · Navigation Compose |
| minSdk / targetSdk | minSdk 26 · targetSdk = Play-current at release (D-016) |
| Versioning | `versionCode` monotonic · `versionName` semver aligned with releases (DEPLOYMENT.md — already established) |
| Build variants | debug + release (R8/minify configuration lands with the quality-toolchain task M1-T002) |
| Signing | Keys only in CI/machine keystores — **never committed** (CI-CD G-6); Play App Signing decided with distribution (M5-T006) |
| Distribution | v1: internal APK + internal testing track; Play/open distribution is an explicit operator decision at M5-T006 (B-003-class — DEPLOYMENT.md) |
| Deep links | Android App Links over the backend HTTPS domain; `assetlinks.json` served by the backend, bound to `com.syconia.android` (SECURITY §2, SEO §1A) |
| Notifications | Not in current PRD scope; adding one requires a recorded decision |
| Client analytics | None in current scope (PRD analytics are server-side); any client telemetry requires a recorded decision |

These are documentation decisions only: **no Android source, manifest, or Gradle configuration exists at the time of writing** (M0-T005, documentation phase). They become build configuration exclusively in M1-T001+.

## 4. Delivery strategy (v1.1.0) — API endpoints & web surfaces

**Android client:** all public surfaces are in-app destinations (Navigation Compose — SCREENS.md destination map); data arrives via the JSON API with repository-layer caching (TTL matrix PRD2 §5); UI states per ERROR-STATES taxonomy (loading/empty/error/offline) rendered in Compose. Age gate is a first-run in-app gate persisted in DataStore (FR-1 preserved client-side; server still enforces age affirmation for its web surfaces and API — SECURITY §6A).

**Backend web surfaces (remaining):**
| Surface | Strategy | Cache | Reason |
|---|---|---|---|
| `/api/*` (API.md §4/§5) | HTTP handlers | 30s micro-cache where safe (PRD2 §5) | Data plane for app + admin |
| `/legal/*`, `/about`, `/contact` | Static | CDN | Compliance surfaces (SEO §6 indexing decision unchanged) |
| `/watch/[slug]` | Minimal OG/share-preview page (noindex; OG tags + "Open in app" + open-at-source) | tag `video:{id}` | Share URLs & OG previews for shared links (SEO §1 v1.1.0) |
| `/admin/**` | Dynamic SSR, `noindex`, auth-guarded | private | Ops console |

Error handling: API error envelopes (API.md §3); app renders E-states; player failures isolated to the stage region (ERROR-STATES.md).

## 5. Backend/server architecture

- **API plane** = backend HTTP handlers under `/app/api` (Next.js in backend-only role — D-010), thin controllers: parse (Zod) → authorize (age cookie / admin session) → rate-limit → service (`/lib/services`) → respond. No business logic in handlers.
- **Services layer**: `catalogService` (list/get/related), `searchService`, `taxonomyService`, `ingestService`, `analyticsService`, `takedownService`, `adminService`. Pure functions over Drizzle — unit-testable without HTTP.
- **Jobs plane** (canonical registry — single source of truth): `scripts/jobs/*` invoked by platform cron (Vercel Cron / GitHub Actions / system crontab on VPS): `sync-sources` (per-source, isolated), `probe-availability`, `rollup-daily`, `purge-expired`, `refresh-trending`, `mapping-backfill` (on-demand after mapping-rule create/update — UX-FLOWS §9), `sitemap-refresh` (post-sync — CI-CD §7). All idempotent, all write `sync_runs`/`audit_log` rows, all kill-switchable via `system_settings`.
- **Backend middleware**: ① age-affirmation enforcement for web surfaces + API (PRD FR-1; Android app passes the affirmed-age attestation header — SECURITY §6A), ② security headers on web surfaces (SECURITY.md §4), ③ admin session redirect, ④ request-id injection. (No browser middleware exists in the Android client; its concerns map to in-app gates + network config.)

## 6. Adapter architecture (external sources)

- `/lib/adapters/<sourceSlug>/` — one module per approved source exporting: `manifest` (host allowlist, rate budget, capability set), `fetchPage(cursor)`, `fetchItem(id)`, `normalize(raw): NormalizedVideo`, `probe(item): availability`. Registry pattern: `adapters/index.ts` resolves slug → module; adding a source = code-reviewed module + admin enable (never runtime-registered).
- **SSRF hard seam:** the outbound HTTP client (single wrapper in `/lib/adapters/http.ts`) refuses any URL whose host is not in that adapter's manifest allowlist; DNS resolved and re-checked (against private CIDRs) before connect; timeouts 10s; response size cap 5MB; no redirects across hosts. (SECURITY.md §8.)
- Normalization per PRD2 §6; anything unknown is quarantined to `metadata jsonb`, never rendered un-sanitized.
- **Embed rendering:** server components validate `embed.url` against the source manifest before emitting the iframe; attributes locked: `sandbox="allow-scripts allow-same-origin allow-presentation"`, `allowfullscreen`, `referrerpolicy="strict-origin-when-cross-origin"`, `loading="lazy"`. No third-party `<script>` ever loads on our origin.

## 7. Data flow — watch session
1. Watch destination renders from API data (repository cache) with reserved 16:9 stage → 2. WebView embed shell initializes per adapter capability set → 3. anonymous app session id (`sy_sid` equivalent: UUID v4 held in DataStore, never a cookie — same lifecycle) ties beacons → 4. quartile beacons POST `/api/events/watch` (batched; flushed on app backgrounding) → 5. rollups nightly. No PII anywhere in the chain. **`sy_sid` lifecycle (normative):** 30-day expiry from issuance, **no renewal** (a fresh `sy_sid` is minted after expiry — continuity of analytics is deliberately sacrificed for privacy); rotated immediately by the “Clear session traces” control (UX-FLOWS §14).

## 8. Caching architecture
Layered: CDN for web surfaces (tag purge via `revalidateTag`) → API micro-cache → Drizzle prepared statements → **app repository-layer cache (replaces TanStack Query; TTLs from PRD2 §5 applied client-side)**. TTLs and invalidation events: single source of truth in PRD2 §5. Invariant: **admin hide/takedown purges `video:{id}` + listing tags and is effective ≤60s end-to-end** (E2E-verified).

## 9. Rate limiting & abuse controls
Sliding-window counters (Upstash Redis on Vercel path; Postgres-backed fallback on VPS path) keyed by truncated IP + route class: `suggest` 60/min, `search` 30/min, `events` 120/min, `report` 5/hour, admin login 5/15min then lockout. 429 + `Retry-After`; client backs off with jitter. Full policy: SECURITY.md §10.

## 10. Validation strategy
Zod schemas shared by client forms and server handlers (single definition in `/lib/validation`). Defense in depth: HTML sanitize (server) for any source text rendered as HTML (we render as text nodes by default — React escaping — plus a strict sanitizer for the rare rich field), URL validation at adapter boundary and again at render boundary (double-check).

## 11. Logging, monitoring, error boundaries
- Structured JSON logs, one line per request: `{ts, level, requestId, route, status, ms, source?, code?}`. No PII, no full IPs (truncation rule PRD2 §9). Log levels: `error` (page failure, adapter hard failure), `warn` (breaker half-open, rate-limit hits, normalization drift), `info` (sync summaries), `debug` (dev only, stripped in prod).
- Uptime/health: `/api/health` (liveness: process) and `/api/ready` (readiness: DB ping + breaker states). External uptime monitor pings 60s `[REQUIRED]`; on-call alert channel documented in SOP.md §9.
- Client error reporting: Android uncaught-error handler → beacon to `/api/events/client-error` (throttled 5/session, no stack in URL, sampled; web surface keeps its equivalent onerror beacon).

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
| Thumbnails proxy | backend image proxy with allowlist (`next/image` retained server-side; Android consumes proxied URLs via Coil) | Optimization + SSRF-safe, no media storage (caches transforms only — never source video/media) |
| Analytics | First-party pipeline (F-12) | Privacy posture + zero third-party script risk |

## 15. Architectural invariants (audited per release)
1. No media file storage anywhere in the system (static analysis gate G-7 also greps for mp4/m3u8 writes). 2. No content renders before the in-app age gate (and no web surface serves content without age affirmation). 3. No third-party scripts on our origin; the app loads third-party scripts only inside the sandboxed player WebView (D-013). 4. All external egress via the allowlisted adapter client. 5. All admin mutations audited. 6. Tokens are the only color source. 7. No placeholder/mock data (G-7). 8. Every feature ships with its four states (loading/empty/error/offline).
