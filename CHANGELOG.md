# Changelog

All notable changes to the SYCONIA project are documented here. Format: Keep a Changelog; versioning: SemVer.

## [1.0.2] — 2026-09-03 — Pre-Implementation Gap-Audit Patch

Applied the 8-group patch plan resolving the gap audit (G-01…G-34). No scope, architecture, brand, or legal changes; documentation-only.

### Added / Resolved
- **API.md:** §5.1 complete admin data contracts (9 DTOs + all 16 mutation request schemas, sort whitelists, `confirmation_required`, `terms_not_verified`, `weights_invalid`, `slug_immutable`); §4.11 `POST /api/contact` (honeypot, queue routing, CTN references); `notice?` field on `/api/videos` 200 DTO; `relevance` restricted to search on `/api/videos` with explicit rejection semantics; duration buckets half-open `[0,300)/[300,900)/[900,1800)/[1800,∞)`; `related=<slug>` continuation param + stable relatedCursor key; taxonomy contract (categories bounded ≤200 unpaginated; tags `q=` prefix + cursor 48/page).
- **PRD2.md:** §2.5 related-rail composition (buckets A/B/C, exclusions, ≥4 rule, deterministic key); §2.6 view-count semantics (distinct session/day with ≥q25; display rounding); §2.7 stale-request/race/cancellation policy (query-key supersession, AbortController, suggest `seq` guard, single-flight mutations); §2.8 filters never auto-relaxed; §2.1 hero eligibility criteria.
- **GESTURES.md:** §6.9 formal player state machine (10 states, valid + invalid transitions); §8 v1 haptics policy (none); §10 formal state-machine appendix (age gate, takedown, source/breaker, network).
- **ERROR-STATES.md:** E-02b filtered-empty state; E-05/§5 v1 offline mechanism corrected (no SW — client-side nav E-04 + /offline link; hard-nav limitation documented, SW `[PROPOSED]` F-21).
- **SECURITY.md:** §6 normative cookie contracts (`sy_age_ok` signed payload format; `sy_admin` opaque token, hashed at rest; `sy_csrf` issuance/rotation), CSRF flows for admin + public forms, admin lockout scope (per username AND truncated IP).
- **SCREENS.md:** S-01 leave-site target (`https://www.wikipedia.org`, env `AGE_LEAVE_URL`); S-05 filtered-empty → E-02b; S-06 server-backed tag search + pagination; S-07 theater persistence (sessionStorage) + no-JS `<noscript>` fallback + S-07R honeypot field; S-08 legal indexing decision applied.
- **DATABASE.md:** slug generation algorithm (normative); cross-source duplicate policy (distinct entries per source; content_hash future-only); `interaction_events.video_id` FK unified with watch_events (server resolves slug→id).
- **ARCHITECTURE.md:** canonical jobs registry synchronized (+`mapping-backfill`, +`sitemap-refresh`); `sy_sid` lifecycle (30d, no renewal, rotate on clear-traces).
- **SEO.md:** E-06b unavailable pages emit `noindex, follow` with automatic restoration; legal/info indexing decision (all indexable, canonicals).
- **TESTING.md:** T-89 (contact), T-90 (admin contracts) rows. `.env.example`: `AGE_LEAVE_URL`.
- **Unresolved by design:** G-04 (external-source selection) remains an operational M2 operator gate — no provider named, assumed, or integrated (per audit instruction).

## [1.0.1] — 2026-09-03 — Documentation QA Audit & Corrections

### Fixed (documentation defects found by QA audit)
- `DESIGN-SYSTEM.md` §4: all eight semantic-token contrast ratios were asserted, not computed; replaced with values computed per the WCAG relative-luminance formula (e.g., Ostiole Gold on Obsidian 6.9→8.1:1, secondary 7→9.9:1, primary 19.5→18.9:1). Documented branding-source discrepancy **B-1**: the brand-guidelines PDF's own contrast figures do not compute (Ostiole vs white "3.2:1" → 2.46:1 actual). Corrected the gold-as-text law: both golds pass WCAG AA normal-text contrast on Obsidian (8.1:1 / 13.4:1); large-only restriction now applies to light surfaces only; body text stays Alabaster for editorial hierarchy.
- `SCREENS.md` S-07: wrong cross-reference "GESTURES §8" → §6 (autoplay policy location).
- **Canonical watch-item status rule** resolved contradiction between `API.md` (opaque 404 for hidden) and `SEO.md` (200 for hidden): hidden/removed → HTTP 404 + E-06 UI; temporarily unavailable → HTTP 200 + E-06 UI + related (mirrored in API §4.2, SEO §5, ERROR-STATES E-06/E-06b, SCREENS S-07).
- `SECURITY.md` §4: CSP `img-src` tightened to `'self' data:` (all imagery is same-origin via the proxy). §14: corrected license claim — fonts are SIL OFL; icons (lucide-react) are ISC; brand assets are project-proprietary.
- `TESTING.md` §8: removed phantom `/system` route (not in any route table) → Storybook primitive gallery. Added test rows T-87/T-88.
- `CHANGELOG.md`/PDF cover: corrected suite count 23 → 24 documents.

### Added (gaps closed by QA audit)
- `API.md` §4.7b `POST /api/events/interaction` — the PRD §10 interaction-event catalogue now has an endpoint contract (whitelist-enforced, 202, 120/min).
- `API.md` §4.8b `POST /api/csp-report` — the CSP `report-uri` referenced by SECURITY.md §4 is now a documented age-exempt endpoint.
- `DATABASE.md` §2.2: `videos.views_24h` / `videos.views_7d` job-maintained columns + indexes (PRD2 sorts/cursors previously referenced an undefined aggregate); §2.18 `interaction_events` table (90-day retention, nightly rollup); §5/§6 index + retention updates.
- **No-automatic-grant rule** (API.md §6.1, docs/LEGAL-COMPLIANCE.md §4): an API key or embed snippet is not itself a grant of redistribution/aggregation rights; ambiguous terms disable a source.
- `SCREENS.md` admin shell: explicit admin empty-state rule (honest zeros, never demo data).
- Consolidated PDF now includes all 24 documents (README.md and CHANGELOG.md added as Part 23).

### Audit trail
- Full QA battery re-run post-correction: file existence, substantiveness, 79+ internal links, placeholder scan, label vocabulary, route/state coverage, brand-guidelines conformance, PDF↔Markdown correspondence with truncation detection — results recorded in the release record.

## [1.0.0] — 2026-09-03 — Documentation Baseline

### Added
- Complete project documentation suite (24 documents: the 23 mandated files plus docs/LEGAL-COMPLIANCE.md) at repository root and `/docs`:
  - Product: `PRD.md` (master product requirements incl. conflicts register), `PRD2.md` (advanced specification: ranking, cursors, cache matrix, adapters, observability, risk register).
  - UX/UI: `SCREENS.md` (22 screen specifications incl. admin panel), `UX-FLOWS.md` (15 workflows + navigation state machine), `GESTURES.md` (touch/mouse/keyboard/player interaction model with capability flags and platform divergences), `DESIGN-SYSTEM.md` (tokens, typography, motion, components, logo rules).
  - Engineering: `ARCHITECTURE.md` (hybrid 3-plane architecture), `DATABASE.md` (17-table PostgreSQL schema, indexes, retention, roles), `API.md` (public + admin API contracts, adapter architecture), `CI-CD.md` (pipeline + quality gates G-1…G-12 incl. no-placeholder gate), `TESTING.md` (test strategy + traceability matrix).
  - Quality & operations: `SECURITY.md` (threat model, CSP, SSRF/privacy controls, checklist), `PERFORMANCE.md` (CWV budgets, caching, loading), `SEO.md`, `ACCESSIBILITY.md` (WCAG 2.2 AA), `ERROR-STATES.md` (E-01…E-20 catalogue), `SOP.md`, `DEPLOYMENT.md` (HTTPS configuration), `PRE-RELEASE.md` (PASS/FAIL release gate).
  - Governance: `AGENT.md` (AI coding-agent laws + milestone plan M1–M5), `README.md`, `CHANGELOG.md`, `docs/DOCUMENTATION-INDEX.md`, `docs/LEGAL-COMPLIANCE.md`.
- Consolidated specification PDF: `docs/SYCONIA-PROJECT-SPECIFICATION.pdf` (generated from this documentation).
- Brand asset inventory registered in `/branding/` (primary logo, symbol-only, monochrome light, app icon, favicon, brand guidelines PDF) — copied from operator-supplied originals.
- Development aid cloned: `ui-ux-pro-max` skill v2.13.0 → `/.skills/` (advisory design heuristics; brand docs override).
- Documentation repository initialized with git baseline.

### Decisions recorded
- Stack locked: Next.js 15 App Router + TypeScript strict + PostgreSQL + Drizzle ORM + `motion` + TanStack Query + Tailwind v4 (token layer) + Zod.
- Fonts selected: Fraunces (serif) + Inter (sans) — both SIL OFL, satisfying the brand guidelines' typography direction legally.
- Conflicts register established (PRD §17): C-1 explicit-asset instruction vs non-explicit brand identity (brand identity wins; explicit material = source-provided thumbnails only, never authored in-repo); C-2 "Corporate Decoy" business misrepresentation rejected (truthful representation policy); C-3 out-of-scope business units excluded.
- Product laws: no user auth, no payments, no creator tools, no public dev API, no media storage, anonymous-first privacy posture, server-enforced 18+ age gate.

### Not implemented (by design, this release)
- All application code, database, and deployments — this baseline is documentation-only; implementation begins at milestone M1 per `AGENT.md` §4.
