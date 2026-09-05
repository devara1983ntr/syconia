# SYCONIA — Master Execution Checklist (controlled)

Every COMPLETE requires cited evidence in the task file (AGENT §2.1: completion without evidence is prohibited). Gates link to their evidence tables.

## M0-RECON — [M0-GATE](./gates/M0-GATE.md)

| Task | Title | Status | Evidence |
|---|---|---|---|
| [M0-T001](./tasks/M0/M0-T001.md) | Create `.ai/` execution-control system | COMPLETE | commit `docs: add AI implementation execution system` + QUALITY §validation log |
| [M0-T002](./tasks/M0/M0-T002.md) | Record truthful project baseline (current state + audits) | COMPLETE | commit `docs: add AI implementation execution system` + QUALITY §validation log |
| [M0-T003](./tasks/M0/M0-T003.md) | Verify M1 toolchain prerequisites | COMPLETE | task file Completion Evidence: node v24.19.0, npm 11.17.0, PostgreSQL 17.11 reachable 127.0.0.1:5432 (rootless official Debian packages), Playwright 1.62.1 + chromium-1234 · commit `chore(ai): record M0-T003 toolchain verification (M0-T003)` |

## M1-FOUNDATION — [M1-GATE](./gates/M1-GATE.md)

| Task | Title | Status | Evidence |
|---|---|---|---|
| [M1-T001](./tasks/M1/M1-T001.md) | Initialize Next.js + TypeScript strict scaffold | COMPLETE | task file Completion Evidence: `npm run build` PASS (routes `/`+`/_not-found`, 0 warnings), `npm run typecheck` clean, `npm run lint` 0/0, G-7 gate PASS, dev-boot smoke HTTP 200 · lockfile: next 16.3.4 / react 19.2.8 / typescript 5.9.3 strict+noUncheckedIndexedAccess / eslint 9.39.5 flat · commit `feat(app): initialize Next.js + TypeScript strict scaffold (M1-T001)` |
| [M1-T002](./tasks/M1/M1-T002.md) | Install test/quality toolchain (Vitest, Testing Library, Playwright, axe, custom lint rules) | COMPLETE | task file Completion Evidence: `npm run test` 1/1 green (RTL smoke on real home route) · `ci:lint-rules` PASS (all 3 G-8 rules fire on committed fixtures) · Playwright engines verified launch+render+click (chromium 153 / firefox 155 / webkit 26.6) · lint 0/0 · typecheck clean · build green · commit `feat(test): install Vitest/RTL/Playwright/axe toolchain + G-8 lint rules (M1-T002)` |
| [M1-T003](./tasks/M1/M1-T003.md) | Implement design tokens layer + Tailwind v4 wiring | COMPLETE | task file Completion Evidence: 17/17 token tests (snapshot + WCAG contrast re-computation) · lint 0/0 · G-8 PASS incl. new CSS hex scan · G-7 PASS · build green · dev-boot CSS var emission verified · commit `feat(design): implement token layer + Tailwind v4 wiring (M1-T003)` |
| [M1-T004](./tasks/M1/M1-T004.md) | Self-host fonts (Fraunces + Inter) via next/font | COMPLETE | task file Completion Evidence: 34/34 tests (14 font contract + SHA-256 integrity pins + 3 post-build self-hosting assertions) · AG-013 weight pin 400–900 in @font-face · prod-boot smoke (2 preloads, 0 external font URLs, 360440-byte file fetch) · lint 0/0 (M1-T003 lint debt fixed) · G-7/G-8 PASS · build green · commit `feat(fonts): self-host Fraunces + Inter via next/font with AG-013 weight pinning (M1-T004)` |
| [M1-T005](./tasks/M1/M1-T005.md) | Integrate official brand assets (favicon, icons, logo components) | COMPLETE | task file Completion Evidence: ostiole dot measured 105px on the 615px symbol master (D-010) → --space-logo-clear token + geometry module · 4 logo components + watermark (official files only, SHA-256-pinned 13-file public/branding serve map) · favicon/manifest wiring per README config + D-009 any/maskable 192/512 · 43 tests incl. 6 visual snapshots (diff clean) · 145/145 total · G-7/G-8 PASS · build green · commit `feat(brand): integrate official assets — favicon/manifest wiring + logo/watermark components (M1-T005)` |
| [M1-T006](./tasks/M1/M1-T006.md) | Configure Motion (motion/react LazyMotion) | COMPLETE | task file Completion Evidence: 26 motion tests (§9 table verbatim · transform/opacity-only law walker · reduced ≤100ms opacity-only · strict-mode enforcement) · motion@13.2.0 exact · bundle +22.4KB gzip vs 168.3KB framework floor (measured before/after) · 60/60 total · G-7/G-8 PASS · build green · commit `feat(motion): wire LazyMotion domAnimation provider + §9 variant system (M1-T006)` |
| [M1-T007](./tasks/M1/M1-T007.md) | Env validation + Zod boundary schemas (/lib/env.ts, /lib/validation) | COMPLETE | task file Completion Evidence: 42 tests (all §12 vars incl. it.each missing-var fail-closed · secrets-never-logged assertions · bootValidateEnv exit(1) + safe message) · boot proofs on fresh servers (no-env → abort+exit with 10 safe issues; valid → Ready+200) · dotenv $-escaping pitfall found + documented in .env.example · 102/102 total · G-7/G-8 PASS · commit `feat(env): fail-closed Zod environment validation + shared schema home (M1-T007)` |
| [M1-T008](./tasks/M1/M1-T008.md) | Primitives batch 1 — form controls (Button, IconButton, Input, Select, Textarea, Checkbox, Radio, Switch) | COMPLETE | task file Completion Evidence: D-006b state register (states.ts + --press-scale token) · ostiole-dot loading via the §9 motion system · label/hint/error slot wiring · native semantics (select/radio groups/role=switch) · 44px floors · lucide@1.41.0 + Storybook 10.6 (52 stories, build green) · 51 tests incl. axe zero-critical per state matrix + userEvent keyboard journeys · 196/196 total · G-7/G-8 PASS · commit `feat(ui): primitives batch 1 — form controls with full states + Storybook gallery (M1-T008)` |
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
| [DA-GATE](./gates/DA-GATE.md) | PASS WITH CONDITIONS | Design & asset readiness 2026-09-03 — asset pack verified; C-1 (AG-002 visual sign-off) **satisfied 2026-09-03, CLOSED/PASS**; C-2 (AG-001 vector masters) open |
| [M1-GATE](./gates/M1-GATE.md) | NOT_STARTED | NOT_STARTED |
| [M2-GATE](./gates/M2-GATE.md) | BLOCKED | BLOCKED while B-001 open |
| [M3-GATE](./gates/M3-GATE.md) | NOT_STARTED | NOT_STARTED |
| [M4-GATE](./gates/M4-GATE.md) | NOT_STARTED | NOT_STARTED |
| [M5-GATE](./gates/M5-GATE.md) | NOT_STARTED | NOT_STARTED |

**Totals:** 70 tasks — 11 COMPLETE · 55 NOT_STARTED · 4 BLOCKED (M2-T008/T009 ← B-001; M5-T006 ← B-003; M5-T007 ← B-002). Gates: M0 PASS · M2 BLOCKED(B-001) · M1/M3/M4/M5 NOT_STARTED.
