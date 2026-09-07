# SYCONIA — Design System & Brand Implementation

| Field | Value |
|---|---|
| Document | DESIGN-SYSTEM.md · v1.1.0 · 2026-09-03 (Android platform migration) |
| Branding source of truth | `/branding/syconia-brand-guidelines.pdf` (v1.0, Sept 2026) + `/branding/` assets — `[EXISTING]` |
| Conflicts | PDF §5 "Corporate Decoy" rejected (PRD §17 C-2); unrelated business units out of scope (C-3) |

---

## 1. Brand foundation (locked)
- **Name/spelling:** SYCONIA (all-caps in display contexts; body prose may use "SYCONIA" only — no alternate company names in UI).
- **Pronunciation:** sy-COHN-ee-uh. **Etymology:** *syconium* (Greek *sykon*, fig) — the enclosed bloom. **Concept:** The Inward Bloom. **Tagline:** *The Beauty of the Inward Experience.* **Secondary:** *Where Intimacy Blooms.*
- **Position:** Quiet Luxury + Cinematic Technology + Editorial Media. Forbidden: neon, tube-site clichés, generic SaaS, excessive gradients/glass/gold, clutter, vulgarity.
- **Logo geometry (from guidelines):** mirrored S-curves forming a symmetrical vessel/urn silhouette; refined negative space; central ostiole dot; minimal line work; mathematically mirrored Béziers.

## 2. Official asset inventory `[EXISTING]` (in `/branding/`, copied from `/uploads/`)
| File | Role | Spec |
|---|---|---|
| `syconia-primary-logo.png` | Primary emblem + wordmark | 2160×2148; Night Emerald bg, Ostiole Gold emblem, custom wordmark |
| `syconia-symbol-only.png` | Symbol-only | 1635×1626; Obsidian bg; favicon/avatar/watermark basis |
| `syconia-monochrome-light.png` | Monochrome light | 1635×1626; for light/Alabaster contexts & print |
| `syconia-app-icon.png` | App icon | 512×512; golden border, 3D-luster monogram |
| `syconia-favicon.png` | Favicon | 32×32 (line-weight thickened for legibility; 16px audit passed per guidelines) |
| `syconia-brand-guidelines.pdf` | Normative brand reference | 6 pages |

Watermark variant (128px, 6pt refined lines, 20% opacity) is derived from the symbol-only asset by scale + opacity only — no redraw. **Rule: never recreate the logo as hand-written CSS/SVG approximation while these assets exist; use official files (or exact exports of them).** Dark/light/mono variants map 1:1 to the files above.

## 3. Logo usage rules
- Never: stretch, rotate, recolor (beyond supplied variants), alter geometry, add shadows/neon, crop the wordmark, place on low-contrast backgrounds, combine with unapproved marks, shrink the full logo below 96px width (use symbol-only below that; favicon contexts always symbol-only).
- **Clear space:** ≥ 4× the ostiole dot's diameter on all sides — enforced via layout tokens (`--space-logo-clear`).
- Placement: header (wordmark), drawer header (symbol + wordmark), favicon/app icon, player watermark bottom-right (never center, never over native controls), admin sidebar (symbol-only 28px), 404/error art (line-art rendering of symbol `[REQUIRED]`: a monochrome stroke export of the official asset, not a redraw).
- Loading indicator: the ostiole dot pulse (§10) — the dot is the brand's "alive" signal.

## 4. Color tokens (the only color source)
**Brand primitives**
| Token | Hex | Role |
|---|---|---|
| `--color-brand-emerald` | `#012A21` | Primary backdrop band, hero washes, emerald surfaces |
| `--color-brand-obsidian` | `#09090B` | App background (dark theme is the only theme) |
| `--color-brand-gold` | `#C5A059` | Ostiole Gold — accents, active states, emblem line |
| `--color-brand-champagne` | `#E6D3A0` | Champagne Gold — wordmark, secondary accents, focus ring |
| `--color-brand-alabaster` | `#FAF9F6` | Primary text on dark, editorial highlights |

**Semantic tokens (dark theme, canonical values)**
| Token | Value | Contrast on Obsidian | Use |
|---|---|---|---|
| `--color-background` | `#09090B` | — | Page |
| `--color-surface` | `#121214` (Obsidian +6% lightness, same hue) | — | Cards, table rows |
| `--color-surface-elevated` | `#1A1A1E` | — | Modals, dropdowns, drawer |
| `--color-surface-emerald` | `#012A21` | — | Hero bands, category cards |
| `--color-text-primary` | `#FAF9F6` | 18.9:1 | Body/titles |
| `--color-text-secondary` | `#B9B7B0` (Alabaster 72% on Obsidian) | 9.9:1 | Meta, captions |
| `--color-text-tertiary` | `#8A8880` | 5.6:1 | Disabled, fine print (≥14px only) |
| `--color-border` | `#26262B` | — | Hairlines, dividers |
| `--color-accent` | `#C5A059` | 8.1:1 | Active nav, links, highlights |
| `--color-accent-strong` | `#E6D3A0` | 13.4:1 | Focus ring, emphasis text |
| `--color-success` | `#4EC9A0` | 9.7:1 | Positive status (emerald-harmonized) |
| `--color-warning` | `#E3B341` | 10.2:1 | Caution, SLA amber |
| `--color-error` | `#F08A84` | 8.2:1 | Errors, destructive (soft coral; never pure red glow) |
| `--color-focus` | `#E6D3A0` | — | 2px ring + 2px Obsidian offset |
| `--color-scrim` | `rgba(9,9,11,0.56)` | — | Overlays |
| `--color-glass` | `rgba(9,9,11,0.72)` | — | Header/drawer/player chrome (blur 12px) |

Rules: derived neutrals are lightness steps of the brand hues only — no new hues. Status colors are functional-only and visually harmonized (desaturated toward the palette). **All ratios above are computed per the WCAG relative-luminance formula against Obsidian `#09090B` and are re-verified by unit test (TESTING §6); they are normative for conformance.** Branding-source discrepancy **B-1 (documented per PRD §17 policy):** the brand-guidelines PDF's own contrast figures — Ostiole Gold "3.2:1", Night Emerald "12.8:1", Champagne "2.1:1", Obsidian "19.5:1" (all vs white) — do not match computed WCAG values (2.46:1, 15.5:1, 1.48:1, 19.9:1 respectively). The guidelines remain the *aesthetic* authority; the computed math governs *conformance*. **Gold-as-text law (corrected):** on Obsidian — the only v1 theme — Ostiole Gold computes 8.1:1 and Champagne 13.4:1, so **both pass WCAG AA for normal-size text on dark surfaces** and may be used for text accents, links, labels and emphasis; body copy nevertheless remains Alabaster/secondary as an editorial-hierarchy rule (brand restraint, not contrast necessity). On light surfaces (Alabaster print/letterhead contexts) gold fails (2.46:1 vs white) and is restricted to large or decorative use only. No other colors may appear anywhere; CI gate greps for raw hex outside the token file (CI-CD §4 G-8).

## 5. Typography
- **Primary (editorial serif):** **Fraunces** (SIL OFL 1.1) — licensed, bundled in the app (`branding/fonts/`, Compose `FontFamily`; variable axes pinned per D-008/AG-013). Chosen as the legally-safe embodiment of the guidelines' direction (which names proprietary Canela/Ogg as *examples*, never bundled).
- **Secondary (sans):** **Inter** (SIL OFL 1.1) — guidelines-shortlisted; bundled the same way. Font scaling: all type respects Android user font-scale (sp units; no fixed-px text); min body 16sp.
- **Scale (fluid, clamp between mobile/desktop):** display `clamp(34px,6vw,64px)/1.05` serif · h1 `clamp(26px,4vw,40px)/1.15` serif · h2 `clamp(20px,3vw,28px)/1.25` serif · h3 `18px/1.4` sans-semibold · body `16px/1.7` sans · meta `13px/1.5` sans · overline `12px/0.12em uppercase` sans-medium · data `13px tabular-nums` sans.
- **Usage:** serif = hero headlines, section titles, editorial/legal page titles, major numbers; sans = everything else (nav, buttons, forms, tables, metadata, admin). Wordmark remains the official asset (not typeset).
- **Rules:** min body 16px; 70–80ch measure; no font weights below 400 for text; `text-wrap: balance` on headings.

## 6. Spacing, radii, elevation, borders
- **Spacing:** 8px base (`--space-1:4px` … `--space-8:64px`; section rhythm 64/96/128). Grid gutter 16/24 by viewport.
- **Radii:** `--radius-sm:6px` (chips, inputs) · `--radius-md:10px` (cards) · `--radius-lg:16px` (modals/sheets) · `--radius-full` (pills, avatars). **No random rounded cards** — radius maps to component class, not mood.
- **Elevation (subtle depth, shadows only, no glows):** `--elevation-1: 0 1px 2px rgba(0,0,0,.5)` · `--elevation-2: 0 8px 24px rgba(0,0,0,.45)` (drawer/modal) · `--elevation-3: 0 16px 48px rgba(0,0,0,.55)` (fullscreen overlays). No colored shadows, no neon.
- **Glassmorphism (restrained — three surfaces only):** header on scroll, drawer, player chrome: `background: var(--color-glass); backdrop-filter: blur(12px)`. Nowhere else.
- **Borders:** 1px hairlines (`--color-border`); gold hairline reserved for active nav rail + focus ring only.

## 7. Iconography
**UI icons (v1.1.0 — D-015):** Material Symbols/Icons (Outlined, thin/regular weight class ≈1.5–2px stroke, 20/24dp default) for UI icons — the Android-continuous embodiment of the v1.0.2 lucide line-icon principle; tint follows `LocalContentColor`. ICON-SYSTEM.md maps every specced surface to a Material Symbol name. Brand symbols exclusively from `/branding/` (logo ≠ UI icon). No emoji, no Unicode-substitute icons, no mixed styles. Custom icons prohibited except line-art exports of the official emblem. Icon+label always for destructive/ambiguous actions.

## 8. Responsive/adaptive system (v1.1.0 — window-size classes; CSS breakpoints retired)
**Mapping (documented transition):** compact <600dp (was <480/768) → medium 600–839dp (was 768/1024) → expanded ≥840dp (was 1280/1440+); audits additionally at 320dp-class small phones and foldables/tablets postures. Layout laws: compact = single-column, bottom navigation pattern, symbol-only brand; medium = 2–3 column grids, rail navigation option; expanded = up to 6-column grids (SCREENS S-02), permanent nav rail, two-pane where specced. Invariants: touch targets ≥48dp (ACCESSIBILITY §7); wordmark swaps to symbol-only on compact; hero/media maintain 16:9; all motion transform/opacity only; no fixed pixel assumptions — dp/sp + window-size classes.

## 9. Motion specification (v1.1.0 — implemented with Compose animation APIs; spec values unchanged)
| Transition | Spec |
|---|---|
| Page/route | opacity 0→1 (180ms, ease-out) + translateY 8→0 |
| Drawer | translateX −100%→0, 260ms, `cubic-bezier(0.22,1,0.36,1)`; scrim fade 200ms |
| Modal/sheet | scale .96→1 + fade (200ms); sheet translateY 100%→0 (280ms) |
| Card hover/focus | scale 1→1.02 (180ms) + veil opacity 0.4→0 |
| Card→watch | shared-element thumbnail expand (280ms) — reduced-motion: fade |
| Skeleton shimmer | 1.6s linear loop, translateX gradient sweep |
| Ostiole loader | dot scale 1→1.12 + opacity pulse, 1.2s alternating (the brand loading signal) |
| Toast | slide-up + fade in 200ms; auto-dismiss 4s (pause on hover/focus) |
| Stagger lists | children 40ms apart, cap 12 animated nodes |
| Reduced motion | `prefers-reduced-motion: reduce` → durations 0, transitions opacity-only ≤100ms, no shimmer/pulse loops, loader = static emblem |

Performance law: animate **only** `transform`/`opacity`; no layout-triggering properties; no infinite animations besides loader (which pauses off-screen); `will-change` applied transiently.

## 10. Component inventory (design-system primitives — all inherit tokens)
Button (primary gold / secondary ghost / destructive / sizes sm-md-lg; loading state with ostiole dot) · IconButton · Input (with hint/error slots) · Select · Textarea · Checkbox · Radio · Switch · Badge (status/count/source) · Tooltip (focus+hover, 300ms delay, ESC-dismiss) · Dropdown · Modal · Drawer · BottomSheet (≤767px) · Tabs · Card · Avatar (admin) · Skeleton (text/card/grid/stage shapes) · Toast · Alert · Pagination (Load-more + numbered) · Breadcrumb · Navigation (header/drawer/footer) · SearchBar (combobox) · FilterBar · VideoCard · CategoryCard · TagChip · EmptyState · LoadingState · ErrorState · OfflineBanner · ProvenanceChip · DurationBadge · MetaRow · ShortcutsOverlay · PlayerShell (stage/chrome/watermark/poster/failure ladder) · AdminTable (sort/pagination/row-actions) · KpiCard · StateChip · ConfirmDialog · AuditDiff.
Each primitive spec'd with: anatomy, states (default/hover/active/focus/disabled/loading), sizes, a11y contract, token mapping, and Storybook entry `[REQUIRED]` (TESTING §5).

## 11. Imagery direction
Cinematic composition, deep shadows, controlled highlights, sophisticated framing, restrained treatment. Content thumbnails are **source-provided media** delivered through the image proxy (never authored, never explicit-branded UI art). UI illustration = line-art emblem + typographic compositions only. Category hero defaults: token-palette abstract (emerald/obsidian gradient meshes — generated locally, deterministic, no external art).

## 12. Voice & copy (samples are tone, not content)
- Empty state: “The gallery is being curated.” (serif) + one sans action line.
- 404: “Lost in the bloom.” / “The page you seek doesn’t exist — or has drifted beyond the garden.”
- Offline: “You’re offline. Previously visited pages remain available.”
- Buttons: specific verbs (“Enter”, “Watch”, “Retry”, “Report”, “Copy link”). No exclamation marks, no clickbait, no vulgar phrasing, no corporate filler.
- Microcopy ≤ 8 words for actions; explanations ≤ 2 sentences.

## 13. Theming architecture (v1.1.0 — Material 3)
Tokens live in `branding/design-tokens.json` (source of truth) → compiled into **one Compose theme** (`core/designsystem/SyconiaTheme`): SYCONIA tokens → M3 `ColorScheme` (dark-only v1: background Obsidian, surface #121214, surfaceVariant/elevated #1A1A1E, primary Ostiole Gold, secondary Champagne, onPrimary/onSecondary Obsidian or Alabaster per computed contrast, error #F08A84…), `Typography` (Fraunces/Inter mapped to M3 slots per §5 scale), `Shapes` (6/10/16dp per §6), dimensions/spacing scale, and component defaults — all overriding generic Material demo styling. Themes = token value swaps only; `theme-night` (default/only v1); seasonal/light remain `[PROPOSED]`. The backend admin console consumes the same token values via its CSS layer. No other theming hooks exist in v1.

## 14. Brand quality gate (audit before any release — PRE-RELEASE §9)
□ Logo fidelity (official assets only) □ clear-space rule honored □ no logo below 96px (wordmark) □ brand-color fidelity (raw hex only in tokens file) □ typography consistency (2 families only) □ gold-as-accent law □ component/token compliance □ favicon/app-icon correct □ glass limited to 3 surfaces □ motion transform/opacity only □ reduced-motion honored □ loading ostiole present □ empty/error states branded □ no SaaS-generic nor tube-site styling anywhere □ watermark placement correct □ SEO uses official spelling.
