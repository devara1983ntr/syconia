/**
 * SYCONIA brand geometry — measured constants of the official assets
 * (M1-T005; DESIGN-SYSTEM §2/§3, branding/ASSET-MANIFEST.md).
 *
 * The emblem drawing is identical in every official master (the primary
 * lockup simply adds the wordmark), so one set of master measurements
 * describes the whole system. All opaque bounding boxes below were
 * measured programmatically from the ASSET-MANIFEST-registered files
 * (verification: tests/unit/brand-geometry.test.ts re-derives them from
 * the pixels; tests/unit/brand-assets.test.ts pins the served copies
 * byte-identical to the pack).
 *
 * Ostiole measurement (decision D-010): the "central ostiole dot" of the
 * guidelines is the emblem's central neck opening — the ostiole of the
 * syconium, i.e. the enclosed bloom's opening, which sits on the central
 * axis (brand-guidelines p.2: "the single ostiole dot"; p.4: at 16/32px
 * the thickened official favicon renders this junction as the compact
 * dot). The opening measures 105 px across on the 615 px-wide official
 * symbol master. Clear space = 4 × dot = 420 master-px = 0.6829 of the
 * emblem width, exposed as the `--space-logo-clear` token
 * (app/styles/tokens.css) and applied by every logo component as the
 * padding that guarantees ≥ 4 dot-diameters around the artwork on all
 * sides (DESIGN-SYSTEM §3; the official transparent masters already embed
 * part of the zone — the padding makes up only the shortfall).
 */

/** Central ostiole opening width, measured on the official symbol master (px). */
export const OSTIOLE_DOT_PX = 105;

/** Emblem (symbol) artwork width on the official symbol master (px). */
export const EMBLEM_WIDTH_PX = 615;

/** DESIGN-SYSTEM §3: clear space = 4 × ostiole-dot diameter. */
export const CLEAR_SPACE_MULTIPLIER = 4;

/** Clear-space ratio of the emblem width — the `--space-logo-clear` token value. */
export const CLEAR_SPACE_RATIO =
  (CLEAR_SPACE_MULTIPLIER * OSTIOLE_DOT_PX) / EMBLEM_WIDTH_PX; // 0.6829…

/** DESIGN-SYSTEM §3: full lockup (emblem + wordmark) never below 96 px artwork width. */
export const LOGO_LOCKUP_MIN_ART_WIDTH = 96;

/** Master geometry of one official artwork. Margins are from the image edge to the opaque bbox. */
export interface MasterGeometry {
  /** Absolute pack path of the served copy (public/branding/… mirrors it 1:1). */
  readonly src: string;
  /** Master image width (px). */
  readonly w: number;
  /** Master image height (px). */
  readonly h: number;
  /** Opaque artwork bbox x (px). */
  readonly artX: number;
  /** Opaque artwork bbox y (px). */
  readonly artY: number;
  /** Opaque artwork bbox width (px). */
  readonly artW: number;
  /** Opaque artwork bbox height (px). */
  readonly artH: number;
}

/** ASSET-LOGO-011 — symbol, transparent (derived from the official symbol master). */
export const SYMBOL_MASTER: MasterGeometry = {
  src: "/branding/logo/syconia-logo-symbol-transparent.png",
  w: 1635,
  h: 1626,
  artX: 510,
  artY: 218,
  artW: 615,
  artH: 1154,
};

/** ASSET-LOGO-010 — primary lockup (emblem + wordmark), transparent. */
export const PRIMARY_MASTER: MasterGeometry = {
  src: "/branding/logo/syconia-logo-primary-transparent.png",
  w: 2160,
  h: 2148,
  artX: 558,
  artY: 480,
  artW: 1051,
  artH: 1383,
};

/** ASSET-LOGO-012 — monochrome full lockup, Alabaster on dark (editorial display sizes). */
export const MONO_LOCKUP_MASTER: MasterGeometry = {
  src: "/branding/logo/syconia-logo-monochrome-on-dark.png",
  w: 1635,
  h: 1626,
  artX: 437,
  artY: 218,
  artW: 766,
  artH: 1238,
};

/** ASSET-LOGO-013 — symbol-only monochrome line-art (empty/error/404 art), full-bleed crop. */
export const MONO_SYMBOL_MASTER: MasterGeometry = {
  src: "/branding/logo/syconia-logo-symbol-monochrome-on-dark.png",
  w: 615,
  h: 1154,
  artX: 0,
  artY: 0,
  artW: 615,
  artH: 1154,
};

/**
 * Renders `artWidth` px of artwork from `master` and returns the `<img>`
 * box size (the image keeps its aspect; its box carries the artwork plus
 * the master's built-in transparent margins).
 */
export function imageBoxFor(
  master: MasterGeometry,
  artWidth: number,
): { width: number; height: number } {
  const scale = artWidth / master.artW;
  return {
    width: Math.round(master.w * scale),
    height: Math.round(master.h * scale),
  };
}

/** Per-side rendered clear-space shortfall (px) for a logo placed at `artWidth`. */
export interface ClearSpace {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

/**
 * Clear-space padding (rendered px per side) so the zone around the
 * artwork measures ≥ 4 ostiole-dot diameters on every side: the official
 * masters already embed transparent margins; only the shortfall becomes
 * padding (e.g. the full-bleed mono symbol has no margins at all, so it
 * gets the full 0.6829 × width per side).
 */
export function clearSpaceFor(
  master: MasterGeometry,
  artWidth: number,
): ClearSpace {
  const scale = artWidth / master.artW;
  const required = CLEAR_SPACE_MULTIPLIER * OSTIOLE_DOT_PX;
  const margin = (px: number) => Math.max(0, required - px) * scale;
  return {
    top: margin(master.artY),
    right: margin(master.w - master.artX - master.artW),
    bottom: margin(master.h - master.artY - master.artH),
    left: margin(master.artX),
  };
}

/**
 * Symbol width that preserves the lockup's rendered height when the
 * wordmark is replaced by the symbol fallback (DESIGN-SYSTEM §3: full
 * logo below 96 px ⇒ symbol-only).
 */
export function lockupFallbackSymbolWidth(lockupArtWidth: number): number {
  return (
    (lockupArtWidth * PRIMARY_MASTER.artH * SYMBOL_MASTER.artW) /
    (PRIMARY_MASTER.artW * SYMBOL_MASTER.artH)
  );
}
