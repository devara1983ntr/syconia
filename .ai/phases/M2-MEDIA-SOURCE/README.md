# Phase M2-MEDIA-SOURCE

**Objective (AGENT.md §4):** Schema/migrations, adapter framework, sync+jobs, mapping engine, source gate (B-001), public APIs, discovery screens, analytics.

**Entry:** M1-FOUNDATION gate PASS · **Exit:** [M2-GATE](../../gates/M2-GATE.md) with evidence

**Tasks:**

| ID | Title | Status | Depends on |
|---|---|---|---|
| [M2-T001](../../tasks/M2/M2-T001.md) | Drizzle schema + migrations for all 18 tables | NOT_STARTED | M1-T001, M1-T007 |
| [M2-T002](../../tasks/M2/M2-T002.md) | DB roles, pooling, backup/PITR (staging) | NOT_STARTED | M2-T001 |
| [M2-T003](../../tasks/M2/M2-T003.md) | Adapter framework + SSRF-hardened HTTP client + circuit breaker | NOT_STARTED | M1-T007 |
| [M2-T004](../../tasks/M2/M2-T004.md) | Normalization pipeline (NormalizedVideo DTO, field-wise Zod, quarantine) | NOT_STARTED | M2-T003 |
| [M2-T005](../../tasks/M2/M2-T005.md) | sync-sources job + blocked_entries stickiness + sync_runs | NOT_STARTED | M2-T001, M2-T002, M2-T004 |
| [M2-T006](../../tasks/M2/M2-T006.md) | Ops jobs: probe-availability, refresh-trending, rollup-daily, purge-expired, sitemap-refresh + cron wiring | NOT_STARTED | M2-T005 |
| [M2-T007](../../tasks/M2/M2-T007.md) | Mapping rules engine + mapping-backfill job | NOT_STARTED | M2-T005 |
| [M2-T008](../../tasks/M2/M2-T008.md) | ★ GATE (G-04/B-001): operator source selection + terms verification record | BLOCKED | M2-T003, M2-T004 |
| [M2-T009](../../tasks/M2/M2-T009.md) | ★ First source adapter module (post-authorization) | BLOCKED | M2-T008 |
| [M2-T010](../../tasks/M2/M2-T010.md) | Public data APIs: /api/videos (+related), /api/videos/{slug} | NOT_STARTED | M2-T001, M2-T005 |
| [M2-T011](../../tasks/M2/M2-T011.md) | Search APIs: /api/search + /api/search/suggest | NOT_STARTED | M2-T010 |
| [M2-T012](../../tasks/M2/M2-T012.md) | Taxonomy APIs: categories + tags (bounded/paginated) | NOT_STARTED | M2-T010 |
| [M2-T013](../../tasks/M2/M2-T013.md) | Events APIs: watch beacons, interaction beacons, csp-report, client-error | NOT_STARTED | M2-T001, M2-T010 |
| [M2-T014](../../tasks/M2/M2-T014.md) | Report + contact endpoints | NOT_STARTED | M2-T001, M2-T013 |
| [M2-T015](../../tasks/M2/M2-T015.md) | Home screen S-02 wired to real data | NOT_STARTED | M2-T010, M2-T018 |
| [M2-T016](../../tasks/M2/M2-T016.md) | Search screen S-03 wired (filters, sort, URL state, states) | NOT_STARTED | M2-T011, M2-T012, M2-T018 |
| [M2-T017](../../tasks/M2/M2-T017.md) | Categories & tags screens S-04/S-05/S-06 wired | NOT_STARTED | M2-T012, M2-T018 |
| [M2-T018](../../tasks/M2/M2-T018.md) | TanStack Query client layer (cursor pagination, race policy) | NOT_STARTED | M1-T001, M2-T010 |
| [M2-T019](../../tasks/M2/M2-T019.md) | Analytics retention wiring (rollups + purge + admin-ready aggregates) | NOT_STARTED | M2-T006, M2-T013 |
