# SYCONIA — Performance & Optimization Strategy

| Field | Value |
|---|---|
| Document | PERFORMANCE.md · v1.0.0 · 2026-09-03 · `[REQUIRED]` budgets & tactics |

---

## 1. Targets — Core Web Vitals (75th percentile, field data; lab parity via Lighthouse CI)
| Metric | Budget | Primary owner |
|---|---|---|
| LCP | ≤ 2.0s (mobile 4G mid-tier) | Hero thumbnail (home) / stage poster (watch) |
| INP | ≤ 200ms | List interactions, drawer, player chrome |
| CLS | ≤ 0.02 | Reserved media boxes, skeletons matching geometry |
| TTFB | ≤ 300ms (cache hit ≤ 120ms) | ISR + CDN |
| FCP | ≤ 1.2s | Shell + critical CSS (token layer only) |
| TBT (lab) | ≤ 150ms | Island hydration budget |

Secondary SLOs: suggest p95 ≤ 120ms · list API p95 ≤ 300ms · page weight (home, cold) ≤ 900KB (≤ 220KB compressed JS) · watch page JS ≤ 180KB compressed excluding embed · Lighthouse (mobile) ≥ 90 perf / ≥ 95 a11y / ≥ 95 best-practices / 100 SEO.

## 2. Loading strategy
- **Rendering:** route-strategy table (ARCHITECTURE §4): ISR for cacheable surfaces, SSR+streaming for search, SG for legal. Streaming order: shell → header → primary content region → below-fold rails (Suspsese boundaries per rail).
- **Critical path:** inline token CSS variables + critical layout in the document; fonts self-hosted, `font-display: swap`, subset latin, preloaded (2 families × 2 weights max on first load).
- **Images:** every thumbnail through the optimization proxy with `remotePatterns` allowlist; AVIF/WebP negotiation; correct `sizes` per grid (2→6 col) + `fetchpriority="high"` on the LCP element only; lazy below fold; 30d immutable cache (URL-hash versioned).
- **Player:** stage box reserved (aspect-ratio) — zero CLS; embed iframe lazy-initialized on first intent (poster-first); below-fold related content streamed after stage.
- **Prefetch:** nav intent (hover/press ≥150ms) prefetch; viewport prefetch for next cursor page when `saveData=false` and idle; drawer links prefetch on drawer open.
- **Fonts/icons:** icon tree-shaking (lucide per-icon imports); no icon-font sprites.

## 3. JavaScript budget & islands
- Server Components by default; client islands only: header/drawer, search combobox, player shell, feed pagination, admin tables, forms, toasts. Target: public route client JS ≤ 120KB compressed (home), ≤ 180KB (watch incl. shell) — enforced in CI bundle-size gate (G-9).
- `motion/react` used via `LazyMotion` + `domAnimation` feature bundle (no full `domMax` on public routes).
- TanStack Query caches cursor pages client-side (staleTime 60s) preventing refetch storms on back-navigation.

## 4. Animation performance law
Transform/opacity only (DESIGN-SYSTEM §9); no animating layout properties; compositor-friendly (`will-change` transient); ≤12 staggered nodes per region; skeletons/loops pause off-screen; reduced-motion honored everywhere; player chrome overlays GPU-composited.

## 5. Caching architecture (layers — TTL matrix normative in PRD2 §5)
CDN/ISR (tag-purge ≤60s for hides — invariant) → route micro-caches (30s) → Postgres (prepared statements, hot indexes DATABASE §5) → client (TanStack). Cache-key discipline: no user-specific variance on public pages (anonymous homogeneity = cache heaven); admin plane always private/no-store.

## 6. Database performance
Indexes match query paths (DATABASE §5); rollups keep aggregate reads O(day); pagination via cursors — no OFFSET scans; sync jobs batch upserts (≤500 statements/tx) and run off-peak; connection pooling (10–20) via pooler; statement timeouts 5s (list) / 500ms (suggest, via prepared hot path); `pg_stat_statements` reviewed weekly (SOP §11).

## 7. Third-party/embed performance containment
Embeds load only after user intent (poster-first) — keeps cold watch-page LCP ours; iframe `loading="lazy"`; no source scripts on our origin (CSP `script-src` self); adapter fetches budgeted (rate per manifest) so jobs never stampede; breaker prevents retry storms.

## 8. Rate/traffic shaping under load
ISR absorbs anonymous reads; only search/suggest/events hit origin — all rate-limited (SECURITY §10); CDN rules cache suggest responses 30s at edge for repeated prefixes in bursts; maintenance mode static page at edge for S1 events.

## 9. Observability of performance
- RUM beacon (first-party): LCP/INP/CLS/TTFB per route class, sampled 100% (aggregate, anonymous) → daily rollups on admin dashboard.
- Lab: Lighthouse CI on preview deployments per PR (budgets above fail the build — G-9); bundle analyzer diff posted on oversized PRs.
- Alerts: p95 TTFB > 600ms 15min; API p95 breach 15min; error rate > 2%.

## 10. Performance acceptance criteria
1. Home on throttled 4G/mid-Android: LCP ≤ 2.0s, CLS ≤ 0.02, interactive without long tasks. 2. Watch page: no CLS from stage; embed init ≤ 600ms after intent. 3. Search typing: suggestions ≤ 120ms p95. 4. 10k-item category page scroll: no dropped frames >5% on mid-tier (trace verified). 5. Bundle budgets green in CI. 6. All budgets asserted in E2E perf suite (TESTING §7 T-60…T-65) and PRE-RELEASE §7.
