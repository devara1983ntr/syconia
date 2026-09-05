import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

import manifestRoute from "@/app/manifest";
import { metadata } from "@/app/layout";

/**
 * M1-T005 — favicon/app-icon/manifest metadata wiring
 * (branding/README.md §Favicon configuration; SEO.md §2; decision D-009).
 *
 * 1. Layout metadata icons = the README's exact configuration
 *    (/favicon.ico conventional root + official 32/16 PNGs + 180
 *    apple-touch from the app-icon master).
 * 2. The web manifest carries `any` + `maskable` entries at 192/512
 *    (D-009: the maskable set is the safe-zone-inscribed derivation).
 * 3. Manifest name/spelling is the locked brand name (DS §1, PRD §36);
 *    the description is the PRD's truthful project line (the guidelines'
 *    decoy strategy is rejected — conflict C-2).
 * 4. theme_color/background_color are byte-equal to the §4 Obsidian
 *    token (the manifest spec requires literal color strings; this is
 *    the recorded G-8 exemption, asserted here against tokens.css).
 */

vi.mock("next/font/local", () => {
  const face = (variable: string) => ({
    className: `test-local-font-${variable}`,
    variable: `test-font-variable-${variable}`,
  });
  return {
    default: (options: { variable?: string }) => face(options.variable ?? "--x"),
  };
});

const TOKENS_CSS = readFileSync(resolve(process.cwd(), "app/styles/tokens.css"), "utf8");

function tokenHex(name: string): string | undefined {
  return TOKENS_CSS.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{3,8})`))?.[1];
}

describe("M1-T005 layout metadata icons (README §Favicon configuration)", () => {
  it("declares the exact icon set from the pack", () => {
    const icons = metadata.icons;
    if (typeof icons !== "object" || icons === null || Array.isArray(icons) || "href" in icons) {
      throw new Error("metadata.icons must be the README §Favicon object form");
    }
    expect(icons?.icon).toEqual([
      { url: "/favicon.ico", sizes: "any" },
      { url: "/branding/favicon/syconia-favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/branding/favicon/syconia-favicon-16.png", sizes: "16x16", type: "image/png" },
    ]);
    expect(icons?.apple).toEqual({
      url: "/branding/app-icon/syconia-app-icon-180.png",
      sizes: "180x180",
      type: "image/png",
    });
  });

  it("keeps the locked brand title", () => {
    expect(metadata.title).toBe("SYCONIA");
  });
});

const manifest = manifestRoute();

describe("M1-T005 web manifest (PWA installability, PRD §72; D-009)", () => {
  it("icons cover any + maskable at 192/512 from official pack files", () => {
    const icons = manifest.icons ?? [];
    const byPurpose = (purpose: string) => icons.filter((i) => i.purpose === purpose);
    expect(byPurpose("any")).toEqual([
      {
        src: "/branding/app-icon/syconia-app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/branding/syconia-app-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ]);
    expect(byPurpose("maskable")).toEqual([
      {
        src: "/branding/app-icon/syconia-app-icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/branding/app-icon/syconia-app-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ]);
    expect(icons).toHaveLength(4);
  });

  it("name/short_name use the locked display spelling (DS §1, PRD §36)", () => {
    expect(manifest.name).toBe("SYCONIA");
    expect(manifest.short_name).toBe("SYCONIA");
    expect(manifest.name).not.toMatch(/Syconia (Media|Technologies)/);
  });

  it("description is the PRD's truthful project line", () => {
    expect(manifest.description).toBe(
      "Premium adult media discovery and streaming platform.",
    );
  });

  it("standard PWA fields", () => {
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.lang).toBe("en");
  });

  it("theme/background colors are byte-equal to the §4 Obsidian token (G-8 exemption contract)", () => {
    // §4 value pinning lives in tests/unit/tokens.test.ts (the spec
    // snapshot, the sanctioned G-8 exemption); this test pins the LINK:
    // manifest colors must flow from the token layer, not drift.
    const obsidian = tokenHex("--color-background");
    expect(obsidian).toBeDefined();
    expect(manifest.theme_color).toBe(obsidian);
    expect(manifest.background_color).toBe(obsidian);
  });
});
