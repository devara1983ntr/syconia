# SYCONIA — Production Asset Manifest (controlled register)

**Version 1.0.0 · 2026-09-03 · Authority: AGENT.md → specs → docs → this file.**
Verification method note (honest scope): all VERIFIED rows below were validated **programmatically** (dimensions, mode, alpha channel, palette purity, round-trip compositing against the official master, mirror-symmetry IoU, file-format reload). No human visual pass was performed in the authoring environment — see gap **AG-002** (pending operator sign-off) in `.ai/audits/ASSET-GAPS.md`. No asset is marked VERIFIED without a recorded check.

Provenance chain: `/uploads/` (operator originals, byte-identical, never edited) → `/branding/` root (official masters, never edited) → `/branding/**` subdirectories (derived productions; derivation = background key-out / flat alpha-preserving recolor / resample / repack / composition onto brand-token canvas only — **no geometry edits, no redraw**, per DESIGN-SYSTEM §2–§3).

## Logo system

| Asset ID | File | Type | Format / Dimensions | Variant & Purpose | Source / Master | License | Intended usage | Verification | Status |
|---|---|---|---|---|---|---|---|---|---|
| ASSET-LOGO-001 | `syconia-primary-logo.png` (root) | Official master | PNG RGB 2160×2148 | Primary emblem + wordmark on Night Emerald | `/uploads/` original | Operator-owned | Header wordmark contexts (≥96px width), OG card art, print | 2160×2148 confirmed; bg exactly #012A21 (corner-flat); artwork within brand palette (95.6% opaque-purity at tol 28, remainder = AA edge blends) | OFFICIAL-VERIFIED |
| ASSET-LOGO-002 | `syconia-symbol-only.png` (root) | Official master | PNG RGB 1635×1626 | Symbol-only on Obsidian; favicon/avatar/watermark basis | `/uploads/` original | Operator-owned | Symbol contexts <96px, drawer header, admin sidebar 28px | bg exactly #09090B; gold artwork; **mirror-symmetry IoU 0.99978** (confirms guidelines' "mathematically mirrored" geometry) | OFFICIAL-VERIFIED |
| ASSET-LOGO-003 | `syconia-monochrome-light.png` (root) | Official master | PNG RGB 1635×1626 | Monochrome (near-black line work) for light/Alabaster contexts & print | `/uploads/` original | Operator-owned | Light surfaces, letterhead, print | bg exactly #FFFFFF flat; single dark ink #1E1E24; stroke/line-work geometry (coverage 11.35% of bbox) | OFFICIAL-VERIFIED |
| ASSET-LOGO-010 | `logo/syconia-logo-primary-transparent.png` | Derived | PNG RGBA 2160×2148 | Primary art, transparent background | ASSET-LOGO-001 (key-out) | — follows master | Placement on emerald/obsidian gradient surfaces where a solid Night Emerald plate is unwanted | Round-trip composite over #012A21 vs master: max channel diff 18, 0.0625% of pixels >2 (AA-edge estimation only); no opaque pixel within bg tolerance | DERIVED-VERIFIED |
| ASSET-LOGO-011 | `logo/syconia-logo-symbol-transparent.png` | Derived | PNG RGBA 1635×1626 | Symbol, transparent background | ASSET-LOGO-002 (key-out) | — | Watermark master, symbol overlays on any dark surface | Round-trip vs master: max diff 16, 0.0791% pixels >2; symmetry preserved (source IoU 0.99978) | DERIVED-VERIFIED |
| ASSET-LOGO-012 | `logo/syconia-logo-monochrome-on-dark.png` | Derived | PNG RGBA 1635×1626 | Monochrome line-art in Alabaster #FAF9F6 for dark surfaces | ASSET-LOGO-003 (key-out + flat recolor) | — | **Empty/error/404 emblem line-art** (SCREENS S-09, ERROR-STATES E-01/E-02, ERROR-STATES §4), reduced-motion static loader emblem | Alpha channel byte-identical to keyed source (geometry untouched); 100.0% of opaque pixels exactly Alabaster; contrast on Obsidian 18.9:1 (AA) | DERIVED-VERIFIED |

**Configuration matrix (§3 of the asset directive):** primary → `ASSET-LOGO-001`/`-010` · symbol-only → `ASSET-LOGO-002`/`-011` · light-background → `ASSET-LOGO-003` · dark-background → `ASSET-LOGO-001/-010/-011` (opaque/transparent) · monochrome → `ASSET-LOGO-003` (light) + `ASSET-LOGO-012` (dark) · **scalable vector → does not exist — gap AG-001 (UNRESOLVED)**. Creation by tracing/redrawing is prohibited (AGENT.md §2.1.4; DESIGN-SYSTEM §3).

## Favicon package

| Asset ID | File | Format / Dimensions | Purpose | Source | Verification | Status |
|---|---|---|---|---|---|---|
| ASSET-FAV-001 | `syconia-favicon.png` (root) | PNG RGBA 32×32 | Browser favicon (official) | `/uploads/` original | 32×32; line-weight-thickened per guidelines; brand palette | OFFICIAL-VERIFIED |
| ASSET-FAV-002 | `favicon/syconia-favicon-16.png` | PNG RGBA 16×16 | 16px legacy contexts | ASSET-FAV-001 (LANCZOS resample — scale only) | 16×16 reload OK; opaque palette purity 89% (edge resampling blends, expected at 16px); artwork/bg contrast 8.1:1 (gold on Obsidian) | DERIVED-VERIFIED |
| ASSET-FAV-003 | `favicon/syconia-favicon-32.png` | PNG RGBA 32×32 | Package copy of official 32 (lossless re-save) | ASSET-FAV-001 | byte-identical pixels to official 32 | DERIVED-VERIFIED |
| ASSET-FAV-004 | `favicon/syconia-favicon.ico` | ICO (16+32 packed) | Legacy browsers / conventional `/favicon.ico` | ASSET-FAV-001/‑002 (repack only) | Reloads as valid ICO containing both sizes | DERIVED-VERIFIED |
| — | `favicon/syconia-favicon.svg` | — | **Not producible** — no vector master exists (AG-001). Must be supplied by operator; tracing is prohibited. | — | — | UNRESOLVED |

## App icon

| Asset ID | File | Format / Dimensions | Purpose | Source | Verification | Status |
|---|---|---|---|---|---|---|
| ASSET-ICON-001 | `syconia-app-icon.png` (root) | PNG RGBA 512×512 | App icon (official: golden border, luster monogram on Obsidian) | `/uploads/` original | 512×512; Obsidian bg + gold artwork (palette-confirmed); no text beyond official monogram | OFFICIAL-VERIFIED |
| ASSET-ICON-002 | `app-icon/syconia-app-icon-192.png` | PNG RGBA 192×192 | PWA manifest 192 | ASSET-ICON-001 (LANCZOS) | 192×192; purity 98.96% | DERIVED-VERIFIED |
| ASSET-ICON-003 | `app-icon/syconia-app-icon-180.png` | PNG RGBA 180×180 | Apple touch icon | ASSET-ICON-001 (LANCZOS) | 180×180 reload OK | DERIVED-VERIFIED |

## Watermark (player)

| Asset ID | File | Format / Dimensions | Purpose | Source | Verification | Status |
|---|---|---|---|---|---|---|
| ASSET-WM-001 | `watermark/syconia-watermark-128.png` | PNG RGBA 128×128 transparent | Player stage watermark (brand mark, not content protection) | ASSET-LOGO-011 (resample — "scale + opacity only" derivation sanctioned by DESIGN-SYSTEM §2) | 128×128; 94.8% transparent; opaque artwork 100% palette-pure gold; displayed at 20% opacity at runtime | DERIVED-VERIFIED |

Full usage specification: `branding/README.md` §Watermark.

## Social / Open Graph

| Asset ID | File | Format / Dimensions | Purpose | Source | Verification | Status |
|---|---|---|---|---|---|---|
| ASSET-SOC-001 | `social/syconia-og-default.png` | PNG RGB 1200×630 | Default OG/Twitter card for non-video pages (home, legal, about; `twitter:card=summary_large_image`) | Composition: ASSET-LOGO-010 on exact #012A21 canvas + tagline typeset in Inter (OFL) Champagne #E6D3A0 | Corners exactly #012A21; content bbox centered (margins L290/R293/T136/B63); tagline rendered in licensed Inter (no system-font fallback); no fabricated UI screenshot | DERIVED-VERIFIED |

Per-video OG images are **runtime proxy thumbnails (1200×630 crop)** per SEO.md §OG — never authored files.

## Typography

| Asset ID | File | Format | Purpose | Source | License | Verification | Status |
|---|---|---|---|---|---|---|---|
| ASSET-FONT-001 | `fonts/fraunces/Fraunces-VF.ttf` (+ `OFL.txt`) | TrueType variable (SOFT, WONK, opsz, wght) | Primary editorial serif (DESIGN-SYSTEM §5) | google/fonts `ofl/fraunces` @ 2026-09-03 · SHA-256 `177ff6c0f14e5550a3c624247cd1189611d4eb65d000b14944c63d967958abbb` | SIL OFL 1.1 (copyright 2018 The Fraunces Project Authors) | Valid TTF (21 tables, DSIG); loads and renders via font tooling | VERIFIED |
| ASSET-FONT-002 | `fonts/inter/Inter-VF.ttf` (+ `OFL.txt`) | TrueType variable (opsz, wght) | Secondary sans (guidelines shortlist: "Satoshi, Inter, Roboto") | google/fonts `ofl/inter` @ 2026-09-03 · SHA-256 `29160a80ff49ddcab2c97711247e08b1fab27a484a329ce8b813d820dc559031` | SIL OFL 1.1 (copyright 2020 The Inter Project Authors) | Valid TTF; loads and renders (used to typeset ASSET-SOC-001) | VERIFIED |

Wordmark is **not** typeset — official asset only. Italic instances not bundled (decision D-008: no italic requirement exists in any spec).

## Icon system

| Asset ID | File | Purpose | Status |
|---|---|---|---|
| ASSET-ICO-SYS-001 | `ICON-SYSTEM.md` | Production icon system: lucide-react per DESIGN-SYSTEM §7, mapped to every specced surface | VERIFIED (mapped against SCREENS/GESTURES/UX-FLOWS/ERROR-STATES) |

No per-icon SVG files are produced — the library is the source (per asset directive §9; avoids duplication and style drift).

## Design tokens

| Asset ID | File | Purpose | Status |
|---|---|---|---|
| ASSET-TOK-001 | `design-tokens.json` | Machine-readable token foundation mirroring DESIGN-SYSTEM §4–§9 verbatim + documented decisions for values the spec leaves open (z-index, containers, space interpolation) | VERIFIED (cross-checked against DESIGN-SYSTEM.md; consumed by M1-T003) |

## Normative reference

| Asset ID | File | Purpose | Status |
|---|---|---|---|
| ASSET-PDF-001 | `syconia-brand-guidelines.pdf` (root) | Normative brand reference (6pp) — aesthetic authority | OFFICIAL |

## Totals

**19 assets verified (3 official masters logo set + favicon + app icon verified official, 10 derived/composed verified, 2 fonts verified, icon system + tokens verified, PDF official). 1 unresolved deliverable (vector/SVG masters — AG-001, owner: operator). Zero placeholders. Zero generated brand artwork.**
