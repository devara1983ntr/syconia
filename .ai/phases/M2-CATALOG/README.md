# Phase M2-CATALOG (v1.1.0)

**Objective:** backend catalog/data plane: schema, adapters, sync, mapping, public APIs (G-04/B-001 gate intact).

**Entry:** prior phase gate PASS · **Exit:** [M2-GATE](../../gates/M2-GATE.md) with evidence

| ID | Title | Status | Deps | Disposition |
|---|---|---|---|---|
| [M2-T001](../../tasks/M2/M2-T001.md) | Drizzle schema + migrations for all 18 tables | NOT_STARTED | M1-T001 | KEEP (backend; unchanged) |
| [M2-T002](../../tasks/M2/M2-T002.md) | DB roles, pooling, backup/PITR (staging) | NOT_STARTED | M1-T001 | KEEP (backend) |
| [M2-T003](../../tasks/M2/M2-T003.md) | Adapter framework + SSRF client + breaker | NOT_STARTED | M1-T001 | KEEP (backend) |
| [M2-T004](../../tasks/M2/M2-T004.md) | Normalization pipeline | NOT_STARTED | M2-T003 | KEEP (backend) |
| [M2-T005](../../tasks/M2/M2-T005.md) | sync-sources job + blocked stickiness + sync_runs | NOT_STARTED | M2-T001, M2-T002, M2-T004 | KEEP (backend) |
| [M2-T006](../../tasks/M2/M2-T006.md) | Ops jobs: probe, trending, rollups, purge, sitemap-refresh(legal-only), cron | NOT_STARTED | M2-T005 | KEEP (backend; sitemap scope-reduced per D-018) |
| [M2-T007](../../tasks/M2/M2-T007.md) | Mapping rules engine + backfill | NOT_STARTED | M2-T005 | KEEP (backend) |
| [M2-T008](../../tasks/M2/M2-T008.md) | Operator source selection + terms verification record | BLOCKED | M2-T003, M2-T004 | KEEP — ★ BLOCKED (B-001/G-04; unchanged) |
| [M2-T009](../../tasks/M2/M2-T009.md) | First source adapter module (post-authorization) | BLOCKED | M2-T008 | KEEP — ★ BLOCKED (B-001; unchanged) |
| [M2-T010](../../tasks/M2/M2-T010.md) | Public data APIs: /api/videos (+related), /api/videos/{slug} | NOT_STARTED | M2-T001, M2-T005 | KEEP (backend; age mechanism per SECURITY §6A) |
| [M2-T011](../../tasks/M2/M2-T011.md) | Search APIs: /api/search + /api/search/suggest | NOT_STARTED | M2-T010 | KEEP (backend) |
| [M2-T012](../../tasks/M2/M2-T012.md) | Taxonomy APIs: categories + tags | NOT_STARTED | M2-T010 | KEEP (backend) |
| [M2-T013](../../tasks/M2/M2-T013.md) | Events APIs: watch/interaction beacons, csp-report(web), client-error(app+web) | NOT_STARTED | M2-T001, M2-T010 | KEEP (backend; app beacons flush on background) |
| [M2-T014](../../tasks/M2/M2-T014.md) | Report + contact endpoints | NOT_STARTED | M2-T001, M2-T013 | KEEP (backend) |
| [M2-T015](../../tasks/M2/M2-T015.md) | M5-T010 | RETIRED | — | **RETIRED (v1.1.0 platform migration)** — superseded by Home/discovery screens moved to the Android client (they consume M2 APIs via M1-T019). |
| [M2-T016](../../tasks/M2/M2-T016.md) | M5-T011 | RETIRED | — | **RETIRED (v1.1.0 platform migration)** — superseded by Search screen moved to the Android client. |
| [M2-T017](../../tasks/M2/M2-T017.md) | M5-T012 | RETIRED | — | **RETIRED (v1.1.0 platform migration)** — superseded by Categories/tags screens moved to the Android client. |
| [M2-T018](../../tasks/M2/M2-T018.md) | M1-T019 | RETIRED | — | **RETIRED (v1.1.0 platform migration)** — superseded by TanStack Query client layer replaced by the Android data/domain architecture layer. |
| [M2-T019](../../tasks/M2/M2-T019.md) | Analytics retention wiring (rollups + purge + admin-ready aggregates) | NOT_STARTED | M2-T006, M2-T013 | KEEP (backend) |
