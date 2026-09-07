# SYCONIA — Test Strategy & Complete Test Matrix

| Field | Value |
|---|---|
| Document | TESTING.md · v1.1.0 · 2026-09-03 (Android platform migration) · `[REQUIRED]` |
| Platform | **Android (Kotlin/Compose) + backend (Node/TS)** · v1.1.0 |
| Stack | **Android:** JUnit · Turbine (Flow) · MockK/assertk · Compose UI tests (createAndroidComposeRule) · Espresso · kotlinx-serialization contract tests · Macrobenchmark (startup/scroll) · screenshot/visual tests · Playwright **kept for the backend web console + API plane** · axe equivalents via Compose semantics + manual TalkBack passes · detekt/ktlint (Android lint chain) |

---

## 1. Principles
1. No mock *data* in production code (product law); test fixtures are confined to `/tests/fixtures` and clearly synthetic — they test behavior, never ship.
2. External sources are represented in tests by **contract-accurate stub adapters** (recorded fixture responses replaying real API shapes) — the stub lives in test scope only.
3. Every feature ships with its four states tested (loading/empty/error/offline).
4. Matrix below is the traceability source of truth: PRs add/extend rows, never delete coverage.

## 2. Levels (v1.1.0)
- **Domain unit (Android):** use cases, ranking math consumption, cursor handling, E-state mapping — pure Kotlin, fast JVM tests.
- **ViewModel tests:** Turbine Flow assertions; state reduction (loading/success/empty/error/offline/retry/pagination/refresh); event side-effects.
- **Repository/data tests:** Retrofit services against contract-accurate recorded fixtures; DTO→domain mappers; cache TTL behavior; error mapping.
- **Compose UI tests:** every design-system component × states; semantics/content descriptions; touch-target sizes; navigation flows; four-states per feature.
- **Instrumentation:** WebView shell policy (allowlist loads, blocked intents), Coil image pipeline, DataStore/Keystore behaviors, deep links.
- **Backend unit/integration (retained):** services, adapters, validators against ephemeral Postgres (drizzle migrations in CI) — schema, EXPLAIN asserts, retention/purge jobs, breaker, age/attestation middleware, admin session lifecycle.
- **E2E:** Compose-driven app journeys on emulator matrix + Playwright (retained) for backend web console and API contract journeys.
- **Manual device passes:** TalkBack, font-scale 200%, external keyboard, dark/light system, foldables/tablet layout passes per release (§9).

## 3. Device & window matrix (v1.1.0 — replaces the browser matrix for the app; backend web console keeps a Chrome/Firefox/WebKit smoke matrix)
| Device class | Roles |
|---|---|
| Compact phone (small minSdk-era devices, 360dp width) | full journey E2E, a11y, perf |
| Medium phone (Pixel-class) | full E2E + Macrobenchmark (startup/scroll) |
| Large phone / small tablet (expanded width) | layout-adaptation tests (lists→grids, rail↔grid) |
| Tablet + foldable (expanded) | two-pane/adaptive behavior where specced |
| Landscape | player/orientation behaviors (GESTURES) |
Emulators in CI (API 26…current); physical-device manual passes per release. Backend console: Chromium + Firefox + WebKit smoke (Playwright, retained).

## 4. Route coverage table (every route ≥1 E2E)
| Route | Tests |
|---|---|
| `/` | T-01 age-gate gate flow · T-02 rails render+impressions · T-03 hero CTA · T-04 card→watch transition · T-05 cold-catalog empty state |
| `/search` | T-06 query+filters round-trip · T-07 suggest select · T-08 zero-result relaxation · T-09 back/forward state+scroll restore |
| `/api/videos` | T-10 contract · T-11 cursor tamper 400 · T-12 hidden exclusion · T-13 breaker soft-degradation |
| `/api/videos/{slug}` | T-14 DTO · T-15 opaque 404 hidden/unavailable · T-16 no-age-cookie 403 |
| `/api/search(+/suggest)` | T-17 relevance ordering · T-18 rate limit 429 · T-19 injection payload safety |
| `/api/categories|tags(/…)` | T-20 visible-only · T-21 counts |
| `/watch/[slug]` | T-22 poster→init · T-23 milestones beacon · T-24 failure ladder · T-25 geo block · T-26 hidden→E-06 · T-27 watermark/provenance/report present |
| `/legal/*`, `/about`, `/contact` | T-28 render + contact form validation/submit |
| `/offline`, 404, error | T-29 offline banner flow · T-30 404 did-you-mean |
| `/admin/**` | T-31 takedown hide→public 404→sync-sticky (FR-8) · T-32 lockout · T-33 audit rows for every mutation · T-34 sources enable-gate (terms) · T-35 mapping backfill |

## 5. Feature/interaction matrix (selection; full grid maintained alongside specs)
Search (F-04): suggest keyboard combobox (arrow/enter/esc), debounce, relaxation chain, trend fallback — T-36…T-39.
New endpoints (API §4.7b/§4.8b): interaction-event whitelist enforcement (unknown event dropped+logged, never stored) — T-87; csp-report age-exempt intake, sampling cap, 204-always, malformed tolerated — T-88. Contact endpoint (API §4.11): honeypot silent-drop, field validation, queue routing, rate limit — T-89. Admin contracts (API §5.1): DTO shapes both directions, sort whitelists + defaults, `confirmation_required` on destructive ops, `terms_not_verified` enable block, weight-sum validation, slug immutability — T-90.
Player (F-08): capability-driven chrome rendering (per flag set — parametrized), keyboard F/T/ESC, failure ladder incl. alternate embed, buffering chip, autoplay muted-only policy, background unload, rotate chip — T-40…T-48 (per GESTURES §9).
Navigation: drawer open/close/swipe/esc/focus-return, back-arrow semantics table (UX-FLOWS §13) on every screen pair — T-49…T-52.
Gestures: tap/double-tap/long-press/drag/swipe behaviors with `player_api` stub vs `iframe` stub — T-53…T-56.
States: per-screen skeleton geometry (CLS assert), empty states, error E-XX rendering, offline — T-57…T-59.
Performance: budgets (PERFORMANCE §1) on home/search/watch — T-60…T-65 (Lighthouse CI + trace asserts).
SEO: metadata/canonical/JSON-LD/robots/sitemap/RTA — T-66…T-69.
Security: age bypass attempts (direct API, cookie forgery, header spoof), CSP headers on all routes, admin IDOR attempts (user A session → other tenant n/a but role escalation paths), rate limits, SSRF attempts against adapter client (private CIDR/host-suffix trick payloads) — T-70…T-77.
Database: migration up on clean + populated DB; index usage EXPLAIN; retention purge; audit append-only (UPDATE denied) — T-78…T-81.
Validation: every Zod schema property-based tests (fast-check) — T-82.
Build/deploy: `next build` zero-warning gate, bundle budgets, migration dry-run, smoke on staging — T-83…T-85.
Regression: golden journeys suite (F1–F5) on every PR — T-86.
E2E stability: retries ×1 only; flaky tests quarantined with issue, never deleted silently.

## 6. Accessibility testing
- axe-core on every E2E page state (including modals/drawer/player overlays) — zero critical violations.
- Keyboard-only journeys: full F1–F5 flows without pointer (CI-enforced).
- Screen-reader passes (NVDA + VoiceOver) per release on: age gate, drawer, search combobox, watch page, report modal, admin table — script checklist in `/tests/a11y/manual.md` `[REQUIRED] artifact`.
- Contrast asserted from token table (DESIGN-SYSTEM §4) in unit tests (parses computed values).
- Reduced-motion: visual-regression snapshots with and without the media query.

## 7. Consolidated traceability index
Requirements → tests: PRD FR-1…FR-10 → T-16/T-70 (FR-1), T-49…T-52 (FR-2), T-10/T-11 (FR-3), T-06…T-09 (FR-4), T-22/T-27 (FR-5), T-24/T-27 (FR-6/9), T-33 (FR-7), T-31 (FR-8), SSR/streaming checks (FR-9), CI G-7 (FR-10). NFRs → PERFORMANCE/SECURITY/SEO/ACCESSIBILITY suites as listed above.

## 8. Visual regression
Playwright screenshots per breakpoint for: home, search, category, watch, all states (E-01…E-07), admin dashboard/tables, and the **Storybook primitive gallery** (DESIGN-SYSTEM §10 mandates a Storybook entry per primitive — the gallery is an internal tooling surface, not a public route) — diff threshold 0.1%; brand-fidelity guard (logo/clear-space/spacing) via layout-box asserts.

## 9. Release manual checklist (per PRE-RELEASE.md)
iOS Safari + Android Chrome device passes: age gate, drawer, search, player matrix incl. documented divergences (GESTURES §7), offline behavior, zoom 200%, dynamic type. Signed off in release record (CHANGELOG entry).

## 10. Definition of done (feature-level)
Unit+component+integration green · E2E row(s) added & green · 4 states covered · a11y clean (axe+keyboard) · budgets green · docs updated (SCREENS/UX-FLOWS/this file) · no placeholder code (G-7) · audit hooks if mutating admin ops.
