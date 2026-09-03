# SYCONIA — Product Requirements Document (Master PRD)

| Field | Value |
|---|---|
| Project | SYCONIA — premium adult media discovery & streaming platform |
| Document | PRD.md (master product requirements) |
| Version | 1.0.1 — Documentation QA Audit |
| Date | 2026-09-03 |
| Product owner | Roshan (developer & credit holder) |
| Status legend | `[EXISTING]` verified present in repository · `[REQUIRED]` must be implemented · `[PROPOSED]` approved future phase · `[CONFLICT]` documented conflict, see §17 |

Companion documents: [PRD2.md](./PRD2.md) (advanced specification), [SCREENS.md](./SCREENS.md), [UX-FLOWS.md](./UX-FLOWS.md), [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md), [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 1. Executive summary

SYCONIA (pronounced *sy-COHN-ee-uh*, from *syconium*, the enclosed fig structure) is a premium, dark-themed, **adult video discovery and streaming platform**. The product differentiates itself from conventional "tube" sites through an editorial, cinematic, discreet brand experience — *"The Beauty of the Inward Experience."*

The platform does **not** produce, host, upload, or store any video files. All playback is delivered through **official embed players and public APIs of approved third-party sources** (adapter architecture, see [API.md](./API.md)). SYCONIA stores only normalized metadata (title, duration, thumbnail URL, embed reference, taxonomy) in PostgreSQL and renders a premium discovery, search, and watching experience around it.

Core product pillars:

1. **Discreet premium identity** — the SYCONIA brand system (Night Emerald / Obsidian Black / Ostiole Gold / Champagne Gold / Alabaster) applied with editorial restraint.
2. **Frictionless access** — no accounts, no login, no signup, no payments, no premium tiers. An anonymous 18+ age gate is the only barrier.
3. **Fast discovery** — trending rails, semantic search with autocomplete, curated categories and tags, infinite-scroll feeds.
4. **Excellent playback UX** — a branded shell around third-party embed players: gestures, keyboard shortcuts, buffering/source-failure handling, privacy/discretion features.
5. **Operator-grade admin panel** — metadata cache management, taxonomy governance, source health, DMCA/takedown workflow, audit log.

Implementation status: **the repository currently contains brand assets and this documentation suite only.** Every application feature below is `[REQUIRED]` unless explicitly marked otherwise. No feature may be described as existing until verified in code.

---

## 2. Brand foundation (summary — normative detail in DESIGN-SYSTEM.md)

- Name: **SYCONIA** (official spelling; never "Syconia Media", "Syconia Technologies" in product UI).
- Tagline: *The Beauty of the Inward Experience.* Secondary narrative: *Where Intimacy Blooms.*
- Concept: *The Inward Bloom* — outside: restraint, elegance, mystery; inside: discovery, beauty, intimacy.
- Palette: Night Emerald `#012A21`, Obsidian Black `#09090B`, Ostiole Gold `#C5A059`, Champagne Gold `#E6D3A0`, Alabaster `#FAF9F6`.
- Logo: official emblem + wordmark assets supplied in `/branding/` (primary, symbol-only, monochrome light, favicon 16–32px, app icon 512px, watermark 128px @20% opacity). The logo must never be recreated as an approximation while official assets exist.
- Clear space: 4× the diameter of the central ostiole dot on all sides.
- Voice: intelligent, confident, concise, sophisticated, human, editorial. No clickbait, no vulgar promotional language.
- Source of truth for branding: `/uploads/syconia-brand-guidelines.pdf` (v1.0, Sept 2026) — **except** its "Corporate Decoy" section, which is rejected; see §17 conflict C-2 and [docs/LEGAL-COMPLIANCE.md](./docs/LEGAL-COMPLIANCE.md).

## 3. Product scope

### 3.1 In scope `[REQUIRED]`

- Public website: age gate, home/discovery, search, categories, tags, watch page, legal pages.
- Video playback via approved third-party embed players only (never proxied or downloaded).
- Metadata ingestion pipeline (adapters + normalization + PostgreSQL cache) for approved sources.
- Taxonomy system: admin-managed categories, tags, and source→local mapping rules.
- Anonymous, privacy-preserving first-party analytics (trending, admin dashboards).
- Admin panel (authenticated) with full operations tooling and audit log.
- Dark/night theme only; responsive 320px → 1920px+; HTTPS only.
- SEO fundamentals, WCAG 2.2 AA target, Core Web Vitals budgets, CI/CD, E2E tests, pre-release gates.

### 3.2 Explicitly out of scope (product decisions, permanent for v1)

- ❌ User registration, login, signup, email/password, Google/social login — **none**.
- ❌ Payments, subscriptions, premium tiers, paywalls, billing — **none**.
- ❌ Creator studio, uploader, studio pages, creator analytics — **none**.
- ❌ Public developer API — **none** (internal API only).
- ❌ Local video file storage, transcoding, downloading, or stream proxying.
- ❌ Comments, messaging, follows, social features.
- ❌ Light theme (dark/night only; light theme is a `[PROPOSED]` future token-level capability, never a v1 screen).

### 3.3 `[PROPOSED]` phase-2 candidates (not in v1 scope, pre-approved direction)

- On-device (localStorage) watch history and favorites with zero server sync.
- Collections/curated playlists (non-premium).
- Installable PWA with offline shell.
- Optional jurisdiction-aware age-verification provider hook (see docs/LEGAL-COMPLIANCE.md).
- Seasonal campaign theming via design tokens (no component changes).

## 4. Personas

| Persona | Device | Needs | Success looks like |
|---|---|---|---|
| **The Discreet Viewer** | Mobile (iOS/Android Chrome/Safari), evening | Fast, private, tasteful experience; no traces; no popups | Age gate once; instant playback; blur-until-tap discretion mode on thumbnails; history-less browsing |
| **The Binge Browser** | Desktop Chrome/Firefox | Long sessions, keyboard-driven, dense grids | Instant search, keyboard player shortcuts, infinite scroll without jank |
| **The Operator (Admin/Roshan)** | Desktop | Keep catalog fresh, sources healthy, takedowns processed | Dashboard with source health; one-screen takedown action; full audit trail |

## 5. Legal & compliance requirements (normative detail: docs/LEGAL-COMPLIANCE.md)

- **Age gate `[REQUIRED]`** — 18+ self-certification interstitial before any content renders; remembered per device (cookie + localStorage, 12 months). Server-enforced: content APIs reject requests without the age-verified cookie.
- **Source legality** — only sources offering official embed/API programs may be enabled; each source's terms must be verified and recorded in the admin Sources screen before activation. No scraping that violates a source's terms; no circumvention of source controls.
- **Takedown workflow `[REQUIRED]`** — public report/dispute path on every watch page; DMCA designated-agent page; admin takedown queue with SLA; hidden entries remain suppressed and are re-blocked on re-sync.
- **2257 / content provenance** — SYCONIA stores no media and produces no content; watch pages display provenance ("provided by \<source\>") and link to the source's own compliance/2257 statement where available.
- **Prohibited content policy** — zero tolerance policy documented and enforced operationally (admin blocks + source reporting); no content that is unlawful, involves minors, or is non-consensual, per the prohibited-content policy in docs/LEGAL-COMPLIANCE.md.
- **Truthful representation** — business/legal descriptions (company registration, processors, footers) must accurately describe the service. The brand-guidelines "Corporate Decoy" strategy is explicitly rejected (conflict C-2, §17).
- **Privacy** — no accounts, minimal first-party analytics, no third-party trackers, IPs truncated/never stored in full, DNT respected. See [SECURITY.md](./SECURITY.md) §12.

## 6. Feature catalogue

| ID | Feature | Status | Epic |
|---|---|---|---|
| F-01 | 18+ Age gate (overlay + server enforcement) | `[REQUIRED]` | Access |
| F-02 | Global chrome: header, search bar, hamburger drawer, back arrow, footer | `[REQUIRED]` | Navigation |
| F-03 | Home / discovery rails (Trending Now, New, Most Watched, Rising) | `[REQUIRED]` | Discovery |
| F-04 | Search: full-text, typo-tolerant, autocomplete, zero-query trends | `[REQUIRED]` | Discovery |
| F-05 | Categories: index + detail pages, admin CRUD, mapping rules | `[REQUIRED]` | Taxonomy |
| F-06 | Tags: index + detail pages, admin CRUD | `[REQUIRED]` | Taxonomy |
| F-07 | Watch page: branded shell, embed player, metadata, provenance, related rail | `[REQUIRED]` | Playback |
| F-08 | Player interaction model (gestures, keyboard, buffering, failure, fallback) | `[REQUIRED]` | Playback |
| F-09 | Report / takedown request entry point | `[REQUIRED]` | Compliance |
| F-10 | Legal pages: Terms, Privacy, DMCA, 2257 statement, Cookies, About, Contact | `[REQUIRED]` | Compliance |
| F-11 | Ingestion pipeline: adapters, normalization, sync scheduler, availability checks | `[REQUIRED]` | Platform |
| F-12 | Anonymous analytics (watch events, search queries, daily rollups) | `[REQUIRED]` | Platform |
| F-13 | Admin panel: auth, dashboard, videos, categories, tags, sources, mappings, takedowns, settings, audit log | `[REQUIRED]` | Operations |
| F-14 | State system: loading skeletons, empty, error, offline states everywhere | `[REQUIRED]` | Quality |
| F-15 | Accessibility (WCAG 2.2 AA), reduced motion, keyboard operability | `[REQUIRED]` | Quality |
| F-16 | SEO: metadata, canonicals, sitemaps, robots, structured data | `[REQUIRED]` | Growth |
| F-17 | Performance budgets & Core Web Vitals enforcement | `[REQUIRED]` | Quality |
| F-18 | CI/CD pipeline with quality gates (incl. no-placeholder-code gate) | `[REQUIRED]` | Engineering |
| F-19 | On-device favorites & watch history | `[PROPOSED]` | Discovery |
| F-20 | Collections / curated playlists | `[PROPOSED]` | Discovery |
| F-21 | PWA offline shell | `[PROPOSED]` | Platform |

## 7. Major feature specifications

> Each feature below follows the full mandated template. Screen-level layouts live in [SCREENS.md](./SCREENS.md); flows in [UX-FLOWS.md](./UX-FLOWS.md).

### 7.1 F-01 — Age Gate

- **Purpose:** legal access control; establish the discreet, intentional tone of the brand from the first pixel.
- **User value:** one-tap, remembered confirmation; adult users never see the barrier again on that device.
- **Preconditions:** none (first visit, or expired/absent `sy_age_ok` cookie).
- **Entry points:** any route; the overlay renders above the app before content hydrates. Direct deep-links preserve the target URL through the gate.
- **UI/UX behavior:** full-screen Obsidian overlay with centered symbol-only emblem, serif headline ("You must be 18+ to enter"), two buttons (Enter / Leave), link to Terms. Content beneath is not rendered (server-checked cookie; no content API responses without it).
- **User actions:** “I am 18 or older — Enter”; “Leave site” (redirects to a neutral external page); view Terms.
- **System response:** Enter → sets `sy_age_ok=1` HttpOnly cookie (12 months) + localStorage mirror, logs an anonymous `age_ack` event, reveals app with a fade-in; Leave → `window.location` to neutral page; no content ever shipped to the client before Enter.
- **Conditional logic:** cookie present & valid → skip entirely (server-side, zero flash). Cookie malformed → treat as absent.
- **Validation:** none beyond the affirmation itself; server trusts only the signed cookie, never client state.
- **Loading/empty/error:** overlay is static and instant; if Terms fetch fails, inline retry link.
- **Accessibility:** focus trapped in overlay; buttons are real `<button>`s; ESC does not dismiss; announced as a dialog (`role="alertdialog"`); contrast AA on all text.
- **Responsive:** identical centered layout 320px→1920px; buttons stack below 420px; emblem scales via `clamp()`.
- **Security:** HttpOnly + Secure + SameSite=Lax cookie; prevents content API access without it (middleware); no PII collected.
- **Performance:** zero JS beyond the minimal gate island (~<10KB); no images except emblem SVG/PNG (≤8KB).
- **Analytics:** `age_ack` event (count only, no identifiers).
- **Dependencies:** global middleware `[REQUIRED]`.
- **Acceptance criteria:** (1) With no cookie, no route returns content HTML. (2) After Enter, all routes accessible. (3) Cookie expiry re-triggers gate. (4) Keyboard-only users can pass. (5) E2E proves content APIs 403 without the cookie.

### 7.2 F-02 — Global chrome (header, hamburger drawer, back arrow)

- **Purpose:** consistent, quiet navigation across all public screens.
- **User value:** predictable orientation; one-gesture access to everything; safe, reversible navigation.
- **Preconditions:** age gate passed.
- **Entry points:** every public page.
- **UI/UX behavior:** sticky translucent header (restrained glass: blur 12px, Obsidian @ 72% opacity): left — back arrow on pages deeper than home (top-left, per platform convention) and hamburger (three-line) button; center/left-of-actions — SYCONIA wordmark (symbol-only below 480px); right — search icon (expands inline on mobile), theme is fixed dark. Hamburger opens the left slide-in drawer: Discover, Trending, New, Categories (expandable), Tags, About, Legal links, developer credit "Crafted by Roshan".
- **User actions:** tap back (history-back if entry exists, else route to parent), open/close drawer (tap, ESC, swipe-left to close on touch, focus-return to hamburger), navigate to any drawer destination, focus search.
- **System response:** drawer slides in 260ms with scrim; body scroll locked; route changes close drawer first, then navigate with page transition (fade/slide per DESIGN-SYSTEM §9); back arrow behavior defined per screen in SCREENS.md.
- **Conditional logic:** back arrow hidden on Home; drawer active-section highlighting; search icon becomes inline field on mobile (header height preserved).
- **Validation:** n/a. **Loading:** drawer content static-instant; nav prefetch on hover/intent.
- **Empty/error:** if prefetch of a nav target fails, navigation proceeds and the target page renders its own error state (ERROR-STATES.md).
- **Accessibility:** hamburger is `aria-expanded`/`aria-controls`; drawer is a labelled dialog with focus trap; ESC closes; back arrow has `aria-label="Back"`; skip-to-content link first.
- **Responsive:** ≥1024px optional persistent sidebar `[PROPOSED]`; drawer default on all sizes in v1 (consistent mobile-first identity).
- **Security:** no tokens in drawer; links are internal routes only (rel enforcement).
- **Performance:** header shell server-rendered; drawer client island, motion on transform/opacity only; respects `prefers-reduced-motion`.
- **Analytics:** `nav_drawer_open`, `nav_back_used`, destination taps.
- **Dependencies:** design tokens, motion library (`motion/react`).
- **Acceptance criteria:** drawer opens/closes ≤16ms input latency; focus never lost; all routes reachable from drawer in ≤2 taps; E2E covers open→navigate→back on mobile & desktop viewports.

### 7.3 F-03 — Home / Discovery

- **Purpose:** the storefront: instant, cinematic entry into the catalog.
- **User value:** zero-thought content discovery; a beautiful, calm grid instead of aggressive tube-site clutter.
- **Preconditions:** age gate passed; catalog populated (otherwise curated empty state, see ERROR-STATES.md).
- **Entry points:** `/` (default), drawer "Discover", logo tap, back-arrow fallthrough.
- **UI/UX behavior:** editorial hero (serif headline, featured item with blurred-until-hover/press thumbnail treatment), then rails: Trending Now · New Releases · Most Watched (7d) · Rising; each rail horizontally scrollable on mobile, grid-integrated on desktop; rail headers link to full listings. VideoCard: 16:9 thumbnail (source-provided, proxied via next/image allowlist), duration badge, title (2-line clamp), source badge, relative publish time. Hover (pointer:fine): subtle scale 1.02 + preview scrub if source provides preview media `[PROPOSED]`.
- **User actions:** scroll (infinite within rails where applicable), open a video, open a rail listing, search, open drawer.
- **System response:** skeleton-first SSR stream; cards stagger-fade in (motion); tapping a card → watch route with image-dominant transition; rail "View all" → category/sorted listing.
- **Conditional logic:** if Trending has < N items (cold catalog), rail falls back to Most Watched 30d, then New; hero suppressed if no qualified item; availability-checked items only (stale entries pruned or hidden by pipeline).
- **Validation:** rail queries bounded (page size, max offset); client never sends arbitrary query text to rail endpoints.
- **Loading state:** skeletons matching exact card geometry (no layout shift, CLS < 0.02).
- **Empty state:** brand-consistent editorial empty state with search prompt (ERROR-STATES.md E-02).
- **Error state:** rail-level error → inline retry chip; page-level error → ERROR-STATES.md E-01.
- **Offline:** cached shell + banner (ERROR-STATES.md E-05).
- **Accessibility:** all cards are single focusable links with descriptive names (title + duration + source); rails are `aria-labelledby` regions; horizontal scroll keyboard-operable (arrow keys on focused rail group).
- **Responsive:** 2 cols @320–479, 3 @480–767, 4 @768–1279, 5 @1280–1535, 6 @≥1536; hero full-bleed on mobile.
- **Security:** thumbnails proxied through allowlisted image optimization; no third-party scripts from sources.
- **Performance:** LCP element is hero thumbnail (priority-loaded); rails lazy below fold; ISR with tag-based revalidation (PERFORMANCE.md).
- **Analytics:** rail impressions (IntersectionObserver, batched), card clicks with rail context.
- **Dependencies:** F-11 pipeline, F-12 analytics, tokens.
- **Acceptance criteria:** home interactive < 2.0s on 4G mid-range Android; zero layout shift; every visible card opens a valid watch page or is not shown; E2E passes for anonymous cold-start.

### 7.4 F-04 — Search

- **Purpose:** fastest path from intent to content.
- **User value:** instant, typo-tolerant, suggestion-rich search without account friction.
- **Preconditions:** age gate passed.
- **Entry points:** header search icon/field; drawer "Search"; `/search`; watch page related-tags.
- **UI/UX behavior:** header field expands (desktop persistent field, mobile overlay sheet); debounced (180ms) autocomplete dropdown: trending queries (zero input), title suggestions with thumbnails, matching categories/tags (badged); submit → `/search?q=`. Results page: filter bar (category, tag, source, duration buckets, orientation-free neutral filters only), sort (Relevance, Newest, Longest, Most watched), infinite scroll + explicit pagination for accessibility ("Load more" always available), result count.
- **User actions:** type, select suggestion, run raw query, apply/remove filters, change sort, paginate, clear.
- **System response:** suggestions ranked (prefix > fuzzy > trending); results server-rendered for first page; subsequent pages via cursor API; filters reflected in URL (`?q=&cat=&tag=&src=&dur=&sort=`) — shareable, back-button-safe.
- **Conditional logic:** empty query → redirect to trending listing; query of a category/tag name → offer direct link chip at top; zero results → empty state with relaxed-match attempt (trigram similarity) and trending alternatives (E-03).
- **Validation:** query length 1–120 chars (enforced server-side); filter values validated against enums; invalid → sanitized to defaults with notice.
- **Loading:** input keeps value; dropdown skeleton lines; results page SSR + streamed skeletons for above-fold.
- **Empty/error/recovery:** per ERROR-STATES.md E-03/E-04.
- **Accessibility:** combobox pattern (`role="combobox"` + listbox) with full arrow-key operation and live region announcement of result count; each filter is a labelled control; sort is a `radiogroup` menu.
- **Responsive:** mobile full-screen search sheet; filters collapse into bottom drawer "Filters (n)".
- **Security:** query parameterized (never string-concatenated SQL — Drizzle + tsvector/trigram parameter binding); rate limited (60 req/min/IP for suggest; see SECURITY.md §10); output escaped by React; no regex on user input.
- **Performance:** suggest p95 < 120ms (indexed, cached 30s); results TTFB < 300ms; autocomplete payloads capped (8 items).
- **Analytics:** `search_submit` (query string stored in `search_queries` for trending, retention 90d), filter usage, zero-result rate (quality KPI).
- **Dependencies:** tsvector + pg_trgm indexes (DATABASE.md §4), F-12.
- **Acceptance criteria:** typo queries return relevant results; keyboard-only full journey passes; URL round-trips state exactly; E2E covers zero-result and filter paths.

### 7.5 F-07/F-08 — Watch page & player interaction model

- **Purpose:** the core experience: a branded, controllable, private viewing session around third-party embeds.
- **User value:** cinematic presentation, fast and predictable controls, graceful failures, discretion.
- **Preconditions:** age gate passed; video record exists and is `available`.
- **Entry points:** any VideoCard, direct URL `/watch/[slug]`, external backlinks.
- **UI/UX behavior:** top: player stage (16:9, letterboxed, Obsidian matte) inside a branded shell; branded chrome overlays (play affordance, loading ostiole pulse, error overlays) where the embed allows; below: title, meta row (source badge "Provided by X" linking to provenance, publish date, view count, report button), tag chips, description (collapsed 3 lines), then Related rail (same-category then same-tag then trending fill). SYCONIA watermark (128px emblem @20% opacity) anchored bottom-right of the stage, non-interactive.
- **Player interaction model (full spec: GESTURES.md):** because playback is inside a third-party iframe, SYCONIA provides (a) the shell-level interactions it fully controls — keyboard shortcuts where the embed exposes an API, gesture layer for taps/swipes on the stage overlay when the embed permits passthrough, orientation handling, fullscreen delegation via the Fullscreen API on the shell — and (b) documented, honest fallbacks where the embed consumes its own input (native embed controls remain usable; SYCONIA shortcuts then apply to shell functions only: fullscreen, theater, related, report). Each approved adapter declares its `interaction_capability` set; the shell renders only supported controls. **Playback, seeking, volume and captions otherwise defer to the source player's own official control set**; SYCONIA never injects into or scripts the embed's internals.
- **User actions:** play/pause (embed), fullscreen (shell), theater mode (shell), open-at-source, copy link, report, tag navigation, related navigation, back arrow.
- **System response:** watch event beacon (anonymous, throttled: start, 25/50/75% milestones, end); related rail contextual to taxonomy; report opens modal (F-09).
- **Conditional logic:** embed refuses to load (timeout 8s / onError) → failure overlay with (1) retry, (2) alternate embed variant if adapter provides one, (3) open at source, (4) report problem; video marked `degraded` for pipeline re-check. Unavailable video → removed from listings within one sync cycle; direct URL renders E-06 removed state with related suggestions.
- **Validation:** slug format; report form (reason enum, optional contact email validated, 1000-char max, rate limited).
- **Loading:** ostiole pulse indicator (brand loading), stage dims; metadata skeletons.
- **Empty:** no related items → rail hidden (no empty stub).
- **Error/recovery:** per above and ERROR-STATES.md E-04/E-07.
- **Accessibility:** stage is a labelled region; keyboard: F fullscreen, T theater, ESC exits; report modal focus-trapped; watermark `aria-hidden`; all controls ≥44px touch targets; prefers-reduced-motion disables pulse (static emblem).
- **Responsive:** stage fluid; theater mode widens (rail/column collapse); mobile: metadata stacked, related rail horizontal.
- **Security/discretion:** `sandbox` and `referrerpolicy` attributes on iframe; fullscreen allow only; no source scripts on our origin; URLs validated against source allowlist at render; report form CSRF-protected.
- **Performance:** stage reserved space (zero CLS); embed lazy-initialized after intent (tap-to-load poster on mobile data-saver `[PROPOSED]`); below-fold content streamed.
- **Analytics:** watch milestones, drop-off quartiles (aggregate), report submissions.
- **Dependencies:** adapters (API.md §6), tokens, motion.
- **Acceptance criteria:** no unhandled iframe errors visible to user; every failure path offers ≥2 next actions; keyboard-only viewing session possible (shell functions + native embed a11y); autoplay never fires with sound (policy §GESTURES.md autoplay).

### 7.6 F-11 — Ingestion pipeline (adapters + normalization)

- **Purpose:** keep the PostgreSQL catalog fresh, deduplicated, normalized, and legally sourced.
- **User value:** breadth and freshness of catalog without SYCONIA hosting media.
- **Preconditions:** source enabled in admin after terms verification (docs/LEGAL-COMPLIANCE.md).
- **Behavior:** server-side scheduler (cron) runs per-source sync jobs → adapter fetches via official API/feed → normalize to canonical Video DTO (API.md §6.3) → upsert (unique `source_id + source_video_id`) → apply mapping rules → taxonomy attach → availability probe → prune/disable stale. Failures quarantined per-source (never cross-source); `sync_runs` records stats/errors for admin.
- **Validation:** DTO schema-validated (Zod) at boundary; unknown fields preserved in `metadata jsonb` but never rendered without sanitization; titles/durations bounds-checked.
- **Security:** SSRF controls — adapters may only call preconfigured hosts (SECURITY.md §8); timeouts 10s; retries with jitter (max 2); circuit breaker per source.
- **Performance:** incremental syncs (since-token), bounded page sizes, off-peak windows, DB batch upserts.
- **Observability:** success rate, items added/updated, p95 fetch latency, breaker state — all on admin dashboard.
- **Acceptance criteria:** re-running a sync is idempotent; a failing source never blocks others; takedown-blocked entries never resurface.

### 7.7 F-13 — Admin panel (authenticated operations suite)

- **Purpose:** full operational control: catalog, taxonomy, sources, compliance, settings, audit.
- **User value (operator):** safe, fast, accountable operations without database access.
- **Preconditions:** admin account (env-seeded, argon2-hashed) — the **only** authentication in the product, scoped to `/admin`.
- **Screens:** Login, Dashboard (KPIs, source health, sync runs), Videos (search/filter/hide/refresh/re-map), Categories, Tags, Sources (enable/disable, terms-verified flag, keys), Mapping rules (source term → local taxonomy), Takedowns (queue, actions, DMCA log), Settings (age-gate copy, feature flags, retention), Audit log. Full specs in SCREENS.md §A.
- **Security:** HttpOnly session cookie, argon2, brute-force lockout (5 fails → 15min), all mutations audited, IP-bound optional, CSP-strict, noindex + `X-Robots-Tag`.
- **Acceptance criteria:** every mutation has an audit row; takedown hide is effective on public site within 60s (cache invalidation); sessions expire (8h idle / 24h absolute).

### 7.8 F-10 — Legal pages `[REQUIRED]`

Terms of Service, Privacy Policy (truthful: no accounts, what is stored, retention), DMCA/Copyright (designated agent, process, SLA), 2257 Provenance statement, Cookie Notice (first-party only), About, Contact (report/abuse/legal channels). Content requirements and review workflow in docs/LEGAL-COMPLIANCE.md; copy tone per DESIGN-SYSTEM §12.

## 8. Functional requirements (selection — full traceability in TESTING.md)

- **FR-1** Every public content endpoint and page must refuse service without a valid age cookie. (F-01)
- **FR-2** Navigation must include: top-left back arrow on non-root pages, three-line hamburger opening the primary drawer, header search on every page. (F-02)
- **FR-3** All lists paginate via opaque cursors; no unbounded queries. (F-03/04)
- **FR-4** Search must support fuzzy matching, autocomplete ≤8 suggestions, and URL-round-trippable filters. (F-04)
- **FR-5** Watch pages must never reference a media file; playback only via the source's official embed URL stored at ingestion. (F-07)
- **FR-6** Every watch page must expose Report and Open-at-Source actions and provenance text. (F-07/F-09)
- **FR-7** Admin mutations must be auditable and reversible (soft-delete semantics). (F-13)
- **FR-8** Takedown-blocked content must never reappear through any public route or sync. (F-09/F-11)
- **FR-9** The site must function with JavaScript-enhanced, progressively-rendered pages; interactive islands degrade gracefully. (Quality)
- **FR-10** Zero placeholder/mock/demo data in any environment — including empty catalogs, which render designed empty states, never fake content. (Engineering law; enforced by CI gate G-7, CI-CD.md §4)

## 9. Non-functional requirements

| Area | Requirement | Verbose spec |
|---|---|---|
| Performance | LCP < 2.0s (mobile 4G), INP < 200ms, CLS < 0.02, TTFB < 300ms | [PERFORMANCE.md](./PERFORMANCE.md) |
| Accessibility | WCAG 2.2 AA; keyboard-complete; reduced-motion | [ACCESSIBILITY.md](./ACCESSIBILITY.md) |
| Security | Headers, CSP, rate limits, SSRF controls, secrets mgmt | [SECURITY.md](./SECURITY.md) |
| SEO | Canonicals, sitemaps, robots, structured data | [SEO.md](./SEO.md) |
| Stability | Error boundaries per region; graceful degradation; SLO 99.9% | [ARCHITECTURE.md](./ARCHITECTURE.md) §12 |
| Privacy | No accounts; truncated IPs; DNT; 90-day raw-event retention | [SECURITY.md](./SECURITY.md) §12 |
| Compatibility | Chrome, Firefox, Safari (desktop+mobile), Edge; 320px→1920px+ | [TESTING.md](./TESTING.md) |

## 10. Analytics & observability requirements

First-party only. Events: `age_ack`, `page_view`, `rail_impression`, `card_open`, `search_submit`, `watch_start/quartile/end`, `report_open/submit`, `player_error` (with source + code, no PII), `nav_*`. Pipeline → `watch_events`/`search_queries` → daily rollups → admin dashboards. No third-party analytics, no fingerprinting, no cross-site tracking. Structured logs with request IDs; alerting thresholds in PRD2.md §9.

## 11. Constraints & dependencies

- Node 20+, Next.js 15+ (App Router), TypeScript 5 strict, PostgreSQL 16+, Drizzle ORM, `motion` (Framer Motion's current package) + TanStack Query (the two approved companion libraries), Tailwind CSS v4 for token implementation.
- Approved brand assets in `/branding/` (from `/uploads/`) are the only permitted logo sources.
- External dependency: availability & terms of chosen sources (risk register PRD2.md §11).
- Deployment: Vercel + Neon (primary) or Docker/VPS (alternative) — DEPLOYMENT.md.

## 12. Release plan

| Milestone | Contents | Exit gate |
|---|---|---|
| M0 | Docs baseline (this suite) + repo hygiene | PRE-RELEASE §1–2 |
| M1 | Tokens, chrome, age gate, routing, legal pages | E2E smoke + a11y audit |
| M2 | Pipeline + one approved source + home/search/taxonomy | Catalog E2E + perf budget |
| M3 | Watch page + player shell + related + report | Player matrix (GESTURES.md §9) |
| M4 | Admin suite + analytics rollups | Ops runbook dry run |
| M5 | Hardening: perf, SEO, security checklist, pre-release | Full PRE-RELEASE.md PASS |

## 13. Acceptance criteria (product-level)

1. A first-time visitor cannot reach content without the age gate; a returning visitor never sees it twice on the same device.
2. Any video reachable in the UI plays via its source embed or presents a compliant failure/recovery path.
3. Search → filter → watch → back → related loop is completable keyboard-only on 360px viewport.
4. Admin can hide any video and it disappears from all public surfaces within 60 seconds.
5. No route, in any environment, renders mock/demo content or placeholder media.
6. All CI gates (CI-CD.md §4) green on the release commit; PRE-RELEASE.md fully PASS.

## 14. Success metrics (post-launch)

- Search zero-result rate < 8%; suggest p95 < 120ms.
- Watch-page engagement: ≥60% of sessions reach a quartile milestone.
- Report SLA: takedowns actioned < 48h (target 24h).
- CWV: 75th-percentile pass on all three vitals in field data.

## 15. Risks (top 5 — full register in PRD2.md §11)

1. Source terms change / API retirement → adapter redundancy (≥2 sources) + admin kill-switch.
2. Regulatory age-verification mandates in target markets → configurable AV hook `[PROPOSED]`.
3. Payment/hosting policy exposure (adult category) → truthful representation, compliant host selection (DEPLOYMENT.md §2).
4. Catalog cold-start → curated taxonomy-first empty states; pipeline seeding.
5. SEO volatility for adult content → diversified discovery (direct, social-safe share links with neutral preview `[PROPOSED]`).

## 16. Document contribution & maintenance

Owned by Roshan. Any feature change updates: this PRD → SCREENS.md/UX-FLOWS.md → TESTING.md matrix → PRE-RELEASE items. Docs version in lockstep via CHANGELOG.md.

## 17. Conflicts register (mandated)

| ID | Conflict | Resolution (normative) |
|---|---|---|
| C-1 | Instruction block: "every image/logo/icon must be explicitly adult-themed; replace with genuine adult titles/descriptions" **vs** brand guidelines (premium, non-explicit identity; "visual language should communicate the concept without requiring explicit imagery") and the no-mock-data law. | Brand guidelines are the branding source of truth (per project mandate). Site identity (logo, icons, UI) stays non-explicit SYCONIA. Explicit imagery exists only as **source-provided content thumbnails** fetched at runtime through the pipeline — never authored, generated, or hardcoded in this repository. No synthetic "sample adult titles" are written anywhere; the catalog renders live source metadata or designed empty states. |
| C-2 | Brand guidelines PDF §5 "Corporate Decoy Architecture" (present a false mainstream business identity to auditors/processors) **vs** master spec §17 Brand Safety ("never use branding to misrepresent the nature of the business…") and law. | The Decoy strategy is **rejected**. Legal/business-facing descriptions must be truthful. Discretion in *product UX* is legitimate; deception of *institutions* is not. See docs/LEGAL-COMPLIANCE.md §3. |
| C-3 | Brand guidelines PDF describes creator dashboard, sextech divisions, corporate holding layers — **vs** product scope (§3.2: no creator features, no payments). | Out of scope for this platform. The PDF's visual identity applies; its unrelated business-unit narratives do not. |
