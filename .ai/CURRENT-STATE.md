# SYCONIA — Current Project State (single source of truth — v1.2.0)

**Last updated:** 2026-09-24 (D-024 recorded: platform-primary reverted to WEB per owner directive; ledger reconciled) · **Maintainer rule:** update after every meaningful transition; never fabricate progress.

| Field | Value |
|---|---|
| Current phase | **M1 (web track) ACTIVE — resuming.** Web M1-T001–T009 re-activated as the active track (previously recorded as predecessor-superseded). Android track DEFERRED (not cancelled) per D-024 |
| Platform (v1.2.0) | Web primary: Next.js + Node/TS backend-only roles + PostgreSQL (D-020/D-021 re-activated). Android client deferred — v1.1.0 Android definitions (D-010…D-019, D-023) remain in-tree as historical record; `com.syconia.android` stays the canonical Android identity for the deferred client |
| Implementation state | Web M1 implementation EXISTS and is ACTIVE (`app/`, `components/`, `lib/`, `tests/`; scaffold, tokens, fonts, brand, motion, env, form controls, overlays — merged 2026-09-07, D-022). Android implementation: none — deferred |
| Current/active task | **M1 web-track gap audit in progress** (identify remaining M1 items beyond T001–T009: age gate S-01, chrome S-00, routing, legal drafts, error/offline states, E2E smoke + axe). Next backend task: **M2-T001** (Drizzle schema + migrations, 18 tables) — platform-invariant, unblocked |
| Last verified commit | 3fc89f9d (D-024 decision ledger, on branch `docs/d-024-web-primary`) — see CHANGELOG |
| Gate status | M0-GATE **PASS** · DA-GATE **PASS WITH CONDITIONS** (C-1 satisfied; C-2 = AG-001 open) · M1 web-track gap closure NOT_STARTED · M2–M5 NOT_STARTED; M2-GATE **structurally BLOCKED (B-001)** |
| Blocked tasks | M2-T008/T009 (B-001 — source authorization G-04; never unblock by inventing a provider) · M5-T006 (B-003 hosting/distribution) · M5-T007 (B-002 counsel) · B-004 (Android emulator) non-blocking for the web track; affects deferred Android tasks only |
| Retired tasks | M2-T015/016/017/018 (web-era screen/query tasks → successors M5-T010/011/012 + M1-T019) — dispositions unchanged; Android M1/M3/M5 task rows marked DEFERRED with successor note → D-024 |
| Next eligible tasks | Web M1 gap tasks (from gap audit) in parallel with M2-T001…T007, T010–T014 backend work |
| Completed tasks | M0-T001…T006 · web M1-T001–T009 (ACTIVE-COMPLETE, re-activated per D-024) |
| Known risks | **Repository visibility: GitHub currently shows PUBLIC while D-022 recorded "kept private per owner decision 2026-09-07" — flagged to owner 2026-09-24 for resolution; ledger will be corrected to the owner-confirmed state** · B-001 indefinite until operator acts; B-003/B-002 release-side; AG-001 vector masters · stale "commits not pushed" risk from v1.1.0 resolved: all migration-era content is on origin/main via the D-022 merge |
| Unresolved decisions | Repository visibility (public vs private — owner confirmation pending) · all D-010…D-023 recorded; version pinning strategy now web-era (D-020/D-021) |

## Task status summary (regenerate from MASTER-CHECKLIST.md)
Authoritative detail in MASTER-CHECKLIST.md. Under D-024: web M1 tasks re-activated; Android M1/M3/M5 client rows DEFERRED; M2 backend unchanged; M5 re-pointed to the web track. Record-count correction: 78 records (the v1.1.0 figure of 76 was a count inconsistency; M0-T005/T006 additions bring the ledger to 78).

## 2026-09-24 — Platform decision D-024 (web-primary re-migration)

Owner directed that the web platform becomes primary again. Recorded as D-024: web M1 implementation re-activated as the active track; Android deferred (docs preserved in-tree); web-era decisions D-020/D-021 active; Android-specific decisions D-013/D-014/D-015/D-017/D-018 dormant until Android resumes; M2 backend scope unchanged. Gates B-001/B-002/B-003 and G-04 unchanged. Branch `docs/d-024-web-primary` carries the ledger updates pending merge to `main`.

## 2026-09-07 — Remote reconciliation merge (D-022) [historical]

origin/main had diverged: 15 commits (2026-09-05) completing the **web** M1 phase (M1-T001–T009 + web M0-T003 record), invisible to the Android migration because the then-usable credential had been revoked. Resolved per owner decision by a merge preserving both truths: web code retained in-tree untouched; web task completions recorded as *Web-platform predecessor — COMPLETE (superseded)* sections; Android v1.1.0 redefinitions were the then-active plan. Web D-010/D-011 renumbered to D-020/D-021 (ID collision). Repository visibility recorded PRIVATE per owner decision 2026-09-07 — **note: current GitHub state shows public; flagged for owner resolution under D-024**.
