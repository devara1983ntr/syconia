# SYCONIA — Loading, Empty, Error, Offline & Recovery States

| Field | Value |
|---|---|
| Document | ERROR-STATES.md · v1.0.2 · 2026-09-03 · `[REQUIRED]` catalogue — every async surface maps to ≥1 E-XX |

---

## 1. Universal state laws
1. Every async region implements all four states: **loading (skeleton) · empty · error · offline** — designed, branded, tested (TESTING §5).
2. Skeletons match target geometry exactly (zero CLS on resolve); shimmer 1.6s; ≤3 skeleton blocks per region.
3. Errors are always: region-scoped (never nuke the page), code-correlated (digest/requestId shown small), recoverable (Retry preserves user state), and dead-end-free (a safe exit to parent/related content).
4. Empty states are editorial (serif line + one sans action + emblem line-art) — never blank, never apologetic filler, never fake data.
5. Copy tone per DESIGN-SYSTEM §12; no technical jargon to users (codes for support correlation only).

## 2. Catalogue
| Code | Surface | Trigger | Presentation | Recovery path |
|---|---|---|---|---|
| E-01 | Home page | rails API 5xx ×2 | Stage: emblem line-art + “The garden is momentarily closed.” + Retry | Retry → home revalidate; drawer nav unaffected |
| E-02 | Home/category cold catalog | zero visible items (new deploy) | “The gallery is being curated.” + CTA → Categories/Tags (if also empty → status link) | Operator: run sync (A-06) |
| E-02b | Filtered listing — zero matches | filters/sort applied yield empty set (catalog itself non-empty) | Distinct state: “No videos match the current filters.” + **Clear filters** action (restores URL to unfiltered listing) + count of relaxed-filter hint (“Without duration filter: N”) | Clear filters; remove chips; filters are never auto-relaxed (PRD2 §3.3) |
| E-03 | Search zero results | 0 matches incl. relaxation | “Nothing matched ‘{q}’.” + relaxed attempts (if any, labelled “Close matches”) + Trending rail + “Try:” chips | Edit query; chips; back preserves query |
| E-04 | Search/list API error | 5xx/network | Inline panel “Something interrupted the search.” + Retry (query preserved in field & URL) | Retry; drawer exit; offline banner if cause |
| E-05 | Global offline | `offline` event / fetch network fail | Slim persistent header banner “Offline — showing cached pages” + per-region inline fallbacks; banner links to `/offline` (S-11). **v1 cannot intercept hard navigations** (no service worker) — SW-based interception is `[PROPOSED]` with F-21 | Auto-detect `online` → “Back online” toast + refresh visible regions |
| E-06 | Watch — item gone | slug hidden (admin/takedown) or removed | **HTTP 404** + full-page: “This selection is no longer available.” + Related rail + Back (canonical status rule, API.md §4.2) | Related; back arrow; report if user believes error |
| E-06b | Watch — temporarily unavailable | slug `is_available=false` (probe pending, may return) | **HTTP 200** + same E-06 composition + Related rail (item may return) | Related; back arrow; report broken |
| E-07 | Watch — playback failure | embed timeout 8s / error / breaker | Stage overlay ladder: **Retry** → **Alternate source variant** (if provided) → **Open at source** + **Report**; digest shown | Ladder; item flagged `degraded`; pipeline re-probe |
| E-08 | Watch — geo/unsupported | probe `geo` / player refuses region | “This selection isn’t available in your region.” + Related | Related; no circumvention links (policy) |
| E-09 | Suggest dropdown | error/timeout | Silent dropdown close; field keeps text; icon subtle warn | Type continues; ESC clears |
| E-10 | Report form | validation/rate limit | Inline field errors; 429 → “You’ve sent several reports recently — try again later.” | Fix fields; retry after window; contact page link |
| E-11 | Contact form | same as E-10 | same | same |
| E-12 | Thumbnails | proxy error/broken URL | Branded placeholder tile (emblem pattern, deterministic per slug) — layout intact | Pipeline probe replaces URL |
| E-13 | Admin tables | API error | Table error row + Retry (filters preserved) | Retry; re-login if 401 |
| E-14 | Admin action | mutation failure | Toast (error) + row stays unchanged; digest | Retry action; audit shows attempt only on success |
| E-15 | Admin login | bad creds/lockout | Field error + counter; lock panel with countdown | Wait; recovery via operator procedure (SOP §10) |
| E-16 | Route 404 | unmatched | S-09: “Lost in the bloom.” + trending + did-you-mean chip | Buttons; no auto-redirect |
| E-17 | Route 500 | render crash | S-10 boundary: “Something interrupted the moment.” + Retry + Home + digest | Retry revalidates; beacon auto-sent |
| E-18 | Source degraded (sitewide) | breaker OPEN for ≥1 enabled source | Slim chip on listings “Some sources are temporarily unavailable” (dismissible per session); affected items auto-excluded | Auto on breaker recovery; admin A-06 manual reset |
| E-19 | Rate limited (user) | 429 on content APIs | Gentle inline “Easy does — too many requests.” + auto-backoff retry (client) | Client honors `Retry-After`; no user action needed |
| E-20 | Maintenance mode | operator switch | Static edge page: emblem + “SYCONIA is briefly tending the garden. Back soon.” + status note | Operator disables; TTFB-static |

## 3. Loading-state specification (per surface)
Home: hero block + card-row skeletons (12) streamed. Search: field live, grid skeleton 12. Watch: exact stage box + title/meta/tag skeletons. Drawer: none (static). Admin: table rows skeleton 10 + KPI card skeletons. Suggest: 3 dropdown lines. All shimmer paused under `prefers-reduced-motion` (static 12% veil).

## 4. Retry semantics (normative)
Network-class errors: 1 silent auto-retry (800ms, jittered) then manual button. 5xx: manual only (avoid stampede). 429: client honors `Retry-After`, exponential backoff, max 3. Beacons: queued offline, flushed on reconnect (cap 50, drop oldest). All retries preserve scroll anchor, inputs, and URL.

## 5. Offline behavior detail
Banner + cached navigation (client history); visible regions render last-good data with “as of HH:MM” stamps; mutations (report, contact) queue-and-warn; failed **client-side** navigations render E-04 inline with a link to `/offline` (S-11); **hard** navigations while offline show the browser's own offline error in v1 (no service worker — interception arrives only with F-21 `[PROPOSED]`; a documented, accepted v1 limitation). Service-worker caching `[PROPOSED]` (F-21) upgrades this without UX change.

## 6. Error taxonomy (internal codes ↔ events)
`ERR_NETWORK · ERR_API_5XX · ERR_VALIDATION · ERR_RATE_LIMIT · ERR_CURSOR · ERR_AGE_GATE · ERR_AUTH · ERR_FORBIDDEN · ERR_NOT_FOUND · ERR_SOURCE_TIMEOUT · ERR_SOURCE_BREAKER · ERR_EMBED_DEAD · ERR_EMBED_GEO` — each maps to beacon `code`, log level, and dashboard facet (PRD2 §9). None contain user data.
