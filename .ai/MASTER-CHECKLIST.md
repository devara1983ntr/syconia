# SYCONIA — Master Execution Checklist (v1.1.0 — controlled)

Every COMPLETE requires cited evidence in the task file (AGENT §2.1). Gates link to evidence tables.

## M0-RECON — [M0-GATE](./gates/M0-GATE.md)

| Task | Title | Status | Disposition | Evidence |
|---|---|---|---|---|
| [M0-T001](./tasks/M0/M0-T001.md) | Create `.ai/` execution-control system | COMPLETE | KEEP (historical web-era COMPLETE; content superseded by v1.1.0 regeneration) | migration commit chain (v1.1.0) |
| [M0-T002](./tasks/M0/M0-T002.md) | Record truthful project baseline (current state + audits) | COMPLETE | KEEP (historical COMPLETE) | migration commit chain (v1.1.0) |
| [M0-T003](./tasks/M0/M0-T003.md) | Verify Android + backend toolchain prerequisites | BLOCKED† | MODIFY (was: web toolchain; redefined for Android v1.1.0) | B-004 (emulator AC; build path verified 2026-09-07 — evidence in task file) |
| [M0-T004](./tasks/M0/M0-T004.md) | Platform migration: documentation + architecture + roadmap (web → Android) | COMPLETE | NEW (v1.1.0) | migration commit chain (v1.1.0) |
## M1-ANDROID-FOUNDATION — [M1-GATE](./gates/M1-GATE.md)

| Task | Title | Status | Disposition | Evidence |
|---|---|---|---|---|
| [M1-T001](./tasks/M1/M1-T001.md) | Android Gradle scaffold (Kotlin, Compose, Hilt, multi-module) | NOT_STARTED† | REPLACE (was Next.js scaffold) | — |
| [M1-T002](./tasks/M1/M1-T002.md) | Android quality toolchain (detekt, ktlint, unit/emulator harness, CI android track) | NOT_STARTED† | MODIFY (was web tooling) | — |
| [M1-T003](./tasks/M1/M1-T003.md) | SyconiaTheme: Material 3 theme from SYCONIA tokens | NOT_STARTED† | REPLACE (was tokens.css/Tailwind wiring) | — |
| [M1-T004](./tasks/M1/M1-T004.md) | Bundled fonts (Fraunces + Inter) in Compose | NOT_STARTED† | MODIFY (was next/font self-hosting) | — |
| [M1-T005](./tasks/M1/M1-T005.md) | Launcher + adaptive icons from official assets | NOT_STARTED† | REPLACE (was favicon wiring) | — |
| [M1-T006](./tasks/M1/M1-T006.md) | Motion spec in Compose (DS §9 values) | NOT_STARTED† | MODIFY (was motion/react config) | — |
| [M1-T007](./tasks/M1/M1-T007.md) | App config + secure defaults (endpoint config, no secrets) | NOT_STARTED† | MODIFY (was env.ts) | — |
| [M1-T008](./tasks/M1/M1-T008.md) | Component batch 1 — controls (Button, IconButton, TextField, Select, Checkbox, Switch, Slider) | NOT_STARTED† | MODIFY (was web primitives) | — |
| [M1-T009](./tasks/M1/M1-T009.md) | Component batch 2 — overlays & navigation (Badge, Tooltip, Dropdown, Modal/Dialog, DrawerSheet, BottomSheet, Tabs, Toast, Alert, Pagination, Breadcrumb) | NOT_STARTED† | MODIFY | — |
| [M1-T010](./tasks/M1/M1-T010.md) | Component batch 3 — media/data/states (Card, Skeleton, SearchField, FilterBar, EmptyState, ErrorState, OfflineBanner, chips, DurationBadge, MetaRow, ProvenanceChip) | NOT_STARTED | MODIFY | — |
| [M1-T011](./tasks/M1/M1-T011.md) | Age gate: first-run 18+ gate + DataStore persistence + API attestation header | NOT_STARTED | MODIFY (was middleware+cookie) | — |
| [M1-T012](./tasks/M1/M1-T012.md) | Age Gate screen S-01 (Compose) | NOT_STARTED | MODIFY (was web S-01) | — |
| [M1-T013](./tasks/M1/M1-T013.md) | Global chrome S-00: top bar, navigation drawer, system back, search entry | NOT_STARTED | MODIFY (was header/hamburger web chrome) | — |
| [M1-T014](./tasks/M1/M1-T014.md) | Navigation graph: all destinations + deep links + state restoration | NOT_STARTED | MODIFY (was routing scaffold) | — |
| [M1-T015](./tasks/M1/M1-T015.md) | In-app legal + about + contact surfaces | NOT_STARTED | MODIFY (was web legal pages) | — |
| [M1-T016](./tasks/M1/M1-T016.md) | System screens: error/offline/no-connectivity compositions (E-05/E-16/E-17) | NOT_STARTED | MODIFY (was 404/500/offline web) | — |
| [M1-T017](./tasks/M1/M1-T017.md) | E2E smoke suite (golden journeys) on emulator | NOT_STARTED | MODIFY (was Playwright smoke) | — |
| [M1-T018](./tasks/M1/M1-T018.md) | Component gallery: previews + screenshot regression baselines | NOT_STARTED | MODIFY (was Storybook) | — |
| [M1-T019](./tasks/M1/M1-T019.md) | Data/domain architecture layer (Retrofit services, DTO mapping, repositories, DataStore) | NOT_STARTED | REPLACE (supersedes retired M2-T018 TanStack layer) | — |
## M2-CATALOG — [M2-GATE](./gates/M2-GATE.md)

| Task | Title | Status | Disposition | Evidence |
|---|---|---|---|---|
| [M2-T001](./tasks/M2/M2-T001.md) | Drizzle schema + migrations for all 18 tables | NOT_STARTED | KEEP (backend; unchanged) | — |
| [M2-T002](./tasks/M2/M2-T002.md) | DB roles, pooling, backup/PITR (staging) | NOT_STARTED | KEEP (backend) | — |
| [M2-T003](./tasks/M2/M2-T003.md) | Adapter framework + SSRF client + breaker | NOT_STARTED | KEEP (backend) | — |
| [M2-T004](./tasks/M2/M2-T004.md) | Normalization pipeline | NOT_STARTED | KEEP (backend) | — |
| [M2-T005](./tasks/M2/M2-T005.md) | sync-sources job + blocked stickiness + sync_runs | NOT_STARTED | KEEP (backend) | — |
| [M2-T006](./tasks/M2/M2-T006.md) | Ops jobs: probe, trending, rollups, purge, sitemap-refresh(legal-only), cron | NOT_STARTED | KEEP (backend; sitemap scope-reduced per D-018) | — |
| [M2-T007](./tasks/M2/M2-T007.md) | Mapping rules engine + backfill | NOT_STARTED | KEEP (backend) | — |
| [M2-T008](./tasks/M2/M2-T008.md) | Operator source selection + terms verification record | BLOCKED | KEEP — ★ BLOCKED (B-001/G-04; unchanged) | B-001 |
| [M2-T009](./tasks/M2/M2-T009.md) | First source adapter module (post-authorization) | BLOCKED | KEEP — ★ BLOCKED (B-001; unchanged) | B-001 |
| [M2-T010](./tasks/M2/M2-T010.md) | Public data APIs: /api/videos (+related), /api/videos/{slug} | NOT_STARTED | KEEP (backend; age mechanism per SECURITY §6A) | — |
| [M2-T011](./tasks/M2/M2-T011.md) | Search APIs: /api/search + /api/search/suggest | NOT_STARTED | KEEP (backend) | — |
| [M2-T012](./tasks/M2/M2-T012.md) | Taxonomy APIs: categories + tags | NOT_STARTED | KEEP (backend) | — |
| [M2-T013](./tasks/M2/M2-T013.md) | Events APIs: watch/interaction beacons, csp-report(web), client-error(app+web) | NOT_STARTED | KEEP (backend; app beacons flush on background) | — |
| [M2-T014](./tasks/M2/M2-T014.md) | Report + contact endpoints | NOT_STARTED | KEEP (backend) | — |
| [M2-T015](./tasks/M2/M2-T015.md) | M5-T010 | RETIRED | **RETIRED (v1.1.0 platform migration)** — superseded by Home/discovery screens moved to the Android client (they consume M2 APIs via M1-T019). | retired (successor recorded in file) |
| [M2-T016](./tasks/M2/M2-T016.md) | M5-T011 | RETIRED | **RETIRED (v1.1.0 platform migration)** — superseded by Search screen moved to the Android client. | retired (successor recorded in file) |
| [M2-T017](./tasks/M2/M2-T017.md) | M5-T012 | RETIRED | **RETIRED (v1.1.0 platform migration)** — superseded by Categories/tags screens moved to the Android client. | retired (successor recorded in file) |
| [M2-T018](./tasks/M2/M2-T018.md) | M1-T019 | RETIRED | **RETIRED (v1.1.0 platform migration)** — superseded by TanStack Query client layer replaced by the Android data/domain architecture layer. | retired (successor recorded in file) |
| [M2-T019](./tasks/M2/M2-T019.md) | Analytics retention wiring (rollups + purge + admin-ready aggregates) | NOT_STARTED | KEEP (backend) | — |

## M3-WATCH — [M3-GATE](./gates/M3-GATE.md)

| Task | Title | Status | Disposition | Evidence |
|---|---|---|---|---|
| [M3-T001](./tasks/M3/M3-T001.md) | Player shell: stage, poster→init, watermark, capability chrome (Compose + WebView) | NOT_STARTED | MODIFY (player shell now Android) | — |
| [M3-T002](./tasks/M3/M3-T002.md) | Embed security deep-pass + lifecycle (rotation/background/PiP decision) | NOT_STARTED | MODIFY (was web embed security) | — |
| [M3-T003](./tasks/M3/M3-T003.md) | Player state machine + failure ladder E-07/E-08 | NOT_STARTED | MODIFY (Compose FSM) | — |
| [M3-T004](./tasks/M3/M3-T004.md) | Watch destination S-07: metadata, provenance, tags, theater | NOT_STARTED | MODIFY (was watch page) | — |
| [M3-T005](./tasks/M3/M3-T005.md) | Related rail (PRD2 §2.5 + continuation) | NOT_STARTED | MODIFY | — |
| [M3-T006](./tasks/M3/M3-T006.md) | Watch beacons (quartiles) + session semantics | NOT_STARTED | MODIFY (beacons flush on backgrounding) | — |
| [M3-T007](./tasks/M3/M3-T007.md) | Report flow S-07R + takedown intake UX | NOT_STARTED | MODIFY | — |
| [M3-T008](./tasks/M3/M3-T008.md) | Player interaction suite (GESTURES matrix on device) | NOT_STARTED | MODIFY | — |
| [M3-T009](./tasks/M3/M3-T009.md) | Mobile behaviors + discretion features (FLAG_SECURE, label masking, session traces) | NOT_STARTED | MODIFY (was web discretion) | — |
| [M3-T010](./tasks/M3/M3-T010.md) | Watch a11y + TalkBack completion | NOT_STARTED | MODIFY | — |

## M4-ADMIN — [M4-GATE](./gates/M4-GATE.md)

| Task | Title | Status | Disposition | Evidence |
|---|---|---|---|---|
| [M4-T001](./tasks/M4/M4-T001.md) | Admin auth: argon2 seed, login A-01, sessions, lockout (backend web) | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |
| [M4-T002](./tasks/M4/M4-T002.md) | Admin shell + auth guard + noindex (backend web) | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |
| [M4-T003](./tasks/M4/M4-T003.md) | Dashboard A-02 (honest KPIs) | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |
| [M4-T004](./tasks/M4/M4-T004.md) | Videos management A-03 | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |
| [M4-T005](./tasks/M4/M4-T005.md) | Categories A-04 + Tags A-05 (CRUD + merge) | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |
| [M4-T006](./tasks/M4/M4-T006.md) | Sources A-06 (terms gate) + Mappings A-07 | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |
| [M4-T007](./tasks/M4/M4-T007.md) | Takedowns A-08 + Blocks | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |
| [M4-T008](./tasks/M4/M4-T008.md) | Settings A-09 + Audit log A-10 | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |
| [M4-T009](./tasks/M4/M4-T009.md) | Admin API endpoints (§5.1 contracts) | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |
| [M4-T010](./tasks/M4/M4-T010.md) | CDN purge path + hide ≤60s invariant | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |
| [M4-T011](./tasks/M4/M4-T011.md) | Admin E2E suite (Playwright, backend track) + empty-state rule | NOT_STARTED | KEEP (backend web console — unchanged scope) | — |

## M5-DISCOVERY-RELEASE — [M5-GATE](./gates/M5-GATE.md)

| Task | Title | Status | Disposition | Evidence |
|---|---|---|---|---|
| [M5-T001](./tasks/M5/M5-T001.md) | Performance & stability enforcement (Android budgets + API SLOs + RUM) | NOT_STARTED | MODIFY (was Lighthouse-first) | — |
| [M5-T002](./tasks/M5/M5-T002.md) | Discoverability artifacts: App Links, assetlinks, OG share pages, legal SEO | NOT_STARTED | MODIFY (was full web SEO) | — |
| [M5-T003](./tasks/M5/M5-T003.md) | Security checklist execution (SECURITY §17 + §2A Android) | NOT_STARTED | MODIFY (adds Android) | — |
| [M5-T004](./tasks/M5/M5-T004.md) | Full accessibility audit (TalkBack-first) | NOT_STARTED | MODIFY (was web a11y audit) | — |
| [M5-T005](./tasks/M5/M5-T005.md) | CI/CD finalization (dual-track G-1…G-12 live) | NOT_STARTED | MODIFY (android+backend) | — |
| [M5-T006](./tasks/M5/M5-T006.md) | Deployment & distribution (backend hosting + Android internal track) — decision + execution (B-003-class) | BLOCKED | MODIFY (was web-only deployment) | B-003 |
| [M5-T007](./tasks/M5/M5-T007.md) | Legal finalization (counsel review, designated agent) — B-002 | BLOCKED | KEEP (BLOCKED, unchanged) | B-002 |
| [M5-T008](./tasks/M5/M5-T008.md) | PRE-RELEASE full run + release record | NOT_STARTED | MODIFY (v1.1.0 checklist) | — |
| [M5-T009](./tasks/M5/M5-T009.md) | FINAL-VERIFICATION execution | NOT_STARTED | KEEP | — |
| [M5-T010](./tasks/M5/M5-T010.md) | Home/discovery destination S-02 (supersedes retired M2-T015) | NOT_STARTED | NEW (successor of M2-T015) | — |
| [M5-T011](./tasks/M5/M5-T011.md) | Search destination S-03 (supersedes retired M2-T016) | NOT_STARTED | NEW (successor of M2-T016) | — |
| [M5-T012](./tasks/M5/M5-T012.md) | Categories + tags destinations S-04/S-05/S-06 (supersede retired M2-T017) | NOT_STARTED | NEW (successor of M2-T017) | — |
| [M5-T013](./tasks/M5/M5-T013.md) | Offline/cache strategy decision + implementation (Room justification gate) | NOT_STARTED | NEW (D-014 discipline) | — |

## Gate status

| Gate | Status | Note |
|---|---|---|
| [M0-GATE](./gates/M0-GATE.md) | PASS | PASS 2026-09-03 + migration rows (see gate file) |
| [M1-GATE](./gates/M1-GATE.md) | NOT_STARTED | NOT_STARTED |
| [M2-GATE](./gates/M2-GATE.md) | BLOCKED | BLOCKED while B-001 open (unchanged) |
| [M3-GATE](./gates/M3-GATE.md) | NOT_STARTED | NOT_STARTED |
| [M4-GATE](./gates/M4-GATE.md) | NOT_STARTED | NOT_STARTED |
| [M5-GATE](./gates/M5-GATE.md) | NOT_STARTED | NOT_STARTED |
| [DA-GATE](./gates/DA-GATE.md) | PASS WITH CONDITIONS | C-1 satisfied 2026-09-03 (AG-002 closed); C-2 (AG-001) open — non-blocking |

**Totals (v1.1.0):** 76 task records — 3 COMPLETE · 64 NOT_STARTED · 5 BLOCKED (M0-T003←B-004, M2-T008/T009←B-001, M5-T006←B-003, M5-T007←B-002) · 4 RETIRED (successors: M5-T010/011/012, M1-T019).

**† (10 records)** Web-platform predecessor COMPLETE — executed 2026-09-05 on the web stack, superseded by the Android v1.1.0 redefinition, web implementation retained in-tree (M5 web track). Records: M0-T003, M1-T001–M1-T009. Full evidence: each task file's predecessor section + the 2026-09-07 reconciliation merge (D-022).
