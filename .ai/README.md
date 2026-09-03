# SYCONIA — `.ai/` Execution Control System

Version 1.0.0 · 2026-09-03 · Governing authority: [AGENT.md](../AGENT.md) (highest), then the SYCONIA specification suite ([docs/DOCUMENTATION-INDEX.md](../docs/DOCUMENTATION-INDEX.md)), then this directory. **`.ai/` never overrides AGENT.md or the specifications.** On conflict: record it in [BLOCKERS.md](./BLOCKERS.md), cite the authoritative source, and mark the affected task BLOCKED until resolved. Never resolve silently.

## Purpose
Transform the SYCONIA specifications into a dependency-aware, phase-by-phase roadmap of small executable tasks with traceability, gates, progress tracking, blockers, audits, and final verification — so that *nothing required by the authoritative specifications is accidentally skipped, forgotten, duplicated, invented, or declared complete without evidence.*

## Directory map
- [ROADMAP.md](./ROADMAP.md) — master execution roadmap (phases, dependencies, gates, parallelism)
- [CURRENT-STATE.md](./CURRENT-STATE.md) — single source of truth for progress (update after every task)
- [MASTER-CHECKLIST.md](./MASTER-CHECKLIST.md) — controlled checklist of every task/gate with evidence links
- [DECISIONS.md](./DECISIONS.md) / [BLOCKERS.md](./BLOCKERS.md) / [CHANGELOG.md](./CHANGELOG.md)
- `phases/M0-RECON … M5-HARDENING-RELEASE/` — per-phase README (objective, entry/exit, task list)
- `tasks/M0 … M5/` — one file per task (`M<phase>-T<nnn>.md`), exact format per task template
- `gates/M0-GATE.md … M5-GATE.md` — objective evidence required to exit a phase
- `audits/` — [TRACEABILITY.md](./audits/TRACEABILITY.md), [COVERAGE.md](./audits/COVERAGE.md), [QUALITY.md](./audits/QUALITY.md), [FINAL-VERIFICATION.md](./audits/FINAL-VERIFICATION.md)

## Mandatory agent workflow (every task, no exceptions)
1. Read [AGENT.md](../AGENT.md) fully (incl. §2.1 Zero-Placeholder Policy — permanent).
2. Read [CURRENT-STATE.md](./CURRENT-STATE.md).
3. Read [ROADMAP.md](./ROADMAP.md) and identify the **next unblocked task** (all dependencies COMPLETE; phase gate not blocking).
4. Read that task file **completely**.
5. Read its **Authoritative References** (specs) — never skip them; they, not this file, define behavior.
6. Inspect the existing implementation before changing anything; reuse real infrastructure.
7. Implement **only the task scope** — nothing speculative, nothing invented (requirements come only from specs/repository; if undeterminable → status BLOCKED + entry in BLOCKERS.md, never a guess).
8. Run the task's Tests and Verification commands.
9. Run the quality/placeholder scans ([QUALITY.md](./audits/QUALITY.md); `npm run ci:no-placeholder-gate`).
10. Verify every Acceptance Criterion with concrete evidence.
11. Record Completion Evidence in the task file (commands + results + commit SHA).
12. Set task Status (`COMPLETE` only per the Definition of Complete below).
13. Update [CURRENT-STATE.md](./CURRENT-STATE.md) and the [MASTER-CHECKLIST.md](./MASTER-CHECKLIST.md) row.
14. Update [TRACEABILITY.md](./audits/TRACEABILITY.md) links if implementation reality diverged.
15. Select the next eligible task; **stop at every phase gate** — a gate must PASS with evidence before any task of the next phase starts.
16. Commit with a conventional message referencing the task ID.

## Definition of COMPLETE (from task spec — restated normatively)
- **Task:** implementation exists · acceptance criteria satisfied · tests pass · verification passes · zero prohibited placeholder/dummy implementation (AGENT §2.1) · docs/contracts consistent · evidence recorded. Code merely existing ≠ complete.
- **Phase:** all required tasks COMPLETE · blockers resolved or gate-explicit · gate PASS with evidence · traceability + coverage updated.
- **Project:** M5 gate + [FINAL-VERIFICATION.md](./audits/FINAL-VERIFICATION.md) PASS with evidence.

## Session recovery (context loss)
Read, in order: AGENT.md → this file → CURRENT-STATE.md → ROADMAP.md → the active task file → its spec references. Then: inspect `git status` + latest commits; determine whether the in-flight task actually completed (never assume from a dirty tree — re-verify against the task's acceptance criteria); resume. If you cannot safely determine the next action: **STOP and report the ambiguity** — do not guess. This system is designed so no conversation memory is required.

## Statuses
`NOT_STARTED · READY · IN_PROGRESS · BLOCKED · COMPLETE · NEEDS_REVIEW · SUPERSEDED` — exact values only, always with evidence for COMPLETE.

## Change policy
`.ai/` files are versioned with the repository; structural changes get a [CHANGELOG.md](./CHANGELOG.md) entry. Tasks are never deleted — superseded tasks are marked `SUPERSEDED` with a pointer.
