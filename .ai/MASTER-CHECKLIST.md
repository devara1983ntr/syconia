# SYCONIA — Master Execution Checklist (controlled)

Every COMPLETE requires cited evidence in the task file (AGENT §2.1: completion without evidence is prohibited). Gates link to their evidence tables.

## M0-RECON — [M0-GATE](./gates/M0-GATE.md)

| Task | Title | Status | Evidence |
|---|---|---|---|
| [M0-T001](./tasks/M0/M0-T001.md) | Create `.ai/` execution-control system | COMPLETE | commit `docs: add AI implementation execution system` + QUALITY §validation log |
| [M0-T002](./tasks/M0/M0-T002.md) | Record truthful project baseline (current state + audits) | COMPLETE | commit `docs: add AI implementation execution system` + QUALITY §validation log |
| [M0-T003](./tasks/M0/M0-T003.md) | Verify M1 toolchain prerequisites | READY | environment check outputs (pending) |

## M1-FOUNDATION — [M1-GATE](./gates/M1-GATE.md)

| Task | Title | Status | Evidence |
|---|---|---|---|
| [M1-T001](./tasks/M1/M1-T001.md) | Initialize Next.js + TypeScript strict scaffold | NOT_STARTED | — |
| [M1-T002](./tasks/M1/M1-T002.md) | Install test/quality toolchain (Vitest, Testing Library, Playwright, axe, custom lint rules) | NOT_STARTED | — |
| [M1-T003](./tasks/M1/M1-T003.md) | Implement design tokens layer + Tailwind v4 wiring | NOT_STARTED | — |
| [M1-T004](./tasks/M1/M1-T004.md) | Self-host fonts (Fraunces + Inter) via next/font | NOT_STARTED | — |
| [M1-T005](./tasks/M1/M1-T005.md) | Integrate official brand assets (favicon, icons, logo components) | NOT_STARTED | — |
| [M1-T006](./tasks/M1/M1-T006.md) | Configure Motion (motion/react LazyMotion) | NOT_STARTED | — |
| [M1-T007](./tasks/M1/M1-T007.md) | Env validation + Zod boundary schemas (/lib/env.ts, /lib/validation) | NOT_STARTED | — |
| [M1-T008](./tasks/M1/M1-T008.md) | Primitives batch 1 — form controls (Button, IconButton, Input, Select, Textarea, Checkbox, Radio, Switch) | NOT_STARTED | — |
| [M1-T009](./tasks/M1/M1-T009.md) | Primitives batch 2 — overlays & navigation (Badge, Tooltip, Dropdown, Modal, Drawer, BottomSheet, Tabs, Toast, Alert, Pagination, Breadcrumb) | NOT_STARTED | — |
| [M1-T010](./tasks/M1/M1-T010.md) | Primitives batch 3 — media/data/states (Card, Avatar, Skeleton, SearchBar combobox, FilterBar, EmptyState, LoadingState, ErrorState, OfflineBanner, chips/badges) | NOT_STARTED | — |
| [M1-T011](./tasks/M1/M1-T011.md) | Middleware: age-gate enforcement + security headers + request-id | NOT_STARTED | — |
| [M1-T012](./tasks/M1/M1-T012.md) | Age Gate screen S-01 | NOT_STARTED | — |
| [M1-T013](./tasks/M1/M1-T013.md) | Global chrome S-00 (header, hamburger drawer, back arrow, footer) | NOT_STARTED | — |
| [M1-T014](./tasks/M1/M1-T014.md) | Public routing scaffold for all screens + four-state wiring | NOT_STARTED | — |
| [M1-T015](./tasks/M1/M1-T015.md) | Legal/info pages S-08 with real draft copy + contact form | NOT_STARTED | — |
| [M1-T016](./tasks/M1/M1-T016.md) | System pages: 404 / 500 / offline + E-16/E-17/E-05 compositions | NOT_STARTED | — |
| [M1-T017](./tasks/M1/M1-T017.md) | E2E smoke suite + axe wiring (golden journeys) | NOT_STARTED | — |
| [M1-T018](./tasks/M1/M1-T018.md) | Storybook primitive gallery + visual-regression harness | NOT_STARTED | — |

## M2-MEDIA-SOURCE — [M2-GATE](./gates/M2-GATE.md)

| Task | Title | Status | Evidence |
|---|---|---|---|
| [M2-T001](./tasks/M2/M2-T001.md) | Drizzle schema + migrations for all 18 tables | NOT_STARTED | — |
| [M2-T002](./tasks/M2/M2-T002.md) | DB roles, pooling, backup/PITR (staging) | NOT_STARTED | — |
| [M2-T003](./tasks/M2/M2-T003.md) | Adapter framework + SSRF-hardened HTTP client + circuit breaker | NOT_STARTED | — |
| [M2-T004](./tasks/M2/M2-T004.md) | Normalization pipeline (NormalizedVideo DTO, field-wise Zod, quarantine) | NOT_STARTED | — |
| [M2-T005](./tasks/M2/M2-T005.md) | sync-sources job + blocked_entries stickiness + sync_runs | NOT_STARTED | — |
| [M2-T006](./tasks/M2/M2-T006.md) | Ops jobs: probe-availability, refresh-trending, rollup-daily, purge-expired, sitemap-refresh + cron wiring | NOT_STARTED | — |
| [M2-T007](./tasks/M2/M2-T007.md) | Mapping rules engine + mapping-backfill job | NOT_STARTED | — |
| [M2-T008](./tasks/M2/M2-T008.md) | ★ GATE (G-04/B-001): operator source selection + terms verification record | BLOCKED | B-001 |
| [M2-T009](./tasks/M2/M2-T009.md) | ★ First source adapter module (post-authorization) | BLOCKED | B-001 |
| [M2-T010](./tasks/M2/M2-T010.md) | Public data APIs: /api/videos (+related), /api/videos/{slug} | NOT_STARTED | — |
| [M2-T011](./tasks/M2/M2-T011.md) | Search APIs: /api/search + /api/search/suggest | NOT_STARTED | — |
| [M2-T012](./tasks/M2/M2-T012.md) | Taxonomy APIs: categories + tags (bounded/paginated) | NOT_STARTED | — |
| [M2-T013](./tasks/M2/M2-T013.md) | Events APIs: watch beacons, interaction beacons, csp-report, client-error | NOT_STARTED | — |
| [M2-T014](./tasks/M2/M2-T014.md) | Report + contact endpoints | NOT_STARTED | — |
| [M2-T015](./tasks/M2/M2-T015.md) | Home screen S-02 wired to real data | NOT_STARTED | — |
| [M2-T016](./tasks/M2/M2-T016.md) | Search screen S-03 wired (filters, sort, URL state, states) | NOT_STARTED | — |
| [M2-T017](./tasks/M2/M2-T017.md) | Categories & tags screens S-04/S-05/S-06 wired | NOT_STARTED | — |
| [M2-T018](./tasks/M2/M2-T018.md) | TanStack Query client layer (cursor pagination, race policy) | NOT_STARTED | — |
| [M2-T019](./tasks/M2/M2-T019.md) | Analytics retention wiring (rollups + purge + admin-ready aggregates) | NOT_STARTED | — |

## M3-DISCOVERY — [M3-GATE](./gates/M3-GATE.md)

| Task | Title | Status | Evidence |
|---|---|---|---|
| [M3-T001](./tasks/M3/M3-T001.md) | Player shell: stage, poster→init, watermark, capability chrome | NOT_STARTED | — |
| [M3-T002](./tasks/M3/M3-T002.md) | Embed security + dynamic CSP frame-src | NOT_STARTED | — |
| [M3-T003](./tasks/M3/M3-T003.md) | Player state machine + failure ladder E-07/E-08 + fallbacks | NOT_STARTED | — |
| [M3-T004](./tasks/M3/M3-T004.md) | Watch page S-07 (metadata, provenance, tags, theater, no-JS) | NOT_STARTED | — |
| [M3-T005](./tasks/M3/M3-T005.md) | Related rail (PRD2 §2.5 algorithm + relatedCursor continuation) | NOT_STARTED | — |
| [M3-T006](./tasks/M3/M3-T006.md) | Watch beacons (quartiles) + view semantics | NOT_STARTED | — |
| [M3-T007](./tasks/M3/M3-T007.md) | Report modal S-07R + takedown intake UX | NOT_STARTED | — |
| [M3-T008](./tasks/M3/M3-T008.md) | Player interaction suite (GESTURES §9 matrix) | NOT_STARTED | — |
| [M3-T009](./tasks/M3/M3-T009.md) | Mobile player behaviors + discretion features | NOT_STARTED | — |
| [M3-T010](./tasks/M3/M3-T010.md) | Watch a11y + keyboard completion | NOT_STARTED | — |

## M4-ADMIN — [M4-GATE](./gates/M4-GATE.md)

| Task | Title | Status | Evidence |
|---|---|---|---|
| [M4-T001](./tasks/M4/M4-T001.md) | Admin auth: argon2 seed, login A-01, sessions, lockout, cookies/CSRF | NOT_STARTED | — |
| [M4-T002](./tasks/M4/M4-T002.md) | Admin shell + auth-wall middleware + noindex | NOT_STARTED | — |
| [M4-T003](./tasks/M4/M4-T003.md) | Dashboard A-02 (honest KPIs, source health, sync runs) | NOT_STARTED | — |
| [M4-T004](./tasks/M4/M4-T004.md) | Videos management A-03 (search/filter/hide/unhide/resync/detail) | NOT_STARTED | — |
| [M4-T005](./tasks/M4/M4-T005.md) | Categories A-04 + Tags A-05 (CRUD + merge) | NOT_STARTED | — |
| [M4-T006](./tasks/M4/M4-T006.md) | Sources A-06 (terms gate, breaker) + Mappings A-07 (rules, unmapped panel, backfill) | NOT_STARTED | — |
| [M4-T007](./tasks/M4/M4-T007.md) | Takedowns A-08 + Blocks management | NOT_STARTED | — |
| [M4-T008](./tasks/M4/M4-T008.md) | Settings A-09 + Audit log A-10 | NOT_STARTED | — |
| [M4-T009](./tasks/M4/M4-T009.md) | Admin API endpoints (all §5.1 contracts) | NOT_STARTED | — |
| [M4-T010](./tasks/M4/M4-T010.md) | CDN purge path + hide ≤60s invariant test | NOT_STARTED | — |
| [M4-T011](./tasks/M4/M4-T011.md) | Admin E2E suite (T-31…T-35, T-89/T-90) + empty-state rule | NOT_STARTED | — |

## M5-HARDENING-RELEASE — [M5-GATE](./gates/M5-GATE.md)

| Task | Title | Status | Evidence |
|---|---|---|---|
| [M5-T001](./tasks/M5/M5-T001.md) | Performance budget enforcement (Lighthouse CI + RUM) | NOT_STARTED | — |
| [M5-T002](./tasks/M5/M5-T002.md) | SEO artifacts (metadata, sitemap, robots, RTA, JSON-LD, redirects) | NOT_STARTED | — |
| [M5-T003](./tasks/M5/M5-T003.md) | Security checklist execution (SECURITY §17) | NOT_STARTED | — |
| [M5-T004](./tasks/M5/M5-T004.md) | Full accessibility audit | NOT_STARTED | — |
| [M5-T005](./tasks/M5/M5-T005.md) | CI/CD pipeline finalization (G-1…G-12 live) | NOT_STARTED | — |
| [M5-T006](./tasks/M5/M5-T006.md) | Production deployment (HTTPS, HSTS, env, monitor, rollback) — B-003 | BLOCKED | B-003 |
| [M5-T007](./tasks/M5/M5-T007.md) | Legal finalization (counsel review, designated agent) — B-002 | BLOCKED | B-002 |
| [M5-T008](./tasks/M5/M5-T008.md) | PRE-RELEASE full run + release record | NOT_STARTED | — |
| [M5-T009](./tasks/M5/M5-T009.md) | FINAL-VERIFICATION execution | NOT_STARTED | — |

## Gate status

| Gate | Status | Note |
|---|---|---|
| [M0-GATE](./gates/M0-GATE.md) | PASS | PASS 2026-09-03 (evidence in gate file) |
| [M1-GATE](./gates/M1-GATE.md) | NOT_STARTED | NOT_STARTED |
| [M2-GATE](./gates/M2-GATE.md) | BLOCKED | BLOCKED while B-001 open |
| [M3-GATE](./gates/M3-GATE.md) | NOT_STARTED | NOT_STARTED |
| [M4-GATE](./gates/M4-GATE.md) | NOT_STARTED | NOT_STARTED |
| [M5-GATE](./gates/M5-GATE.md) | NOT_STARTED | NOT_STARTED |

**Totals:** 70 tasks — 2 COMPLETE · 1 READY · 63 NOT_STARTED · 4 BLOCKED (M2-T008/T009 ← B-001; M5-T006 ← B-003; M5-T007 ← B-002). Gates: M0 PASS · M2 BLOCKED(B-001) · M1/M3/M4/M5 NOT_STARTED.
