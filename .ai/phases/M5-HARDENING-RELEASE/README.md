# Phase M5-HARDENING-RELEASE

**Objective (AGENT.md §4):** Perf, SEO, security checklist, a11y audit, CI/CD finalization, deployment, legal, PRE-RELEASE, final verification.

**Entry:** M4-ADMIN gate PASS · **Exit:** [M5-GATE](../../gates/M5-GATE.md) with evidence

**Tasks:**

| ID | Title | Status | Depends on |
|---|---|---|---|
| [M5-T001](../../tasks/M5/M5-T001.md) | Performance budget enforcement (Lighthouse CI + RUM) | NOT_STARTED | M4-GATE (phase gate), M1-T002 |
| [M5-T002](../../tasks/M5/M5-T002.md) | SEO artifacts (metadata, sitemap, robots, RTA, JSON-LD, redirects) | NOT_STARTED | M4-GATE, M2-T006 (sitemap job) |
| [M5-T003](../../tasks/M5/M5-T003.md) | Security checklist execution (SECURITY §17) | NOT_STARTED | M4-GATE |
| [M5-T004](../../tasks/M5/M5-T004.md) | Full accessibility audit | NOT_STARTED | M4-GATE |
| [M5-T005](../../tasks/M5/M5-T005.md) | CI/CD pipeline finalization (G-1…G-12 live) | NOT_STARTED | M4-GATE, M5-T001, M5-T002 |
| [M5-T006](../../tasks/M5/M5-T006.md) | Production deployment (HTTPS, HSTS, env, monitor, rollback) — B-003 | BLOCKED | M5-T005 |
| [M5-T007](../../tasks/M5/M5-T007.md) | Legal finalization (counsel review, designated agent) — B-002 | BLOCKED | M4-GATE |
| [M5-T008](../../tasks/M5/M5-T008.md) | PRE-RELEASE full run + release record | NOT_STARTED | M5-T001, M5-T002, M5-T003, M5-T004, M5-T006, M5-T007 |
| [M5-T009](../../tasks/M5/M5-T009.md) | FINAL-VERIFICATION execution | NOT_STARTED | M5-T008 |
