import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  CLEAR_SPACE_MULTIPLIER,
  CLEAR_SPACE_RATIO,
  EMBLEM_WIDTH_PX,
  imageBoxFor,
  clearSpaceFor,
  lockupFallbackSymbolWidth,
  LOGO_LOCKUP_MIN_ART_WIDTH,
  MONO_LOCKUP_MASTER,
  MONO_SYMBOL_MASTER,
  OSTIOLE_DOT_PX,
  PRIMARY_MASTER,
  SYMBOL_MASTER,
  type MasterGeometry,
} from "@/components/brand/geometry";

/**
 * M1-T005 — brand geometry contract (DESIGN-SYSTEM §2/§3; decision D-010).
 *
 * 1. The ostiole measurement and master bboxes are pinned to the
 *    measured values (the pixel-level scans are recorded as task-file
 *    evidence); the relationships below prove the math stays coherent.
 * 2. The `--space-logo-clear` token in app/styles/tokens.css must equal
 *    the geometry ratio (the token IS the component padding source).
 * 3. Image boxes preserve the official masters' aspect ratios.
 * 4. Clear-space padding completes the 4×-dot zone on every side
 *    (master margins + component padding ≥ required), and is 0 only
 *    where the master's own margin already satisfies the rule.
 */

const TOKENS_CSS = readFileSync(
  resolve(process.cwd(), "app/styles/tokens.css"),
  "utf8",
);

function tokenValue(name: string): string {
  const m = TOKENS_CSS.match(new RegExp(`${name}:\\s*([^;\\n]+)`));
  if (!m) throw new Error(`token ${name} not found in tokens.css`);
  return m[1]?.trim() ?? "";
}

/** Property: master margin + component padding = required clear zone, per side. */
function expectZoneComplete(master: MasterGeometry, artWidth: number): void {
  const cs = clearSpaceFor(master, artWidth);
  const scale = artWidth / master.artW;
  const required = CLEAR_SPACE_MULTIPLIER * OSTIOLE_DOT_PX * scale;
  const margins = {
    top: master.artY,
    right: master.w - master.artX - master.artW,
    bottom: master.h - master.artY - master.artH,
    left: master.artX,
  };
  for (const side of ["top", "right", "bottom", "left"] as const) {
    const total = margins[side] * scale + cs[side];
    expect(total).toBeGreaterThanOrEqual(required - 1e-9);
    // Exact completion (never over-reserved) unless clamped at 0.
    if (cs[side] > 0) expect(total).toBeCloseTo(required, 9);
    else expect(margins[side] * scale).toBeGreaterThanOrEqual(required);
  }
}

describe("M1-T005 ostiole + clear-space geometry (D-010)", () => {
  it("clear-space ratio is exactly 4 × 105 / 615", () => {
    expect(OSTIOLE_DOT_PX).toBe(105);
    expect(EMBLEM_WIDTH_PX).toBe(615);
    expect(CLEAR_SPACE_MULTIPLIER).toBe(4);
    expect(CLEAR_SPACE_RATIO).toBeCloseTo(420 / 615, 12);
  });

  it("tokens.css --space-logo-clear equals the geometry ratio (single source)", () => {
    const token = tokenValue("--space-logo-clear");
    expect(Number(token)).toBeCloseTo(CLEAR_SPACE_RATIO, 12);
  });

  it("lockup minimum width is the §3 96px floor", () => {
    expect(LOGO_LOCKUP_MIN_ART_WIDTH).toBe(96);
  });
});

describe("M1-T005 master geometry (measured bboxes)", () => {
  it("symbol master: 1635×1626 image, 615×1154 artwork at (510,218) — ASSET-LOGO-011 / ASSET-LOGO-013 crop", () => {
    expect(SYMBOL_MASTER.w).toBe(1635);
    expect(SYMBOL_MASTER.h).toBe(1626);
    expect(SYMBOL_MASTER.artX).toBe(510);
    expect(SYMBOL_MASTER.artY).toBe(218);
    expect(SYMBOL_MASTER.artW).toBe(615);
    expect(SYMBOL_MASTER.artH).toBe(1154);
  });

  it("primary master: 2160×2148 image, 1051×1383 artwork at (558,480) — ASSET-LOGO-010", () => {
    expect(PRIMARY_MASTER.w).toBe(2160);
    expect(PRIMARY_MASTER.h).toBe(2148);
    expect(PRIMARY_MASTER.artX).toBe(558);
    expect(PRIMARY_MASTER.artY).toBe(480);
    expect(PRIMARY_MASTER.artW).toBe(1051);
    expect(PRIMARY_MASTER.artH).toBe(1383);
  });

  it("mono lockup: 1635×1626 image, 766×1238 artwork at (437,218) — ASSET-LOGO-012", () => {
    expect(MONO_LOCKUP_MASTER.w).toBe(1635);
    expect(MONO_LOCKUP_MASTER.h).toBe(1626);
    expect(MONO_LOCKUP_MASTER.artX).toBe(437);
    expect(MONO_LOCKUP_MASTER.artY).toBe(218);
    expect(MONO_LOCKUP_MASTER.artW).toBe(766);
    expect(MONO_LOCKUP_MASTER.artH).toBe(1238);
  });

  it("mono symbol: full-bleed 615×1154 (ASSET-LOGO-013 region crop, zero margins)", () => {
    expect(MONO_SYMBOL_MASTER.w).toBe(615);
    expect(MONO_SYMBOL_MASTER.h).toBe(1154);
    expect(MONO_SYMBOL_MASTER.artX).toBe(0);
    expect(MONO_SYMBOL_MASTER.artY).toBe(0);
    expect(MONO_SYMBOL_MASTER.artW).toBe(615);
    expect(MONO_SYMBOL_MASTER.artH).toBe(1154);
  });

  it("every artwork bbox lies inside its master image", () => {
    for (const m of [SYMBOL_MASTER, PRIMARY_MASTER, MONO_LOCKUP_MASTER, MONO_SYMBOL_MASTER]) {
      expect(m.artX + m.artW).toBeLessThanOrEqual(m.w);
      expect(m.artY + m.artH).toBeLessThanOrEqual(m.h);
      expect(m.artX).toBeGreaterThanOrEqual(0);
      expect(m.artY).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("M1-T005 image box math", () => {
  it("symbol at 28px artwork renders a 74×74 box (sidebar placement)", () => {
    const box = imageBoxFor(SYMBOL_MASTER, 28);
    expect(box.width).toBe(74);
    expect(box.height).toBe(74);
    // Aspect preserved within the ±0.5px rounding of the layout hints (the
    // <img> renders at the PNG's own intrinsic aspect regardless).
    const ratio = SYMBOL_MASTER.w / SYMBOL_MASTER.h;
    expect(Math.abs(box.width / box.height - ratio)).toBeLessThanOrEqual(1 / box.height);
  });

  it("primary lockup at 160px artwork renders a 329×327 box", () => {
    const box = imageBoxFor(PRIMARY_MASTER, 160);
    expect(box.width).toBe(329);
    expect(box.height).toBe(327);
  });

  it("the visible artwork occupies the requested width exactly", () => {
    const artWidth = 128;
    const box = imageBoxFor(SYMBOL_MASTER, artWidth);
    expect(Math.round(box.width * (SYMBOL_MASTER.artW / SYMBOL_MASTER.w))).toBe(artWidth);
  });
});

describe("M1-T005 clear-space padding math", () => {
  it("completes the 4×-dot zone on every side at many sizes (symbol, primary, mono lockup)", () => {
    for (const w of [16, 28, 96, 128, 160, 240, 480]) {
      expectZoneComplete(SYMBOL_MASTER, w);
      expectZoneComplete(PRIMARY_MASTER, w);
      expectZoneComplete(MONO_LOCKUP_MASTER, w);
      expectZoneComplete(MONO_SYMBOL_MASTER, w);
    }
  });

  it("symbol masters' side margins already satisfy the rule — no L/R padding", () => {
    const cs = clearSpaceFor(SYMBOL_MASTER, 128);
    expect(cs.left).toBe(0);
    expect(cs.right).toBe(0);
    expect(cs.top).toBeGreaterThan(0);
    expect(cs.bottom).toBeGreaterThan(0);
  });

  it("full-bleed mono symbol gets the full ratio on all sides", () => {
    const w = 120;
    const cs = clearSpaceFor(MONO_SYMBOL_MASTER, w);
    expect(cs.top).toBeCloseTo(CLEAR_SPACE_RATIO * w, 9);
    expect(cs.right).toBeCloseTo(CLEAR_SPACE_RATIO * w, 9);
    expect(cs.bottom).toBeCloseTo(CLEAR_SPACE_RATIO * w, 9);
    expect(cs.left).toBeCloseTo(CLEAR_SPACE_RATIO * w, 9);
  });

  it("fallback symbol width preserves the lockup's rendered height", () => {
    const lockupWidth = 80;
    const lockupHeight = (lockupWidth * PRIMARY_MASTER.artH) / PRIMARY_MASTER.artW;
    const symbolWidth = lockupFallbackSymbolWidth(lockupWidth);
    const symbolHeight = (symbolWidth * SYMBOL_MASTER.artH) / SYMBOL_MASTER.artW;
    expect(symbolHeight).toBeCloseTo(lockupHeight, 9);
  });
});
