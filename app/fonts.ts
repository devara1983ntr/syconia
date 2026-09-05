import localFont from "next/font/local";

/*
 * SYCONIA typography loading — DESIGN-SYSTEM §5, PERFORMANCE §2, AGENT §3.
 *
 * Both families are the officially staged, SHA-256-verified OFL packages
 * from branding/ (ASSET-MANIFEST.md ASSET-FONT-001/ASSET-FONT-002; SIL OFL
 * 1.1). They are consumed from branding/ — no downloads, no substitutions.
 *
 * AG-013 (branding/README.md): the Fraunces variable font's default
 * instance is wght 900 (Black). Both faces therefore declare a pinned
 * weight range of 400–900 so text can never render below 400
 * (DESIGN-SYSTEM §5 "no font weights below 400 for text") — font-weight
 * requests below 400 clamp to the range minimum instead of resolving to
 * the Black default instance. The range matches the axis present in each
 * file (Fraunces wght 100–900, Inter wght 100–900) constrained to the
 * spec-legal interval.
 *
 * PERFORMANCE §2: self-hosted (zero external font requests), preloaded,
 * font-display swap, metric-adjusted system fallbacks to keep swap-driven
 * layout shift at zero. One variable file per family covers the whole
 * 400–900 range, so the first-load budget stays at exactly two font files.
 */

/** Editorial serif — hero headlines, section titles, editorial page titles. */
export const fraunces = localFont({
  src: "../branding/fonts/fraunces/Fraunces-VF.ttf",
  weight: "400 900",
  style: "normal",
  display: "swap",
  preload: true,
  adjustFontFallback: "Times New Roman",
  variable: "--font-fraunces",
});

/** Interface sans — navigation, buttons, forms, tables, metadata. */
export const inter = localFont({
  src: "../branding/fonts/inter/Inter-VF.ttf",
  weight: "400 900",
  style: "normal",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  variable: "--font-inter",
});
