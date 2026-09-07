# SYCONIA — Blockers

Never hide blockers. Never work around a blocker by fabricating functionality (AGENT §2.1.10). A blocker is resolved only with recorded evidence.

| ID | Discovered | Phase | Affected task(s) | Reason | Authoritative source | Required decision/action | Status | Resolution evidence |
|---|---|---|---|---|---|---|---|---|
| **B-001** | 2026-09-03 (documented since PRD v1.0.0 as G-04) | M2 | M2-T008 (source selection + terms verification), M2-T009 (first adapter), **M2-GATE** | No external media source has been selected or authorized. Possessing an API/embed snippet is not a grant of aggregation rights; terms must affirmatively permit our use | API.md §6.1 (No-automatic-grant rule); docs/LEGAL-COMPLIANCE.md §4; PRD §17 C-1; AGENT.md §9 | Operator (Roshan): select candidate source(s) offering official API/embed programs, complete terms review (or counsel sign-off), record `terms_verified_at` + reference URL in admin Sources (A-06 flow). **No provider may be invented or assumed to unblock this.** | **OPEN** | none yet |
| **B-002** | 2026-09-03 | M5 | M5-T007 (legal finalization) | Final legal copy (Terms/Privacy/DMCA/2257) requires qualified counsel review; documentation is a spec, not legal advice | docs/LEGAL-COMPLIANCE.md preamble; PRD F-10 | Operator: counsel review + designated-agent details before production (PRE-RELEASE §15) | **OPEN** | none yet |
| **B-003** | 2026-09-03 | M5 | M5-T006 (deployment & distribution — backend hosting + Android internal/Play decision; v1.1.0) | Host/CDN/DB/registrar must be selected with AUPs that permit adult (18+) content, chosen truthfully | DEPLOYMENT.md §2; LEGAL-COMPLIANCE §3 | Operator: select + record providers; never misrepresent the service | **OPEN** | none yet |

## Rules
1. A task blocked by an open blocker carries status `BLOCKED` and cites the blocker ID.
2. Blockers never justify placeholder implementation — implement the documented gated/unavailable state instead (E-02/E-18).
3. Resolution requires evidence (record, URL, date, approver) recorded in this table and referenced from the affected task's Completion Evidence.

> v1.1.0 platform migration note (2026-09-03): blocker scope is unchanged — B-001 still gates M2-T008/T009 + M2-GATE (backend source authorization); B-002 still gates M5-T007; B-003 still gates M5-T006. The Android migration neither bypasses nor fabricates any gate.

| **B-004** | 2026-09-07 | M0/M1 | M0-T003 (full completion: AVD-boot AC), M1-T017 (connected E2E), all `connected*AndroidTest`/instrumented rows | Execution sandbox has no `/dev/kvm` and only 2 vCPU / 2 GB RAM — Android emulator/AVD boot is structurally impossible here; build/unit path fully verified (JDK 17, SDK 35, Gradle 8.10.2 wrapper-green, Node 20, PG 17.11 reachable — evidence in M0-T003) | M0-T003 evidence table; TESTING.md §3 (device matrix) | Operator: either (a) run instrumented suites on operator hardware/Android Studio device, or (b) provide a KVM-capable CI runner for the emulator matrix — decision recorded then. Build-path M1 tasks are NOT blocked (dependency analysis in M0-T003). | **OPEN** | M0-T003 evidence 2026-09-07 |
