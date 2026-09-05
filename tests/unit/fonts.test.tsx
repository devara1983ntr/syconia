import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";

type HtmlElement = ReactElement<{
  lang?: string;
  className?: string;
  children: ReactElement<{ children: unknown }>;
}>;

import RootLayout from "@/app/layout";
import { fraunces, inter } from "@/app/fonts";

/**
 * M1-T004 font loading tests (DESIGN-SYSTEM §5, PERFORMANCE §2, AG-013).
 *
 * Mandates:
 * 1. Module contract — next/font/local is configured with the officially
 *    staged OFL packages from branding/ (no downloads/substitutions),
 *    font-display swap, preload, and the AG-013 weight-range pin
 *    (Fraunces VF default instance is wght 900 — the declared range must
 *    start at 400 so no text can render below 400, DESIGN-SYSTEM §5).
 * 2. File integrity — the consumed TTFs match the SHA-256 values recorded
 *    in branding/ASSET-MANIFEST.md (ASSET-FONT-001 / ASSET-FONT-002).
 * 3. Wiring — the root layout injects both next/font CSS variables on
 *    <html>, and the token layer (app/styles/tokens.css) resolves
 *    --font-sans/--font-serif through those variables.
 * 4. Self-hosting — in built output (requires `next build` to have run;
 *    CI runs the battery after build), the document preloads only
 *    /_next/static/media font files and references no external font URL.
 */

const { localFontCalls } = vi.hoisted(() => ({
  localFontCalls: [] as Array<Record<string, unknown>>,
}));

vi.mock("next/font/local", () => ({
  default: (options: Record<string, unknown>) => {
    localFontCalls.push(options);
    const n = localFontCalls.length;
    return {
      className: `test-local-font-${n}`,
      variable: `test-font-variable-${String(options.variable)}`,
    };
  },
}));

/** branding/ASSET-MANIFEST.md — ASSET-FONT-001 / ASSET-FONT-002 pins. */
const FONT_FILES = {
  fraunces: {
    path: "branding/fonts/fraunces/Fraunces-VF.ttf",
    sha256: "177ff6c0f14e5550a3c624247cd1189611d4eb65d000b14944c63d967958abbb",
    variable: "--font-fraunces",
    fallback: "Times New Roman",
  },
  inter: {
    path: "branding/fonts/inter/Inter-VF.ttf",
    sha256: "29160a80ff49ddcab2c97711247e08b1fab27a484a329ce8b813d820dc559031",
    variable: "--font-inter",
    fallback: "Arial",
  },
} as const;

function callFor(variable: string): Record<string, unknown> {
  const call = localFontCalls.find((c) => c.variable === variable);
  if (!call) {
    throw new Error(`localFont was not configured for ${variable}`);
  }
  return call;
}

describe("M1-T004 font module contract (app/fonts.ts)", () => {
  it("configures exactly two local font faces", () => {
    expect(localFontCalls).toHaveLength(2);
  });

  it.each([FONT_FILES.fraunces, FONT_FILES.inter])(
    "configures $variable to consume the staged OFL package ($path)",
    (font) => {
      const call = callFor(font.variable);
      expect(call.src).toBe(`../${font.path}`);
      expect(existsSync(resolve(process.cwd(), font.path))).toBe(true);
    },
  );

  it.each([FONT_FILES.fraunces, FONT_FILES.inter])(
    "$path matches the ASSET-MANIFEST SHA-256 pin",
    (font) => {
      const digest = createHash("sha256")
        .update(readFileSync(resolve(process.cwd(), font.path)))
        .digest("hex");
      expect(digest).toBe(font.sha256);
    },
  );

  it.each([FONT_FILES.fraunces, FONT_FILES.inter])(
    "$variable pins weight 400–900 (AG-013: never below 400, never the wght-900 default instance)",
    (font) => {
      const call = callFor(font.variable);
      expect(call.weight).toBe("400 900");
    },
  );

  it.each([FONT_FILES.fraunces, FONT_FILES.inter])(
    "$variable declares swap, preload, normal style, and the metric-adjusted fallback",
    (font) => {
      const call = callFor(font.variable);
      expect(call.display).toBe("swap");
      expect(call.preload).toBe(true);
      expect(call.style).toBe("normal");
      expect(call.adjustFontFallback).toBe(font.fallback);
    },
  );
});

describe("M1-T004 root layout wiring (app/layout.tsx)", () => {
  it("injects both next/font CSS variables on <html>", () => {
    const element = RootLayout({ children: <p>content</p> }) as HtmlElement;
    expect(element.type).toBe("html");
    expect(element.props.lang).toBe("en");
    expect(element.props.className).toContain(
      "test-font-variable---font-fraunces",
    );
    expect(element.props.className).toContain("test-font-variable---font-inter");
    expect(fraunces.variable).toBeTruthy();
    expect(inter.variable).toBeTruthy();
  });

  it("wraps children in <body>", () => {
    const element = RootLayout({ children: <p>content</p> }) as HtmlElement;
    const body = element.props.children;
    expect(body.type).toBe("body");
    expect(body.props.children).toBeDefined();
  });
});

describe("M1-T004 token layer wiring (app/styles/tokens.css)", () => {
  const tokensCss = readFileSync(
    resolve(process.cwd(), "app/styles/tokens.css"),
    "utf8",
  );

  it("resolves --font-sans through the Inter next/font variable", () => {
    expect(tokensCss).toMatch(
      /--font-sans:\s*var\(--font-inter,\s*"Inter"\),\s*ui-sans-serif,\s*system-ui,\s*sans-serif;/,
    );
  });

  it("resolves --font-serif through the Fraunces next/font variable", () => {
    expect(tokensCss).toMatch(
      /--font-serif:\s*var\(--font-fraunces,\s*"Fraunces"\),\s*ui-serif,\s*Georgia,\s*serif;/,
    );
  });

  it("declares no type weight below 400 (DESIGN-SYSTEM §5 rule)", () => {
    const weights = [...tokensCss.matchAll(/--text-[a-z0-9-]+--font-weight:\s*(\d+);/g)].map(
      (m) => Number(m[1]),
    );
    expect(weights.length).toBeGreaterThan(0);
    for (const weight of weights) {
      expect(weight).toBeGreaterThanOrEqual(400);
    }
  });
});

/**
 * Self-hosting proof against built output. `next build` writes the
 * prerendered document and the font CSS chunks; these assertions run in
 * the post-build battery (the CI gate order runs tests with the build
 * present). Without a build, this block is skipped — the module-contract
 * tests above already pin the configuration that produces the output.
 */
const BUILD_HTML = resolve(process.cwd(), ".next/server/app/index.html");

/** Recursively collect built CSS files under a directory. */
function collectCssFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectCssFiles(full));
    } else if (entry.name.endsWith(".css")) {
      out.push(full);
    }
  }
  return out;
}

describe.skipIf(!existsSync(BUILD_HTML))(
  "M1-T004 built output is fully self-hosted (post-build)",
  () => {
    let html: string;

    beforeAll(() => {
      html = readFileSync(BUILD_HTML, "utf8");
    });

    it("preloads at least the two font files from /_next/static/media", () => {
      const preloads = [...html.matchAll(/<link[^>]*as="font"[^>]*>/g)].map(
        (m) => m[0],
      );
      expect(preloads.length).toBeGreaterThanOrEqual(2);
      for (const link of preloads) {
        expect(link).toMatch(/href="\/_next\/static\/media\/[^"]+\.ttf"/);
      }
    });

    it("references no external font URL (PERFORMANCE §2)", () => {
      expect(html).not.toMatch(/https?:\/\/[^"'\s]*font/i);
      expect(html).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/i);
    });

    it("emits @font-face with swap, the 400–900 pin, and existing self-hosted files", () => {
      const faceEntries = collectCssFiles(
        resolve(process.cwd(), ".next/static"),
      ).flatMap((file) => {
        const text = readFileSync(file, "utf8");
        return [...text.matchAll(/@font-face\s*\{[^}]+\}/g)].map((m) => ({
          file,
          face: m[0],
        }));
      });

      const primary = faceEntries.filter(({ face }) => !face.includes("Fallback"));
      expect(primary.length).toBe(2);
      const families: string[] = [];
      for (const { file, face } of primary) {
        expect(face).toMatch(/font-display:\s*swap/);
        expect(face).toMatch(/font-weight:\s*400 900/);
        expect(face).toMatch(/font-style:\s*normal/);
        const family = face.match(/font-family:\s*([^;]+);/)?.[1];
        expect(family).toBeTruthy();
        families.push(family as string);
        const src = face.match(/src:\s*url\("?([^")]+\.ttf)"?\)/)?.[1];
        expect(src, `missing src in ${face}`).toBeTruthy();
        expect(
          existsSync(resolve(resolve(file, ".."), src as string)),
          `font file not built: ${src}`,
        ).toBe(true);
      }
      expect(families.join(" ")).toMatch(/fraunces/i);
      expect(families.join(" ")).toMatch(/inter/i);

      // Metric-adjusted system fallbacks (the CLS guard during swap).
      const fallbacks = faceEntries.filter(({ face }) => face.includes("Fallback"));
      expect(fallbacks.length).toBe(2);
      for (const { face } of fallbacks) {
        expect(face).toMatch(/size-adjust:\s*[\d.]+%/);
        expect(face).toMatch(/src:\s*local\(/);
      }
    });
  },
);
