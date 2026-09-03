# Phase M4-ADMIN

**Objective (AGENT.md §4):** Admin auth, shell, dashboard, catalog/taxonomy/sources/mappings/takedowns/settings/audit, purge invariant.

**Entry:** M3-DISCOVERY gate PASS · **Exit:** [M4-GATE](../../gates/M4-GATE.md) with evidence

**Tasks:**

| ID | Title | Status | Depends on |
|---|---|---|---|
| [M4-T001](../../tasks/M4/M4-T001.md) | Admin auth: argon2 seed, login A-01, sessions, lockout, cookies/CSRF | NOT_STARTED | M3-GATE (phase gate), M1-T011 |
| [M4-T002](../../tasks/M4/M4-T002.md) | Admin shell + auth-wall middleware + noindex | NOT_STARTED | M4-T001 |
| [M4-T003](../../tasks/M4/M4-T003.md) | Dashboard A-02 (honest KPIs, source health, sync runs) | NOT_STARTED | M4-T002, M2-T019 |
| [M4-T004](../../tasks/M4/M4-T004.md) | Videos management A-03 (search/filter/hide/unhide/resync/detail) | NOT_STARTED | M4-T002, M4-T009 |
| [M4-T005](../../tasks/M4/M4-T005.md) | Categories A-04 + Tags A-05 (CRUD + merge) | NOT_STARTED | M4-T002, M4-T009 |
| [M4-T006](../../tasks/M4/M4-T006.md) | Sources A-06 (terms gate, breaker) + Mappings A-07 (rules, unmapped panel, backfill) | NOT_STARTED | M4-T002, M4-T009 |
| [M4-T007](../../tasks/M4/M4-T007.md) | Takedowns A-08 + Blocks management | NOT_STARTED | M4-T002, M4-T009, M2-T014 |
| [M4-T008](../../tasks/M4/M4-T008.md) | Settings A-09 + Audit log A-10 | NOT_STARTED | M4-T002, M4-T009 |
| [M4-T009](../../tasks/M4/M4-T009.md) | Admin API endpoints (all §5.1 contracts) | NOT_STARTED | M4-T001, M2-T001 |
| [M4-T010](../../tasks/M4/M4-T010.md) | CDN purge path + hide ≤60s invariant test | NOT_STARTED | M4-T004, M4-T007 |
| [M4-T011](../../tasks/M4/M4-T011.md) | Admin E2E suite (T-31…T-35, T-89/T-90) + empty-state rule | NOT_STARTED | M4-T003…T010 |
