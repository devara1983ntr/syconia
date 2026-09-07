# Phase M5-DISCOVERY-RELEASE (v1.1.0)

**Objective:** Android discovery screens (successors of retired M2 screen tasks) + hardening/testing/perf/security/release.

**Entry:** prior phase gate PASS · **Exit:** [M5-GATE](../../gates/M5-GATE.md) with evidence

| ID | Title | Status | Deps | Disposition |
|---|---|---|---|---|
| [M5-T001](../../tasks/M5/M5-T001.md) | Performance & stability enforcement (Android budgets + API SLOs + RUM) | NOT_STARTED | M1-T002 | MODIFY (was Lighthouse-first) |
| [M5-T002](../../tasks/M5/M5-T002.md) | Discoverability artifacts: App Links, assetlinks, OG share pages, legal SEO | NOT_STARTED | M2-T006 | MODIFY (was full web SEO) |
| [M5-T003](../../tasks/M5/M5-T003.md) | Security checklist execution (SECURITY §17 + §2A Android) | NOT_STARTED | — | MODIFY (adds Android) |
| [M5-T004](../../tasks/M5/M5-T004.md) | Full accessibility audit (TalkBack-first) | NOT_STARTED | — | MODIFY (was web a11y audit) |
| [M5-T005](../../tasks/M5/M5-T005.md) | CI/CD finalization (dual-track G-1…G-12 live) | NOT_STARTED | M5-T001, M5-T002 | MODIFY (android+backend) |
| [M5-T006](../../tasks/M5/M5-T006.md) | Deployment & distribution (backend hosting + Android internal track) — decision + execution (B-003-class) | BLOCKED | M5-T005 | MODIFY (was web-only deployment) |
| [M5-T007](../../tasks/M5/M5-T007.md) | Legal finalization (counsel review, designated agent) — B-002 | BLOCKED | — | KEEP (BLOCKED, unchanged) |
| [M5-T008](../../tasks/M5/M5-T008.md) | PRE-RELEASE full run + release record | NOT_STARTED | M5-T001, M5-T002, M5-T003, M5-T004, M5-T006, M5-T007 | MODIFY (v1.1.0 checklist) |
| [M5-T009](../../tasks/M5/M5-T009.md) | FINAL-VERIFICATION execution | NOT_STARTED | M5-T008 | KEEP |
| [M5-T010](../../tasks/M5/M5-T010.md) | Home/discovery destination S-02 (supersedes retired M2-T015) | NOT_STARTED | M1-T019, M2-T010 | NEW (successor of M2-T015) |
| [M5-T011](../../tasks/M5/M5-T011.md) | Search destination S-03 (supersedes retired M2-T016) | NOT_STARTED | M1-T019, M2-T011 | NEW (successor of M2-T016) |
| [M5-T012](../../tasks/M5/M5-T012.md) | Categories + tags destinations S-04/S-05/S-06 (supersede retired M2-T017) | NOT_STARTED | M1-T019, M2-T012 | NEW (successor of M2-T017) |
| [M5-T013](../../tasks/M5/M5-T013.md) | Offline/cache strategy decision + implementation (Room justification gate) | NOT_STARTED | M1-T019, M5-T010 | NEW (D-014 discipline) |
