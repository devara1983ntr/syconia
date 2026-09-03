# SYCONIA — Screen-by-Screen UI/UX Specification

| Field | Value |
|---|---|
| Document | SCREENS.md · v1.0.0 · 2026-09-03 |
| Status | All screens `[REQUIRED]` (no UI code exists yet). Layouts reference DESIGN-SYSTEM.md tokens; flows reference UX-FLOWS.md; states reference ERROR-STATES.md. |
| Viewports | Mobile 320–479 · Phablet 480–767 · Tablet 768–1023 · Desktop 1024–1535 · Wide ≥1536 (design tokens scale fluidly; all layouts are mobile-first) |

Standard per-screen guarantees (apply to every screen below unless overridden): top-left **back arrow** on any non-root page (behavior: `history.back()` when an in-app entry exists, else route to the logical parent, else Home; `aria-label="Back"`; hidden on Home); **three-line hamburger** always visible left of (or replacing) the back arrow, opening the global drawer (S-00); header search present on every public screen; every async region implements the four states (skeleton / empty / error / offline) per ERROR-STATES.md; every interactive element ≥44×44px, visible focus ring (`--color-focus`), and full keyboard operation; page transitions: fade 180ms + 8px slide-up (reduced-motion: instant); toasts bottom-center (mobile) / bottom-right (desktop), 4s, dismissible, `role="status"`.

---

## S-00 — Global chrome (header, drawer, footer, overlays)

- **URL/Route:** every public route (`(public)` layout).
- **Purpose:** orientation, navigation, search access, brand presence, legal footing.
- **Desktop layout:** sticky header 64px: [hamburger | back-arrow*] [wordmark] … [search field 320px] [theme-neutral icons: shortcuts “?”]. Footer 3 columns (Discover links / Legal links / brand statement + “Crafted by Roshan” + © 2026 SYCONIA).
- **Tablet layout:** header 60px, search collapses to icon → expands overlay field.
- **Mobile layout:** header 56px: [hamburger] [back-arrow*] [symbol-only emblem centered] [search icon]. Footer single column, accordioned legal.
- **Hamburger menu:** three-line icon (2px strokes, 18×14px, gold on hover) → drawer slides from left (width 88vw max 320px, 260ms cubic-bezier(0.22,1,0.36,1)), Obsidian @96% + 12px blur (the *only* glass surface besides player chrome), scrim 40%. Contents (order): Search field → DISCOVER (Home, Trending, New, Rising) → BROWSE (Categories ▸, Tags ▸, expandable groups) → INFORMATION (About, Contact) → LEGAL (Terms, Privacy, DMCA, 2257, Cookies) → footer: session controls (Discreet thumbnails toggle, Clear session traces) + credit. Active route highlighted (Ostiole Gold 2px left rail). Close: X button, scrim tap, ESC, swipe-left; focus returns to hamburger.
- **Navigation hierarchy:** 3 levels max: drawer → listing → detail; watch page is always depth-2 from something.
- **Notifications:** global toast region + drawer badge dot when a `[PROPOSED]` system notice exists (v1: only error/offline toasts).
- **Keyboard:** `/` focuses search; `?` opens shortcuts overlay; ESC closes topmost layer; tab order visual order; skip-link “Skip to content” first.
- **Touch:** swipe-right from left edge (24px) opens drawer on mobile; swipe-left closes; drawer items 48px tall.
- **Transitions:** drawer slide; header background opacity 72%→96% on scroll >8px; hide-on-scroll-down/show-on-up on mobile (8px threshold, never while drawer/search open).
- **Accessibility:** all landmarks (`header/nav/main/footer`), `aria-current="page"` on active nav, drawer `role="dialog" aria-modal`, focus trap, `inert` background.
- **Offline:** header shows persistent slim banner “Offline — showing cached pages” (E-05).

## S-01 — Age Gate

- **URL/Route:** interstitial overlay over target route (no separate URL; deep-link preserved).
- **Purpose:** 18+ legal access control (PRD F-01); first brand impression.
- **Layouts (all viewports — identical centered composition):** Obsidian full-screen; symbol-only emblem (breathing 4s scale 1→1.03 loop — disabled under reduced-motion); serif headline “A private world awaits.”; sub-copy “You must be 18 or older to enter SYCONIA.”; body “By entering you confirm your age and agree to our Terms.”; primary button **I am 18 or older — Enter** (Ostiole Gold fill, Obsidian text) / secondary **Leave site** (ghost) / text link Terms of Service.
- **Behavior:** server-rendered when age cookie absent — content never ships. Enter → set cookie+localStorage, fade-out 240ms, reveal app, route intact. Leave → neutral external redirect. Terms link opens in new tab (the only pre-gate action).
- **Keyboard:** focus moves into dialog on load; Enter key activates focused control; trap enforced.
- **Touch:** large targets (56px buttons), no hover dependencies.
- **Error:** none possible client-side (static); Terms load failure → inline “Open Terms in a new tab” retry link.
- **Responsive breakpoints:** emblem `clamp(96px,18vw,160px)`; buttons full-width ≤420px, inline ≥421px.
- **A11y:** `role="alertdialog"` labelled “Age verification”; contrast: Alabaster text on Obsidian (19.5:1), button Obsidian-on-Gold (≥4.5:1 verified in DESIGN-SYSTEM §5).

## S-02 — Home / Discovery

- **URL/Route:** `/`
- **Purpose:** storefront; instant cinematic discovery (PRD F-03).
- **Desktop layout:** 12-col grid, max-w 1440. Hero: editorial split — left: serif headline + featured meta + CTA “Watch”; right: featured thumbnail (blurred until hover). Below: full-width rails as rows of 6 cards; rail header (serif 20px + “View all →”).
- **Tablet:** hero stacks (media above, text below); rails 4-across, horizontally scrollable with edge-fade.
- **Mobile:** hero 16:9 media with bottom gradient + overlay text; rails: horizontal scroll-snap rows of 1.4-card-width cards; pull-to-refresh `[PROPOSED]`.
- **Cards/grids:** VideoCard (DESIGN-SYSTEM §13): 16:9 thumb, duration badge bottom-right (Obsidian 80% pill, Alabaster mono digits), title 2-line clamp, source badge, relative time. Grid columns: 2/3/4/5/6 per viewport class. Hover (fine pointer): scale 1.02, veil lifts, title underlines; focus-visible: same via keyboard.
- **Buttons/menus:** rail overflow menu (⋯): “Hide this video” (local-only hide list `[PROPOSED]`), “Copy link”, “Report” — bottom sheet on mobile, dropdown on desktop.
- **Notifications:** toast on copy-link success.
- **Sorting:** rails have fixed semantics (PRD2 §2.2); “View all” targets pre-sorted listings.
- **Pagination:** rails are bounded (24 items); “View all” pages use infinite scroll + Load more (S-03 pattern).
- **Loading:** hero + first rail SSR; below-fold rails stream with exact-geometry skeletons (card-shaped, shimmer 1.6s, staggered reveal 40ms/card).
- **Empty (cold catalog):** editorial empty state E-02: emblem line-art, serif “The gallery is being curated.”, CTA to Categories.
- **Error:** rail-level retry chip; page-level E-01 after 2 failed retries.
- **Offline:** cached shell + banner; rails show last-good data with stale timestamp.
- **Keyboard:** cards tabbable in DOM order; rail group arrow-key scroll; Enter opens.
- **Touch:** horizontal swipe rails with scroll-snap; tap opens (first tap on veiled thumb lifts veil only on `discreet_thumbs=on`).
- **Transitions:** card→watch: shared-element thumbnail expand (motion layout, 280ms; reduced-motion: fade).
- **Analytics:** `rail_impression`, `card_open{rail}`, hero CTA.

## S-03 — Search Results

- **URL/Route:** `/search?q=&cat=&tag=&src=&dur=&sort=`
- **Purpose:** intent → content matching (PRD F-04).
- **Header/search:** sticky sub-header with the query in an editable field (re-submit updates URL); result count + active filter chips (removable).
- **Desktop layout:** left FilterBar (240px): Category (list, counts), Tags (top 20 + search-in-tags), Source, Duration buckets; main: sort bar (Relevance/Newest/Longest/Most watched — segmented control) + 4-col grid.
- **Tablet:** FilterBar collapses to “Filters (n)” button → right sheet.
- **Mobile:** full-screen filter bottom sheet; grid 2-col; sort bar horizontal-scroll chips.
- **Autocomplete (in header field, all screens):** combobox dropdown — grouped: Queries (trending/typed), Titles (thumb+title), Categories, Tags (chips); 8 max; keyboard navigable; submit on Enter/select.
- **Pagination:** infinite scroll + Load more (PRD2 §2.1), cursor-based, announcements “12 more videos loaded”.
- **Loading:** field keeps text; grid skeleton 12 cards; filters reflect instantly (client state) with server confirmation.
- **Empty:** E-03 — “Nothing matched ‘{q}’.” + relaxed-match attempt results if any + Trending rail + “Try:” suggestion chips.
- **Error:** E-04 pattern with query preserved in field.
- **Offline:** banner + cached results if any.
- **Keyboard:** `/` focuses search from anywhere; ESC clears; results grid arrow-key 2D traversal `[PROPOSED]` (v1: tab order).
- **Touch:** pull-down on grid focuses search field; chips swipe-dismissible.
- **Transitions:** dropdown 140ms fade+slide 4px; filter apply → grid cross-fade 200ms (no full-page flash).
- **URL contract:** full state round-trip; back/forward restores state + scroll (UX-FLOWS §4).

## S-04 — Categories Index

- **URL/Route:** `/categories`
- **Purpose:** browse the curated taxonomy.
- **Desktop:** 4-col editorial cards: brand-styled hero (optional per category; default = generated Obsidian/emerald abstract from token palette — never explicit art), serif category name, one-line description, video count.
- **Tablet:** 3-col → 2-col. **Mobile:** 2-col → 1-col list with 64px thumbs.
- **Search:** header search (categories suggested inline when name matches).
- **Sorting:** admin-defined `sort_order` (curated, not user-sorted); A–Z toggle available.
- **States:** skeleton grid; empty (no visible categories) → E-02 variant; error/offline standards.
- **Keyboard/touch/a11y/transitions:** whole card is one link; staggered fade-in; counts in `aria-label` (“Drama — 1,240 videos”).
- **Back arrow:** → Home (or history).

## S-05 — Category Detail

- **URL/Route:** `/categories/[slug]`
- **Purpose:** focused listing within one taxonomy node.
- **Layouts:** hero band (name, description, count, curated hero) + grid identical to S-03 main area; FilterBar reduced to Duration + Sort (category fixed).
- **Sorting:** full sort set (PRD2 §2.2). **Pagination:** infinite + Load more.
- **Sub-navigation:** breadcrumb Home / Categories / {Name} (aria-labelled, schema.org BreadcrumbList).
- **States:** as S-03; empty category → E-02 variant “This gallery is being curated — explore Trending”.
- **Keyboard/touch:** grid tab order; pull-to-refresh `[PROPOSED]`.
- **Back arrow:** → `/categories` (or history).
- **Transitions:** shared hero from index card `[PROPOSED]`; standard otherwise.

## S-06 — Tags (index + detail)

- **URL/Route:** `/tags`, `/tags/[slug]`
- **Purpose:** long-tail discovery; SEO surface.
- **Index layout:** search-in-tags field + featured tags (pill row) + alphabetical section list with counts (desktop 3-col, mobile 1-col with sticky letter headers).
- **Detail layout:** compact header (tag chip + count) + S-03 grid minus category filter; related-tags row (co-occurrence top-8).
- **Sorting/Pagination/States:** as S-05. **Back arrow:** index → Home; detail → `/tags`.
- **Keyboard:** letters jump sections (typeahead on list).

## S-07 — Watch / Player

- **URL/Route:** `/watch/[slug]`
- **Purpose:** the core experience (PRD F-07/F-08; full interaction model in GESTURES.md).
- **Desktop layout:** player stage centered (max-w 1280, 16:9, letterboxed, Obsidian matte, SYCONIA watermark 128px @20% bottom-right); below: two-column — left: title block, meta row, tags, description; right (rail): Related (vertical list 6 + “More”); theater mode collapses to single column with stage at 92vw.
- **Tablet:** single column; related below metadata.
- **Mobile:** stage sticky-top on scroll-down (collapsed 16:9 mini-player `[PROPOSED]`); metadata stacked; related horizontal snap row.
- **Stage chrome (ours):** before-init poster (thumb + centered Ostiole play affordance); loading ostiole pulse; capability-driven control bar **only if** adapter declares `player_api` delegation — otherwise native source controls + our corner overlay: [fullscreen] [theater] [open-at-source] [report] [watermark].
- **Meta row:** provenance chip “Provided by {source}” (→ source page, `nofollow noopener`), publish date, view count (approx, formatted), **Report** button (opens S-07R modal: reason select, details textarea, optional email, submit → toast “Reference TKN-XXXXXX recorded”).
- **Tags:** chips → tag detail. **Description:** collapsed 3 lines + “More”.
- **Related:** same category → same tags → trending fill (PRD2); card = compact VideoCard.
- **Menus/buttons:** share (copy link, neutral preview note), report, open-at-source (external icon).
- **Notifications:** player failure overlay E-07 ladder (Retry → Alternate → Open at source → Report); source-wide degradation chip.
- **Loading:** stage reserves exact 16:9 (zero CLS); metadata skeletons (title bar 60%, meta row, 3 tag chips).
- **Empty:** video hidden/unavailable → E-06 “This selection is no longer available” + related suggestions (never a dead end).
- **Offline:** stage disabled with E-05 inline + cached metadata.
- **Keyboard:** F fullscreen · T theater · ESC exit fullscreen/close overlays · M mute *if delegated* · player-native keys otherwise (GESTURES §5).
- **Touch:** tap stage toggles controls (source player) / our overlay buttons 44px; double-tap far-left/right seek ±10s *if delegated*; swipe-down on fullscreen exits (GESTURES §3).
- **Orientation:** rotating to landscape in fullscreen-eligible state offers fullscreen (system-backed; iOS falls back to source player behavior — documented divergence, GESTURES §7).
- **Transitions:** entrance: stage fade + metadata slide-up 240ms; related cards stagger.
- **A11y:** stage `role="region" aria-label`; report modal dialog (focus trap, ESC, labelled); watermark `aria-hidden`; autoplay muted-only (policy GESTURES §8).
- **Security:** iframe sandbox/allowlist (ARCHITECTURE §6); report CSRF; no media on our origin.
- **Analytics:** `watch_start`, quartiles, `player_error{source,code}`, `report_open/submit`, related CTR.

## S-08 — Legal / informational pages

- **URL/Route:** `/legal/terms`, `/legal/privacy`, `/legal/dmca`, `/legal/2257`, `/legal/cookies`, `/about`, `/contact`
- **Purpose:** compliance surfaces with real, reviewed copy (content requirements: docs/LEGAL-COMPLIANCE.md; no lorem, no stubs — copy is a M1 deliverable with legal review).
- **Layout (all viewports — single readable column, max-w 720):** serif H1 + effective date; prose in sans 16–17px/1.7; section anchors sidebar on desktop (sticky TOC); last-updated stamp.
- **Contact:** structured channels (abuse, legal/DMCA, privacy, general) as definition list + form (subject enum, message ≤2000, email optional) → `/api/report`-style handler with rate limit.
- **States:** static pages (no skeletons needed); form has validation, inline errors, success panel with reference code.
- **Back arrow:** → Home. **Keyboard/a11y:** standard prose semantics; anchors focusable; TOC `nav` labelled.
- **SEO:** `noindex` optional per page policy (SEO.md §6); 2257 + DMCA indexed.

## S-09 — 404 Not Found

- **URL/Route:** any unmatched path (`not-found.tsx`).
- **Purpose:** graceful dead-end recovery.
- **Layout (all viewports):** centered emblem line-art, serif “Lost in the bloom.”, copy “The page you seek doesn’t exist — or has drifted beyond the garden.”, buttons: Home / Search; below: 8 trending cards.
- **Behavior:** keeps header chrome; logs `nav_404{path}` (aggregate); suggest-corrected slug when trigram-close match exists (“Did you mean /watch/…?” chip).
- **A11y/keyboard/transitions:** as standard; no auto-redirect (user-controlled).

## S-10 — Global error (500)

- **URL/Route:** `error.tsx` / `global-error.tsx` fallbacks.
- **Layout:** same composition as S-09 with copy “Something interrupted the moment.” + Retry (revalidates route) + Home; error digest shown small (correlates with `requestId` log).
- **Behavior:** boundary-scoped (only failed region where possible); retry preserves form inputs where safe; `client-error` beacon with digest.

## S-11 — Offline / connection lost

- **URL/Route:** `/offline` + inline banners.
- **Layout:** emblem, “You’re offline.”, copy “Previously visited pages remain available.”, list of last-visited cached routes (from client history), Retry connection button (listens `online` event).
- **Behavior:** service-worker-free in v1 (banner-based); automatic recovery toast “Back online” + refresh of visible data.

---

# Admin panel (`/admin` — authenticated, noindex, P2)

Common admin shell: left sidebar nav (collapses to icons ≤1024px, bottom tab bar on mobile), top bar (section title, admin identity, logout), data tables (dense, sans, 13–14px) with column sort, server-driven pagination (numbered, 25/page — cursor under the hood), global search per section, action confirmation modals for destructive ops, every table row action audited. Admin theme: same tokens; surfaces `--color-surface` on Obsidian; semantic status colors per DESIGN-SYSTEM §6.

## A-01 — Admin Login
- **Route:** `/admin/login`. Centered card: username, password (show/hide), submit; lockout messaging after 4 failures (“Final attempt before a 15-minute lock”); rate limit 5/15min; session 8h idle/24h absolute; audit `auth.login/auth.fail`. A11y: errors `aria-live`, caps-lock hint, autocomplete attributes. Back arrow: none (root of admin).

## A-02 — Admin Dashboard
- **Route:** `/admin`. KPI cards (Sessions 24h, Watches 24h, Search zero-result %, Takedown queue age); Source health table (state chip closed/open/half-open, last sync, freshness lag); recent `sync_runs`; quick actions (Run sync, Review queue). Data: 30s cache; refresh button; sparkline `[PROPOSED]`. Empty (no data yet): honest zeros + “Awaiting first sync” status — never fabricated numbers.

## A-03 — Admin Videos
- **Route:** `/admin/videos`. Filters: text (title/slug), source, category/tag, visibility (visible/hidden/hidden-reason), availability; columns: thumb (64px), title, source, duration, published, views, flags, actions. Row actions: Hide (reason modal: admin/policy), Unhide, Resync, View public, Copy slug. Bulk: none in v1 (deliberate safety). Drawer detail: full metadata, mapping trace (which rules attached taxonomy), sync history, takedown history. Pagination numbered; states standard; audit on every mutation.

## A-04 — Admin Categories · A-05 — Admin Tags
- **Routes:** `/admin/categories`, `/admin/tags`. CRUD tables (create modal: name/slug auto-suggest/description/sort/visible; edit inline-safe; delete = soft-hide + confirm; tags support merge flow with alias preview and re-mapped counts). Validation mirrors DATABASE §2.3/2.4; audit `category.*`, `tag.*`.

## A-06 — Admin Sources & Adapters
- **Route:** `/admin/sources`. Cards per source: manifest summary (hosts, capabilities), enable/disable (requires `terms_verified_at` set — UI blocks otherwise with explanatory panel + reference URL field), breaker state with manual reset, last sync stats, “Run sync now”. Danger zone: disable source (reversible). Audit `source.update`.

## A-07 — Admin Mapping Rules
- **Route:** `/admin/mappings`. Table: source, direction (category/tag), pattern, target, priority, active, hits. Create/edit modal with regex tester (sample-match preview against recent unmapped terms); toggle active; delete. Unmapped-terms panel: top unmapped source terms with one-click “Create rule →” targeting. Audit `mapping.*`.

## A-08 — Admin Takedowns & Blocks
- **Route:** `/admin/takedowns`. Queue table: status filter (new/under_review/actioned/rejected/escalated), age (SLA color: amber >24h, red >36h), reason, reporter contact, claimed URL, video thumb. Resolve modal: action (hide + block video / block source-wide pattern / report-to-source note / reject with rationale), notes; auto-purge CDN tags; writes `blocked_entries` when blocking. Tabs: Requests / Blocks (manage suppression records). Audit `takedown.resolve`, `block.*`.

## A-09 — Admin Settings
- **Route:** `/admin/settings`. Typed form groups: Age gate copy variant; Discreet thumbnails default; Trending weights (validated 0–1, sum hint); Retention days (30–180); Maintenance mode (+ message, timed); Feature flags (suggest, infinite scroll); Danger zone: trigger rollup, purge caches. All writes audited; kill-switches effective ≤120s.

## A-10 — Admin Audit Log
- **Route:** `/admin/audit`. Read-only table: time, admin, action (whitelist API.md §8), entity, diff (expandable JSON view), requestId. Filters: admin, action, entity, date range. Export CSV (rate-limited). No edit/delete path in UI or API (append-only DB grant).

---

## Cross-screen interaction matrix (normative summary)

| Interaction | Behavior (all screens) |
|---|---|
| Back arrow | Top-left; history-back → parent → Home; hidden on Home |
| Hamburger | Always available; drawer per S-00 |
| Route transition | 180ms fade + 8px slide; reduced-motion: none |
| Toasts | Bottom-center (m)/bottom-right (d); 4s; dismissible; never stacked >3 |
| Modals | Centered (d) / bottom-sheet (m ≤767px); scrim 40%; focus trap; ESC |
| Skeletons | Exact target geometry; shimmer 1.6s; ≤3 per region |
| Empty states | Branded (emblem line-art + serif line + one CTA); never blank |
| Error states | Code-correlated digest + Retry + safe exit; E-XX catalogue |
| Offline | Persistent slim banner + per-region inline fallbacks |
| Focus | 2px Ostiole ring + 2px Obsidian offset, always visible |
| Touch targets | ≥44×44px (controls), ≥48px (nav rows) |
| Text scale | Usable to 200% zoom; no horizontal scroll (WCAG 1.4.10) |

## Responsive breakpoints (canonical — shared with DESIGN-SYSTEM §8)
`320 · 480 · 768 · 1024 · 1280 · 1440 · 1920+` (px, min-width); fluid type/spacing between steps; grids per S-02; images `sizes`-correct; no horizontal overflow at any width (tested at 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 — TESTING §8).
