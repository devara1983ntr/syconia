# SYCONIA — Recurring Quality Checks

Version 1.0.0 · 2026-09-03 · Commands are the canonical set defined by AGENT.md §6 (they exist once M1-T001/T002 create the toolchain — until then, run the documentation-level equivalents marked §). **Never invent commands that do not exist.**

| Check | Command (AGENT §6) | Cadence | Gate refs |
|---|---|---|---|
| TypeScript strict | `npm run typecheck` | every task | G-2; all gates |
| Lint incl. design rules | `npm run lint` | every task | G-1; all gates |
| Unit + component tests | `npm run test` | every task | G-3 |
| Integration (ephemeral PG) | `npm run test:integration` | data-layer tasks | G-3/G-4; M2/M4 |
| E2E (multi-browser) | `npm run test:e2e` | feature tasks + gates | G-3; all gates |
| Build (zero-warning policy) | `npm run build` | every task | G-1/G-9 |
| **Zero-placeholder scan** | `npm run ci:no-placeholder-gate` | every task (AGENT §2.1.11) | G-7; all gates |
| Performance budgets | `npm run perf:lighthouse` | M1 baseline + M5 + perf-touching tasks | G-9 |
| Migrations | `npm run db:generate` / `db:migrate` | schema tasks | G-4 |
| Accessibility | axe-core (in `test:e2e`) + keyboard journeys | UI tasks | M1-GATE 1.8; M5-GATE 5.5 |
| Security headers/CSP | automated header test (built in M1-T011) | header/auth tasks | M1-GATE 1.7; M5-GATE 5.3 |
| Dependency health § | `npm audit` (CI G-5) + lockfile-only installs | weekly + release | G-5 |
| API/schema consistency § | contract tests (Zod both directions) + EXPLAIN asserts | API/DB tasks | M2-GATE 2.2/2.3; M4-GATE 4.6 |
| Broken links (docs) § | link-check script (validation battery, used since v1.0.0) | docs changes | M0/M5 |
| Docs placeholder scan § | grep battery (AGENT §2.1 patterns) | docs changes | M0-GATE 0.6 |
| Dead code / unreachable branches § | lint rules + G-7 scan output review | every task | G-7 |
| Error-handling review § | ERROR-STATES taxonomy compliance in code review | feature tasks | gates |
| Responsive behavior § | Playwright viewport suite {320,375,390,430,768,1024,1280,1440,1920} | UI tasks + nightly | gates; TESTING §3 |
| Browser compatibility § | matrix Chromium/Firefox/WebKit + BrowserStack iOS/Android at release | M3/M5 | M3-GATE 3.1; TESTING §9 |
| Documentation consistency § | paired-doc update check (SOP §2 reviewer checklist) | every PR | G-12 |

## §validation log (this system's own validation — M0 evidence)
2026-09-03 · `.ai` structural validation PASS: 70 unique task IDs; dependency graph acyclic (topological check); every task has all 17 sections (objective/why/references/prerequisites/dependencies/blocks/scope/implementation/acceptance checkboxes/tests/verification/files/forbidden/evidence/status); statuses ∈ {NOT_STARTED, READY, IN_PROGRESS, BLOCKED, COMPLETE, NEEDS_REVIEW, SUPERSEDED}; distribution 2 COMPLETE · 1 READY · 63 NOT_STARTED · 4 BLOCKED (M2-T008/T009←B-001, M5-T006←B-003, M5-T007←B-002, matching BLOCKERS.md exactly); M2-GATE blocked-by-B-001 intact; all dependency references resolve to existing task IDs; M2-T009 depends on M2-T008; `.ai/` placeholder scan clean (TODO/FIXME/TBD/lorem markers appear only inside quoted policy/gate text); no COMPLETE without cited evidence (2/70, both = this deliverable); CURRENT-STATE/MASTER-CHECKLIST/task-file statuses mutually consistent (post-generation cross-check).
2026-09-03 · Final design/asset readiness review battery PASS: forensic re-inspection of all 20 derived/composed assets (halo=0, components, ICO directory, OG tagline centering, favicon-16 honest metric, font fvar axes); AG-012 (symbol-only mono) found & resolved via byte-identical extraction crop (IoU 0.9863 cross-check); AG-013 (Fraunces default-900) found & guardrailed; AG-002 visual sign-off honestly OPEN (no vision capability in environment — re-tested, verbatim recorded); AG-001 unchanged (no vector artwork supplied; none traced); change scope = branding/ + .ai/ only; 70-task roadmap statuses unchanged (2/1/63/4).
