# Changelog

All notable changes to the SYCONIA project are documented here. Format: Keep a Changelog; versioning: SemVer.

## [1.0.0] — 2026-09-03 — Documentation Baseline

### Added
- Complete project documentation suite (23 documents) at repository root and `/docs`:
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
