import type { MetadataRoute } from "next";

/**
 * SYCONIA web app manifest (M1-T005; PRD §72 PWA installability,
 * SEO.md §2 "Favicons/app icons", decision D-009).
 *
 * - Icons are the official pack assets served from public/branding
 *   (byte-identical copies of ASSET-ICON-001/002/004/005): `any` and
 *   `maskable` entries at 192/512 — the maskable set is the inscribed
 *   full-composition derivation (safe zone verified in ASSET-MANIFEST).
 * - Name is the locked display spelling (DS §1; PRD §36 — never
 *   "Syconia Media"/"Syconia Technologies" in product UI); the
 *   description is the PRD's own project line, stated truthfully
 *   (master spec §17 rejects the guidelines' decoy strategy — conflict
 *   C-2).
 * - theme_color/background_color mirror the §4 Obsidian token
 *   (--color-background #09090B — the only v1 theme). The web-app
 *   manifest spec requires literal CSS color strings (var() is not a
 *   valid manifest value), so the hex appears here by spec necessity —
 *   the G-8 exemption for this file records that (values must stay
 *   byte-equal to tokens.css §4).
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SYCONIA",
    short_name: "SYCONIA",
    description: "Premium adult media discovery and streaming platform.",
    start_url: "/",
    display: "standalone",
    lang: "en",
    theme_color: "#09090B",
    background_color: "#09090B",
    icons: [
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
    ],
  };
}
