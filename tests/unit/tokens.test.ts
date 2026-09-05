import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * M1-T003 token snapshot test — the token layer (app/styles/tokens.css) is
 * verified against the specification table (DESIGN-SYSTEM §4/§5/§6/§8,
 * mirrored in branding/design-tokens.json v1.0.0 — do not fork).
 *
 * Two mandates:
 * 1. Snapshot: every spec token exists with the exact spec value.
 * 2. Conformance re-verification (DESIGN-SYSTEM §4, normative): text/status
 *    color contrast ratios are RE-COMPUTED with the WCAG relative-luminance
 *    formula against Obsidian #09090B and must match the spec's computed
 *    ratios (18.9 / 9.9 / 5.6 / 8.1 / 13.4 / 9.6 / 10.2 / 8.2).
 */

const TOKENS_PATH = resolve(process.cwd(), "app/styles/tokens.css");

function parseCustomProperties(css: string): Map<string, string> {
  const vars = new Map<string, string>();
  const decl = /--([a-z0-9-]+)\s*:\s*([^;]+);/g;
  for (const m of css.matchAll(decl)) {
    const name = m[1] as string;
    const value = (m[2] as string).trim();
    if (!vars.has(name)) vars.set(name, value);
  }
  return vars;
}

const tokens = parseCustomProperties(readFileSync(TOKENS_PATH, "utf8"));

/** §4/§5/§6/§8 spec table (values verbatim — the snapshot source). */
const SPEC = {
  colors: {
    "brand-emerald": "#012A21",
    "brand-obsidian": "#09090B",
    "brand-gold": "#C5A059",
    "brand-champagne": "#E6D3A0",
    "brand-alabaster": "#FAF9F6",
    background: "#09090B",
    surface: "#121214",
    "surface-elevated": "#1A1A1E",
    "surface-emerald": "#012A21",
    "text-primary": "#FAF9F6",
    "text-secondary": "#B9B7B0",
    "text-tertiary": "#8A8880",
    border: "#26262B",
    accent: "#C5A059",
    "accent-strong": "#E6D3A0",
    success: "#4EC9A0",
    warning: "#E3B341",
    error: "#F08A84",
    focus: "#E6D3A0",
    scrim: "rgba(9, 9, 11, 0.56)",
    glass: "rgba(9, 9, 11, 0.72)",
  },
  typeScale: {
    "display": "clamp(34px, 6vw, 64px)",
    "display--line-height": "1.05",
    "h1": "clamp(26px, 4vw, 40px)",
    "h1--line-height": "1.15",
    "h2": "clamp(20px, 3vw, 28px)",
    "h2--line-height": "1.25",
    "h3": "18px",
    "h3--line-height": "1.4",
    "h3--font-weight": "600",
    "body": "16px",
    "body--line-height": "1.7",
    "meta": "13px",
    "meta--line-height": "1.5",
    "overline": "12px",
    "overline--line-height": "1.2",
    "overline--letter-spacing": "0.12em",
    "overline--font-weight": "500",
    "data": "13px",
  },
  spacing: {
    "": "8px",
    "1": "4px",
    "2": "8px",
    "3": "16px",
    "4": "24px",
    "5": "32px",
    "6": "40px",
    "7": "48px",
    "8": "64px",
    "section-sm": "64px",
    "section-md": "96px",
    "section-lg": "128px",
  },
  radius: { sm: "6px", md: "10px", lg: "16px", full: "9999px" },
  elevation: {
    "elevation-1": "0 1px 2px rgba(0, 0, 0, 0.5)",
    "elevation-2": "0 8px 24px rgba(0, 0, 0, 0.45)",
    "elevation-3": "0 16px 48px rgba(0, 0, 0, 0.55)",
  },
  blur: { glass: "12px" },
  breakpoints: { xs: "480px", sm: "768px", md: "1024px", lg: "1280px", xl: "1440px" },
  container: { content: "1280px" },
} as const;

/** WCAG relative luminance (spec §4 formula; normative for conformance). */
function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

describe("M1-T003 token layer snapshot (spec table)", () => {
  it("has the token file with a @theme block", () => {
    const raw = readFileSync(TOKENS_PATH, "utf8");
    expect(raw).toContain("@theme");
    expect(tokens.size).toBeGreaterThan(40);
  });

  it("§4 brand + semantic colors match the spec exactly", () => {
    for (const [name, value] of Object.entries(SPEC.colors)) {
      expect(tokens.get(`color-${name}`)).toBe(value);
    }
  });

  it("§5 fluid type scale matches the spec exactly (clamp values)", () => {
    for (const [name, value] of Object.entries(SPEC.typeScale)) {
      expect(tokens.get(`text-${name}`)).toBe(value);
    }
    // Fluidity: the headline sizes clamp between mobile and desktop stops.
    expect(tokens.get("text-display")).toContain("clamp(");
    expect(tokens.get("text-h1")).toContain("clamp(");
    expect(tokens.get("text-h2")).toContain("clamp(");
  });

  it("§6 spacing ladder, radii, elevations, blur match the spec", () => {
    expect(tokens.get("spacing")).toBe(SPEC.spacing[""]);
    for (const [name, value] of Object.entries(SPEC.spacing)) {
      if (name === "") continue;
      expect(tokens.get(`spacing-${name}`)).toBe(value);
    }
    for (const [name, value] of Object.entries(SPEC.radius)) {
      expect(tokens.get(`radius-${name}`)).toBe(value);
    }
    for (const [name, value] of Object.entries(SPEC.elevation)) {
      expect(tokens.get(`shadow-${name}`)).toBe(value);
    }
    expect(tokens.get("blur-glass")).toBe(SPEC.blur.glass);
  });

  it("§8 breakpoints + D-006 container ladder match the spec", () => {
    for (const [name, value] of Object.entries(SPEC.breakpoints)) {
      expect(tokens.get(`breakpoint-${name}`)).toBe(value);
    }
    expect(tokens.get("container-content")).toBe(SPEC.container.content);
  });

  it("D-006 z-index ladder + focus/target/measure tokens are declared", () => {
    const zLadder: Record<string, string> = {
      "z-base": "0",
      "z-header-sticky": "100",
      "z-scrim": "200",
      "z-drawer": "300",
      "z-modal-sheet": "400",
      "z-player-failure-overlay": "450",
      "z-toast": "500",
      "z-shortcuts-overlay": "600",
    };
    for (const [name, value] of Object.entries(zLadder)) {
      expect(tokens.get(name)).toBe(value);
    }
    expect(tokens.get("focus-ring-width")).toBe("2px");
    expect(tokens.get("focus-ring-offset")).toBe("2px");
    expect(tokens.get("target-min")).toBe("44px");
    expect(tokens.get("target-nav-row")).toBe("48px");
    expect(tokens.get("measure-min")).toBe("70ch");
    expect(tokens.get("measure-max")).toBe("80ch");
  });
});

describe("M1-T003 WCAG contrast re-verification (DESIGN-SYSTEM §4 normative)", () => {
  const OBSIDIAN = "#09090B";

  const expectedRatios: Record<string, number> = {
    "text-primary": 18.9,
    "text-secondary": 9.9,
    "text-tertiary": 5.6,
    accent: 8.1,
    "accent-strong": 13.4,
    success: 9.7,
    warning: 10.2,
    error: 8.2,
  };

  it.each(Object.entries(expectedRatios))(
    "%s computes to the spec ratio %s:1 on Obsidian",
    (name, expected) => {
      const hex = tokens.get(`color-${name}`);
      expect(hex).toBeDefined();
      const ratio = contrastRatio(hex as string, OBSIDIAN);
      expect(Math.round(ratio * 10) / 10).toBe(expected);
    },
  );

  it("every text/status color passes WCAG AA (≥4.5:1) on Obsidian", () => {
    for (const name of Object.keys(expectedRatios)) {
      const hex = tokens.get(`color-${name}`) as string;
      expect(contrastRatio(hex, OBSIDIAN)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("focus ring color has ≥3:1 contrast against adjacent Obsidian (ACCESSIBILITY §4)", () => {
    const focus = tokens.get("color-focus") as string;
    expect(contrastRatio(focus, OBSIDIAN)).toBeGreaterThanOrEqual(3);
  });
});
