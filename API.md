# SYCONIA — API Specification (Internal API + External Adapter Contracts)

| Field | Value |
|---|---|
| Document | API.md · v1.0.1 · 2026-09-03 |
| Status | Target contract `[REQUIRED]`. Base URL: same-origin `/api`. All endpoints HTTPS-only. |

Conventions: JSON bodies; Zod-validated requests; RFC-7807-style error envelope `{ error: { code, message, requestId } }`; cursor pagination per PRD2 §4; every response carries `x-request-id`. **Global precondition:** all `/api/*` except `/api/health`, `/api/ready`, `/api/csp-report`, `/api/admin/login` require the signed age cookie (`sy_age_ok`) — enforced by middleware (403 `age_verification_required` otherwise).

---

## 1. Authentication levels
| Level | Mechanism | Scope |
|---|---|---|
| P0 public-anonymous | signed age cookie | all content endpoints |
| P1 anonymous session | `sy_sid` cookie (uuid) | event beacons (correlation only) |
| P2 admin | HttpOnly session cookie (argon2 login) | `/api/admin/**` |

## 2. Rate limits (per truncated IP unless noted)
`suggest` 60/min · `search`/list 30/min · `events` 120/min · `report` 5/h · `admin/login` 5/15min (then lockout) · others 60/min. 429 + `Retry-After`; burst 2× for 10s. Security detail: SECURITY.md §10.

## 3. Common error codes
`age_verification_required` 403 · `unauthorized` 401 · `forbidden` 403 · `not_found` 404 · `validation_failed` 422 (field details) · `rate_limited` 429 · `cursor_invalid` 400 · `source_unavailable` 503 (breaker) · `internal_error` 500.

---

## 4. Public content endpoints

### 4.1 `GET /api/videos` — catalog list
- **Purpose:** rails, listings, related-source lists. **Auth:** P0.
- **Query:** `rail=trending|new|most_watched|rising` · `category=<slug>` · `tag=<slug>` · `source=<slug>` · `duration=short|medium|long|extended` (≤5, 5–15, 15–30, >30min) · `sort=relevance|new|longest|most_watched` (default per rail) · `cursor?` · `limit` (server-clamped 6–48).
- **200:** `{ items: VideoCardDTO[≤48], nextCursor: string|null }` where `VideoCardDTO = { slug, title, durationSeconds|null, thumbUrl (proxied), sourceName, publishedAt|null, categories: string[] (slugs, ≤3), tags: string[] (slugs, ≤5) }`.
- **Behavior:** 30s micro-cache; queries hit indexes (DATABASE §5); hidden/unavailable excluded at SQL level.
- **Errors:** `validation_failed` (unknown enum → sanitized to default + 200 with `notice` field — never hard-fail browsing), `rate_limited`.
- **Timeout/retry:** server-side p50 budget 80ms; client TanStack retry ×2 (backoff 500ms/2s) on 5xx/network only.

### 4.2 `GET /api/videos/{slug}` — watch payload
- **Auth:** P0. **200:** `WatchDTO = { slug, title, description, durationSeconds, publishedAt, viewCount, source: { slug, name, provenanceUrl }, embed: { url (validated vs manifest), type, capabilities: [] }, categories[], tags[], relatedCursor }`.
- **Errors:** `not_found` — **canonical status rule (single source of truth, mirrored in SEO.md §5 and ERROR-STATES E-06):** hidden (admin/takedown) or removed items → **HTTP 404** with helpful E-06 UI (no existence leak, URL exits indexes); temporarily unavailable (probe pending, may return) → **HTTP 200** with E-06 UI + related rail; `source_unavailable` if breaker open for that source (payload still returned 200 with `embed:null` + `notice` so UI can render E-04 with related content).
- **Caching:** 600s ISR-aligned; purged by tag on hide.

### 4.3 `GET /api/search?q=` — search results page 1
- **Auth:** P0. **Query:** `q` (1–120), + filters as §4.1, `sort` (default relevance). **200:** `{ items[], nextCursor, resultCount, relaxed: boolean }`.
- **Behavior:** zero-result relaxation chain PRD2 §3.3 (`relaxed:true` when applied); query logged to `search_queries`.

### 4.4 `GET /api/search/suggest?q=` — autocomplete
- **Auth:** P0. **200:** `{ suggestions: [{ type: query|title|category|tag, label, slug?, thumbUrl?, score }][≤8] }` (zero-query → trending queries). 30s cache; p95 <120ms SLO.

### 4.5 `GET /api/categories` / `GET /api/categories/{slug}` · 4.6 `GET /api/tags` / `GET /api/tags/{slug}`
- **Auth:** P0. Visible-only taxonomy with `videoCount` (cached estimate). Listing response includes hero metadata for categories. **Errors:** `not_found`.

### 4.7 `POST /api/events/watch` — view beacons (P1)
- **Body:** `{ videoSlug, event: start|q25|q50|q75|end, sessionTs }`; session from `sy_sid` cookie server-side. **202** always (fire-and-forget; malformed → dropped, logged). Batched client-side (≤10/beacon, `navigator.sendBeacon` on hide). Rate 120/min.

### 4.7b `POST /api/events/interaction` — product analytics beacons (P1)
- **Purpose:** the interaction events catalogued in PRD.md §10 (`age_ack`, `page_view`, `rail_impression`, `card_open`, `search_submit`, `suggest_select`, `filter_apply`, `report_open`, `nav_*`, `player_error`).
- **Body:** `{ events: [{ event: <whitelist enum>, ts, videoSlug?, rail?, context? }] }` — batched ≤20, `navigator.sendBeacon`-capable; **event names outside the whitelist are dropped and logged** (never stored raw). No free-form properties beyond bounded enum/string fields (≤64 chars).
- **Response:** **202** always. Rate class: 120/min (shared with watch beacons). Persists to `interaction_events` (DATABASE §2.18; 90-day retention, nightly rollup, then purge).

### 4.8 `POST /api/events/client-error`
- **Body:** `{ code, route, sample: boolean }` (no stacks in prod, sampled 20%). 202.

### 4.8b `POST /api/csp-report` — Content-Security-Policy violation intake (age-exempt)
- **Purpose:** receives browser CSP reports from the `report-uri` directive (SECURITY.md §4). **Age-exempt** (like health/ready): reports must be receivable from any page state, including the age gate.
- **Behavior:** accepts `application/csp-report` JSON; stores a capped, sampled record (max 500/hour stored; remainder counted only); fields kept: `document-uri` path (no query), `violated-directive`, `blocked-uri` host — **no full URLs, no PII**. Responds **204 No Content** always (including malformed — dropped silently, counted). Rate 60/min/IP; outputs feed the CSP-violation dashboard + weekly review (SOP §11).

### 4.9 `POST /api/report` — takedown/issue entry (P0 + CSRF token)
- **Body:** `{ videoSlug, reason: copyright|underage|nc|other_legal|wrong_meta|broken, details?≤1000, contactEmail? }`.
- **202:** receipt reference `TKN-XXXXXX` shown in UI + stored `takedown_requests(new)`. **Errors:** `validation_failed`, `rate_limited`.
- **Behavior:** `copyright`/`underage`/`nc` immediately hide the item pending review (safe-harbor posture, LEGAL-COMPLIANCE §5) and purge CDN tags ≤60s.

### 4.10 `GET /api/health` / `GET /api/ready`
- `health`: 200 `{ok:true}` liveness. `ready`: checks DB `SELECT 1` + breaker map; 503 with component detail (no secrets) — used by deploy gate & uptime monitor.

## 5. Admin endpoints (P2, all mutations audited)

| Endpoint | Method(s) | Purpose | Notes |
|---|---|---|---|
| `/api/admin/login` | POST | `{username,password}` → session cookie | argon2 verify; lockout; audit `auth.login` |
| `/api/admin/logout` | POST | destroy session | audit |
| `/api/admin/overview` | GET | KPIs, source health, queue age | 30s cache |
| `/api/admin/videos` | GET | filter/search cache incl. hidden | cursor |
| `/api/admin/videos/{id}/visibility` | PATCH | `{isHidden, reason}` | purge tags; audit `video.hide/unhide` |
| `/api/admin/videos/{id}/resync` | POST | force adapter refresh | rate 6/min; audit |
| `/api/admin/categories` `/…/{id}` | GET POST PATCH | CRUD | slug immutable post-create; audit |
| `/api/admin/tags` `/…/{id}` | GET POST PATCH | CRUD + merge (`mergeIntoId`) | soft alias; audit |
| `/api/admin/sources` `/…/{id}` | GET PATCH | enable/disable, `termsVerifiedAt` | enable requires verified terms flag; audit |
| `/api/admin/mappings` `/…/{id}` | GET POST PATCH DELETE | mapping rules | regex validated; audit |
| `/api/admin/takedowns` `/…/{id}` | GET PATCH | queue + resolve `{status, action}` | hide-first; SLA timestamps; audit |
| `/api/admin/blocks` `/…/{id}` | GET POST DELETE | blocked_entries mgmt | FR-8 sticky; audit |
| `/api/admin/settings` | GET PATCH | typed flags (PRD2 §8) | schema-validated; audit |
| `/api/admin/audit` | GET | filtered audit log | read-only |
| `/api/admin/sync` | POST | trigger `{sourceSlug}` | CRON_SECRET or P2; idempotent; audit |

Errors: 401/403 + `validation_failed`; all bodies Zod-validated; no bulk ops without explicit `confirm:true`.

## 6. External adapter architecture (outbound)

### 6.1 Policy
- Outbound calls only from the jobs/server plane through `/lib/adapters/http.ts` (SSRF seam, ARCHITECTURE §6). Client never calls sources directly.
- **Source candidacy rule:** a source is eligible only if it offers an official public API, feed, or embed program whose terms permit third-party embedding/aggregation of metadata. The operator must record `terms_verified_at` + reference URL per source before enabling (admin UI enforces). Scraping beyond documented endpoints, terms-gated endpoints, or circumvention of technical controls is prohibited. Candidate families: official webmaster/feed APIs and oEmbed-style providers (specific sources selected at M2 by the operator after terms review; adapter interface is source-agnostic).
- **No-automatic-grant rule:** possessing an API key, feed endpoint, or copy-paste embed snippet does **not** by itself grant redistribution, re-hosting, or metadata-aggregation rights. Permission to aggregate metadata and embed must be affirmatively established from each source's published terms (or written permission) before that source is enabled; where terms are silent or ambiguous, the source remains **disabled** pending counsel sign-off. Embedding always renders the source's own player — never re-hosted streams or downloads; the image proxy caches provider thumbnails for display only.

### 6.2 Adapter interface
```ts
interface SourceAdapter {
  manifest: { slug, hosts: string[], ratePerMin, capabilities: Capability[] }
  fetchPage(cursor?: string): Promise<{ rawItems: unknown[], nextCursor: string|null }>
  fetchItem(id: string): Promise<unknown>
  normalize(raw: unknown): NormalizedVideo        // PRD2 §6 DTO, field-wise validation
  probe(item: NormalizedVideo): Promise<{ ok: boolean, embedState?: 'alive'|'dead'|'geo' }>
}
```
Timeout 10s, ≤2 retries with jitter, response cap 5MB, circuit breaker per source (§6.3 PRD2). Failure never crosses sources.

### 6.3 Normalization & source failure behavior
- Field-wise validation: a bad field drops that field (log `normalization_drift`), a bad item drops the item (count in `sync_runs.items_failed`), a bad page aborts the page only.
- Embed provenance: `embed.url` is the source's official embed URL only; shell re-validates against manifest hosts at render (defense in depth).
- Failure ladder (per video, at watch time): embed timeout 8s or error → adapter `probe` → if `dead`/`geo`: mark `is_available=false` + render E-04 with (Retry) (Alternate variant if `player_api` provides one) (Open at source) (Report). Breaker open for source → listings exclude that source's items automatically (soft degradation, notice chip “Some sources are temporarily unavailable”).

## 7. Embed/player integration notes
- Rendering: iframe with locked attributes (ARCHITECTURE §6). Autoplay: never with sound; poster-first on mobile; user gesture required before init on cellular `[PROPOSED]`.
- Capability-driven chrome: shell renders fullscreen/theater/report/watermark always (ours); play/pause/seek/volume/captions/speed controls are the source player's own, surfaced natively unless `capabilitySet` declares shell-delegation (GESTURES §2).
- `player_error` beacon carries `{sourceSlug, code}` only.

## 8. Audit action whitelist
`auth.login, auth.logout, auth.fail, video.hide, video.unhide, video.purge, video.resync, category.create/update/delete, tag.create/update/merge/delete, source.update, mapping.create/update/delete, takedown.resolve, block.create/delete, settings.update, sync.trigger` — anything else is a 422 by contract.

## 9. Versioning & evolution
Internal API is versionless but additive-only within v1; breaking changes require `/api/v2` + deprecation window (≥90 days) documented in CHANGELOG.md. DTO changes update DATABASE.md + this file in the same PR (SOP §6 checklist).

## 10. Endpoint test traceability
Every endpoint maps to ≥1 row in TESTING.md §7 (T-10…T-29) and ≥1 Playwright API-level spec; contract tests validate Zod schemas both directions (request rejects, response shape).
