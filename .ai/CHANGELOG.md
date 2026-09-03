# Changelog — `.ai/` Execution Control System

## [1.0.0] — 2026-09-03
### Added
- Complete AI execution-control system: README (agent workflow, recovery, authority), ROADMAP (M0→M5 lifecycle, dependencies, safe parallelism, blocked conditions), CURRENT-STATE (truthful baseline: documentation-only repo), DECISIONS (D-001…D-004), BLOCKERS (B-001 source gate G-04, B-002 legal review, B-003 hosting AUP), CHANGELOG.
- 70 task files across `tasks/M0…M5` (M0:3 · M1:18 · M2:19 · M3:10 · M4:11 · M5:9), each with objective, authoritative references, dependencies/blocks, scope, implementation requirements, acceptance criteria, tests, verification, files, forbidden shortcuts, evidence, status — all derived from the v1.0.2 specification suite (no invented requirements; every task cites sources).
- 6 phase READMEs (`phases/M0-RECON … M5-HARDENING-RELEASE`) and 6 evidence-based gates (`gates/M0…M5-GATE.md`); M2-GATE explicitly blocked while B-001 is open.
- Audits: TRACEABILITY (requirements→tasks→tests→gates, orphan analysis), COVERAGE (per-specification execution paths), QUALITY (recurring checks mapped to documented commands), FINAL-VERIFICATION (evidence template; all sections NOT_STARTED — nothing faked).
- MASTER-CHECKLIST: controlled checklist of all 70 tasks + 6 gates with evidence columns.
### Status at creation
M0-T001/T002 COMPLETE (this commit is the evidence); M0-T003 READY; 4 tasks BLOCKED (M2-T008/T009 ← B-001; M5-T006 ← B-003; M5-T007 ← B-002); everything else NOT_STARTED. Zero fabricated completion — the repository contains no application code.
