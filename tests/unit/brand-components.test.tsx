import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  clearSpaceFor,
  imageBoxFor,
  MONO_SYMBOL_MASTER,
  PRIMARY_MASTER,
  SYMBOL_MASTER,
  type MasterGeometry,
} from "@/components/brand/geometry";
import {
  Logo,
  LogoMono,
  LogoMonoSymbol,
  LogoSymbol,
} from "@/components/brand/logo";
import {
  Watermark,
  WATERMARK_INSET,
  WATERMARK_OPACITY,
  WATERMARK_SIZE,
  WATERMARK_SRC,
} from "@/components/brand/watermark";

/**
 * M1-T005 — brand component contracts (DESIGN-SYSTEM §2/§3;
 * branding/README.md usage map).
 *
 * 1. Every variant renders its official file (no recreation — src is
 *    the pack path).
 * 2. Clear-space padding is emitted through the --space-logo-clear
 *    token (the calc string is asserted and cross-checked against the
 *    geometry module's math).
 * 3. The wordmark's 96px floor falls back to the symbol.
 * 4. Mono variants are decorative (aria-hidden, empty alt); the
 *    watermark implements the ASSET-WM-001 spec verbatim.
 */

afterEach(() => {
  cleanup();
});

function imgOf(container: HTMLElement): HTMLImageElement {
  const img = container.querySelector("img");
  expect(img).not.toBeNull();
  return img as HTMLImageElement;
}

const TOKEN = "var(--space-logo-clear, 0.6829268292682927)";

/** Asserts the four padding calc strings equal the geometry math for `master` at `artWidth`. */
function expectClearSpacePaddings(
  style: CSSStyleDeclaration,
  master: MasterGeometry,
  artWidth: number,
): void {
  const scale = artWidth / master.artW;
  const emblem = `${Number((master.artW * scale).toFixed(3))}px`;
  const side = (marginPx: number) =>
    `max(0px, calc(${TOKEN} * ${emblem} - ${Number((marginPx * scale).toFixed(3))}px))`;
  expect(style.paddingTop).toBe(side(master.artY));
  expect(style.paddingRight).toBe(side(master.w - master.artX - master.artW));
  expect(style.paddingBottom).toBe(side(master.h - master.artY - master.artH));
  expect(style.paddingLeft).toBe(side(master.artX));
}

describe("M1-T005 Logo (primary lockup, ASSET-LOGO-010)", () => {
  it("renders the official transparent primary art at the requested artwork width", () => {
    const { container } = render(<Logo width={160} />);
    const img = imgOf(container);
    expect(img.getAttribute("src")).toBe(PRIMARY_MASTER.src);
    const box = imageBoxFor(PRIMARY_MASTER, 160);
    expect(img.getAttribute("width")).toBe(String(box.width));
    expect(img.getAttribute("height")).toBe(String(box.height));
    expect(img.getAttribute("alt")).toBe("SYCONIA");
    expect(img.getAttribute("aria-hidden")).toBeNull();
    expect(img.draggable).toBe(false);
  });

  it("applies clear-space padding through the --space-logo-clear token", () => {
    const { container } = render(<Logo width={160} />);
    const span = container.querySelector("span");
    expect(span).not.toBeNull();
    const style = (span as HTMLElement).style;
    expect(style.paddingTop).toContain(TOKEN);
    expect(style.paddingLeft).toContain(TOKEN);
    expectClearSpacePaddings(style, PRIMARY_MASTER, 160);
    // Base layout styles.
    expect(style.display).toBe("inline-flex");
    expect(style.lineHeight).toBe("0");
  });

  it("falls back to the symbol below the 96px floor (data-fallback, height-preserving)", () => {
    const { container } = render(<Logo width={80} />);
    const img = imgOf(container);
    expect(img.getAttribute("src")).toBe(SYMBOL_MASTER.src);
    expect(container.querySelector('[data-fallback="logo-symbol"]')).not.toBeNull();
    // Height-preserving: symbol art height == the lockup's would-be art height.
    const symbolWidth = (80 * PRIMARY_MASTER.artH * SYMBOL_MASTER.artW) / (PRIMARY_MASTER.artW * SYMBOL_MASTER.artH);
    const box = imageBoxFor(SYMBOL_MASTER, symbolWidth);
    expect(img.getAttribute("width")).toBe(String(box.width));
    expect(img.getAttribute("alt")).toBe("SYCONIA");
  });

  it("renders the lockup exactly at the 96px floor (>= is allowed)", () => {
    const { container } = render(<Logo width={96} />);
    expect(imgOf(container).getAttribute("src")).toBe(PRIMARY_MASTER.src);
    expect(container.querySelector('[data-fallback]')).toBeNull();
  });

  it("consumer styles never override the clear-space paddings (the §3 law wins)", () => {
    const { container } = render(
      <Logo width={160} style={{ paddingTop: "0px", color: "red" }} />,
    );
    const style = (container.querySelector("span") as HTMLElement).style;
    expect(style.paddingTop).toContain(TOKEN); // not "0px"
    expect(style.color).toBe("red"); // non-conflicting styles pass through
  });
});

describe("M1-T005 LogoSymbol (ASSET-LOGO-011)", () => {
  it("renders the official symbol art at sidebar scale (28px artwork → 74×74 box)", () => {
    const { container } = render(<LogoSymbol width={28} />);
    const img = imgOf(container);
    expect(img.getAttribute("src")).toBe(SYMBOL_MASTER.src);
    expect(img.getAttribute("width")).toBe("74");
    expect(img.getAttribute("height")).toBe("74");
    expect(img.getAttribute("alt")).toBe("SYCONIA");
  });

  it("clear-space: L/R margins of the official master suffice (calc clamps to 0); T/B completed", () => {
    const { container } = render(<LogoSymbol width={128} />);
    const style = (container.querySelector("span") as HTMLElement).style;
    expectClearSpacePaddings(style, SYMBOL_MASTER, 128);
    const cs = clearSpaceFor(SYMBOL_MASTER, 128);
    expect(cs.left).toBe(0);
    expect(cs.right).toBe(0);
    expect(cs.top).toBeGreaterThan(0);
    expect(cs.bottom).toBeGreaterThan(0);
  });

  it("honours a custom accessible label", () => {
    const { container } = render(<LogoSymbol width={28} alt="SYCONIA home" />);
    expect(imgOf(container).getAttribute("alt")).toBe("SYCONIA home");
  });
});

describe("M1-T005 monochrome variants (decorative line-art)", () => {
  it("LogoMono renders ASSET-LOGO-012 with aria-hidden + empty alt", () => {
    const { container } = render(<LogoMono width={240} />);
    const img = imgOf(container);
    expect(img.getAttribute("src")).toBe("/branding/logo/syconia-logo-monochrome-on-dark.png");
    expect(img.getAttribute("alt")).toBe("");
    expect(img.getAttribute("aria-hidden")).toBe("true");
  });

  it("LogoMonoSymbol renders ASSET-LOGO-013 full-bleed with the full clear-space ratio per side", () => {
    const { container } = render(<LogoMonoSymbol width={120} />);
    const img = imgOf(container);
    expect(img.getAttribute("src")).toBe("/branding/logo/syconia-logo-symbol-monochrome-on-dark.png");
    expect(img.getAttribute("aria-hidden")).toBe("true");
    const box = imageBoxFor(MONO_SYMBOL_MASTER, 120);
    expect(img.getAttribute("width")).toBe(String(box.width));
    expect(img.getAttribute("height")).toBe(String(box.height));
    // Full-bleed ⇒ every side's calc resolves to ratio × 120 (no built-in margin).
    const style = (container.querySelector("span") as HTMLElement).style;
    expectClearSpacePaddings(style, MONO_SYMBOL_MASTER, 120);
    const cs = clearSpaceFor(MONO_SYMBOL_MASTER, 120);
    expect(cs.top).toBeGreaterThan(0);
    expect(cs.right).toBeGreaterThan(0);
    expect(cs.bottom).toBeGreaterThan(0);
    expect(cs.left).toBeGreaterThan(0);
  });
});

describe("M1-T005 Watermark (ASSET-WM-001, README §Watermark verbatim)", () => {
  it("renders the official 128px watermark at 20% opacity, aria-hidden, non-interactive", () => {
    const { container } = render(<Watermark />);
    const span = container.querySelector("span");
    expect(span).not.toBeNull();
    const style = (span as HTMLElement).style;
    expect(style.position).toBe("absolute");
    expect(style.right).toBe(`${WATERMARK_INSET}px`);
    expect(style.bottom).toBe(`${WATERMARK_INSET}px`);
    expect(style.width).toBe(`${WATERMARK_SIZE}px`);
    expect(style.height).toBe(`${WATERMARK_SIZE}px`);
    expect(style.opacity).toBe(String(WATERMARK_OPACITY));
    expect(style.pointerEvents).toBe("none");
    expect(span?.getAttribute("aria-hidden")).toBe("true");
    const img = imgOf(container);
    expect(img.getAttribute("src")).toBe(WATERMARK_SRC);
    expect(img.getAttribute("width")).toBe("128");
    expect(img.getAttribute("height")).toBe("128");
    expect(img.getAttribute("alt")).toBe("");
  });

  it("exports the spec-fixed constants", () => {
    expect(WATERMARK_SIZE).toBe(128);
    expect(WATERMARK_INSET).toBe(16);
    expect(WATERMARK_OPACITY).toBe(0.2);
    expect(WATERMARK_SRC).toBe("/branding/watermark/syconia-watermark-128.png");
  });
});

describe("M1-T005 brand images use no next/image runtime (PERFORMANCE §3)", () => {
  it("every component renders a plain <img> with intrinsic width/height (CLS-safe, zero JS)", () => {
    for (const jsx of [
      <Logo key="logo" width={160} />,
      <LogoSymbol key="symbol" width={28} />,
      <LogoMono key="mono" width={240} />,
      <LogoMonoSymbol key="monosym" width={120} />,
      <Watermark key="wm" />,
    ]) {
      const { container } = render(jsx);
      const img = imgOf(container);
      expect(img.tagName).toBe("IMG");
      expect(img.getAttribute("width")).toMatch(/^\d+$/);
      expect(img.getAttribute("height")).toMatch(/^\d+$/);
    }
  });
});
