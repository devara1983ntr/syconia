# SYCONIA — Production Icon System

**Authority:** DESIGN-SYSTEM.md §7 (Iconography) — `lucide-react`, 1.5px stroke, 20/24px boxes, color = `currentColor`; brand symbols exclusively from `/branding/`; **custom icons prohibited** except line-art exports of the official emblem. No emoji. No Unicode glyphs as icon substitutes. No mixed icon styles.

## Rules

1. **Library:** `lucide-react` (dependency wired at M1-T002; pin exact version then — React exports are PascalCase of the kebab IDs below; where a name was renamed, use the pinned version's canonical export, not deprecated aliases).
2. **Stroke/size:** `strokeWidth={1.5}`; 20px inside dense chrome (player overlay, meta rows), 24px for standalone/primary actions.
3. **Color:** inherits `currentColor` — never hard-coded hex (G-8). Non-text UI contrast ≥3:1 (ACCESSIBILITY §4).
4. **Labels:** icon-only buttons carry `aria-label`; icon+label mandatory for destructive/ambiguous actions (DESIGN-SYSTEM §7).
5. **Loading is never an icon:** the ostiole dot pulse is the brand loading signal (DESIGN-SYSTEM §9). Spinner icons are prohibited.
6. **Emblem ≠ icon:** logo/watermark/empty-state art come from `/branding/`, never from the icon library.

## Mapped inventory (every specced surface)

| Category | Icon (lucide kebab ID) | Specced surface (source) |
|---|---|---|
| Navigation | `menu` | Hamburger, S-00 (2px strokes 18×14 rendered spec is the drawer trigger's visual; lucide `menu` at 1.5px is the system rendering — component CSS owns exact stroke box) |
| Navigation | `arrow-left` | Back arrow, S-00 standard guarantee |
| Navigation | `x` | Close drawer/modal/sheets; clear-search |
| Navigation | `search` | Header search (tablet/mobile icon), S-00 |
| Navigation | `chevron-right` / `chevron-down` / `chevron-left` | Drawer groups ▸, expandable rows, pagination, breadcrumbs |
| Navigation | `keyboard` | `?` shortcuts overlay trigger, S-00 |
| Search | `filter` | FilterBar toggle, S-03 |
| Search | `arrow-up-down` | Sort control, S-03 |
| Player (ours, always) | `maximize` / `minimize` | Fullscreen toggle, GESTURES §2 |
| Player (ours, always) | `rectangle-horizontal` | Theater mode, GESTURES §2 |
| Player (ours, always) | `flag` | Report, GESTURES §2 / S-07R |
| Player (ours, always) | `share-2` | Share, GESTURES §2 |
| Player (ours, always) | `external-link` | Open-at-source, GESTURES §2; also ProvenanceChip |
| Player (delegated only) | `play` / `pause` | Control bar when `player_api` capability declared, GESTURES §2 |
| Player (delegated only) | `volume-2` / `volume-x` | Volume overlay / mute, GESTURES §3 |
| Player (delegated only) | `settings` | Delegated settings, GESTURES §2 |
| Player (hints) | `captions` / `gauge` | Captions/speed availability hints linking to native controls, GESTURES §2 capability signals |
| States | `check` | Success (toast/alert, badges) |
| States | `triangle-alert` | Warning (Alert primitive, SLA amber) |
| States | `circle-alert` | Error (ErrorState, failure ladder) |
| States | `info` | Informational alerts |
| States | `wifi-off` | OfflineBanner, E-17 |
| States | `rotate-cw` | Retry actions, E-01/E-07 ladder |
| Session/discretion | `eye` / `eye-off` | Discreet-thumbnails toggle, S-00 drawer |
| Session/discretion | `eraser` | Clear session traces, S-00 drawer |
| Actions | `copy` | "Copy link" share action, DESIGN-SYSTEM §12 |
| Admin | same library | Admin tables/actions consume the same set per-component at M4; no separate admin icon style |

## Explicitly excluded (no spec basis — do not add)

`bookmark`/save, `bell`/notifications, `user`/profile, `heart`/like, `download` — no such features exist in v1 (PRD scope; no accounts, no public interactions beyond report/search/watch). Adding any icon without a spec source is scope invention (AGENT.md §2).

## Verification

Mapping audited against SCREENS.md (S-00/S-03/S-07/S-07R), GESTURES.md (§2 capabilities, §3 gestures, §4 pointer, §5 shortcuts), UX-FLOWS.md, ERROR-STATES.md (state icons), DESIGN-SYSTEM.md §7/§10/§12. Exact React export names verified against the pinned `lucide-react` version when the dependency is installed (M1-T002) — kebab IDs above are stable library identifiers.
