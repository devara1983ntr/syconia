# Changelog

All notable changes to the SYCONIA project are documented here. Format: Keep a Changelog; versioning: SemVer.

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
