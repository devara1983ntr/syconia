# SYCONIA — Navigation & User Workflows

| Field | Value |
|---|---|
| Document | UX-FLOWS.md · v1.0.2 · 2026-09-03 · `[REQUIRED]` target behavior |

Screens: [SCREENS.md](./SCREENS.md) · Interaction physics: [GESTURES.md](./GESTURES.md) · States: [ERROR-STATES.md](./ERROR-STATES.md)

---

## 1. Information architecture (site map)

```
Age Gate ─┬─ Home /
          ├─ Search /search?q=…
          ├─ Categories /categories ── /categories/[slug]
          ├─ Tags /tags ── /tags/[slug]
          ├─ Watch /watch/[slug]  (terminal-content node)
          ├─ Info: /about  /contact
          ├─ Legal: /legal/{terms|privacy|dmca|2257|cookies}
          └─ System: /offline · 404 · error
Admin (separate tree): /admin/login → /admin/{dashboard|videos|categories|tags|
                      sources|mappings|takedowns|settings|audit}
```

Depth rule: any content is ≤3 taps from Home (drawer → listing → watch). Watch pages cross-link only *sideways* (related/tags) — never deeper.

## 2. Global navigation rules
1. **Back arrow (top-left):** visible on every non-root page. Resolution order: (a) in-app history entry exists → `history.back()`; (b) else static parent (search→home, watch→referring listing *if passed via state*, else home; category detail→index; tag detail→index; legal→home; admin sections→/admin); (c) else Home. Never traps the user; never exits the site.
2. **Hamburger drawer:** available on every page (including watch — pauses nothing, overlays only). Opens S-00 drawer; selecting a destination: drawer closes (200ms) → route transition. If leaving a watch page with active playback: playback stops (shell unloads embed) — deliberate, privacy-first.
3. **Logo tap:** Home. **Browser back/forward:** full URL-state restoration incl. filters + scroll (S-03).
4. **Header search:** `/` focuses; ESC blurs; mobile opens overlay sheet.

## 3. Flow F1 — First visit (cold start)
```
Arrive (any URL) ──► Age Gate (S-01, content withheld server-side)
   ├─ "Enter" ──► set sy_age_ok + sy_sid ──► fade to target route
   │                 ├─ route exists ──► normal render (skeleton→content)
   │                 └─ route gone/404 ──► S-09 + trending + did-you-mean
   └─ "Leave" ──► neutral external page (no content ever rendered)
```
Rules: deep-link survives the gate exactly (no redirect to home); `age_ack` event; nothing about the target page (title/thumbnail) leaks before Enter.

## 4. Flow F2 — Directed search (intent known)
```
Focus search (icon or "/") ──► type (debounce 180ms)
   ├─ suggestions ▸ select title ──► /watch/[slug]
   ├─ suggestions ▸ select category/tag chip ──► /categories/[slug] | /tags/[slug]
   └─ Enter ──► /search?q=…
        ├─ results ──► grid; refine via FilterBar (URL updates live)
        │     └─ open card ──► F4 watch
        ├─ zero results ──► E-03: relaxed matches (if any) + trending + suggestion chips
        └─ error ──► E-04 (retry preserves query)
Back arrow at every step returns to the previous state exactly (URL contract PRD2 §2.3).
```

## 5. Flow F3 — Serendipitous browse (intent unknown)
```
Home ──► rail scroll (horizontal snap) ──► card tap ──► Watch
                                  └─► "View all" ──► listing ──► card ──► Watch
Drawer ──► Trending/New/Rising/Categories/Tags ──► listing ──► card ──► Watch
```
Loop rule: after a watch session ends (or ESC exits fullscreen), the Related rail is the primary continuation; back arrow returns to the originating listing *at previous scroll position*.

## 6. Flow F4 — Watch session (happy path)
```
Card tap ──► /watch/[slug]
  1. Stage reserved (16:9, zero CLS); poster + play affordance
  2. Tap ▶ ──► embed initializes (capability set drives chrome, GESTURES §2)
  3. View: milestones beacon (start/q25/q50/q75/end)
  4. Sideways exits:
      ├─ Related card ──► new watch (replace, history stack +1)
      ├─ Tag chip ──► /tags/[slug]
      ├─ Share ──► copy link (neutral clipboard title)
      ├─ Open at source ──► new tab, nofollow noopener noreferrer
      └─ Back arrow ──► originating listing (scroll restored)
  5. Failure at any point ──► E-07 ladder (Retry → Alternate → Open at source → Report)
```

## 7. Flow F5 — Report / takedown (compliance)
```
Watch page ▸ Report ──► modal (reason enum, details ≤1000, optional email)
  ├─ reason ∈ {copyright, underage, nc} ──► on submit: item auto-hidden pending review
  │        + CDN purge ≤60s + toast "TKN-XXXXXX recorded" + queue alert to admin
  ├─ reason ∈ {broken, wrong_meta} ──► queued to maintenance; item stays visible
  └─ validation error ──► inline field errors; submit disabled until valid
Admin side (A-08): queue ──► review (provenance + claim) ──► resolve:
  hide+block video │ block source-wide pattern │ note report-to-source │ reject+rationale
  ──► audit row + (if blocked) FR-8 sticky suppression on future syncs
```

## 8. Flow F6 — Error & recovery (universal ladder)
```
Any region fails ──► region-scoped error (E-04/E-07/E-01)
  1. Auto-retry: 1× silent (network-class only, 800ms)
  2. Manual Retry button ──► preserves all user state (query, form inputs, scroll anchor)
  3. Secondary path: related/parent content is always offered (never a dead end)
  4. Digest/reference surfaced for support correlation
Offline ──► E-05 banner + cached content; auto “Back online” toast + visible-data refresh.
```

## 9. Flow F7 — Admin: session
```
/admin/login ──► credentials ──► (ok) session cookie → /admin
                      └─ (fail) shake + error; 4th fail warning; 5th → 15-min lock (audit)
Idle 8h / 24h absolute ──► redirect to login, deep-link preserved post-auth.
Logout ──► session destroyed; drawer/back disabled into /admin (auth wall).
```

## 10. Flow F8 — Admin: source enablement (legal gate)
```
Sources (A-06) ──► "Enable source"
  ├─ terms not verified ──► blocked panel: requires reference URL + date + operator
  │        confirmation (checkbox: "Terms reviewed; embedding/aggregation permitted")
  └─ verified ──► enable ──► audit ──► optional "Run sync now" ──► sync_runs visible
```

## 11. Flow F9 — Admin: taxonomy gap triage (weekly rhythm)
```
Mappings (A-07) ──► Unmapped panel (top source terms by hit_count)
  ──► "Create rule" (target existing category/tag or quick-create)
  ──► apply retroactively (backfill job) ──► counts refresh ──► audit
```

## 12. Flow F10 — Moderation sweep (daily rhythm)
```
Dashboard (A-02) ──► queue-age alert if any >24h ──► Takedowns (A-08)
  ──► oldest first ──► resolve per F5 ──► verify public absence (row action "View public" → 404)
```

## 13. Navigation state machine (back-arrow semantics table)

| Screen | Back target (no history) | Notes |
|---|---|---|
| Home | — (arrow hidden) | — |
| Search | Home | Query preserved in URL |
| Category detail | /categories | — |
| Tag detail | /tags | — |
| Watch | Referring listing (state) else Home | Scroll restored |
| Legal/info | Home | — |
| 404/error/offline | Home | Via buttons (no auto-redirect) |
| Admin sections | /admin | Login wall guards all |
| Admin login | — (arrow hidden) | — |

## 14. Session & privacy micro-flows
- Discreet thumbnails toggle (drawer footer): persists localStorage only; takes effect instantly (veil class toggle, no reload).
- Clear session traces (drawer footer): wipes `sy_sid` + queued beacons + local hide-list → new session id; confirmation toast.
- Tab-mask: on `visibilitychange→hidden` from any watch page, `document.title` = “SYCONIA — The Beauty of the Inward Experience”; restored on focus.

## 15. Analytics checkpoints per flow
F1 `age_ack` · F2 `search_submit`, `suggest_select{type}`, `filter_apply` · F3 `rail_impression`, `card_open{rail}` · F4 `watch_*` quartiles, `player_error` · F5 `report_open/submit{reason}` · F8–F10 admin actions (via audit_log, not events). All anonymous; no cross-site identifiers (SECURITY §12).
