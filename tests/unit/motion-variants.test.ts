import { describe, expect, it } from "vitest";

import {
  capStaggerChildren,
  MOTION,
  reducedVariants,
  selectVariants,
  STAGGER_CAP,
  variants,
} from "@/lib/motion/variants";

/**
 * M1-T006 variant conformance tests — DESIGN-SYSTEM §9 table verbatim,
 * PERFORMANCE §4 animation law (transform/opacity only), and the §9
 * reduced-motion row (≤100ms, opacity-only, no loops).
 */

/** Animated-property whitelist (the §9 transform/opacity law). */
const ANIMATABLE = new Set(["x", "y", "scale", "opacity"]);
const TRANSITION_KEYS = new Set([
  "transition",
  "type",
  "duration",
  "ease",
  "easeIn",
  "easeOut",
  "easeInOut",
  "delay",
  "staggerChildren",
  "staggerDirection",
  "repeat",
  "repeatType",
  "repeatDelay",
  "times",
]);

type VariantState = Record<string, unknown>;

function statesOf(set: Record<string, VariantState>): Array<[string, string, VariantState]> {
  const out: Array<[string, string, VariantState]> = [];
  for (const [family, v] of Object.entries(set)) {
    for (const [state, value] of Object.entries(v)) {
      if (value && typeof value === "object") {
        out.push([family, state, value as VariantState]);
      }
    }
  }
  return out;
}

describe("M1-T006 timing tokens match the §9 table verbatim", () => {
  it("durations (seconds)", () => {
    expect(MOTION.page.duration).toBe(0.18);
    expect(MOTION.drawer.duration).toBe(0.26);
    expect(MOTION.scrim.duration).toBe(0.2);
    expect(MOTION.modal.duration).toBe(0.2);
    expect(MOTION.sheet.duration).toBe(0.28);
    expect(MOTION.card.duration).toBe(0.18);
    expect(MOTION.sharedElement.duration).toBe(0.28);
    expect(MOTION.toast.duration).toBe(0.2);
    expect(MOTION.toast.autoDismissMs).toBe(4000);
    expect(MOTION.stagger.delay).toBe(0.04);
    expect(MOTION.stagger.cap).toBe(12);
    expect(MOTION.shimmer.duration).toBe(1.6);
    expect(MOTION.loader.duration).toBe(1.2);
    expect(MOTION.loader.scale).toBe(1.12);
    expect(MOTION.reducedMax).toBe(0.1);
  });

  it("drawer easing is the §9 cubic-bezier", () => {
    expect(MOTION.drawer.ease).toEqual([0.22, 1, 0.36, 1]);
    expect(variants.drawer.animate.transition).toEqual({
      duration: 0.26,
      ease: [0.22, 1, 0.36, 1],
    });
  });

  it("page transition is 180ms ease-out", () => {
    expect(variants.page.animate.transition).toEqual({ duration: 0.18, ease: "easeOut" });
  });
});

describe("M1-T006 variant values encode the §9 rows", () => {
  it("page: opacity 0→1 + translateY 8→0", () => {
    expect(variants.page.initial).toEqual({ opacity: 0, y: 8 });
    expect(variants.page.animate).toMatchObject({ opacity: 1, y: 0 });
  });

  it("scrim: opacity 0→1, 200ms", () => {
    expect(variants.scrim.initial).toEqual({ opacity: 0 });
    expect(variants.scrim.animate).toMatchObject({ opacity: 1 });
    expect(variants.scrim.animate.transition).toEqual({ duration: 0.2 });
  });

  it("drawer: translateX −100%→0", () => {
    expect(variants.drawer.initial).toEqual({ x: "-100%" });
    expect(variants.drawer.animate).toMatchObject({ x: "0%" });
    expect(variants.drawer.exit).toEqual({ x: "-100%", transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] } });
  });

  it("modal: scale .96→1 + fade", () => {
    expect(variants.modal.initial).toEqual({ opacity: 0, scale: 0.96 });
    expect(variants.modal.animate).toMatchObject({ opacity: 1, scale: 1 });
  });

  it("sheet: translateY 100%→0, 280ms", () => {
    expect(variants.sheet.initial).toEqual({ y: "100%" });
    expect(variants.sheet.animate).toMatchObject({ y: "0%" });
    expect(variants.sheet.animate.transition).toEqual({ duration: 0.28 });
  });

  it("card: scale 1→1.02 on hover/focus, 180ms", () => {
    expect(variants.card.rest).toMatchObject({ scale: 1 });
    expect(variants.card.hover).toMatchObject({ scale: 1.02 });
    expect(variants.card.focus).toMatchObject({ scale: 1.02 });
    expect(variants.card.hover.transition).toEqual({ duration: 0.18 });
  });

  it("card veil: opacity 0.4→0 on hover/focus", () => {
    expect(variants.cardVeil.rest).toMatchObject({ opacity: 0.4 });
    expect(variants.cardVeil.hover).toMatchObject({ opacity: 0 });
    expect(variants.cardVeil.focus).toMatchObject({ opacity: 0 });
  });

  it("toast: slide-up + fade, 200ms, 4s auto-dismiss constant", () => {
    expect(variants.toast.initial).toEqual({ opacity: 0, y: 16 });
    expect(variants.toast.animate).toMatchObject({ opacity: 1, y: 0 });
    expect(variants.toast.animate.transition).toEqual({ duration: 0.2 });
  });

  it("stagger container: children 40ms apart; cap 12", () => {
    expect(variants.stagger.animate.transition).toEqual({ staggerChildren: 0.04 });
    expect(STAGGER_CAP).toBe(12);
    expect(MOTION.stagger.cap).toBe(12);
  });
});

describe("M1-T006 PERFORMANCE §4 law: transform/opacity only", () => {
  it("no standard variant animates a layout property", () => {
    for (const [family, state, value] of statesOf(variants)) {
      for (const key of Object.keys(value)) {
        if (TRANSITION_KEYS.has(key)) continue;
        expect(ANIMATABLE.has(key), `${family}.${state}.${key} is not transform/opacity`).toBe(
          true,
        );
      }
    }
  });
});

describe("M1-T006 reduced-motion set (§9 last row)", () => {
  it("every reduced transition is ≤100ms", () => {
    for (const [family, state, value] of statesOf(reducedVariants)) {
      const transition = value.transition as Record<string, unknown> | undefined;
      if (transition && typeof transition.duration === "number") {
        expect(
          transition.duration,
          `${family}.${state} duration must be ≤ 100ms`,
        ).toBeLessThanOrEqual(0.1);
      }
    }
  });

  it("every reduced state animates opacity only (no transforms)", () => {
    for (const [family, state, value] of statesOf(reducedVariants)) {
      for (const key of Object.keys(value)) {
        if (TRANSITION_KEYS.has(key)) continue;
        expect(key, `${family}.${state}.${key} must be opacity-only`).toBe("opacity");
      }
    }
  });

  it("contains no loops (repeat/repeatType absent) and no stagger delay", () => {
    for (const [, , value] of statesOf(reducedVariants)) {
      expect(value.repeat).toBeUndefined();
      expect(value.repeatType).toBeUndefined();
    }
    expect(
      (reducedVariants.stagger.animate.transition as Record<string, unknown>).staggerChildren,
    ).toBe(0);
  });

  it("reduced set keeps family parity with the standard set", () => {
    expect(Object.keys(reducedVariants).sort()).toEqual(Object.keys(variants).sort());
  });
});

describe("M1-T006 variant selection switch", () => {
  it("selects the full set when motion is allowed", () => {
    expect(selectVariants(false)).toBe(variants);
  });

  it("selects the reduced set when the user prefers reduced motion", () => {
    expect(selectVariants(true)).toBe(reducedVariants);
  });
});

describe("M1-T006 stagger cap helper (§9 'cap 12 animated nodes')", () => {
  it("slices beyond 12", () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    expect(capStaggerChildren(items)).toHaveLength(12);
  });

  it("keeps lists at or below the cap intact", () => {
    expect(capStaggerChildren([1, 2, 3])).toEqual([1, 2, 3]);
    expect(capStaggerChildren(Array.from({ length: 12 }, (_, i) => i))).toHaveLength(12);
  });

  it("handles empty lists", () => {
    expect(capStaggerChildren([])).toEqual([]);
  });
});
