# SYCONIA — Production Asset Manifest (controlled register)

**Version 1.0.0 · 2026-09-03 · Authority: AGENT.md → specs → docs → this file.**
Verification method note (honest scope): all VERIFIED rows below were validated **programmatically** (dimensions, mode, alpha channel, palette purity, round-trip compositing against the official master, mirror-symmetry IoU, file-format reload). No human visual pass was possible in the authoring environment; **operator visual sign-off was subsequently received 2026-09-03 — AG-002 CLOSED/PASS** (scope recorded in `.ai/audits/ASSET-GAPS.md`). No asset is marked VERIFIED without a recorded check.

Provenance chain: `/uploads/` (operator originals, byte-identical, never edited) → `/branding/` root (official masters, never edited) → `/branding/**` subdirectories (derived productions; derivation = background key-out / flat alpha-preserving recolor / resample / repack / composition onto brand-token canvas only — **no geometry edits, no redraw**, per DESIGN-SYSTEM §2–§3).

## Logo system

| Asset ID | File | Type | Format / Dimensions | Variant & Purpose | Source / Master | License | Intended usage | Verification | Status |
|---|---|---|---|---|---|---|---|---|---|
| ASSET-LOGO-001 | `syconia-primary-logo.png` (root) | Official master | PNG RGB 2160×2148 | Primary emblem + wordmark on Night Emerald | `/uploads/` original | Operator-owned | Header wordmark contexts (≥96px width), OG card art, print | 2160×2148 confirmed; bg exactly #012A21 (corner-flat); artwork within brand palette (95.6% opaque-purity at tol 28, remainder = AA edge blends) | OFFICIAL-VERIFIED |
| ASSET-LOGO-002 | `syconia-symbol-only.png` (root) | Official master | PNG RGB 1635×1626 | Symbol-only on Obsidian; favicon/avatar/watermark basis | `/uploads/` original | Operator-owned | Symbol contexts <96px, drawer header, admin sidebar 28px | bg exactly #09090B; gold artwork; **mirror-symmetry IoU 0.99978** (confirms guidelines' "mathematically mirrored" geometry) | OFFICIAL-VERIFIED |
| ASSET-LOGO-003 | `syconia-monochrome-light.png` (root) | Official master | PNG RGB 1635×1626 | Monochrome (near-black line work) for light/Alabaster contexts & print | `/uploads/` original | Operator-owned | Light surfaces, letterhead, print | bg exactly #FFFFFF flat; single dark ink #1E1E24; stroke/line-work geometry (coverage 11.35% of bbox) | OFFICIAL-VERIFIED |
| ASSET-LOGO-010 | `logo/syconia-logo-primary-transparent.png` | Derived | PNG RGBA 2160×2148 | Primary art, transparent background | ASSET-LOGO-001 (key-out) | — follows master | Placement on emerald/obsidian gradient surfaces where a solid Night Emerald plate is unwanted | Round-trip composite over #012A21 vs master: max channel diff 18, 0.0625% of pixels >2 (AA-edge estimation only); no opaque pixel within bg tolerance | DERIVED-VERIFIED |
| ASSET-LOGO-011 | `logo/syconia-logo-symbol-transparent.png` | Derived | PNG RGBA 1635×1626 | Symbol, transparent background | ASSET-LOGO-002 (key-out) | — | Watermark master, symbol overlays on any dark surface | Round-trip vs master: max diff 16, 0.0791% pixels >2; symmetry preserved (source IoU 0.99978) | DERIVED-VERIFIED |
| ASSET-LOGO-012 | `logo/syconia-logo-monochrome-on-dark.png` | Derived | PNG RGBA 1635×1626 | Monochrome **full lockup** (emblem + wordmark) in Alabaster #FAF9F6 for dark surfaces | ASSET-LOGO-003 (key-out + flat recolor) | — | Editorial lockup contexts (reduced-motion static emblem at display sizes) | Alpha channel byte-identical to keyed source (geometry untouched); 100.0% of opaque pixels exactly Alabaster; contrast on Obsidian 18.9:1 (AA) | DERIVED-VERIFIED |
| ASSET-LOGO-013 | `logo/syconia-logo-symbol-monochrome-on-dark.png` | Derived | PNG RGBA 615×1154 | **Symbol-only monochrome line-art** — the emblem required for empty/error/404 art | ASSET-LOGO-012 (extraction crop to the emblem component region [510,218,1124,1371] of the official mono master — region crop only, no geometry edit) | — | Empty/error/404 emblem line-art (SCREENS S-09, ERROR-STATES §4/E-01/E-02), reduced-motion static loader emblem, editorial states | Pixels byte-identical to the master region (verified full-region compare); single connected component; ink 99.6% Alabaster; coverage 14.11% ≈ official symbol master 14.06%; silhouette mask IoU vs gold symbol master 0.9863 at 256px (line-work vs filled — expected residual) | DERIVED-VERIFIED |

**Configuration matrix (§3 of the asset directive):** primary → `ASSET-LOGO-001`/`-010` · symbol-only → `ASSET-LOGO-002`/`-011` · light-background → `ASSET-LOGO-003` · dark-background → `ASSET-LOGO-001/-010/-011` (opaque/transparent) · monochrome → `ASSET-LOGO-003` (light) + `ASSET-LOGO-012` (dark) · **scalable vector → does not exist — gap AG-001 (UNRESOLVED)**. Creation by tracing/redrawing is prohibited (AGENT.md §2.1.4; DESIGN-SYSTEM §3).

## Favicon package

| Asset ID | File | Format / Dimensions | Purpose | Source | Verification | Status |
|---|---|---|---|---|---|---|
| ASSET-FAV-001 | `syconia-favicon.png` (root) | PNG RGBA 32×32 | Browser favicon (official) | `/uploads/` original | 32×32; line-weight-thickened per guidelines; brand palette | OFFICIAL-VERIFIED |
| ASSET-FAV-002 | `favicon/syconia-favicon-16.png` | PNG RGBA 16×16 | 16px legacy contexts | ASSET-FAV-001 (LANCZOS resample — scale only) | 16×16 reload OK; palette purity 89% (edge resampling blends, expected at 16px); artwork present (16 warm-core px); **honest 16px metric:** brightest line-averaged pixel (106,87,50) = 2.8:1 vs Obsidian (full-tone gold is 8.1:1; 1px lines average with bg at this size). Favicon is decorative browser chrome, not a WCAG 1.4.11 UI component — acceptable; sharper sub-16px rendering arrives with AG-001 vector masters | DERIVED-VERIFIED |
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
| ASSET-FONT-001 | `fonts/fraunces/Fraunces-VF.ttf` (+ `OFL.txt`) | TrueType variable (SOFT, WONK, opsz, wght) | Primary editorial serif (DESIGN-SYSTEM §5) | google/fonts `ofl/fraunces` @ 2026-09-03 · SHA-256 `177ff6c0f14e5550a3c624247cd1189611d4eb65d000b14944c63d967958abbb` | SIL OFL 1.1 (copyright 2018 The Fraunces Project Authors) | Valid TTF (21 tables, DSIG); fvar axes verified structurally: opsz 9–144 · **wght 100–900 (DEFAULT 900)** · SOFT 0–100 · WONK 0/1. **Guardrail (AG-013): the default instance is Black 900 — implementation MUST pin weights** (next/font weight range + CSS font-weight ≥400 per DESIGN-SYSTEM §5) at M1-T004 | VERIFIED |
| ASSET-FONT-002 | `fonts/inter/Inter-VF.ttf` (+ `OFL.txt`) | TrueType variable (opsz, wght) | Secondary sans (guidelines shortlist: "Satoshi, Inter, Roboto") | google/fonts `ofl/inter` @ 2026-09-03 · SHA-256 `29160a80ff49ddcab2c97711247e08b1fab27a484a329ce8b813d820dc559031` | SIL OFL 1.1 (copyright 2020 The Inter Project Authors) | Valid TTF; fvar axes verified: opsz 14–32 · wght 100–900 (default 400 — safe); used to typeset ASSET-SOC-001 | VERIFIED |

Wordmark is **not** typeset — official asset only. Italic instances not bundled (decision D-008: no italic requirement exists in any spec).

## Icon system

| Asset ID | File | Purpose | Status |
|---|---|---|---|
| ASSET-ICO-SYS-001 | `ICON-SYSTEM.md` | Production icon system: lucide-react per DESIGN-SYSTEM §7, mapped to every specced surface | VERIFIED (mapped against SCREENS/GESTURES/UX-FLOWS/ERROR-STATES) |

No per-icon SVG files are produced — the library is the source (per asset directive §9; avoids duplication and style drift).

## Static serve map (M1-T005 — app public/ mirror)

The application serves the official pack over HTTP via byte-identical copies in `public/branding/` (plus the conventional root `public/favicon.ico`); serve paths mirror the pack paths 1:1. These are **serve-path remaps of existing registered assets, not new pack assets** (README: "serve paths may be re-mapped by the app's static strategy at M1-T005"). Integrity is enforced by `tests/unit/brand-assets.test.ts` — every copy must stay SHA-256-identical to its source below; the served set is asserted to equal exactly this map.

| Served path | Pack source | Asset ID | SHA-256-pinned |
|---|---|---|---|
| `/favicon.ico` | `favicon/syconia-favicon.ico` | ASSET-FAV-004 | ✓ |
| `/branding/favicon/syconia-favicon-16.png` | `favicon/syconia-favicon-16.png` | ASSET-FAV-002 | ✓ |
| `/branding/favicon/syconia-favicon-32.png` | `favicon/syconia-favicon-32.png` | ASSET-FAV-003 | ✓ |
| `/branding/app-icon/syconia-app-icon-180.png` | `app-icon/syconia-app-icon-180.png` | ASSET-ICON-003 | ✓ |
| `/branding/app-icon/syconia-app-icon-192.png` | `app-icon/syconia-app-icon-192.png` | ASSET-ICON-002 | ✓ |
| `/branding/app-icon/syconia-app-icon-maskable-192.png` | `app-icon/syconia-app-icon-maskable-192.png` | ASSET-ICON-005 | ✓ |
| `/branding/app-icon/syconia-app-icon-maskable-512.png` | `app-icon/syconia-app-icon-maskable-512.png` | ASSET-ICON-004 | ✓ |
| `/branding/syconia-app-icon.png` | `syconia-app-icon.png` (root master) | ASSET-ICON-001 | ✓ |
| `/branding/logo/syconia-logo-primary-transparent.png` | `logo/syconia-logo-primary-transparent.png` | ASSET-LOGO-010 | ✓ |
| `/branding/logo/syconia-logo-symbol-transparent.png` | `logo/syconia-logo-symbol-transparent.png` | ASSET-LOGO-011 | ✓ |
| `/branding/logo/syconia-logo-monochrome-on-dark.png` | `logo/syconia-logo-monochrome-on-dark.png` | ASSET-LOGO-012 | ✓ |
| `/branding/logo/syconia-logo-symbol-monochrome-on-dark.png` | `logo/syconia-logo-symbol-monochrome-on-dark.png` | ASSET-LOGO-013 | ✓ |
| `/branding/watermark/syconia-watermark-128.png` | `watermark/syconia-watermark-128.png` | ASSET-WM-001 | ✓ |

(ASSET-SOC-001 `social/syconia-og-default.png` is deliberately **not** mirrored yet — OG wiring belongs to M5-T002 per D-007.)

## Supporting / secondary assets (2026-09-03 audit — see SUPPORTING-ASSETS.md for the full category audit)

| Asset ID | File | Format / Dimensions | Purpose | Source | Verification | Status |
|---|---|---|---|---|---|---|
| ASSET-ICON-004 | `app-icon/syconia-app-icon-maskable-512.png` | PNG RGBA 512×512 | PWA manifest icon, `purpose: maskable` (safe-zone-inscribed: survives circular/squircle launcher masks) | ASSET-ICON-001 composition: official 512 art scaled 287px (inscribed in 80% safe circle) on exact-Obsidian canvas | All art radius 203.65 ≤ safe 204.8; corners exactly #09090B; 32,050 bytes | DERIVED-VERIFIED |
| ASSET-ICON-005 | `app-icon/syconia-app-icon-maskable-192.png` | PNG RGBA 192×192 | PWA manifest icon, maskable | Same derivation at 192 | Art radius 74.95 ≤ safe 76.8; corners Obsidian; 7,244 bytes | DERIVED-VERIFIED |
| ASSET-SPEC-001 | `CATEGORY-ART-SYSTEM.md` | Spec document | Deterministic token-derived category art (CSS-first; seed algorithm; contrast-proof obligation; anti-invention clauses) | DESIGN-SYSTEM §11 mandate | Spec audited against tokens/§11; no image files by design; consumed by M2-T017 | VERIFIED |
| ASSET-SPEC-002 | `SUPPORTING-ASSETS.md` | Audit document | Secondary-asset category audit: 14 categories → verdicts with spec citations (2 present, 2 created, 9 rejected, 1 pending) | This audit pass | Every verdict cites a spec row; zero rejected-as-unnecessary assets created | VERIFIED |

Performance notes: maskable pair = 39.3KB total, immutable static cache; category system = ~200B CSS/surface, zero images (rasterization only on measured trigger per spec §2).

## Design tokens

| Asset ID | File | Purpose | Status |
|---|---|---|---|
| ASSET-TOK-001 | `design-tokens.json` | Machine-readable token foundation mirroring DESIGN-SYSTEM §4–§9 verbatim + documented decisions for values the spec leaves open (z-index, containers, space interpolation) | VERIFIED (cross-checked against DESIGN-SYSTEM.md; consumed by M1-T003) |

## Normative reference

| Asset ID | File | Purpose | Status |
|---|---|---|---|
| ASSET-PDF-001 | `syconia-brand-guidelines.pdf` (root) | Normative brand reference (6pp) — aesthetic authority | OFFICIAL |

## Totals

**24 assets verified (6 official, 13 derived/composed, 2 fonts, icon system + tokens, 2 specs + audit doc). 1 unresolved deliverable (vector/SVG masters — AG-001, owner: operator); documentation screenshots PENDING real UI (AG-014). Final readiness review 2026-09-03: forensic re-inspection passed (halo=0, components, ICO structure, OG tagline centering offset 1px, font axes structural check); vision-based human inspection NOT available in the authoring environment (AG-002 remains open for operator sign-off). Zero placeholders. Zero generated brand artwork.**
