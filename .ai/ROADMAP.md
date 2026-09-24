# SYCONIA — Master Execution Roadmap (v1.1.0 — Android platform)

Version 2.0.0 · 2026-09-03 · Authority: AGENT.md §4 + PRD §12 (v1.1.0). **Platform migration (D-010…D-019) reconciled this roadmap from the web-era 70-task graph to a 78-record graph (74 active + 4 retired-with-successor; M0-T005/M0-T006 added 2026-09-07 per D-023); task IDs preserved where practical.** Product scope, gates and zero-placeholder law unchanged.

## Project objective
Implement SYCONIA — premium 18+ adult-media discovery/streaming **native Android application** (Kotlin/Compose/M3) + **backend service** (API, admin console, legal/share web, ingestion; PostgreSQL) — embed-only playback via authorized sources (never stored), with zero placeholders and evidence-based completion.

## Current project state
Documentation-complete and **platform-migrated**; implementation not started. See [CURRENT-STATE.md](./CURRENT-STATE.md).

## Lifecycle
```
M0-RECON ─► M1-ANDROID-FOUNDATION ─► M2-CATALOG(backend) ─► M3-WATCH ─► M4-ADMIN ─► M5-DISCOVERY-RELEASE
 (done ✓)      (scaffold→UI system)   (gate G-04 ★ B-001)   (player)    (console)    (screens + release)
```
| Phase | Objective | Tasks | Entry | Exit = gate |
|---|---|---|---|---|
| **M0-RECON** | Baseline + **platform migration (docs/architecture/roadmap)** + Android identity/platform boundaries (M0-T005, D-023) + web isolation executed (M0-T006) | M0-T001…T006 | docs v1.1.0 verified | [M0-GATE](./gates/M0-GATE.md) |
| **M1-ANDROID-FOUNDATION** | Gradle multi-module scaffold, quality toolchain, SyconiaTheme (M3 from tokens), fonts, adaptive icons, motion, components ×3 batches, age gate (DataStore+attestation), chrome, navigation, legal, system states, E2E harness, gallery, data/domain layer | M1-T001…T019 | M0-GATE PASS + DA-GATE conditions (C-1 satisfied) | [M1-GATE](./gates/M1-GATE.md) |
| **M2-CATALOG** | Backend: schema/migrations, roles, adapter framework+SSRF+breaker, normalization, sync, jobs, mapping, **source authorization gate (★G-04/B-001 — M2-T008/T009)**, public APIs (videos/search/taxonomy/events/report) | M2-T001…T014 active (+T015…T018 RETIRED→M5/M1 successors) | M1-GATE PASS | [M2-GATE](./gates/M2-GATE.md) — **BLOCKED while B-001 open** |
| **M3-WATCH** | Android playback: hardened WebView shell (D-013), lifecycle/security, player FSM + failure ladder, watch destination, related rail, beacons, report, interaction suite, discretion (FLAG_SECURE/masking), a11y | M3-T001…T010 | M2-GATE PASS | [M3-GATE](./gates/M3-GATE.md) |
| **M4-ADMIN** | Backend admin console (auth, dashboard, videos/taxonomy/sources/mappings/takedowns/settings/audit) + §5.1 APIs + purge ≤60s invariant | M4-T001…T011 | M3-GATE PASS | [M4-GATE](./gates/M4-GATE.md) |
| **M5-DISCOVERY-RELEASE** | Android discovery destinations (home/search/categories/tags — successors of retired M2 tasks), offline/cache decision (D-014), perf/stability, App Links+share, security §17+§2A, a11y audit, CI/CD dual-track, deployment/distribution (B-003), legal final (B-002), PRE-RELEASE, FINAL-VERIFICATION | M5-T001…T013 | M4-GATE PASS | [M5-GATE](./gates/M5-GATE.md) → project COMPLETE |

## Parallelism & blocked conditions (v1.1.0)
- M1 tasks T003…T011 largely parallel after T001/T002; batch tasks sequential; T014+ need T008…T013.
- M2 backend work (T001…T007, T010…T014) proceeds while **M2-T008/T009 remain BLOCKED (B-001/G-04)** — the gate cannot PASS until the operator records terms verification; **no provider may be invented** (AGENT §2.1.10).
- M5 discovery screens (T010…T013) depend on M1-T019 + M2 APIs, not on M3/M4 — schedulable after M2 per dependency graph (phase gates still order phases by policy).
- **Blockers:** B-001 → M2-T008/T009 + M2-GATE · B-002 → M5-T007 · B-003 → M5-T006 · AG-001 (SVG masters; D-015 icons unaffected) · AG-014 (doc screenshots pending real UI).

## v1.2.0 addendum — 2026-09-24 · D-024 web-primary re-migration (owner directive)

**This addendum supersedes the platform-primacy aspects of v1.1.0 above for execution purposes; the v1.1.0 text is retained as historical record.**

- **Platform primary: WEB** (Next.js + Node/TS backend-only roles + PostgreSQL). Web-era decisions D-020/D-021 re-activated; Android-specific decisions D-013/D-014/D-015/D-017/D-018 dormant until Android resumes.
- **Effective lifecycle (v1.2.0):**
  ```
  M0-RECON (done) ─► M1-WEB-FOUNDATION (re-activated; T001–T009 COMPLETE + gap closure) ─► M2-CATALOG(backend) ─► M3-WATCH(web) ─► M4-ADMIN ─► M5-WEB-DISCOVERY-RELEASE
  ```
- **Android milestone set (M1-ANDROID-FOUNDATION, M3-WATCH Android tasks, M5 Android discovery) marked DEFERRED** — not cancelled; rows remain in MASTER-CHECKLIST with DEFERRED disposition and successor note → D-024.
- **M5 scope (web track):** discovery destinations on web, full SEO scope restored per D-020/D-021 (SEO.md doc-delta required), CI/CD, deployment (B-003), legal final (B-002), PRE-RELEASE, FINAL-VERIFICATION.
- **Blockers unchanged:** B-001 → M2-T008/T009 + M2-GATE · B-002 → M5-T007 · B-003 → M5-T006 · AG-001 · AG-014. B-004 (Android emulator) non-blocking for the web track; affects deferred Android tasks only.
- **Parallelism (v1.2.0):** web M1 gap closure proceeds in parallel with M2 backend (T001…T007, T010…T014); M2-T008/T009 stay BLOCKED until operator source authorization (G-04).
