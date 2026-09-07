# Phase M4-ADMIN (v1.1.0)

**Objective:** backend admin console + APIs + purge invariant.

**Entry:** prior phase gate PASS · **Exit:** [M4-GATE](../../gates/M4-GATE.md) with evidence

| ID | Title | Status | Deps | Disposition |
|---|---|---|---|---|
| [M4-T001](../../tasks/M4/M4-T001.md) | Admin auth: argon2 seed, login A-01, sessions, lockout (backend web) | NOT_STARTED | — | KEEP (backend web console — unchanged scope) |
| [M4-T002](../../tasks/M4/M4-T002.md) | Admin shell + auth guard + noindex (backend web) | NOT_STARTED | M4-T001 | KEEP (backend web console — unchanged scope) |
| [M4-T003](../../tasks/M4/M4-T003.md) | Dashboard A-02 (honest KPIs) | NOT_STARTED | M4-T002 | KEEP (backend web console — unchanged scope) |
| [M4-T004](../../tasks/M4/M4-T004.md) | Videos management A-03 | NOT_STARTED | M4-T002, M4-T009 | KEEP (backend web console — unchanged scope) |
| [M4-T005](../../tasks/M4/M4-T005.md) | Categories A-04 + Tags A-05 (CRUD + merge) | NOT_STARTED | M4-T002, M4-T009 | KEEP (backend web console — unchanged scope) |
| [M4-T006](../../tasks/M4/M4-T006.md) | Sources A-06 (terms gate) + Mappings A-07 | NOT_STARTED | M4-T002, M4-T009 | KEEP (backend web console — unchanged scope) |
| [M4-T007](../../tasks/M4/M4-T007.md) | Takedowns A-08 + Blocks | NOT_STARTED | M4-T002, M4-T009, M2-T014 | KEEP (backend web console — unchanged scope) |
| [M4-T008](../../tasks/M4/M4-T008.md) | Settings A-09 + Audit log A-10 | NOT_STARTED | M4-T002, M4-T009 | KEEP (backend web console — unchanged scope) |
| [M4-T009](../../tasks/M4/M4-T009.md) | Admin API endpoints (§5.1 contracts) | NOT_STARTED | M4-T001, M2-T001 | KEEP (backend web console — unchanged scope) |
| [M4-T010](../../tasks/M4/M4-T010.md) | CDN purge path + hide ≤60s invariant | NOT_STARTED | M4-T004, M4-T007 | KEEP (backend web console — unchanged scope) |
| [M4-T011](../../tasks/M4/M4-T011.md) | Admin E2E suite (Playwright, backend track) + empty-state rule | NOT_STARTED | M4-T003 | KEEP (backend web console — unchanged scope) |
