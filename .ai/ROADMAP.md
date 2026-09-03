# SYCONIA — Master Execution Roadmap

Version 1.0.0 · 2026-09-03 · Authority: AGENT.md §4 (build order) + PRD §12 — this roadmap decomposes those milestones; it does not alter them. Phase-label mapping recorded as DECISIONS.md D-001 (labels M2-"MEDIA-SOURCE"/M3-"DISCOVERY" are directory names; boundaries are exactly AGENT.md §4's M2 "Catalog" and M3 "Watch experience").

## Project objective
Implement SYCONIA — a premium 18+ adult-media discovery/streaming platform (no accounts, no payments, embed-only playback via authorized sources) — exactly as specified by the v1.0.2 documentation suite, with zero placeholders (AGENT §2.1) and full evidence-based completion.

## Current project state
Documentation-complete, implementation not started. See [CURRENT-STATE.md](./CURRENT-STATE.md) (authoritative live view).

## Lifecycle

```
M0-RECON ──► M1-FOUNDATION ──► M2-MEDIA-SOURCE ──► M3-DISCOVERY ──► M4-ADMIN ──► M5-HARDENING-RELEASE
 (done✓)        (serial core)     (gate G-04 ★)      (watch UX)      (ops suite)     (release)
```

| Phase | Objective (from AGENT §4 / PRD §12) | Tasks | Entry criteria | Major deliverables | Exit = gate |
|---|---|---|---|---|---|
| **M0-RECON** | Project baseline: verified docs suite, execution-control system, implementation-state audit | M0-T001…T003 | docs v1.0.2 verified (✓ 40e710e) | `.ai/` system, truthful CURRENT-STATE, baseline audits | [M0-GATE](./gates/M0-GATE.md) |
| **M1-FOUNDATION** | Repo scaffold, tokens/primitives, middleware (age gate + headers), global chrome, age gate, public routing, legal pages, error/offline/404, test harness | M1-T001…T018 | M0-GATE PASS | App shell with branded chrome, age-gate enforced server-side, all public routes scaffolded, E2E smoke green | [M1-GATE](./gates/M1-GATE.md) |
| **M2-MEDIA-SOURCE** | Drizzle schema/migrations, adapter framework + SSRF client + breaker, normalization, sync + jobs, mapping engine, **first authorized source (GATE G-04 ★)**, public data/search/taxonomy/events APIs, discovery screens wired to real data (or honest E-02), analytics retention | M2-T001…T019 | M1-GATE PASS | Catalog data plane + public APIs + discovery UI; `sync_runs` live | [M2-GATE](./gates/M2-GATE.md) — **BLOCKED while B-001 (source authorization) is open** |
| **M3-DISCOVERY** | Player shell (capability-driven), embed security, player state machine + failure ladder, watch page, related rail, beacons, report flow, mobile player behaviors, discretion features | M3-T001…T010 | M2-GATE PASS | Fully working watch experience incl. E-07/E-08 recovery | [M3-GATE](./gates/M3-GATE.md) |
| **M4-ADMIN** | Admin auth (argon2/lockout/CSRF), shell, dashboard, videos/categories/tags/sources/mappings/takedowns/settings/audit screens + admin APIs, purge ≤60s invariant | M4-T001…T011 | M3-GATE PASS | Complete operational suite, every mutation audited | [M4-GATE](./gates/M4-GATE.md) |
| **M5-HARDENING-RELEASE** | Perf budgets, SEO artifacts, security checklist, full a11y audit, CI/CD finalization, deployment (HTTPS/HSTS), legal finalization, PRE-RELEASE full run, final verification | M5-T001…T009 | M4-GATE PASS | Production-ready release + release record | [M5-GATE](./gates/M5-GATE.md) → project COMPLETE |

## Dependencies & safe parallelism (never claim parallelism where dependencies forbid it)
- **Strictly serial (phase chains):** M0→M1→M2→M3→M4→M5 gates. Inside phases the task files state exact dependencies (`## Dependencies` / `## Blocks`); the dependency graph is acyclic (validated — see audits/QUALITY.md §validation).
- **M1 parallel tracks (after M1-T001…T007 core config):** primitives batches (T008/T009/T010) ∥ chrome (T013) ∥ routing scaffold (T014) ∥ legal pages (T015) — merge at T016/T017.
- **M2 parallel tracks:** schema/migrations (T001/T002) ∥ adapter framework (T003/T004) while **M2-T008 source gate is BLOCKED (B-001)**; screens T015–T018 parallel after API tasks T010–T014. **M2-T009 (first adapter) cannot start before M2-T008 completes — no provider may be invented to unblock it.**
- **M3 parallel:** shell (T001–T003) then page integration (T004–T007) ∥ mobile/discretion (T009/T010).
- **M4 parallel:** auth/shell (T001/T002) → screens T003–T008 ∥ API T009; invariant test T010 last.
- **M5:** T001–T004 largely parallel; T008 (PRE-RELEASE) after all; T009 last.

## Blocked conditions (live list: BLOCKERS.md)
- **B-001 — M2 source authorization gate (G-04):** operator must select a source and record terms verification (API §6.1, LEGAL-COMPLIANCE §4). While open: M2-T008/T009 BLOCKED and **M2-GATE cannot PASS** (per policy §15 of the execution-system directive — M2 remains blocked; all other M2 tasks may complete against the real mechanism with honest E-02 states).
- **B-002 — legal copy counsel review** (final Terms/Privacy/DMCA/2257 copy): blocks M5-T007 only (M1-T015 implements pages with real drafts + review flag).
- **B-003 — production hosting/registrar selection** with adult-permitting AUP (DEPLOYMENT §2): blocks M5-T006.

## Verification requirements (every phase)
Gates demand objective evidence: lint/type/test/build results, gate G-1…G-12 statuses (CI-CD §4), zero-placeholder scan output, a11y/axe results, spec-consistency spot checks. A phase is never PASS on assertion alone — evidence must be cited in the gate file.
