# SYCONIA — Performance & Optimization Strategy

| Field | Value |
|---|---|
| Document | PERFORMANCE.md · v1.1.0 · 2026-09-03 (Android platform migration) · `[REQUIRED]` budgets & tactics |

---

## 1. Targets (v1.1.0 — Android field/lab + backend API)
**Android app (measured on mid-tier device, API 26+):**
| Metric | Budget | Owner |
|---|---|---|
| Cold startup | ≤ 2.0s to first content (app open → home content), ≤ 1.2s warm | App module, baseline profiles |
| P95 frame time | ≤ 16ms steady scroll; ≤ 800 dropped frames per 10k-item scroll session | Lazy lists, image pipeline |
| Search suggestions | ≤ 150ms tap→results on cache hit (network p95 ≤ 120ms API-side) | Search feature |
| Watch open | stage reserved instantly (zero layout jumps); embed init ≤ 600ms after intent | Player shell |
| ANR / crash | ANR-free golden journeys; crash-free sessions ≥ 99.5% | Stability |
| App size | APK ≤ 25MB / AAB download-size ≤ 15MB baseline (reviewed per release) | Build, R8, asset discipline |
| Memory | no OOM on 10k-item session; Coil memory cache bounded | Imaging |
| Battery | no main-thread network/decode; no wake locks; WorkManager-only background | Architecture |

**Backend API (unchanged):** suggest p95 ≤ 120ms · list p95 ≤ 300ms · TTFB (web surfaces) ≤ 300ms/120ms cached · error rate < 2%.
Core Web Vitals apply **only to the remaining web surfaces** (legal/share/admin) and are demoted from primary targets (they are asserted where Lighthouse still runs on the backend track).

## 2. Loading strategy (v1.1.0 — Android; web bullets at section end apply to backend surfaces only)
- **Rendering:** route-strategy table (ARCHITECTURE §4): ISR for cacheable surfaces, SSR+streaming for search, SG for legal. Streaming order: shell → header → primary content region → below-fold rails (Suspsese boundaries per rail).
- **Critical path:** inline token CSS variables + critical layout in the document; fonts self-hosted, `font-display: swap`, subset latin, preloaded (2 families × 2 weights max on first load).
- **Images:** every thumbnail through the optimization proxy with `remotePatterns` allowlist; AVIF/WebP negotiation; correct `sizes` per grid (2→6 col) + `fetchpriority="high"` on the LCP element only; lazy below fold; 30d immutable cache (URL-hash versioned).
- **Player:** stage box reserved (aspect-ratio) — zero CLS; embed iframe lazy-initialized on first intent (poster-first); below-fold related content streamed after stage.
- **Prefetch:** nav intent (hover/press ≥150ms) prefetch; viewport prefetch for next cursor page when `saveData=false` and idle; drawer links prefetch on drawer open.
- **Fonts/icons:** bundled variable fonts (single file/family); Material Symbols loaded as needed (no icon-font sprites, no bundled icon bitmaps).

## 3. JavaScript budget & islands
- Server Components by default; client islands only: header/drawer, search combobox, player shell, feed pagination, admin tables, forms, toasts. Target: public route client JS ≤ 120KB compressed (home), ≤ 180KB (watch incl. shell) — enforced in CI bundle-size gate (G-9).
- `motion/react` used via `LazyMotion` + `domAnimation` feature bundle (no full `domMax` on public routes).
- App repository layer caches cursor pages (staleTime 60s, PRD2 §5) preventing refetch storms on back-navigation.

## 4. Animation performance law
Transform/opacity only (DESIGN-SYSTEM §9); no animating layout properties; compositor-friendly (`will-change` transient); ≤12 staggered nodes per region; skeletons/loops pause off-screen; reduced-motion honored everywhere; player chrome overlays GPU-composited.

## 5. Caching architecture (layers — TTL matrix normative in PRD2 §5)
CDN for web surfaces (tag-purge ≤60s for hides — invariant retained) → API micro-caches (30s) → Postgres (prepared statements, hot indexes DATABASE §5) → app repository cache (TTLs from PRD2 §5). Cache-key discipline: no user-specific variance on public data (anonymous homogeneity); admin plane always private/no-store. Cache-key discipline: no user-specific variance on public pages (anonymous homogeneity = cache heaven); admin plane always private/no-store.

## 6. Database performance
Indexes match query paths (DATABASE §5); rollups keep aggregate reads O(day); pagination via cursors — no OFFSET scans; sync jobs batch upserts (≤500 statements/tx) and run off-peak; connection pooling (10–20) via pooler; statement timeouts 5s (list) / 500ms (suggest, via prepared hot path); `pg_stat_statements` reviewed weekly (SOP §11).

## 7. Third-party/embed performance containment
Embeds load only after user intent (poster-first) — keeps cold watch-page LCP ours; iframe `loading="lazy"`; no source scripts on our origin (CSP `script-src` self); adapter fetches budgeted (rate per manifest) so jobs never stampede; breaker prevents retry storms.

## 8. Rate/traffic shaping under load
ISR absorbs anonymous reads; only search/suggest/events hit origin — all rate-limited (SECURITY §10); CDN rules cache suggest responses 30s at edge for repeated prefixes in bursts; maintenance mode static page at edge for S1 events.

## 9. Observability (v1.1.0: first-party RUM beacon retained — metrics now app-side: startup, cold/warm, frame drops, API latency per endpoint class, crash-free sessions; web vitals only for web surfaces)
- RUM beacon (first-party): LCP/INP/CLS/TTFB per route class, sampled 100% (aggregate, anonymous) → daily rollups on admin dashboard.
- Lab: Lighthouse CI on preview deployments per PR (budgets above fail the build — G-9); bundle analyzer diff posted on oversized PRs.
- Alerts: p95 TTFB > 600ms 15min; API p95 breach 15min; error rate > 2%.

## 10. Performance acceptance criteria
1. Home on throttled 4G/mid-Android: LCP ≤ 2.0s, CLS ≤ 0.02, interactive without long tasks. 2. Watch page: no CLS from stage; embed init ≤ 600ms after intent. 3. Search typing: suggestions ≤ 120ms p95. 4. 10k-item category page scroll: no dropped frames >5% on mid-tier (trace verified). 5. Bundle budgets green in CI. 6. All budgets asserted in E2E perf suite (TESTING §7 T-60…T-65) and PRE-RELEASE §7.
