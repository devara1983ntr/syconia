/**
 * SYCONIA primitive state values — the D-006b register
 * (DESIGN-SYSTEM §10 + design-tokens.json `interaction_states`:
 * "per-component state values … are fixed in each primitive's Storybook
 * spec at M1-T008…T010 against these tokens; disabled text =
 * --color-text-tertiary. No ad-hoc values.").
 *
 * This module IS that fixed register for primitives batch 1 (form
 * controls). Every value is derived from a token or an ACCESSIBILITY/
 * DESIGN-SYSTEM law — cited per entry. Components and stories consume
 * these tables; tests pin them.
 */

/** Control height ladder (px) — sm is the 44px floor, never below it. */
export const CONTROL_HEIGHTS = {
  sm: 44,
  md: 48,
  lg: 56,
} as const;

export type ControlSize = keyof typeof CONTROL_HEIGHTS;

/** §5 type sizes admissible for control labels (no invented sizes). */
export const CONTROL_TEXT_SIZES = {
  sm: "text-meta", // 13px — the sanctioned small control size (§5)
  md: "text-body", // 16px — §5 minimum body size
  lg: "text-body", // 16px — weight/padding differentiate, not size
} as const;

/**
 * Choice-control visuals (D-006b fixed values): 18px box/circle,
 * 14px lucide check mark (§7 stroke 1.5), 8px selected dot (the
 * ostiole at control scale — §4 gold).
 */
export const CHOICE_BOX = 18;
export const CHOICE_MARK = 14;
export const CHOICE_DOT = 8;

/** Switch visuals (D-006b fixed values): 40×24 track, 16px thumb — inside the 44×44 button target. */
export const SWITCH_TRACK_W = 40;
export const SWITCH_TRACK_H = 24;
export const SWITCH_THUMB = 16;

/**
 * Ostiole loader dot (§9): scale 1→1.12 + opacity pulse, 1.2s
 * alternating — the brand loading signal (never a generic spinner).
 * Reduced motion: static dot (no loops — §9 reduced-motion law).
 */
export const OSTIOLE_DOT = {
  size: 8, // px — the ostiole dot at control scale
  pulse: { duration: 1.2, scale: 1.12 },
} as const;

/**
 * The ring is applied GLOBALLY by the base layer (app/styles/globals.css
 * `:focus-visible` rule — every interactive element, no per-component
 * wiring). Primitives must never set `outline: none` (ACCESSIBILITY §2).
 */
