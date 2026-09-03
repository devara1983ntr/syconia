# M1-GATE — FOUNDATION (PASS required before M2)

**Status: NOT_STARTED** · Gate is PASS only when every row cites evidence (command output + commit). Source: AGENT §4 M1, CI-CD §4, TESTING, ACCESSIBILITY, SECURITY §4, DESIGN-SYSTEM.

| # | Criterion (objective) | Evidence (fill on pass) |
|---|---|---|
| 1.1 | G-1 lint: zero errors/warnings incl. custom design-system rules (no raw hex outside tokens, no `dangerouslySetInnerHTML`, no `any`) | |
| 1.2 | G-2 types: `tsc --noEmit` strict clean | |
| 1.3 | Unit + component suites green (primitives × states incl. keyboard operation) | |
| 1.4 | Build: `next build` zero errors **and zero warnings**; bundle budgets (§ G-9: home ≤220KB compressed JS) | |
| 1.5 | E2E smoke: first-visit flow F1 (age gate blocks content server-side; Enter reveals; deep-link preserved) green — Chromium+Firefox+WebKit | |
| 1.6 | Age-gate enforcement probe: content API 403 without cookie; forged cookie 403 (T-70 class) | |
| 1.7 | Security headers present on every route (automated header test vs SECURITY §4 CSP/HSTS/etc.); CSP report-only phase completed before enforcement | |
| 1.8 | axe zero critical on implemented surfaces (gate, chrome, legal, error pages) + keyboard-only journey | |
| 1.9 | Zero-placeholder scan green (`npm run ci:no-placeholder-gate`) — no fake UI, no lorem, no non-functional controls | |
| 1.10 | Spec consistency: routes match ARCHITECTURE §3 tree; chrome/age gate match SCREENS S-00/S-01 exactly; token values match DESIGN-SYSTEM §4 (incl. computed contrasts) | |
| 1.11 | Storybook primitive gallery exists for all implemented primitives (TESTING §8 visual-regression basis) | |
| 1.12 | Reduced-motion honored (visual check) · focus visible · legal pages carry real draft copy (no lorem) with review flag (B-002 note) | |
