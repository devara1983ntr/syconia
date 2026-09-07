import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  CHOICE_BOX,
  CHOICE_DOT,
  CHOICE_MARK,
  CONTROL_HEIGHTS,
  CONTROL_TEXT_SIZES,
  OSTIOLE_DOT,
  SWITCH_THUMB,
  SWITCH_TRACK_H,
  SWITCH_TRACK_W,
} from "@/components/ui/states";

/**
 * M1-T008 — the D-006b state-value register (design-tokens.json
 * `interaction_states`: per-component values "fixed in each primitive's
 * Storybook spec at M1-T008…T010"; no ad-hoc values).
 *
 * Pins the register and its token sources (tokens.css) so no primitive
 * can drift from the fixed values.
 */

const TOKENS_CSS = readFileSync(resolve(process.cwd(), "app/styles/tokens.css"), "utf8");
const GLOBALS_CSS = readFileSync(resolve(process.cwd(), "app/styles/globals.css"), "utf8");

describe("M1-T008 D-006b register (components/ui/states.ts)", () => {
  it("control heights: all sizes ≥ the 44px §7 target floor", () => {
    expect(CONTROL_HEIGHTS.sm).toBe(44);
    expect(CONTROL_HEIGHTS.md).toBe(48);
    expect(CONTROL_HEIGHTS.lg).toBe(56);
  });

  it("control text sizes use only §5 scale members", () => {
    expect(CONTROL_TEXT_SIZES.sm).toBe("text-meta");
    expect(CONTROL_TEXT_SIZES.md).toBe("text-body");
    expect(CONTROL_TEXT_SIZES.lg).toBe("text-body");
  });

  it("choice visuals: 18px box, 14px mark, 8px dot (the ostiole at control scale)", () => {
    expect(CHOICE_BOX).toBe(18);
    expect(CHOICE_MARK).toBe(14);
    expect(CHOICE_DOT).toBe(8);
  });

  it("switch visuals: 40×24 track + 16px thumb inside the 44×44 target", () => {
    expect(SWITCH_TRACK_W).toBe(40);
    expect(SWITCH_TRACK_H).toBe(24);
    expect(SWITCH_THUMB).toBe(16);
    expect(SWITCH_TRACK_W - SWITCH_THUMB - 8).toBe(16); // thumb travel
  });

  it("ostiole loader dot: §9 values (1.2s, scale 1.12, 8px dot)", () => {
    expect(OSTIOLE_DOT.size).toBe(8);
    expect(OSTIOLE_DOT.pulse.duration).toBe(1.2);
    expect(OSTIOLE_DOT.pulse.scale).toBe(1.12);
  });
});

describe("M1-T008 token sources (no ad-hoc values reach the DOM)", () => {
  it("--press-scale token exists and the .sy-press class applies it (§9 transform-only)", () => {
    expect(TOKENS_CSS).toMatch(/--press-scale:\s*0\.98/);
    expect(GLOBALS_CSS).toMatch(/\.sy-press:active\s*\{\s*transform:\s*scale\(var\(--press-scale\)\)/);
    expect(GLOBALS_CSS).toMatch(/\.sy-press\s*\{/);
  });

  it("targets flow from --target-min (ACCESSIBILITY §7 44px)", () => {
    expect(TOKENS_CSS).toMatch(/--target-min:\s*44px/);
  });

  it("focus ring construction lives in the base layer for every interactive element", () => {
    expect(GLOBALS_CSS).toMatch(/:focus-visible\s*\{/);
    expect(GLOBALS_CSS).toMatch(/var\(--focus-ring-width\) solid var\(--color-focus\)/);
  });
});
