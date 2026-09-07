/**
 * SYCONIA logo components — official artwork renderers (M1-T005;
 * DESIGN-SYSTEM §2/§3, branding/README.md usage map).
 *
 * Laws enforced here:
 * - Official assets only — every `<img src>` is a byte-identical public
 *   copy of an ASSET-MANIFEST-registered file; no recreated paths, no
 *   recoloring, no effects (AGENT.md §2.1.4; DESIGN-SYSTEM §2–§3).
 * - Clear space ≥ 4 × ostiole-dot diameter on all sides via the
 *   `--space-logo-clear` token, applied as wrapper padding (the calc
 *   subtracts the official masters' built-in transparent margins, so
 *   the reserved zone is exact, never doubled — decision D-010).
 * - Full lockup never below 96 px artwork width — below that the
 *   component falls back to the symbol (DESIGN-SYSTEM §3) at the height
 *   the lockup would have had, marked `data-fallback`.
 * - Monochrome variants are decorative line-art (branding/README.md
 *   a11y row): `aria-hidden`, empty alt — the adjacent copy carries
 *   meaning.
 *
 * Server components: pure markup, zero client JS (PERFORMANCE §3).
 */

import type { CSSProperties } from "react";

import {
  clearSpaceFor,
  CLEAR_SPACE_RATIO,
  imageBoxFor,
  lockupFallbackSymbolWidth,
  LOGO_LOCKUP_MIN_ART_WIDTH,
  MONO_LOCKUP_MASTER,
  MONO_SYMBOL_MASTER,
  PRIMARY_MASTER,
  SYMBOL_MASTER,
  type MasterGeometry,
} from "./geometry";

/** Common props: `width` is the rendered artwork width in px (the visible logo). */
export interface LogoProps {
  /** Rendered artwork width (px) — the visible logo. The `<img>` box is larger: it carries the master's built-in transparent margins. */
  width: number;
  /** Wrapper class. */
  className?: string;
  /** Wrapper styles; clear-space padding always applies last (the §3 law wins). */
  style?: CSSProperties;
  /** Accessible label for the color variants (default "SYCONIA", DS §1 display spelling). Mono variants are always decorative. */
  alt?: string;
}

/** Formats a rendered length for a stable inline-style string. */
function px(value: number): string {
  return `${Number(value.toFixed(3))}px`;
}

/**
 * Clear-space padding for one side, expressed through the token:
 * `var(--space-logo-clear) × emblem-width − master-margin` clamped to 0.
 */
function clearSide(emblem: string, margin: string): string {
  return `max(0px, calc(var(--space-logo-clear, ${CLEAR_SPACE_RATIO}) * ${emblem} - ${margin}))`;
}

/** Wrapper base style: inline-flex + zero line-height (no baseline gap) + the §3 clear-space paddings. */
function wrapperStyle(master: MasterGeometry, artWidth: number): CSSProperties {
  const scale = artWidth / master.artW;
  const emblem = px(master.artW * scale);
  const top = clearSide(emblem, px(master.artY * scale));
  const right = clearSide(emblem, px((master.w - master.artX - master.artW) * scale));
  const bottom = clearSide(emblem, px((master.h - master.artY - master.artH) * scale));
  const left = clearSide(emblem, px(master.artX * scale));
  return {
    display: "inline-flex",
    lineHeight: 0,
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
  };
}

interface BrandImageProps {
  master: MasterGeometry;
  artWidth: number;
  alt: string;
  decorative: boolean;
  className?: string;
  style?: CSSProperties;
  "data-fallback"?: string;
}

/** Shared renderer: wrapper span with clear-space padding + official `<img>`. */
function BrandImage({
  master,
  artWidth,
  alt,
  decorative,
  className,
  style,
  "data-fallback": dataFallback,
}: BrandImageProps): React.JSX.Element {
  const box = imageBoxFor(master, artWidth);
  const base = wrapperStyle(master, artWidth);
  const merged: CSSProperties = { ...style, ...base };
  return (
    <span className={className} data-fallback={dataFallback} data-art-width={artWidth} style={merged}>
      {/* eslint-disable-next-line @next/next/no-img-element -- official pack assets are pre-optimized PNGs served from public/ (branding/README static-serve map); next/image adds no value for exact-size fixed artwork. */}
      <img
        src={master.src}
        alt={alt}
        width={box.width}
        height={box.height}
        draggable={false}
        {...(decorative ? { "aria-hidden": true } : {})}
      />
    </span>
  );
}

/**
 * Primary lockup — emblem + wordmark (ASSET-LOGO-010). Header/display
 * placements. Below 96 px artwork width it renders the symbol instead
 * (DESIGN-SYSTEM §3; height-preserving fallback, `data-fallback`).
 */
export function Logo({ width, alt = "SYCONIA", className, style }: LogoProps): React.JSX.Element {
  if (width < LOGO_LOCKUP_MIN_ART_WIDTH) {
    return (
      <BrandImage
        master={SYMBOL_MASTER}
        artWidth={lockupFallbackSymbolWidth(width)}
        alt={alt}
        decorative={false}
        className={className}
        style={style}
        data-fallback="logo-symbol"
      />
    );
  }
  return (
    <BrandImage
      master={PRIMARY_MASTER}
      artWidth={width}
      alt={alt}
      decorative={false}
      className={className}
      style={style}
    />
  );
}

/**
 * Symbol-only emblem (ASSET-LOGO-011) — mobile header (<480px, §8),
 * drawer header, admin sidebar, any placement below the lockup's 96 px
 * floor; favicon contexts always symbol-only (DS §3).
 */
export function LogoSymbol({
  width,
  alt = "SYCONIA",
  className,
  style,
}: LogoProps): React.JSX.Element {
  return (
    <BrandImage
      master={SYMBOL_MASTER}
      artWidth={width}
      alt={alt}
      decorative={false}
      className={className}
      style={style}
    />
  );
}

/**
 * Monochrome full lockup, Alabaster on dark (ASSET-LOGO-012) —
 * editorial display-size contexts (reduced-motion static emblem at
 * display sizes). Decorative line-art: `aria-hidden`, empty alt.
 */
export function LogoMono({ width, className, style }: LogoProps): React.JSX.Element {
  return (
    <BrandImage
      master={MONO_LOCKUP_MASTER}
      artWidth={width}
      alt=""
      decorative
      className={className}
      style={style}
    />
  );
}

/**
 * Symbol-only monochrome line-art (ASSET-LOGO-013) — empty/error/404
 * emblem art and the reduced-motion static loader emblem (DS §3, §9).
 * Decorative: `aria-hidden`, empty alt.
 */
export function LogoMonoSymbol({ width, className, style }: LogoProps): React.JSX.Element {
  return (
    <BrandImage
      master={MONO_SYMBOL_MASTER}
      artWidth={width}
      alt=""
      decorative
      className={className}
      style={style}
    />
  );
}

/** Re-exported for placement math in consumer tests/screens. */
export { clearSpaceFor, imageBoxFor, LOGO_LOCKUP_MIN_ART_WIDTH };
