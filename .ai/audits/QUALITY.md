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
2026-09-03 · Supporting-asset pass battery PASS: 14 categories audited with spec citations (2 present / 2 created / 9 rejected / 1 pending); maskable icons safe-zone-verified (max art radius 203.65 ≤ 204.8 @512; 74.95 ≤ 76.8 @192; corners exact Obsidian; 39.3KB total); category-art spec published (CSS-first, zero files, determinism+contrast ACs wired to M2-T017); no placeholders, no fake content, no invented providers, no app code; 70-task roadmap statuses unchanged (2/1/63/4); change scope = branding/ + .ai/ only.

2026-09-03 · PLATFORM-MIGRATION VALIDATION (v1.1.0): canonical docs migrated in place (23 files; no duplicate doc system); web-term residual scan classified (retained references = backend Next.js role, historical CHANGELOG text, retired markers); .ai regenerated (76 records; unique IDs; deps resolve; acyclic; statuses ∈ {NOT_STARTED,READY,IN_PROGRESS,BLOCKED,COMPLETE,NEEDS_REVIEW,SUPERSEDED,RETIRED(new, migration-defined)}; blocked set = M2-T008/T009←B-001, M5-T006←B-003, M5-T007←B-002 matching BLOCKERS; retired set = M2-T015…T018 with successors); M2-GATE B-001 block intact; DA-GATE C-1 satisfaction preserved; PDF regenerated + verified (page count + Android-baseline probes); no app code, no scaffolds, no dependency installs; zero placeholders in changed files; git scope = docs + .ai + PDF only.

2026-09-07 · M0-T003 execution battery: all recorded toolchain outputs are real command results captured this session (java/gradle/sdkmanager/adb/node/npm/psql/pg_isready + wrapper diagnostic); no fabricated checks; B-004 recorded with structural evidence (/dev/kvm absent); push blocked honestly (credential absent — locations probed without exposure); local commit created on top of 459ed80 (no rewrites).

- **2026-09-07 (M0-T005 documentation phase):** battery PASS — 78 records (4 COMPLETE · 65 NOT_STARTED · 5 BLOCKED · 4 RETIRED + 10 † web-predecessor); package-ID scan: sole canonical `com.syconia.android`; zero-placeholder scan green on changed docs; secret scan green; zero Android artifacts (0 .kt/gradle/manifest, no /android); PDF regenerated 105pp with content probes; .ai graph edges M0-T004→M0-T005→{M0-T006, M1-T001} valid.

- **2026-09-07 (M0-T006 web isolation):** battery PASS — 78 records (5 COMPLETE · 64 NOT_STARTED · 5 BLOCKED · 4 RETIRED); all moves rename-tracked (no delete+add); lint/typecheck/276 tests/build/storybook green (Node 22.23.2); backend plane verified intact; zero Android artifacts; zero-placeholder + secret scans green; working tree clean at commit.
