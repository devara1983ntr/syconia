import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test } from "@playwright/test";

/**
 * M1-T005 — visual snapshot tests of the brand variants
 * (task Tests row: "Visual snapshot tests of variants"; Verification:
 * "Snapshot diff clean").
 *
 * Each variant renders the exact official file, served by the
 * production server, at a spec-relevant size on the Obsidian token
 * background — the same pixels the components emit (component DOM,
 * clear-space paddings and a11y contracts are unit-asserted in
 * tests/unit/brand-components.test.tsx; the served bytes are pinned by
 * SHA-256 in tests/unit/brand-assets.test.ts).
 *
 * Chromium-only: raster baselines are engine-specific; cross-engine
 * coverage arrives with the M1-T017 E2E suite per TESTING.md §3.
 */

test.skip(
  ({ browserName }) => browserName !== "chromium",
  "Visual baselines are raster-engine-specific (chromium); cross-engine coverage arrives with the M1-T017 E2E suite (TESTING.md §3).",
);

/** The snapshot canvas color, sourced from the token layer (G-8: no raw hex in test sources). */
const OBSIDIAN = readFileSync(resolve(process.cwd(), "app/styles/tokens.css"), "utf8").match(
  /--color-background:\s*(#[0-9a-fA-F]{3,8})/,
)?.[1] as string;
const BASE = (process.env.SYCONIA_E2E_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Renders one or more served images on the Obsidian canvas at exact sizes. */
async function showVariant(
  page: import("@playwright/test").Page,
  images: Array<{ src: string; width: number; height: number; opacity?: number }>,
): Promise<void> {
  const body = images
    .map(
      ({ src, width, height, opacity }) =>
        `<img src="${BASE}${src}" width="${width}" height="${height}" style="display:block;${opacity ? `opacity:${opacity};` : ""}">`,
    )
    .join("");
  await page.setContent(
    `<!doctype html><html><head><style>html,body{margin:0;padding:0;background:${OBSIDIAN};}</style></head><body>${body}</body></html>`,
  );
  // Wait until every image is actually decoded (setContent resolves before load events).
  await page.waitForFunction(
    () => Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
  );
  await expect(page.locator("img")).toHaveCount(images.length);
}

// One fixed canvas for all baselines: wide enough for the 512px icon row
// stack, tall enough for the largest lockup; dsf 1 keeps rasters stable.
test.use({ viewport: { width: 560, height: 720 } });

test("primary lockup — ASSET-LOGO-010 at header/display scale", async ({ page }) => {
  // 160px artwork → 329×327 img box (components/brand/geometry.ts).
  await showVariant(page, [
    { src: "/branding/logo/syconia-logo-primary-transparent.png", width: 329, height: 327 },
  ]);
  await expect(page).toHaveScreenshot("primary-lockup.png");
});

test("symbol — ASSET-LOGO-011 at sidebar and age-gate scales", async ({ page }) => {
  await showVariant(page, [
    { src: "/branding/logo/syconia-logo-symbol-transparent.png", width: 74, height: 74 },
    { src: "/branding/logo/syconia-logo-symbol-transparent.png", width: 341, height: 339 },
  ]);
  await expect(page).toHaveScreenshot("symbol-variants.png");
});

test("monochrome emblem — ASSET-LOGO-013 empty/error art scale", async ({ page }) => {
  await showVariant(page, [
    { src: "/branding/logo/syconia-logo-symbol-monochrome-on-dark.png", width: 120, height: 225 },
  ]);
  await expect(page).toHaveScreenshot("mono-symbol.png");
});

test("monochrome lockup — ASSET-LOGO-012 editorial display scale", async ({ page }) => {
  await showVariant(page, [
    { src: "/branding/logo/syconia-logo-monochrome-on-dark.png", width: 257, height: 256 },
  ]);
  await expect(page).toHaveScreenshot("mono-lockup.png");
});

test("favicon + app icons — official pack at native sizes", async ({ page }) => {
  await showVariant(page, [
    { src: "/branding/favicon/syconia-favicon-32.png", width: 32, height: 32 },
    { src: "/branding/app-icon/syconia-app-icon-192.png", width: 192, height: 192 },
    { src: "/branding/app-icon/syconia-app-icon-maskable-512.png", width: 512, height: 512 },
  ]);
  await expect(page).toHaveScreenshot("favicon-app-icons.png");
});

test("watermark — ASSET-WM-001 at 128px / 20% opacity (player spec)", async ({ page }) => {
  await showVariant(page, [
    {
      src: "/branding/watermark/syconia-watermark-128.png",
      width: 128,
      height: 128,
      opacity: 0.2,
    },
  ]);
  await expect(page).toHaveScreenshot("watermark.png");
});
