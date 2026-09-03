# SYCONIA — Branding & Production Asset Pack

**Authority chain:** AGENT.md → specification suite → docs → this pack. The branding truth is `/branding/syconia-brand-guidelines.pdf` + these official assets (aesthetic authority); the repo is implementation truth. Controlled register: **[ASSET-MANIFEST.md](./ASSET-MANIFEST.md)** — every asset, provenance, and verification result.

## Directory structure

```
branding/
├── syconia-primary-logo.png        ← official masters (NEVER edit; root = spec-referenced paths)
├── syconia-symbol-only.png
├── syconia-monochrome-light.png
├── syconia-app-icon.png
├── syconia-favicon.png
├── syconia-brand-guidelines.pdf
├── logo/          derived transparent + monochrome-on-dark variants
├── favicon/       16px, 32px, .ico   (svg = gap AG-001)
├── app-icon/      192 (PWA), 180 (Apple touch)
├── watermark/     syconia-watermark-128.png
├── social/        syconia-og-default.png (1200×630)
├── fonts/         Fraunces + Inter (SIL OFL 1.1) + licenses
├── design-tokens.json   token foundation (consumed by M1-T003)
├── ICON-SYSTEM.md       lucide-react mapping + rules
└── ASSET-MANIFEST.md    controlled register (this pack's source of truth)
```

`/uploads/` holds the operator's originals (byte-identical provenance copies) — leave untouched.

## Rules (binding)

1. **Never modify the six official masters.** Derivations are permitted only as: background key-out, alpha-preserving flat recolor, resampling, repackaging, or composition of official assets onto brand-token canvases — **no geometry edits, no redraw, no effects** (DESIGN-SYSTEM §2–§3; AGENT.md §2.1.4).
2. **No AI-generated "brand" artwork.** The logo exists; it is not re-imagined. UI illustration = line-art emblem exports (`logo/syconia-logo-monochrome-on-dark.png`) + typography only.
3. **No vector master exists** (gap AG-001). Until the operator supplies official SVGs, `favicon.svg` and vector logo variants are UNRESOLVED — **tracing is prohibited**. High-res rasters (1635–2160px) cover all v1 UI needs.
4. **Naming law:** `syconia-[purpose]-[variant].[ext]`. Forbidden: `final-final`, `new-logo`, `logo2`, `test`, `temp`, `old`.
5. New assets require an ASSET-MANIFEST row (ID, source/master, verification) before commit — nothing enters the pack unregistered.

## Usage map

| Context | Asset | Rules |
|---|---|---|
| Header (≥480px) | `syconia-primary-logo.png` or transparent variant | Wordmark never <96px width; clear space = 4× ostiole-dot diameter (`--space-logo-clear`) |
| Header <480px / drawer / admin sidebar | `syconia-symbol-only.png` (or transparent) | Symbol-only below 480px; admin sidebar 28px |
| Favicon contexts | always symbol-only | See Favicon configuration below |
| Light/print contexts | `syconia-monochrome-light.png` | Gold fails contrast on light (2.46:1) — mono ink only |
| Dark line-art (empty/error/404 art, reduced-motion loader emblem) | `logo/syconia-logo-monochrome-on-dark.png` | Alabaster #FAF9F6 (18.9:1); decorative → `aria-hidden` |
| OG default card | `social/syconia-og-default.png` | Non-video pages; per-video OG = runtime proxy thumbnail (SEO.md) |

## Favicon configuration (browser-compatible; wired at M1-T005)

Next.js App Router metadata (implementation consumes this pack — files are ready):

```ts
icons: {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },                // legacy + conventional /favicon.ico
    { url: '/branding/favicon/syconia-favicon-32.png', sizes: '32x32', type: 'image/png' },
    { url: '/branding/favicon/syconia-favicon-16.png', sizes: '16x16', type: 'image/png' },
  ],
  apple: { url: '/branding/app-icon/syconia-app-icon-180.png', sizes: '180x180', type: 'image/png' },
}
```

(Serve paths may be re-mapped by the app's static strategy at M1-T005; the **files** above are final.)
Legibility: the 32px master is the official line-weight-thickened rendering; 16px is a pure downscale (guidelines' 16px audit refers to the thickened master; 16px purity 89% = resample edge blends, artwork/bg contrast 8.1:1). No wordmark at favicon sizes — symbol only.

## Watermark — full usage specification (asset directive §7)

| Property | Specification |
|---|---|
| Source format | `watermark/syconia-watermark-128.png` — PNG RGBA, transparent background, official symbol artwork (scale-only derivation per DESIGN-SYSTEM §2) |
| Stored opacity | 100% (full) — adaptability preserved |
| Display opacity | **20%** at render time (CSS `opacity: .2`) per SCREENS S-07 / GESTURES §6 |
| Display size | **128px** (spec-fixed, all viewports) |
| Position | Bottom-right of the player stage; **never centered, never over native source controls** (GESTURES §2) |
| Safe area | Inset ≥16px from stage edges (documented decision — keeps clear of corner overlay controls) |
| Fullscreen | Same rule, stage-relative (unchanged) |
| Theater mode | Stage remains the positioning context (92vw single column) — unchanged |
| Mobile | Same 128px rule; sits above the letterbox matte, below corner overlay |
| Light/dark | Gold artwork reads on dark mattes (8.1:1 vs Obsidian); over bright source media visibility reduces — acceptable: this is a **brand mark, not content protection** (right-click stays native; GESTURES §4) |
| Accessibility | `aria-hidden="true"` (decorative; SCREENS S-07 a11y row) |
| Implementation location | Stage backdrop in our DOM — **never inside or over the provider iframe** (GESTURES §4: "part of stage backdrop, not the media"). No provider terms are implicated by our own DOM; nonetheless, actual player deployment remains subject to authorized-source terms and **M2/G-04** — no provider is assumed by this asset's existence |
| Wiring task | M3-T001 (player shell) |

## Image system rules (asset directive §13)

- **Hero imagery / video thumbnails / posters** — always **source-provided media via the image proxy** (DESIGN-SYSTEM §11; PRD C-1). Never authored, never duplicated into this repo, never fabricated. No fake titles, performers, providers, or URLs.
- **Category artwork** — deterministic token-palette gradient meshes (emerald/obsidian), generated locally at runtime; **no static files** (by design).
- **Avatars** — admin surfaces only (component-rendered); no public user imagery exists in v1 (no accounts).
- **Metadata imagery** — runtime source data only.
- **Fallback behavior** — the specced four-state system (skeleton/empty/error/offline per ERROR-STATES.md): empty = `logo/syconia-logo-monochrome-on-dark.png` line-art + serif line + one CTA. **No placeholder imagery ever substitutes for unavailable real content.**
- **OG** — per-video: proxy thumbnail 1200×630; default: `social/syconia-og-default.png`. No fake screenshots of the future app.

## Player visual dependencies (asset directive §12 — audit result)

Every player visual resolves to the **icon system** (`ICON-SYSTEM.md`), **CSS**, or this pack — zero additional image files required: poster = source thumbnail + ostiole play affordance (component); play/pause/volume/mute/fullscreen/theater/settings/more = lucide icons (capability-driven chrome, GESTURES §2); buffering/loading = **ostiole dot pulse** (the brand loading signal — never a generic spinner); muted/volume overlays = icons + slider components; playback failure / source unavailable / geo / error = failure-ladder dialog components (E-07/E-08/E-18) with icons; mobile controls = same icon set at ≥44px targets; gesture feedback (seek ripple, 2× chip, time bubble) = CSS/spec'd micro-components (GESTURES §3). Watermark = ASSET-WM-001 above.

## Accessibility of the visual system (asset directive §11)

WCAG 2.2 AA target is structural, not cosmetic: focus ring 2px Champagne + 2px Obsidian offset on everything (ACCESSIBILITY §2); token contrasts are computed and unit-tested (18.9/9.9/5.6/8.1/13.4/9.6/10.2/8.2:1 — DESIGN-SYSTEM §4, math governs per discrepancy B-1); every primitive carries default/hover/active/focus/pressed/disabled/loading/selected/error states per DESIGN-SYSTEM §10 (fixed per-component at M1-T008…T010); icons are non-text UI ≥3:1 via `currentColor`; reduced-motion replaces pulse/shimmer with the static emblem (`logo/syconia-logo-monochrome-on-dark.png`); decorative art is `aria-hidden`. Sign-off checkpoints: M5-T004 full audit.
