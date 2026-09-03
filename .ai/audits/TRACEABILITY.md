# SYCONIA — Requirement Traceability Audit

Version 1.0.0 · 2026-09-03 · Chain: **Requirement → Specification → Phase → Task → Implementation area → Test → Verification → Gate.** Every significant v1 requirement is mapped. Orphan analysis at the end (nothing silently invented or dropped).

## 1. Product features (PRD §6 catalogue F-01…F-18)

| Req | Specification | Phase | Task(s) | Implementation area | Test | Verification | Gate |
|---|---|---|---|---|---|---|---|
| F-01 Age gate | PRD §7.1; SCREENS S-01; SECURITY §6 | M1 | M1-T011, M1-T012 | middleware + S-01 + cookie contract | T-01, T-70 | enforcement probe | M1-GATE 1.5/1.6 |
| F-02 Global chrome | PRD §7.2; SCREENS S-00; UX-FLOWS §2 | M1 | M1-T013 | header/drawer/footer components | T-49…T-52 | E2E + axe | M1-GATE 1.5/1.8 |
| F-03 Home/discovery | PRD §7.3; SCREENS S-02; PRD2 §2.1/§2.5 hero | M2 | M2-T015 | home route + rails | T-02…T-05 | E2E + perf | M2-GATE 2.9 |
| F-04 Search | PRD §7.4; SCREENS S-03; PRD2 §3.2/§3.3/§2.7/§2.8; API §4.3/4.4 | M2 | M2-T011, M2-T016 | search API + screen | T-06…T-09, T-17…T-19, T-36…T-39 | contract + E2E | M2-GATE 2.3/2.10 |
| F-05 Categories | PRD §6; SCREENS S-04/S-05; API §4.5 | M2 | M2-T012, M2-T017 | taxonomy API + screens | T-20/T-21 | contract + E2E | M2-GATE 2.3 |
| F-06 Tags | PRD §6; SCREENS S-06; API §4.6 | M2 | M2-T012, M2-T017 | taxonomy API + screens | T-20/T-21 | contract + E2E | M2-GATE 2.3 |
| F-07 Watch page | PRD §7.5; SCREENS S-07 | M3 | M3-T001, M3-T004 | player shell + watch route | T-22…T-27 | E2E + a11y | M3-GATE 3.5 |
| F-08 Player interactions | PRD §7.5; GESTURES all; PRD2 §6 | M3 | M3-T001…T003, M3-T009 | capability chrome + state machine | T-40…T-48 | interaction matrix | M3-GATE 3.1/3.2 |
| F-09 Report/takedown | PRD §7.5; UX-FLOWS F-05; API §4.9 | M3 | M3-T007 | report modal + auto-hide | T-24 class | flow test | M3-GATE 3.8 |
| F-10 Legal pages | PRD §7.8; SCREENS S-08; LEGAL-COMPLIANCE | M1/M5 | M1-T015, M5-T007 (B-002) | legal routes + final copy | T-28 | E2E + counsel sign-off | M1-GATE 1.12; M5-GATE 5.8 |
| F-11 Ingestion pipeline | PRD §7.6; API §6; ARCH §5/§6; PRD2 §6 | M2 | M2-T003…T007, T008★, T009★ | adapters/sync/jobs | T-13, T-77 | integration + SSRF suite | M2-GATE 2.5/2.7/2.8 (★B-001) |
| F-12 Analytics | PRD §10; PRD2 §3; API §4.7/4.7b; DATABASE §2.8/2.9/2.18 | M2 | M2-T013, M2-T019 | beacons + rollups | T-87 | pipeline test | M2-GATE 2.11 |
| F-13 Admin panel | PRD §7.7; SCREENS A-01…A-10; API §5/5.1 | M4 | M4-T001…T011 | admin routes + APIs | T-31…T-35, T-89/T-90 | E2E + contracts | M4-GATE all |
| F-14 Four-state system | PRD FR-9/FR-10; ERROR-STATES all | M1→M4 | M1-T014/T016 + per-screen tasks | state components per surface | T-57…T-59 | catalogue walkthrough | each gate |
| F-15 Accessibility | ACCESSIBILITY all | M1→M5 | M1-T002/T017 + continuous + M5-T004 | global a11y + audits | axe + keyboard suites | §10 criteria | M5-GATE 5.5 |
| F-16 SEO | SEO all | M5 | M5-T002 | metadata/sitemap/JSON-LD/RTA | T-66…T-69 | validators (G-10) | M5-GATE 5.6 |
| F-17 Performance budgets | PERFORMANCE all | M1(config)+M5 | M1-T002, M5-T001 | budgets + RUM | T-60…T-65 | Lighthouse CI | M5-GATE 5.4 |
| F-18 CI/CD gates | CI-CD all | M5 | M5-T005 | pipeline G-1…G-12 | pipeline itself | CI green | M5-GATE 5.2 |

## 2. Functional requirements PRD §8
FR-1→M1-T011/T012 (T-70) · FR-2→M1-T013 · FR-3→M2-T010 (T-10/T-11) · FR-4→M2-T011/T016 · FR-5→M3-T001/T002 (T-22/T-27) · FR-6→M3-T004/T007 · FR-7→M4-T009 (T-33) · FR-8→M2-T005 + M4-T007 (T-31) · FR-9→M1-T014 + M3-T004 · FR-10→all gates (G-7).

## 3. Non-functional + state/taxonomy mappings
NFR table (PRD §9) → PERFORMANCE/SECURITY/SEO/ACCESSIBILITY/TESTING docs → M5-T001…T005 (+M1 wiring). E-01…E-20b (22 states) → S-screens tasks + M1-T016 (system pages); each E-code asserted by the owning screen's tests (TESTING §4/§5). G-1…G-12 → M5-T005 + per-phase gates. Jobs registry (ARCH §5) → M2-T005/T006/T007. DB tables §2.1–2.18 → M2-T001 (+consumers verified in COVERAGE). API §4.1–4.11, §5.1 → M2-T010…T014, M4-T009.

## 4. Orphan analysis (as of v1.0.0 of this audit)
- **Requirements without tasks:** none in v1 scope. `[PROPOSED]` items F-19 (favorites/history), F-20 (collections), F-21 (PWA), PWA/mini-player/neutral-preview/seasonal themes/AV hook (PRD §3.3, PRD2 §12, GESTURES/SEO `[PROPOSED]`) are **deliberately excluded** from the v1 roadmap per PRD scope — recorded here, not silently dropped; they enter only via a spec change.
- **Tasks without requirements:** none — every task's "Authoritative References" cites spec sections (validated).
- **Tasks missing acceptance criteria / verification:** none (validated by generator schema).
- **Requirements without tests where required:** none — TESTING matrix rows T-01…T-90 mapped above; PRE-RELEASE rows map to M5-T008.
- **Duplicated tasks:** none — one deliverable per task; overlapping areas (e.g., tokens) split by boundary (M1-T003 tokens vs M1-T005 brand assets).
- **Contradictory requirements:** none open — all previously audited contradictions (H-1, M-1, G-01…G-34) were resolved in v1.0.1/v1.0.2; phase-label mapping handled by DECISIONS D-001 without scope change.
- **Unresolved (recorded, not guessed):** G-04/B-001 (source authorization — operator), B-002 (counsel review), B-003 (hosting) — see BLOCKERS.md.

## 9. Asset requirements → assets → tasks → verification (added 2026-09-03, asset-readiness directive)

| Asset requirement | Specification | Asset(s) delivered | Wiring task | Verification | Gate |
|---|---|---|---|---|---|
| Logo configuration set (primary/symbol/light/dark/mono) | DESIGN-SYSTEM §2–§3 | ASSET-LOGO-001…003 (official) + -010…012 (derived, round-trip/symmetry/purity checks) | M1-T005, M1-T013 | ASSET-MANIFEST §Logo | DA-1 |
| Favicon package (16/32/ico; svg pending vector master) | DESIGN-SYSTEM §2; brand guidelines (16px audit) | ASSET-FAV-001…004 | M1-T005 | ASSET-MANIFEST §Favicon | DA-2 |
| App icon set (512/192/180) | DESIGN-SYSTEM §2; ARCHITECTURE (PWA) | ASSET-ICON-001…003 | M1-T005 | ASSET-MANIFEST §App icon | DA-3 |
| Player watermark (128px, 20%, bottom-right, spec'd behaviors) | DESIGN-SYSTEM §2; SCREENS S-07; GESTURES §6 | ASSET-WM-001 + README §Watermark usage spec | M3-T001 | ASSET-MANIFEST §Watermark | DA-4 |
| Licensed self-hosted typography (no substitution) | DESIGN-SYSTEM §5 | ASSET-FONT-001/002 (OFL 1.1, SHA-256) | M1-T004 | ASSET-MANIFEST §Typography | DA-5 |
| Icon system (library + inventory + rules; no emoji/Unicode) | DESIGN-SYSTEM §7 | ICON-SYSTEM.md (mapped to specs) | M1-T002 (pin), M1-T008…T010, M3 chrome | ICON-SYSTEM §Verification | DA-6 |
| Design-token foundation | DESIGN-SYSTEM §4–§9 | design-tokens.json (+ decisions D-005…D-008 for open values) | M1-T003 | token cross-check vs DESIGN-SYSTEM | DA-7 |
| Player visual dependencies (no unmet image needs) | GESTURES §2–§7; SCREENS S-07 | audit in README §Player (icons+CSS+ostiole+watermark) | M3-T001…T003 | README audit table | DA-8 |
| Image strategy (no fake content) | DESIGN-SYSTEM §11; PRD C-1 | README §Image system rules | M2-T015+ (runtime) | README rules + G-7 gate | DA-9 |
| Social/OG (brand-real) | SEO.md §OG | ASSET-SOC-001 + runtime per-video thumbs | M5-T002 | ASSET-MANIFEST §Social | DA-10 |
| A11y visual basis (focus/contrast/states/reduced-motion) | ACCESSIBILITY §2/§4/§6; DESIGN-SYSTEM §9/§10 | tokens + README §Accessibility | M1-T003/T008…T010 | contrast unit tests (TESTING §6) | DA-11 |

Orphan analysis (assets): every delivered asset traces to a spec requirement above; no asset exists without a requirement row; AG-001/002/003 are the only unmet/unclosed items (see ASSET-GAPS.md).

### Supporting-asset pass rows (2026-09-03)

| Requirement | Specification | Asset(s) | Wiring task | Verification | Gate |
|---|---|---|---|---|---|
| PWA installability (manifest icons incl. maskable) | PRD §72; SEO.md §Favicons/app-icons | ASSET-ICON-002/003/004/005 | M1-T005 | safe-zone radius check (203.65 ≤ 204.8), corners, bytes | DA-3 (addendum 2) |
| Category visual system (deterministic token meshes) | DESIGN-SYSTEM §11 | ASSET-SPEC-001 (spec; zero files by design) | M2-T017 (generator), M2-T018 (perf trigger) | determinism + contrast unit tests (task ACs) | M2-GATE 2.9-adjacent |
| Secondary-category restraint (nothing unnecessary) | DESIGN-SYSTEM §1; supporting directives | ASSET-SPEC-002 audit (9 rejections cited) | — (governance doc) | audit table row-by-row | DA-GATE DA-15 scope |
