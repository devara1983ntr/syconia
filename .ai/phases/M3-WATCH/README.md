# Phase M3-WATCH (v1.1.0)

**Objective:** Android playback: WebView shell, security/lifecycle, FSM, watch screen, related, beacons, report, gestures, discretion, a11y.

**Entry:** prior phase gate PASS · **Exit:** [M3-GATE](../../gates/M3-GATE.md) with evidence

| ID | Title | Status | Deps | Disposition |
|---|---|---|---|---|
| [M3-T001](../../tasks/M3/M3-T001.md) | Player shell: stage, poster→init, watermark, capability chrome (Compose + WebView) | NOT_STARTED | M1-T010, M2-T009 | MODIFY (player shell now Android) |
| [M3-T002](../../tasks/M3/M3-T002.md) | Embed security deep-pass + lifecycle (rotation/background/PiP decision) | NOT_STARTED | M3-T001 | MODIFY (was web embed security) |
| [M3-T003](../../tasks/M3/M3-T003.md) | Player state machine + failure ladder E-07/E-08 | NOT_STARTED | M3-T001, M3-T002 | MODIFY (Compose FSM) |
| [M3-T004](../../tasks/M3/M3-T004.md) | Watch destination S-07: metadata, provenance, tags, theater | NOT_STARTED | M3-T001, M1-T019 | MODIFY (was watch page) |
| [M3-T005](../../tasks/M3/M3-T005.md) | Related rail (PRD2 §2.5 + continuation) | NOT_STARTED | M3-T004, M1-T019 | MODIFY |
| [M3-T006](../../tasks/M3/M3-T006.md) | Watch beacons (quartiles) + session semantics | NOT_STARTED | M3-T004, M2-T013 | MODIFY (beacons flush on backgrounding) |
| [M3-T007](../../tasks/M3/M3-T007.md) | Report flow S-07R + takedown intake UX | NOT_STARTED | M3-T004, M2-T014 | MODIFY |
| [M3-T008](../../tasks/M3/M3-T008.md) | Player interaction suite (GESTURES matrix on device) | NOT_STARTED | M3-T003, M3-T009 | MODIFY |
| [M3-T009](../../tasks/M3/M3-T009.md) | Mobile behaviors + discretion features (FLAG_SECURE, label masking, session traces) | NOT_STARTED | M3-T004 | MODIFY (was web discretion) |
| [M3-T010](../../tasks/M3/M3-T010.md) | Watch a11y + TalkBack completion | NOT_STARTED | M3-T004, M3-T007 | MODIFY |
