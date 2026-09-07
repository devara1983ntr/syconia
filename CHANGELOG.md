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


## [1.0.3] — 2026-09-03 — ANDROID PLATFORM MIGRATION (v1.1.0 baseline)

SYCONIA's implementation target migrates from the web-oriented baseline (Next.js full-stack) to **native Android (Kotlin + Jetpack Compose + Material 3, Clean Architecture, MVVM/UDF, Coroutines/Flow, Hilt, Navigation Compose)** with a retained **Node/TypeScript backend service** (public API, admin console, legal/contact/share web surfaces, ingestion jobs; PostgreSQL 16+/Drizzle unchanged, backend-only). Product scope, laws, gates and the zero-placeholder policy are unchanged. No application code exists — documentation/architecture migration only.

### Migration classification (web-specific → disposition; full registry in .ai/DECISIONS D-010…D-019)
- **KEEP (product/platform-neutral):** all product features F-01…F-15/F-17/F-18; E-state taxonomy; DATABASE.md; API.md contracts; PRD2 math/cursors/TTLs; security server controls; admin console (as backend web); legal surfaces; G-04/B-001/B-002/B-003 gates; AGENT.md §2.1.
- **MODIFY:** AGENT (stack/commands) · SOP (Android+backend setup) · SCREENS (routes→destinations+deep links) · UX-FLOWS (system back, masking→FLAG_SECURE+label masking) · GESTURES (Compose/touch semantics, hardware keyboards) · DESIGN-SYSTEM (§5 fonts→Compose, §7 icons→Material Symbols D-015, §8 window-size classes, §13 M3 theme) · ACCESSIBILITY (Compose/TalkBack/font-scale) · TESTING (Android pyramid + retained backend tests) · CI-CD (dual android+backend tracks; G-gates re-mapped) · DEPLOYMENT (backend topology + honest Android internal-distribution scope) · PRE-RELEASE (build/test rows) · PERFORMANCE (Android budgets + API SLOs) · SEO (scope-reduced: web surfaces + App Links; discovery-web SEO retired — D-018) · PRD (§3.1, F-16, F-21, personas, NFR row) · ARCHITECTURE (client/server rewrite; backend-only Next.js — D-010).
- **REPLACE with Android equivalent:** Next.js routing→Navigation Compose; React components→Compose; React state→ViewModel+StateFlow; TanStack Query→repository/UseCase layer; Tailwind→M3 theme from tokens; browser storage→DataStore (+Keystore); cookies→attestation/session strategy (SECURITY §6A); favicon→adaptive launcher icon (branding pack + AG-001 note); viewport breakpoints→window-size classes; DOM a11y→Compose semantics; service-worker/PWA→retired (F-21); Lighthouse-first→Macrobenchmark/API budgets.
- **REMOVE as platform-specific:** PWA install/offline shell ([PROPOSED] item retired); public web discovery UI (superseded by the app; minimal share/OG web surface retained); web-specific rendering rows (ISR/SSR for public pages); lucide-react (Android equivalent per D-015).
- **BLOCKED (unchanged):** G-04/B-001 source authorization (M2-T008/T009, M2-GATE); B-002 legal finalization; B-003 hosting AUP; AG-001 SVG masters; AG-014 doc screenshots (pending real UI).

### New decisions
D-010 platform architecture & backend retention · D-011 Retrofit/OkHttp/kotlinx-serialization · D-012 Coil · D-013 WebView embed shell · D-014 DataStore-first persistence (Room only task-justified; no local media) · D-015 Material Symbols icons · D-016 version strategy (pin-at-scaffold; minSdk 26; targetSdk Play-current) · D-017 app age attestation approach (mechanism finalized at M1-T011/M2-T010) · D-018 SEO scope reduction · D-019 milestone/task reconciliation model. Recorded in `.ai/DECISIONS.md`.

### Artifacts
Canonical docs migrated in place (no duplicate doc system created). `.ai` execution system reconciled: 75 task records (71 active + 4 retired-with-successor), dispositions recorded per task; roadmap/gates/audits/checklist updated; PDF regenerated from the migrated suite.
