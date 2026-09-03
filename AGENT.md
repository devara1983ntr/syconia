# SYCONIA — Autonomous AI Coding-Agent Execution Instructions

| Field | Value |
|---|---|
| Document | AGENT.md · v1.0.2 · 2026-09-03 |
| Audience | AI coding agents (and humans) implementing this repository. Read this file fully before writing any code. |
| Policy | §2.1 Zero-Placeholder / Zero-Dummy Implementation Policy — **permanent**, added 2026-09-03 |

---

## 1. Mission
Implement the SYCONIA platform exactly as specified by the documentation suite (index: [docs/DOCUMENTATION-INDEX.md](./docs/DOCUMENTATION-INDEX.md)). The repository currently contains **only** brand assets (`/branding/`) and documentation — everything else is to be built. Do not improvise scope: the specs are the contract.

## 2. Non-negotiable laws (violation = work rejected)
1. **No mock/placeholder/dummy data or logic.** No `TODO`, `FIXME`, `TBD`, `XXX`, `HACK`, `coming soon`, `not implemented`, no lorem, no fake catalog entries, no seeded “sample videos”, no stubbed service that pretends success. If a piece is not implementable yet (e.g., no approved source key), implement the *real* mechanism with an honest empty/degraded state (ERROR-STATES E-02/E-18) — never fabricate content. Tests may use recorded fixtures; production code may not. **Full expansion: §2.1 (permanent policy).**
2. **No media storage.** Never download, cache, proxy, or reference video media. Playback = official source embed URLs only (ARCHITECTURE §6). CI gate greps for media-file writes.
3. **No authentication features for users.** No signup/login/password/Google flows — the only auth is the admin panel (env-seeded, argon2).
4. **No payments/premium/creator/dev-API features.** Out of scope permanently for v1 (PRD §3.2).
5. **Age gate is server-enforced.** No content HTML/API response without the signed cookie (FR-1). Never bypass “for testing” — use the test harness.
6. **Brand fidelity.** Use official `/branding/` assets only; never recreate the logo; colors/typography/spacing/motion only via tokens (DESIGN-SYSTEM); CI lint blocks raw hex.
7. **Every async surface ships all four states** (loading/empty/error/offline) from the ERROR-STATES catalogue.
8. **All admin mutations audited; takedown blocks are sticky across syncs (FR-8).**
9. **Accessibility is a feature:** keyboard operability, focus visibility, reduced-motion, axe-clean.
10. **Docs stay true:** if reality must diverge from a spec, update the spec in the same PR with justification (SOP §6). Never let docs drift.

## 2.1 ZERO-PLACEHOLDER / ZERO-DUMMY IMPLEMENTATION POLICY (permanent)

Production implementation **must not contain** placeholders, dummy implementations, fake content, fabricated data, temporary UI, unfinished logic, or deceptive “looks implemented” behavior. This applies to everything, including but not limited to:

**2.1.1 Content** — No lorem ipsum; no placeholder copy; no generic fake descriptions; no fabricated titles, names, metadata, statistics, ratings, counts, dates, durations, categories, tags, or other production content; no invented provider/source information; no fake API responses presented as real data; no fabricated database records; no hard-coded sample records pretending to be production records; no misleading “example” content rendered in production UI unless the specification explicitly requires an actual example.

**2.1.2 UI** — No placeholder UI; no fake cards, thumbnails, avatars, posters, charts, or metrics; no decorative elements pretending to be functional controls; no buttons, links, filters, menus, tabs, search controls, pagination, player controls, or notifications that visually exist without their specified behavior; never build an interface merely to make a screen *appear* complete.

**2.1.3 Images / media** — No placeholder images; no stock/demo images as fake production media; no fabricated adult-content thumbnails/posters; no fabricated media metadata presented as real source data; never invent media URLs, stream URLs, embed URLs, provider IDs, thumbnails, posters, or artwork — only authorized, specification-compliant source data. If a real source is unavailable because the authorization/provider gate is still open, implement the correct empty/unavailable state (E-02/E-18) rather than inventing media.

**2.1.4 Logos / branding** — No placeholder or fake logo; no recreated/approximated SYCONIA logo while an official asset exists; no substitute brand mark; no random icon in place of an official asset — use the official `/branding/` assets per DESIGN-SYSTEM §2–3.

**2.1.5 Icons** — No emoji or random Unicode symbols as fake icons; no arbitrary iconography where the design system specifies an icon; use lucide-react or official project assets per DESIGN-SYSTEM §7; every icon must have an intentional semantic or functional purpose.

**2.1.6 Code** — No `TODO`/`FIXME`/`XXX`/`HACK` markers; no commented-out unfinished implementation; no empty function bodies unless explicitly required by a framework/interface contract and documented as such; no fake return values (`null`, `[]`, `{}`, `false`, `true`, `"TODO"`, `"Coming soon"`, `"Not implemented"`) used to bypass required implementation; no hard-coded values simulating backend behavior when real logic is required; no swallowed errors or ignored exceptions (`catch {}` to hide failures is forbidden); no disabling validation to make tests pass; no bypassing authentication/authorization/security controls; no mock service secretly wired into production behavior; no development-only shortcuts in production paths; no dead code implying incomplete functionality; no unreachable “future implementation” branches; no commented-out code kept as a substitute for implementation.

**2.1.7 Backend / database / API** — No fake endpoints, fake repositories, fabricated payloads, hard-coded API responses, placeholder IDs, fake source/provider records, fake video records, or fake user/admin records (controlled test fixtures outside production are the only exception, §2.1.9). Schemas, migrations, repositories, services, validation, DTOs, errors, and handlers must implement the actual specification — no API contract that exists only visually.

**2.1.8 Legitimate states are NOT placeholders** — Real loading/skeleton, empty, error, offline, source-unavailable, authorization-gated, and permission-denied states (ERROR-STATES catalogue) are **required** implementations, must represent genuine application state, and must never contain fake production data. No videos → show the specified empty state. Provider not yet authorized → show the specified gated/unavailable state. Never insert fake videos to make a page look populated.

**2.1.9 Test data vs production data** — Fixtures, mocks, factories, and seeded dev data are allowed **only** inside automated tests/development infrastructure (TESTING §1): isolated from production runtime, never presented as real content, never silently imported into production services, never used to conceal missing implementation. Production code uses real contracts and real data sources.

**2.1.10 No “temporary” production implementations** — Never use “temporary”, “for now”, “later”, “replace this”, “will implement”, “coming soon”, “stub”, “placeholder”, “mock for now”, “fake for demo” (or equivalents) as a substitute for completing required functionality. If a requirement cannot legitimately be implemented because an external dependency, authorization, credential, provider decision, or specification gate (e.g., G-04) is unresolved: (1) do not fabricate the missing functionality or data; (2) implement the correct documented gated/unavailable/error state; (3) follow the corresponding specification and this file; (4) clearly report the blocked dependency to the developer; (5) never silently downgrade the requirement.

**2.1.11 Completeness gate (before declaring ANY task complete)** — Run a repository-wide quality scan for: TODO/FIXME/HACK/XXX markers · placeholder text · fake/dummy/demo content · fake API responses · mock services in production paths · placeholder images/media/logos/icons · unfinished or empty implementations · hard-coded simulated backend behavior · commented-out unfinished code · dead/incomplete branches · disabled validation/security checks · non-functional UI controls · fabricated production data (`npm run ci:no-placeholder-gate`, G-7). Do not claim completion while any prohibited item remains.

**2.1.12 No cosmetic completion** — Never optimize for “the screen looks finished.” A feature is complete only when: UI · interaction behavior · data contract · backend/API/database behavior (where required) · validation · loading/error/empty/offline states · accessibility · security requirements · passing tests · documentation consistency are **all** implemented. A visually polished but functionally fake feature is INCOMPLETE.

**2.1.13 Not a prohibition on legitimate artifacts** — This policy does not prohibit: loading indicators, skeleton loaders, empty/error/offline states, accessibility labels, test fixtures/mocks, development tooling, deterministic test data, or framework-required stubs/interfaces (documented). The rule targets unfinished, deceptive, fabricated, or placeholder implementation being treated as completed production functionality.

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
0. Inspect the relevant specification/documentation first; then inspect the existing implementation before changing it; reuse real existing project infrastructure where appropriate (never scaffold a parallel fake path).
1. Read the paired spec sections (screen → SCREENS+UX-FLOWS+ERROR-STATES; endpoint → API; table → DATABASE).
2. Write the real implementation + tests (four states) + doc deltas. 3. Run the full gate set locally (§6 commands). 4. Open PR with reviewer checklist (SOP §2). 5. Address CI failures completely — never weaken a test to pass it; if a test is wrong, fix the test *and* the spec together. 6. Before reporting completion, run the §2.1.11 completeness scan; report genuinely blocked items (with their gates) instead of pretending they are complete — never invent missing requirements, never invent production data, never substitute fake functionality for an unresolved dependency.

## 6. Commands (canonical)
`npm ci` · `npm run dev` · `npm run lint` · `npm run typecheck` · `npm run test` (unit) · `npm run test:integration` · `npm run test:e2e` · `npm run build` · `npm run db:migrate` / `db:generate` · `npm run hash-password` · `npm run ci:no-placeholder-gate` · `npm run perf:lighthouse`.

## 7. Design guidance sources (priority order)
1. `/branding/syconia-brand-guidelines.pdf` + DESIGN-SYSTEM.md (brand — absolute). 2. SCREENS/UX-FLOWS/GESTURES (behavior — absolute). 3. `/.skills/ui-ux-pro-max` (craft heuristics — advisory only; brand tokens override any suggestion). Never import skill data into app code.

## 8. Forbidden actions summary
Adding user auth · adding payments · storing/serving media · scraping beyond official APIs · recreating the logo · hard-coded colors · `dangerouslySetInnerHTML` · client-side source API calls · weakening gates · placeholder anything · deleting tests to pass · changing brand spelling/naming · fabricating analytics numbers (dashboards render honest zeros, A-02) · emoji/Unicode as fake icons (§2.1.5) · non-functional decorative controls (§2.1.2) · mock services wired into production (§2.1.9) · cosmetic completion (§2.1.12).

## 9. Environment handling
All secrets from env (validated by `/lib/env.ts` fail-closed). Dev adapters default to recorded fixtures (`SOURCE_MODE=fixed`). Never log secrets or full IPs. Never enable a source in code without the admin terms-verification record (API §6.1).

## 10. Definition of done (every unit)
Feature works against real data path (or honest empty state) · four states · tests green new+existing · a11y clean · budgets green · lint/type clean · no placeholders (gate green) · specs updated · audit hooks where applicable · observability events emitted · **§2.1.11 completeness scan clean** · not cosmetically complete (§2.1.12): interaction, validation, security, and data contracts all real.

## 11. When blocked
If a spec is ambiguous or conflicting: stop, document the question in the PR/issue, propose the resolution *aligned with the docs' priority order* (brand guidelines → product laws PRD §3/§8 → architecture → craft skills). Never resolve ambiguity by inventing scope.
