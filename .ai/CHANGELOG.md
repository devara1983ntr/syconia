# Changelog — `.ai/` Execution Control System

## [1.0.0] — 2026-09-03
### Added
- Complete AI execution-control system: README (agent workflow, recovery, authority), ROADMAP (M0→M5 lifecycle, dependencies, safe parallelism, blocked conditions), CURRENT-STATE (truthful baseline: documentation-only repo), DECISIONS (D-001…D-004), BLOCKERS (B-001 source gate G-04, B-002 legal review, B-003 hosting AUP), CHANGELOG.
- 70 task files across `tasks/M0…M5` (M0:3 · M1:18 · M2:19 · M3:10 · M4:11 · M5:9), each with objective, authoritative references, dependencies/blocks, scope, implementation requirements, acceptance criteria, tests, verification, files, forbidden shortcuts, evidence, status — all derived from the v1.0.2 specification suite (no invented requirements; every task cites sources).
- 6 phase READMEs (`phases/M0-RECON … M5-HARDENING-RELEASE`) and 6 evidence-based gates (`gates/M0…M5-GATE.md`); M2-GATE explicitly blocked while B-001 is open.
- Audits: TRACEABILITY (requirements→tasks→tests→gates, orphan analysis), COVERAGE (per-specification execution paths), QUALITY (recurring checks mapped to documented commands), FINAL-VERIFICATION (evidence template; all sections NOT_STARTED — nothing faked).
- MASTER-CHECKLIST: controlled checklist of all 70 tasks + 6 gates with evidence columns.
### Status at creation
M0-T001/T002 COMPLETE (this commit is the evidence); M0-T003 READY; 4 tasks BLOCKED (M2-T008/T009 ← B-001; M5-T006 ← B-003; M5-T007 ← B-002); everything else NOT_STARTED. Zero fabricated completion — the repository contains no application code.

## [1.1.0] — 2026-09-03
### Added (asset-readiness directive — design prep only; no app code, no scope invention)
- **Production asset pack in `branding/`**: derived logo variants (transparent primary/symbol, monochrome-on-dark line-art for empty/error/404 art — alpha-identical recolor D-005), favicon package (16px, package 32, ICO 16+32; svg impossible without vector master → AG-001), app icons 192/180, watermark 128px transparent (+ full usage spec: 20% runtime opacity, bottom-right, safe area, fullscreen/theater/mobile behavior, provider-terms caveat), OG default card 1200×630 (official art + token canvas + licensed-font tagline, D-007), self-hosted **Fraunces + Inter variable fonts (SIL OFL 1.1, licenses + SHA-256 in-tree, D-008)**.
- **`branding/ASSET-MANIFEST.md`** — controlled register: 19 verified assets (IDs, provenance chain uploads→masters→derived, programmatic verification results), 1 UNRESOLVED honestly marked.
- **`branding/ICON-SYSTEM.md`** — lucide-react per DESIGN-SYSTEM §7, full spec-mapped inventory, exclusions for un-specced icons (no scope invention).
- **`branding/design-tokens.json`** — token foundation mirroring DESIGN-SYSTEM §4–§9 verbatim; open values fixed as documented decisions D-006 (z-index/container/space ladders).
- **`branding/README.md`** — pack rules (derivations = key-out/recolor/resample/repack/composition only), usage map, favicon configuration, watermark spec, image-system rules (no fake content), player visual audit (zero unmet image needs), a11y basis.
- **`.ai/gates/DA-GATE.md`** — Design & Asset Readiness Gate: PASS WITH CONDITIONS (15 objective criteria; C-1 = AG-002 visual sign-off due before M1-GATE; C-2 = AG-001 vector masters open).
- **`.ai/audits/ASSET-GAPS.md`** — gap register: 3 open (AG-001 HIGH operator-supplied SVG masters, AG-002 MEDIUM human sign-off, AG-003 LOW blocked-by-AG-001), 8 resolved same-day with evidence.
- DECISIONS.md D-005…D-008; TRACEABILITY §9 (asset chain); COVERAGE DESIGN-SYSTEM row updated; ROADMAP M1 entry notes DA-GATE; CURRENT-STATE + MASTER-CHECKLIST reflect DA-GATE.
### Verification method (honest scope)
All asset checks are programmatic (round-trip composite vs master ≤18 max channel diff / 0.06–0.08% px >2; symbol mirror-symmetry IoU 0.99978; recolor alpha byte-identical; palette purity; ICO/PNG reloads; exact-canvas corners). No human visual pass exists in the authoring environment → AG-002 tracks operator sign-off. Zero placeholders; zero generated brand artwork; official masters untouched.
