# SYCONIA — Advanced Product Specification (v1.1.0 — platform-neutral data/behavior spec)

> Platform mapping: client-side behaviors (cursors, cache TTLs, race policies, session) are consumed by the **Android repository/UseCase layer** (replacing TanStack Query); `sy_sid` = app anonymous session id (same lifecycle); beacons flush on app backgrounding. All math, contracts and policies unchanged.

| Field | Value |
|---|---|
| Document | PRD2.md — advanced specification complementing [PRD.md](./PRD.md) |
| Version | 1.0.2 — Gap-Audit Patch · Date: 2026-09-03 |
| Status | All mechanisms described here are `[REQUIRED]` for v1 unless marked `[PROPOSED]` |

---

## 1. Purpose

PRD.md defines *what* SYCONIA is and *who* it serves. This document defines *how the product behaves in the dark corners*: ranking math, pagination semantics, cache lifetimes, adapter contracts, governance, observability, capacity, and risk. It is the bridge between product intent and [ARCHITECTURE.md](./ARCHITECTURE.md)/[API.md](./API.md).

## 2. Interaction deep-specifications (product-level)

### 2.1 Feed semantics
- **Rail order (Home):** `Trending Now` → `New Releases` → `Most Watched (7d)` → `Rising`. A rail is rendered only if ≥ 4 items qualify; otherwise it is replaced by the next eligible rail (never a stub).
- **Infinite scroll contract:** first page SSR (12 items/page on mobile grid, 24 on desktop); subsequent pages via cursor. Trigger at 800px from end; prefetch 1 page ahead when `saveData` is false. An explicit “Load more” button always exists as keyboard/mobile fallback and moves focus to the first new item (`aria-live` announcement: “12 more videos loaded”).
- **End of feed:** footer strip “You’ve reached the end” with two suggestions (Trending, Categories) — never an abrupt void.
- **Hero eligibility (normative):** `is_available = true` AND `is_hidden = false` AND `trending_score` within global top 10 AND proxied thumbnail verified (proxy 200 at render) AND title length 10–120 chars. The first item in that order is the hero; if none qualifies, the hero is suppressed and rails move up (no fallback fake hero).

### 2.2 Sorting semantics (normative)
| Sort | Definition |
|---|---|
| Relevance (search default) | tsvector rank `ts_rank_cd` × trigram similarity tiebreak × availability recency boost (×1.1 if `last_seen_at` within 48h) |
| Newest | `published_at DESC NULLS LAST`, tiebreak `first_seen_at DESC` |
| Longest | `duration_seconds DESC` (filter: duration bucket applied independently) |
| Most watched | `views_7d DESC` from rollups, tiebreak `views_total DESC` |
| Trending (default listing) | decayed velocity — §3.1 |
| Rising | `views_24h / max(views_7d,1)` ratio, min threshold 50 views/24h |

### 2.3 URL state contract (search/listings)
- Every filter/sort/page state lives in destination state + deep-link arguments (pattern `?q= &cat= &tag= &src= &dur= &sort= &cursor=` retained for share URLs). System back must restore state *and scroll position* (saved-state + lazy-list first-visible-item restoration; verified in E2E).
- Canonical URLs exclude cursor/page parameters (SEO.md §4).

### 2.4 Discretion behaviors
- Thumbnail treatment: posters render with a subtle brand-consistent dim/blur (8px, 40% opacity veil) until hover (pointer:fine) or first tap-release (touch); a settings toggle “Discreet thumbnails: on/off” persists in localStorage only — `[REQUIRED]` (privacy UX, zero server state).
- History hygiene: watch pages set `document.title` to the neutral base brand title on `visibilitychange` hidden (tab-mask), and offer “Clear session traces” (clears localStorage session id + beacons queue) in the footer — `[REQUIRED]`.
- Referrer hygiene: all external links (source, provenance) use `rel="nofollow noopener noreferrer"`; Referrer-Policy `strict-origin-when-cross-origin` sitewide (SECURITY.md §4).

### 2.5 Related-rail composition (normative — G-05 resolution)
Ordered candidate pool for a watch page `V`:
1. **Bucket A — same primary category:** videos sharing V's first category, ranked `trending_score DESC`.
2. **Bucket B — shared tags:** videos sharing ≥1 tag with V (excluding Bucket A), ranked `shared_tag_count DESC, trending_score DESC`.
3. **Bucket C — trending backfill:** global trending, ranked `trending_score DESC`.
Global exclusions across all buckets: `V` itself, `is_hidden`, `is_available=false`, blocked entries, sources currently disabled. Dedupe by `id`. Rail = first 6 of the merged pool (A then B then C); rail rendered only if ≥4 items — else hidden (no stub). Continuation (`More` / `relatedCursor`) walks the identical pool with the stable composite key `(bucket, shared_tag_count, trending_score, id)` — deterministic across requests (API §4.2).

### 2.6 View-count semantics (normative — G-06 resolution)
- A **view** = one distinct `(session_id, video_id, calendar day)` with ≥1 quartile milestone (`q25|q50|q75|end`) — deduped in aggregation (`COUNT(DISTINCT session_id)` per video/day where event IN quartiles), so replays and beacon duplicates never double-count.
- `views_24h` / `views_7d`: rolling sums of daily distinct-session counts (jobs, DATABASE §2.2). `views_total`: cumulative sum maintained by the nightly rollup. `WatchDTO.viewCount` = `views_total`.
- Display rounding (watch page + admin): `<1000` exact · `1,000–999,999` → `X.Xk` · `≥1,000,000` → `X.XM`.

### 2.7 Stale-request / race / cancellation policy (normative — G-08 resolution)
- Every query/filter change produces a new repository request key → automatic request supersession; in-flight coroutines are **cancelled** on key change; responses arriving for abandoned keys are discarded (last-write-wins collection).
- Suggest endpoint: each request carries a client `seq`; responses with `seq` < latest rendered `seq` are dropped (out-of-order guard).
- Duplicate/idempotent beacons: no cancellation (safe by §2.6 aggregation dedupe).
- Mutations (report/contact): single-flight — submit button disabled while in-flight; duplicate submits impossible; retries only after network-class failure with unchanged payload.

### 2.8 Filter semantics under empty results (normative — G-27 resolution)
The zero-result relaxation chain (§3.3) applies to the text query `q` **only**. Filters and sort are **never auto-relaxed or auto-removed**. A filtered query yielding zero items renders **E-02b** (ERROR-STATES) with an explicit **Clear filters** action; the response may include a `notice: "filters_cleared_suggestion"` hint but the server never silently changes the client's filter state.

## 3. Ranking & analytics mathematics

### 3.1 Trending score
`trending_score = (w24·V24h + w7·V7d/7 + wq·Q)·freshness·availability`
- `V24h`, `V7d` = distinct anonymous sessions with ≥1 quartile milestone, from rollups.
- `Q` = completion quality = mean of quartile reached (0.25–1.0).
- `freshness = exp(-λ·age_days)`, λ=0.08 (≈ 8.5-day half-life tuning window, admin-tunable via Settings).
- Weights (default): w24=0.5, w7=0.3, wq=0.2. Recomputed hourly into `daily_video_stats.trending_score`.

### 3.2 Suggestion ranking (autocomplete)
1. Prefix matches on title (tsvector `prefix:*`), 2. trigram similarity ≥ 0.32 on title, 3. trending queries matching the prefix, 4. exact category/tag name matches (surfaced as typed chips). Interleaved with the ordering above; 8-item cap; each item carries its result-count when known.

### 3.3 Zero-result recovery
If strict query yields 0: relax in order — (a) trigram similarity ≥ 0.25, (b) drop lowest-specificity token, (c) tag/category fuzzy. If still 0, render E-03 (ERROR-STATES.md) with trending; the failed query is logged with `relaxed=1` for taxonomy gap analysis (admin Tags screen surfaces gaps weekly).

### 3.4 Rollup & retention
Raw `watch_events`, `interaction_events` and `search_queries` aggregate nightly into `daily_video_stats` / `daily_search_stats` / daily event-type aggregates; raw rows purged at 90 days (Settings-tunable 30–180); rollups retained indefinitely (aggregate, non-identifying). The hourly trending job also maintains `videos.views_24h` / `videos.views_7d` (DATABASE §2.2). Purge job is idempotent and audited.

## 4. Cursor pagination specification
- Cursor = Base64URL(`{sortKey, id}`), signed with HMAC (server secret) to prevent forgery/tamper (403 on invalid signature).
- Sort keys: `trending`→(score,id), `new`→(published_at,id), `views`→(views_7d,id), `relevance`→(rank not cursorable → page-token window by query hash, max 10 pages deep then force-refine UX).
- Page sizes: grid 24 (desktop)/12 (mobile) — size is server-decided from viewport hint, clamped 6–48; client cannot set arbitrary size.
- Empty/short pages return `nextCursor: null` when exhausted; duplicate-guard by `id` set on client.

## 5. Cache TTL matrix (single source of truth; referenced by ARCHITECTURE.md §9)
| Layer | Key | TTL | Invalidation |
|---|---|---|---|
| CDN/ISR | Home | 120s | tag `home` on sync/purge |
| CDN/ISR | Category/Tag listing p.1 | 300s | tag `taxonomy:{id}` |
| CDN/ISR | Watch page shell | 600s | tag `video:{id}`, `video:hide` |
| Route handler | `/api/videos` list | 30s | none (short) |
| Route handler | suggest | 30s | none |
| Adapter | source fetch | source-defined (min 300s) | breaker |
| DB | rollup tables | hourly job | job |
| Client (app repository cache) | lists | staleTime 60s, memory 5m | cursor-keyed |
| Images | thumbnails | 30d immutable | URL-hash changes |

## 6. Adapter architecture contract (summary — full API in API.md §6)
- Canonical `NormalizedVideo` DTO: `{ sourceSlug, sourceVideoId, title(≤300), description(≤5000|null), durationSeconds(30–28800|null), thumbUrl, thumbUrls[], previewUrl|null, embed{type: iframe|player-api, url, allowFullscreen, capabilitySet[]}, sourceCategories[], sourceTags[], publishedAt|null, sourceRating|null }`.
- `capabilitySet` enumerates what the shell may control per source: `fullscreen-delegation, keyboard-passthrough, tap-overlay, preview-media, captions-signal, speed-signal`. The player shell renders **only** controls whose capability the adapter declares — this is the honesty mechanism that prevents promising interactions a source cannot honor (GESTURES.md §2).
- Boundary rules: every field Zod-validated; URLs must match the source's allowlisted host patterns (scheme https, host suffix match, no userinfo, no port other than 443); text passed through a character-normalization + length clamp; anything failing validation is dropped field-wise (never whole-batch), logged as `normalization_drift` for admin review.
- Circuit breaker: 5 consecutive failures or >30% failure over 50 calls → OPEN 10min → HALF-OPEN probe; state visible on admin Sources screen.

## 7. Taxonomy governance
- Local taxonomy is closed-world: only admin-created categories/tags exist; source terms map through `mapping_rules` (pattern → local id, priority, is_regex). Unmapped terms count as `unmapped_hits` surfaced in admin for weekly triage — this is how the catalog stays browse-quality without free-text taxonomy drift.
- Category requirements: slug unique, name 2–48 chars, description ≤280 chars, hero optional (brand-styled), `sort_order`, `is_visible`.
- Merge/split: admin actions are soft (alias table), never destructive; audit-logged; CDN tags purged.

## 8. Feature flags & settings (system_settings)
`age_gate_copy_variant`, `discreet_thumbs_default`, `trending_weights`, `retention_days`, `source_enable:{slug}`, `maintenance_mode`, `suggest_enabled`, `infinite_scroll_enabled`. All readable in admin Settings; all typed and validated; all changes audited. Kill-switches must act within one cache window (≤120s).

## 9. Observability & SLOs
- SLOs: API p95 < 300ms (list), < 120ms (suggest); page TTFB p95 < 400ms; pipeline success ≥ 99%/source/week; uptime 99.9%.
- Dashboards (admin): traffic (sessions, views), funnel (impression→open→quartile), search health (zero-result %, suggest p95), source health (sync success, breaker state, freshness lag hours), error budget burn.
- Alerts: breaker OPEN > 30min; sync failure 3 consecutive; error-rate > 2%/15min; takedown queue > 20 or oldest > 36h; disk/connections > 80%.
- Log schema: `{ts, level, requestId, route, source?, code, ms}` — no PII, no full IPs (truncated /24 IPv4, /48 IPv6), no query strings from watch pages in access logs.

## 10. Capacity model (initial)
- Assumptions: 50k videos, 100k events/day. Hot tables indexed (DATABASE.md §5); rollups keep aggregates O(days). Connection pool 10–20 (pooler). ISR + CDN absorb ≥ 90% of reads. Burst: rate limits protect DB (SECURITY.md §10); queue beacons client-side on 429 with jittered retry.

## 11. Risk register (FMEA-style)
| # | Failure mode | Effect | Sev | Mitigation | Detection |
|---|---|---|---|---|---|
| R1 | Source API retired/terms change | Catalog shrink | High | 2+ approved sources; admin kill-switch; adapter isolation | sync failures, breaker |
| R2 | Source embed breaks for a video | Watch failure | Med | capability-aware fallback chain E-04; degraded flag; prune | player_error events |
| R3 | DB saturation | Site slowness | High | pooling, caching, rate limits, rollups | p95 alerts |
| R4 | Takedown SLA breach | Legal exposure | High | queue alerts; hide-first workflow | admin queue age |
| R5 | Age gate bypass via direct API | Compliance gap | High | middleware on /api + signed cookie | pen test + logs |
| R6 | SEO deindex wave | Traffic loss | Med | diversified discovery; compliant markup | GSC-style monitoring |
| R7 | CSP/iframe regression | Broken playback | Med | E2E iframe matrix; CSP report-only first | E2E + reports |
| R8 | Placeholder code shipped | Brand/trust damage | High | CI gate G-7 (CI-CD.md §4) | CI |

## 12. Roadmap (post-v1, `[PROPOSED]`)
1. On-device history/favorites (F-19) · 2. Collections (F-20) · 3. PWA offline shell (F-21) · 4. Optional AV provider hook · 5. Seasonal token themes · 6. Additional sources via adapter SDK · 7. Localization (i18n) groundwork.

## 13. Traceability
Every mechanism here maps to: API endpoints (API.md §4–5), indexes (DATABASE.md §5), tests (TESTING.md §7 matrix rows T-*), and gates (CI-CD.md §4). A PR that changes §2–§8 must update the paired rows in those documents in the same commit (enforced by reviewer checklist, SOP.md §6).
