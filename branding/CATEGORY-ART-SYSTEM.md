# SYCONIA — Category Art System (deterministic, token-derived)

**Version 1.0.0 · 2026-09-03 · Authority:** DESIGN-SYSTEM.md §11 — *"Category hero defaults: token-palette abstract (emerald/obsidian gradient meshes — generated locally, deterministic, no external art)."* This document defines that system so M2-T017 implements a specification instead of inventing one. It creates **no image files** — by design.

## 1. What this system is

Every category surface (CategoryCard art, category-detail hero band) renders an **abstract, deterministic composition derived from the category's stable slug** using only brand tokens. Same slug → identical art, forever, on every device. No external art, no photography, no illustration of people/content, no invented category names (categories exist only via the M2 taxonomy; this system art-has zero opinions about content).

## 2. Rendering strategy (performance-first)

**Primary: pure CSS.** The "mesh" is a composition of 2–3 `radial-gradient` layers with custom-property positions/angles emitted as an inline style (~200 bytes) computed from the slug seed. Zero image payload, resolution-independent, no cache infrastructure, no CLS, works offline.

**Fallback (only on objective evidence):** if M2-T018 profiling shows measurable paint cost of stacked gradients in long category grids (threshold: >4ms style-recalc/paint per 12-card viewport on the CI reference hardware), generation may move to SSR-rendered WebP (`/img/category/<slug>-<ratio>-<hash>.webp`, 30d immutable — matching the thumbs TTL). This trigger is a task acceptance criterion, not a preference. Until then, no rasterization.

## 3. Deterministic algorithm (normative for the M2-T017 generator)

1. **Seed:** `sha256(slug)` → first 32 bits → `s`.
2. **Base:** Obsidian `#09090B` canvas region.
3. **Layer 1 — emerald wash:** radial gradient, center at `(x1,y1)` with `x1 = 18 + (s%25)%`, `y1 = 12 + ((s>>3)%22)%`, radius `55–75%`, from Night Emerald `#012A21` at `alpha 0.9` → transparent.
4. **Layer 2 — depth:** second emerald radial at the opposite quadrant (`x2 = 100−x1±(s%9)`, `y2 = 100−y1±((s>>5)%9)`), radius `40–60%`, alpha `0.35` → transparent.
5. **Layer 3 — controlled light (restrained):** a single tight champagne radial (`#E6D3A0`) at `alpha 0.06–0.10` (bounded: `(6 + (s>>7)%5)%`), radius `≤30%`, positioned on the same side as Layer 1's center. **This is the only gold permitted** — a faint cinematic key-light, never a glow, never a border.
6. **Horizon hairline (optional, seed-gated `s%3==0`):** 1px Emerald-on-Obsidian tonal step at `y = 62–78%` — structure, not ornament.
7. **Aspect variants:** `16:9` (detail hero) and `1:1` (grid card) use the same seed and centers; only the canvas box changes (CSS handles this — no separate art).
8. **Forbidden:** noise/grain, animated meshes, photographic or illustrative content, text baked into art, gold above 10% alpha, more than one gold layer, any color outside the token palette.

## 4. Label overlay & contrast (accessibility law)

- Category names are **HTML overlays** (never baked into art): Fraunces title on a `--color-scrim`-derived bottom gradient (Obsidian 0.56 → transparent), Alabaster `#FAF9F6` text.
- **Worst-case contrast is provable:** every mesh color is Emerald or Obsidian except the ≤10% champagne light, whose composite luminance over Emerald stays below the level at which Alabaster text exceeds 4.5:1 (the M2 task's unit test computes contrast over generated samples for all seeds used by the live taxonomy — acceptance criterion, not assumption).
- Scrim + text ≥44px tap area when the card is interactive; cards are links with accessible names (`{category}, {count} videos` — SCREENS S-04).
- Art is decorative: `aria-hidden` on the art layer; the accessible name carries the information.

## 5. Reduced motion & motion budget

The system is **static by construction** (no animated gradients — DESIGN-SYSTEM §9 motion law: nothing infinite besides the ostiole loader). Nothing to disable under `prefers-reduced-motion`.

## 6. Provenance & fake-content statement

No file in `/branding/` is produced by this system; it defines runtime CSS only. It cannot depict, imply, or invent performers, videos, providers, titles, or statistics — it is abstract token-derived geometry keyed to real taxonomy slugs (which exist only after M2 sync). If a category has no slug yet, no art exists (honest empty state per ERROR-STATES, not a generic placeholder tile).

## 7. Wiring & verification

- **Task:** M2-T017 (categories screens) implements the generator to this spec; M2-T018 holds the performance trigger.
- **Tests:** determinism (same slug → byte-identical inline style), contrast unit test over live-taxonomy samples, Storybook visual-regression snapshots at 320/768/1440 for ≥6 seeded slugs.
- **Gate evidence:** M2-GATE 2.9-adjacent (screen composition) — no new gate rows; the spec is cited by the task.
