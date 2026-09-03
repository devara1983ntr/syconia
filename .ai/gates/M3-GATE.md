# M3-GATE — DISCOVERY / WATCH EXPERIENCE (PASS required before M4)

**Status: NOT_STARTED** · Source: AGENT §4 M3, GESTURES, SCREENS S-07, ERROR-STATES E-06…E-08, PRD2 §2.5–2.8, SECURITY embed rules.

| # | Criterion (objective) | Evidence (fill on pass) |
|---|---|---|
| 3.1 | Player interaction matrix (GESTURES §9) executed: capability flag × interaction × browser (Chromium/Firefox/WebKit + documented iOS/Android divergences asserted as documented) | |
| 3.2 | Player state machine (§6.9) tests: all valid transitions exercised; **invalid transitions proven prevented**; no fabricated playback possible | |
| 3.3 | Failure ladder E-07 verified end-to-end (timeout→Retry→Alternate→Open-at-source→Report) and geo E-08; `player_error` beacons fire | |
| 3.4 | Embed security: iframe attrs locked (sandbox/referrerpolicy/allowfullscreen); CSP `frame-src` matches enabled manifests only; no source scripts on our origin (CSP violation log clean) | |
| 3.5 | Watch page E2E green: T-22…T-27 (poster→init, milestones, hidden→E-06 404 status rule, watermark/provenance/report present, no-JS fallback) | |
| 3.6 | Related rail: PRD2 §2.5 bucket algorithm + deterministic relatedCursor continuation verified (same order across repeated requests) | |
| 3.7 | View semantics: distinct (session,video,day) with ≥q25 dedupe verified by integration test (PRD2 §2.6) | |
| 3.8 | Report flow: auto-hide reasons (copyright/underage/nc) hide + purge ≤60s; TKN reference issued; queue row created (F-05) | |
| 3.9 | Discretion behaviors: tab-mask on visibilitychange, thumbnail veil toggle, clear-session-traces rotate `sy_sid` — verified | |
| 3.10 | Accessibility: stage region labelled, modal focus trap, keyboard F/T/ESC; axe zero critical on watch page states | |
| 3.11 | Zero-placeholder scan green — no fake player chrome, no controls without capability, no preview media fabrication | |
