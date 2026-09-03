# SYCONIA — Autonomous AI Coding-Agent Execution Instructions

| Field | Value |
|---|---|
| Document | AGENT.md · v1.0.1 · 2026-09-03 |
| Audience | AI coding agents (and humans) implementing this repository. Read this file fully before writing any code. |

---

## 1. Mission
Implement the SYCONIA platform exactly as specified by the documentation suite (index: [docs/DOCUMENTATION-INDEX.md](./docs/DOCUMENTATION-INDEX.md)). The repository currently contains **only** brand assets (`/branding/`) and documentation — everything else is to be built. Do not improvise scope: the specs are the contract.

## 2. Non-negotiable laws (violation = work rejected)
1. **No mock/placeholder/dummy data or logic.** No `TODO`, `FIXME`, `TBD`, `XXX`, `HACK`, `coming soon`, `not implemented`, no lorem, no fake catalog entries, no seeded “sample videos”, no stubbed service that pretends success. If a piece is not implementable yet (e.g., no approved source key), implement the *real* mechanism with an honest empty/degraded state (ERROR-STATES E-02/E-18) — never fabricate content. Tests may use recorded fixtures; production code may not.
2. **No media storage.** Never download, cache, proxy, or reference video media. Playback = official source embed URLs only (ARCHITECTURE §6). CI gate greps for media-file writes.
3. **No authentication features for users.** No signup/login/password/Google flows — the only auth is the admin panel (env-seeded, argon2).
4. **No payments/premium/creator/dev-API features.** Out of scope permanently for v1 (PRD §3.2).
5. **Age gate is server-enforced.** No content HTML/API response without the signed cookie (FR-1). Never bypass “for testing” — use the test harness.
6. **Brand fidelity.** Use official `/branding/` assets only; never recreate the logo; colors/typography/spacing/motion only via tokens (DESIGN-SYSTEM); CI lint blocks raw hex.
7. **Every async surface ships all four states** (loading/empty/error/offline) from the ERROR-STATES catalogue.
8. **All admin mutations audited; takedown blocks are sticky across syncs (FR-8).**
9. **Accessibility is a feature:** keyboard operability, focus visibility, reduced-motion, axe-clean.
10. **Docs stay true:** if reality must diverge from a spec, update the spec in the same PR with justification (SOP §6). Never let docs drift.

## 3. Stack (exact — do not substitute)
Next.js 15+ App Router · TypeScript 5 strict · PostgreSQL 16+ · Drizzle ORM (+ drizzle-kit) · `motion` package (`motion/react`) for animation · TanStack Query v5 for client data · Tailwind CSS v4 (token layer) · Zod · lucide-react · Vitest/Testing Library/Playwright/axe-core · fonts: Fraunces + Inter (OFL, self-hosted via next/font).

## 4. Build order (milestones — PRD §12; complete each before the next)
**M0 (done):** documentation suite (this baseline).
**M1 — Foundation:** repo scaffold (`/app` per ARCHITECTURE §3) · token layer + primitives (DESIGN-SYSTEM §10, incl. Storybook entries) · middleware (age gate + headers + request-id) · global chrome (S-00) · age gate (S-01) · routing for all public screens · legal pages with real copy drafts · error/offline/404 pages · E2E smoke + axe wired.
**M2 — Catalog:** Drizzle schema/migrations (DATABASE) · adapter framework + http client (SSRF seam) + first source adapter after operator terms-verification (API §6) · sync job + sync_runs · mapping rules engine · home/search/categories/tags screens wired to real data (or honest E-02) · cursor pagination · suggest endpoint · analytics beacons + events tables.
**M3 — Watch experience:** player shell (capability-driven chrome) · poster→init flow · watermark · metadata/tags/description · related rail · failure ladder E-07/E-08 · report flow + takedown tables · player interaction suite (GESTURES §9).
**M4 — Admin:** admin auth (argon2, lockout, sessions) · dashboard KPIs · videos/categories/tags/sources/mappings/takedowns/settings/audit screens (A-01…A-10) · CDN tag purge path ≤60s invariant test.
**M5 — Hardening:** perf budgets green · SEO artifacts · security checklist (SECURITY §17) · full PRE-RELEASE run · release record.
Each milestone ends: all gates G-1…G-12 green, PRE-RELEASE rows for its scope PASS.

## 5. Task protocol (per work unit)
1. Read the paired spec sections (screen → SCREENS+UX-FLOWS+ERROR-STATES; endpoint → API; table → DATABASE).
2. Write the real implementation + tests (four states) + doc deltas. 3. Run the full gate set locally (§6 commands). 4. Open PR with reviewer checklist (SOP §2). 5. Address CI failures completely — never weaken a test to pass it; if a test is wrong, fix the test *and* the spec together.

## 6. Commands (canonical)
`npm ci` · `npm run dev` · `npm run lint` · `npm run typecheck` · `npm run test` (unit) · `npm run test:integration` · `npm run test:e2e` · `npm run build` · `npm run db:migrate` / `db:generate` · `npm run hash-password` · `npm run ci:no-placeholder-gate` · `npm run perf:lighthouse`.

## 7. Design guidance sources (priority order)
1. `/branding/syconia-brand-guidelines.pdf` + DESIGN-SYSTEM.md (brand — absolute). 2. SCREENS/UX-FLOWS/GESTURES (behavior — absolute). 3. `/.skills/ui-ux-pro-max` (craft heuristics — advisory only; brand tokens override any suggestion). Never import skill data into app code.

## 8. Forbidden actions summary
Adding user auth · adding payments · storing/serving media · scraping beyond official APIs · recreating the logo · hard-coded colors · `dangerouslySetInnerHTML` · client-side source API calls · weakening gates · placeholder anything · deleting tests to pass · changing brand spelling/naming · fabricating analytics numbers (dashboards render honest zeros, A-02).

## 9. Environment handling
All secrets from env (validated by `/lib/env.ts` fail-closed). Dev adapters default to recorded fixtures (`SOURCE_MODE=fixed`). Never log secrets or full IPs. Never enable a source in code without the admin terms-verification record (API §6.1).

## 10. Definition of done (every unit)
Feature works against real data path (or honest empty state) · four states · tests green new+existing · a11y clean · budgets green · lint/type clean · no placeholders (gate green) · specs updated · audit hooks where applicable · observability events emitted.

## 11. When blocked
If a spec is ambiguous or conflicting: stop, document the question in the PR/issue, propose the resolution *aligned with the docs' priority order* (brand guidelines → product laws PRD §3/§8 → architecture → craft skills). Never resolve ambiguity by inventing scope.
