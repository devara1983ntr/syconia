# SYCONIA — Supporting Asset Audit (secondary/pass-polish system)

**Version 1.0.0 · 2026-09-03 · Method:** every category below was audited against the specification suite before any asset was created. Verdict vocabulary: **PRESENT** (critical pack already covers it) · **CREATED** (this pass) · **REJECTED** (spec-justified refusal — creating it would violate restraint/YAGNI/scope) · **PENDING** (legitimate but blocked on real UI). Visual-inspection limitation applies to this pass as before: verification is programmatic; no visual approval is claimed (AG-002 scope).

| # | Category | Verdict | Evidence / spec basis | Asset & notes |
|---|---|---|---|---|
| A | Social / Open Graph | **PRESENT** | SEO.md §OG: per-video = runtime proxy thumbnails 1200×630; default card = `social/syconia-og-default.png` (critical pack) | Nothing added. `twitter:card=summary_large_image` consumes the same image — no second variant (§7 directive: no unverified hard-coded platform dimensions) |
| B | Share-preview artwork | **PRESENT** | SEO.md §OG; UX-FLOWS share = copy-link (no share-image service) | Same OG card; "neutral preview mode" is `[PROPOSED]`, off in v1 — deliberately not created (consistency spine excludes PROPOSED from v1) |
| C | Website metadata artwork | **PRESENT** | SEO.md §Favicons/app-icons: 32 favicon, 180 apple-touch, 192/512 manifest icons | Complete in critical pack; maskable additions below under N |
| D | Branded loading visuals | **REJECTED (no file needed)** | DESIGN-SYSTEM §9: ostiole dot pulse (CSS/Motion), skeleton shimmer, static emblem under reduced-motion | Loading = Motion + tokens + `logo/syconia-logo-symbol-monochrome-on-dark.png`; a static "loading artwork" would duplicate this |
| E | Empty-state illustrations | **REJECTED (composition, not illustration)** | ERROR-STATES §4: states are *editorial typographic compositions* — emblem line-art + serif line + one CTA; "never apologetic filler" | Asset exists (ASSET-LOGO-013). Per-state artwork would add clutter the spec forbids |
| F | Error-state illustrations | **REJECTED (same basis)** | ERROR-STATES E-01…E-20: emblem art + copy + actions; player failure = ladder dialog (icons) | Same symbol-mono asset; no per-error imagery |
| G | Background textures / grain / patterns | **REJECTED** | DESIGN-SYSTEM §1 forbids clutter; §11 imagery direction; no texture specced anywhere | Quiet Luxury = generous negative space; grain files would add payload + noise for zero UX gain |
| H | Section/collection visual treatments | **PRESENT (tokens)** | DESIGN-SYSTEM §4/§6: emerald bands (`--color-surface-emerald`), hairlines, elevation | CSS tokens cover section treatment; no art |
| I | Category visual system | **CREATED (spec doc, not images)** | DESIGN-SYSTEM §11 mandates runtime-deterministic token meshes — explicitly "generated locally … no external art" | **`CATEGORY-ART-SYSTEM.md`** (ASSET-SPEC-001): seed algorithm, CSS-first strategy with objective rasterization trigger, contrast proof obligation, anti-invention clauses |
| J | Search / no-results visual | **REJECTED (typographic)** | ERROR-STATES E-04 + suggestions rail; SCREENS S-03 | Emblem + serif line + suggestions; no illustration |
| K | Offline visual treatment | **REJECTED (components)** | SCREENS S-11, E-17: banner + /offline page with emblem art, SW-free in v1 | Existing symbol-mono + OfflineBanner icon (`wifi-off`) suffice |
| L | Source-unavailable visual | **REJECTED (rail, not art)** | E-06b: 200 + related rail + E-06 404 composition | No imagery — the related rail IS the treatment |
| M | Notification/status visuals | **REJECTED** | SCREENS §Notifications: v1 = error/offline toasts (components) + drawer badge dot | No notification artwork; status = `Badge`/`StateChip` primitives + semantic colors |
| N | PWA / install supporting artwork | **CREATED (2 icons)** | PRD §72 "Installable PWA"; SEO.md §Favicons/app-icons (192/512 manifest icons); F-21 offline shell is `[PROPOSED]` → manifest + icons in scope, no SW assets | **`app-icon/syconia-app-icon-maskable-512.png` / `-192.png`** (ASSET-ICON-004/005): official 512 composition inscribed in the maskable safe zone (art ≤203.65px radius vs 204.8 safe @512; corners exact Obsidian; 32KB/7KB). Rationale D-009: without maskable entries, Android circular masks clip the golden frame |
| O | Browser metadata artwork | **PRESENT** | favicon.ico + 16/32 + apple-touch 180 in critical pack | safari-pinned-tab / browserconfig.xml not specced → not created (no platform claims without verification) |
| P | Documentation screenshots | **PENDING (AG-014)** | Real UI does not exist; fabricating screenshots is prohibited (AGENT §2.1; both directives §9) | Gap row AG-014: capture after M1 screens render; never mock |
| Q | Promotional / marketing artwork | **REJECTED** | No marketing surface exists in any spec; §8 directive forbids unsupported claims | Nothing created — no "best/largest/safest" claims anywhere in the pack |

**Totals:** 2 categories PRESENT via critical pack · 2 CREATED (maskable icons; category-art spec) · 9 REJECTED with spec citations · 1 PENDING (screenshots, honestly blocked on real UI).

## Accessibility of this pass

Maskable icons: launcher-level chrome (no WCAG text-contrast obligation; art inherited from official icon). Category art system: decorative-by-construction (`aria-hidden`), information carried by HTML labels with provable ≥4.5:1 over the bounded-luminance mesh (unit-tested at M2-T017). All rejected categories remove—not add—potential a11y noise.

## Performance of this pass

Added payload: 39.3KB total (two small PNGs, cache-forever static assets). Category system adds ~200B of CSS per surface and zero images (rasterization only on a measured trigger). No animated assets exist; nothing affects motion budgets.
