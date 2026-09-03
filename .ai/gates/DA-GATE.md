# DA-GATE — Design & Asset Readiness (PASS required before M1 UI implementation completes)

**Version 1.0.0 · 2026-09-03 · Scope:** verifies the production asset pack so UI implementation never invents, approximates, or fabricates a required visual asset (asset directive §22). This gate does **not** modify the M0→M5 roadmap; it front-loads asset readiness consumed by M1-T003/T004/T005, M3-T001 and all UI tasks.

**Status: PASS WITH CONDITIONS** — every criterion below has objective programmatic evidence. Two open items are recorded (not hidden): **C-1** human visual sign-off of derived assets (due before M1-GATE; tracked as AG-002) and **C-2** official vector/SVG masters (AG-001; UNRESOLVED — non-blocking for v1 UI, blocking `favicon.svg` + print/large-format use). Status vocabulary note: PASS WITH CONDITIONS = all criteria evidenced, with owner-tracked open items that do not block the gated activity.

| # | Criterion (objective) | Evidence | Result |
|---|---|---|---|
| DA-1 | Required logo configurations exist (primary / symbol / light-bg / dark-bg / mono × 2) | ASSET-MANIFEST §Logo system — 3 official masters + 3 derived (round-trip ≤18 max channel diff, 0.06–0.08% px >2; symbol mirror-symmetry IoU 0.99978; mono recolor alpha-identical, 100% Alabaster) | PASS (vector variant → AG-001) |
| DA-2 | Favicon package (16, 32, .ico) | ASSET-MANIFEST §Favicon — official 32 + derived 16 (8.1:1 artwork/bg contrast) + ICO reload-verified 16+32 | PASS (svg → AG-001) |
| DA-3 | App icon (512 official, 192 PWA, 180 Apple) | ASSET-MANIFEST §App icon — resample-only derivations, palette-verified | PASS |
| DA-4 | Watermark (128px transparent, spec'd usage) | ASSET-WM-001 (94.8% transparent, 100% palette purity) + README §Watermark (position/opacity/fullscreen/theater/mobile/safe-area/a11y/provider-terms caveat) | PASS |
| DA-5 | Typography finalized + licensed (no substitution) | Fraunces VF + Inter VF (SIL OFL 1.1, licenses in-tree, SHA-256 recorded) — DESIGN-SYSTEM §5 | PASS |
| DA-6 | Icon system defined (library + inventory + rules) | branding/ICON-SYSTEM.md mapped to SCREENS/GESTURES/UX-FLOWS/ERROR-STATES; exclusions listed (no scope invention) | PASS |
| DA-7 | Design-token foundation (colors/type/space/radius/borders/elevation/opacity/blur/breakpoints/containers/grid/z-index/focus/motion/states) | branding/design-tokens.json mirrors DESIGN-SYSTEM §4–§9 verbatim; open values fixed as documented decisions D-005…D-008 | PASS |
| DA-8 | Player visual dependencies audited (no missing image assets) | README §Player visual dependencies — icons + CSS + ostiole pulse + watermark cover all states; zero unmet image needs | PASS |
| DA-9 | Image strategy defined (no fake content possible) | README §Image system rules — source-provided media only; category art = runtime deterministic meshes; four-state fallbacks; no placeholder imagery | PASS |
| DA-10 | Social/OG assets (brand-real, no fake screenshots) | ASSET-SOC-001 composed from official art + exact token canvas + licensed font (corners #012A21, centered bbox, Inter-rendered tagline) | PASS |
| DA-11 | Accessibility visual basis (focus/contrast/states/reduced-motion) | tokens (computed contrasts 18.9→8.2:1; focus ring; targets) + README §Accessibility — state matrix per DESIGN-SYSTEM §10 | PASS |
| DA-12 | Asset manifest complete (IDs, provenance, verification) | branding/ASSET-MANIFEST.md — 19 verified rows, each with recorded check; 1 UNRESOLVED honestly marked | PASS |
| DA-13 | Asset provenance chain intact | uploads/ (untouched originals) → branding/ root (official masters untouched, verified unmodified in this commit) → derived subdirs (key-out/recolor/resample/repack/composition only) | PASS |
| DA-14 | No critical missing assets | All CRITICAL asset classes evidenced; open items are AG-001 (HIGH, workaround: 1635–2160px rasters exceed all v1 UI needs) + AG-002 (MEDIUM, operator sign-off) | PASS WITH CONDITIONS |
| DA-15 | No prohibited placeholders | Placeholder scan of added files clean; zero generated brand artwork; zero fake content; UNRESOLVED marked not substituted | PASS |

**Conditions register:** C-1 = AG-002 (close before M1-GATE) · C-2 = AG-001 (close when operator supplies SVG masters; until then no vector use, no `favicon.svg`, no print/large-format derivatives).

**Consumed by:** M1-T003 (tokens), M1-T004 (fonts), M1-T005 (favicon/icons/logo wiring), M1-T008…T010 (state matrix), M1-T016 (mono-on-dark emblem art), M3-T001 (watermark). M1 entry unchanged (M0-GATE PASS); C-1 gates **M1-GATE**, not M1 start.
