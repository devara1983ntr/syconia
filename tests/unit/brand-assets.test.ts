import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

import manifestRoute from "@/app/manifest";
import {
  MONO_LOCKUP_MASTER,
  MONO_SYMBOL_MASTER,
  PRIMARY_MASTER,
  SYMBOL_MASTER,
} from "@/components/brand/geometry";
import { WATERMARK_SRC } from "@/components/brand/watermark";

/**
 * M1-T005 — official-file integrity of the static serve map
 * (branding/README.md: "serve paths may be re-mapped by the app's static
 * strategy at M1-T005; the files above are final").
 *
 * 1. Every public/branding file is byte-identical (SHA-256) to its
 *    branding/ pack source — acceptance: "Favicon/app icons served from
 *    official files" + "no recreated SVG paths" (a recreation cannot
 *    match the registered hashes).
 * 2. PNG dimensions match the ASSET-MANIFEST rows (parsed from the IHDR
 *    chunk — no image library needed).
 * 3. Every URL referenced by the components, the metadata icons config
 *    and the web manifest resolves to a served file; the served set is
 *    exactly the map (nothing unregistered ships).
 *
 * (Layout metadata icons are asserted in manifest-metadata.test.ts —
 * importing the layout there requires the next/font mock used by
 * tests/unit/fonts.test.tsx.)
 */

/** The favicon URLs wired in app/layout.tsx metadata.icons (README §Favicon configuration). */
const LAYOUT_ICON_URLS = [
  "/favicon.ico",
  "/branding/favicon/syconia-favicon-32.png",
  "/branding/favicon/syconia-favicon-16.png",
  "/branding/app-icon/syconia-app-icon-180.png",
];

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

/** Reads width/height from a PNG IHDR chunk (bytes 16..23). */
function pngDims(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  expect(buf.subarray(0, 8).equals(sig)).toBe(true);
  expect(buf.toString("ascii", 12, 16)).toBe("IHDR");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** serve map: public path → pack source (mirrored 1:1; favicon.ico at the conventional root). */
const SERVE_MAP: Record<string, string> = {
  "public/favicon.ico": "branding/favicon/syconia-favicon.ico",
  "public/branding/favicon/syconia-favicon-16.png": "branding/favicon/syconia-favicon-16.png",
  "public/branding/favicon/syconia-favicon-32.png": "branding/favicon/syconia-favicon-32.png",
  "public/branding/app-icon/syconia-app-icon-180.png": "branding/app-icon/syconia-app-icon-180.png",
  "public/branding/app-icon/syconia-app-icon-192.png": "branding/app-icon/syconia-app-icon-192.png",
  "public/branding/app-icon/syconia-app-icon-maskable-192.png": "branding/app-icon/syconia-app-icon-maskable-192.png",
  "public/branding/app-icon/syconia-app-icon-maskable-512.png": "branding/app-icon/syconia-app-icon-maskable-512.png",
  "public/branding/syconia-app-icon.png": "branding/syconia-app-icon.png",
  "public/branding/logo/syconia-logo-primary-transparent.png": "branding/logo/syconia-logo-primary-transparent.png",
  "public/branding/logo/syconia-logo-symbol-transparent.png": "branding/logo/syconia-logo-symbol-transparent.png",
  "public/branding/logo/syconia-logo-monochrome-on-dark.png": "branding/logo/syconia-logo-monochrome-on-dark.png",
  "public/branding/logo/syconia-logo-symbol-monochrome-on-dark.png": "branding/logo/syconia-logo-symbol-monochrome-on-dark.png",
  "public/branding/watermark/syconia-watermark-128.png": "branding/watermark/syconia-watermark-128.png",
};

const ROOT = process.cwd();

/** ASSET-MANIFEST.md recorded dimensions (pack register rows). */
const MANIFEST_DIMS: Record<string, { width: number; height: number }> = {
  "branding/favicon/syconia-favicon-16.png": { width: 16, height: 16 },
  "branding/favicon/syconia-favicon-32.png": { width: 32, height: 32 },
  "branding/app-icon/syconia-app-icon-180.png": { width: 180, height: 180 },
  "branding/app-icon/syconia-app-icon-192.png": { width: 192, height: 192 },
  "branding/app-icon/syconia-app-icon-maskable-192.png": { width: 192, height: 192 },
  "branding/app-icon/syconia-app-icon-maskable-512.png": { width: 512, height: 512 },
  "branding/syconia-app-icon.png": { width: 512, height: 512 },
  "branding/logo/syconia-logo-primary-transparent.png": { width: 2160, height: 2148 },
  "branding/logo/syconia-logo-symbol-transparent.png": { width: 1635, height: 1626 },
  "branding/logo/syconia-logo-monochrome-on-dark.png": { width: 1635, height: 1626 },
  "branding/logo/syconia-logo-symbol-monochrome-on-dark.png": { width: 615, height: 1154 },
  "branding/watermark/syconia-watermark-128.png": { width: 128, height: 128 },
};

const manifest = manifestRoute();

function publicFileForUrl(url: string): string {
  expect(url.startsWith("/")).toBe(true);
  return join(ROOT, "public", url.slice(1));
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe("M1-T005 serve map — official files only", () => {
  it("every served file is byte-identical to its pack source (SHA-256)", () => {
    for (const [pub, pack] of Object.entries(SERVE_MAP)) {
      const pubPath = resolve(ROOT, pub);
      const packPath = resolve(ROOT, pack);
      expect(existsSync(pubPath), `missing ${pub}`).toBe(true);
      expect(existsSync(packPath), `missing ${pack}`).toBe(true);
      expect(sha256(pubPath)).toBe(sha256(packPath));
    }
  });

  it("favicon.ico carries the ICO magic bytes (repacked 16+32 container, ASSET-FAV-004)", () => {
    const buf = readFileSync(resolve(ROOT, "public/favicon.ico"));
    expect(buf.readUInt16LE(0)).toBe(0); // reserved
    expect(buf.readUInt16LE(2)).toBe(1); // type: icon
    expect(buf.readUInt16LE(4)).toBeGreaterThanOrEqual(1); // image count
  });

  it("PNG dimensions match the ASSET-MANIFEST register rows", () => {
    for (const [pack, dims] of Object.entries(MANIFEST_DIMS)) {
      const served = publicFileForUrl(`/${pack.replace(/^branding\//, "branding/")}`);
      expect(pngDims(served)).toEqual(dims);
    }
  });

  it("the served set is exactly the map — nothing unregistered ships", () => {
    const served = walk(resolve(ROOT, "public")).sort();
    const expected = Object.keys(SERVE_MAP)
      .map((p) => resolve(ROOT, p))
      .sort();
    expect(served).toEqual(expected);
  });
});

describe("M1-T005 component/manifest/metadata URLs resolve to served official files", () => {
  it("logo component sources resolve", () => {
    for (const m of [SYMBOL_MASTER, PRIMARY_MASTER, MONO_LOCKUP_MASTER, MONO_SYMBOL_MASTER]) {
      expect(existsSync(publicFileForUrl(m.src))).toBe(true);
    }
  });

  it("watermark source resolves", () => {
    expect(existsSync(publicFileForUrl(WATERMARK_SRC))).toBe(true);
  });

  it("layout metadata icon URLs resolve (favicon.ico + 32/16 + apple 180)", () => {
    for (const url of LAYOUT_ICON_URLS) {
      expect(existsSync(publicFileForUrl(url)), `missing ${url}`).toBe(true);
    }
  });

  it("web manifest icon URLs resolve (any + maskable at 192/512)", () => {
    for (const icon of manifest.icons ?? []) {
      const file = publicFileForUrl(icon.src);
      expect(existsSync(file), `missing ${icon.src}`).toBe(true);
      const dims = pngDims(file);
      expect(`${dims.width}x${dims.height}`).toBe(icon.sizes);
    }
  });
});
