# SYCONIA — Web Discoverability (scope-reduced v1.1.0) 

> **Platform migration scope decision (D-018):** SYCONIA's public discovery surface is now the **native Android app**; crawler-based discovery SEO for public catalog pages is **retired with the web UI**. This document now governs: (1) the remaining backend web surfaces — legal/info pages (still indexable, §6 decision unchanged), the minimal `/watch/[slug]` **share/OG preview pages** (noindex, honest OG tags, "Open in app" + open-at-source), and the admin console (noindex); (2) **Android App Links** (`assetlinks.json`, verified deep links `syconia://`→https share URLs), share URL shape, and web-to-app continuity. Sitemaps cover legal pages only; `WebSite/SearchAction`, CollectionPage/ItemList and VideoObject-on-our-domain artifacts are **retired** (an honest `VideoObject` may appear on share pages pointing at the source embed). RTA labelling continues on web surfaces; in-app content rating + Play data-safety disclose adult scope honestly. T-66…T-69 map to these reduced checks.

| Field | Value |
|---|---|
| Document | SEO.md · v1.1.0 · 2026-09-03 (Android platform migration) · `[REQUIRED]` |

Reality note: adult-content discoverability in general web search is constrained by SafeSearch and platform policies; this strategy maximizes what is legitimately indexable while following search-engine guidelines strictly (no cloaking, no sneaky redirects — brand-discretion measures that alter *presentation*, not *content vs crawler*, are documented in §7).

---

## 1. Technical foundations
- **Canonical:** `SITE_URL` absolute, self-referencing on every indexable page; `rel=canonical` strips cursor/pagination params (page 1 canonical for parameterized listings); trailing-slash consistent.
- **robots.txt:** allow all except `/admin`, `/api`, `/offline`, `/search` (parameterized search excluded per guidelines); sitemap reference included.
- **Sitemaps:** `sitemap.xml` index → home, categories index + all visible categories, tags index + featured tags (long-tail tags only if ≥10 videos), watch pages (indexable set: available, visible, ≥1 taxonomy, not `noindex`-flagged); ≤50k URLs/sitemap, split by type; `lastmod` from `updated_at`; refreshed on sync (daily) — not on every request.
- **Indexing directives:** parameterized/filter URLs, cursor pages, offline, admin, 404 → `noindex`; legal pages indexable; watch pages indexable by default with admin per-item override.
- **Hreflang:** single-locale (`en`) in v1 — explicit `lang="en"`, no hreflang noise.
- **HTTPS + HSTS** (SECURITY §3); single origin; no mixed content (CSP `upgrade-insecure-requests`).

## 2. Metadata system (centralized `/lib/seo`)
- **Title template:** `%s — SYCONIA` · default: `SYCONIA — The Beauty of the Inward Experience` (official spelling only).
- **Description:** unique per page type; watch pages compose from source-provided title + neutral brand frame (truncated 155 chars, no explicit strings beyond source metadata — descriptive, non-promotional).
- **OG/Twitter:** `og:title/description/type=video.other/image` (proxy thumbnail 1200×630 crop), `og:site_name=SYCONIA`, `twitter:card=summary_large_image`; neutral preview mode `[PROPOSED]` (privacy share previews use brand card instead of thumbnail — off by default).
- **Favicons/app icons:** official assets (32px favicon, 180 apple-touch from app icon, 192/512 manifest icons from app icon).
- **Pagination markup:** `rel="next/prev"` semantics via crawlable “Load more” fallback links to `?page=n` variants (canonicalized to page-1) — compliant infinite-scroll pattern.

## 3. On-page standards
- One `<h1>` per page (serif, descriptive); heading hierarchy strictly nested (h1→h2→h3, no skips); landmark structure (`header/nav/main/footer`); breadcrumbs on depth ≥2 pages with visible text + markup.
- Internal linking: related rail (contextual), tag/category chips, breadcrumb — every indexable page reachable ≤3 clicks from home.
- Text content: category/tag pages carry curated editorial descriptions (admin-managed, real copy — never lorem) to qualify as substantive pages.

## 4. Structured data (JSON-LD, server-rendered)
| Page | Schema |
|---|---|
| All | `WebSite` (+`SearchAction` → `/search?q={search_term_string}`) |
| Breadcrumbs | `BreadcrumbList` |
| Watch | `VideoObject` (name, description, thumbnailUrl via proxy, uploadDate=publishedAt, duration ISO8601, embedUrl = source embed — honest: player on source domain) — **only when metadata complete; never fabricated fields** |
| Category/Tag | `CollectionPage` + `ItemList` (paged subset) |

Validation: schema validator in CI for representative fixtures (G-10); no markup on `noindex` pages.

## 5. Adult-content policy compliance
- Meta robots `rating`/`RTA` label (`<meta name="rating" content="RTA-5042-1996-1400-1577-RTA">` standard self-label) — declared honestly for family-safe filters.
- No cloaking: crawler and user receive identical content/links; discretion veil (DESIGN-SYSTEM §11) is presentation styling applied equally to all renderers with JS; `<noscript>` fallbacks keep content list-visible.
- No doorway/redirect chains; canonical watch-item status rule (mirrored from API.md §4.2): **hidden (admin/takedown) and removed items return a genuine HTTP 404** with the helpful E-06 UI; **temporarily unavailable items return HTTP 200** with E-06 UI + related rail (item may return) **and emit `noindex, follow`** for the duration of unavailability (directive removed automatically when availability is restored and ISR revalidates — never a stale noindex on a healthy page, never misleading metadata on an unplayable one). Parameterized/cursor URLs `noindex`.

## 6. Page/URL quality rules
**Legal/info indexing decision (normative, resolves the former "optional" policy):** all legal and informational pages — Terms, Privacy, DMCA, 2257, Cookies, About, Contact — are **indexable with self-referencing canonicals** (compliance surfaces; consistent with §1's indexing directives). No legal page carries `noindex` in v1.
Slugs: lowercase, hyphenated, stable forever (DATABASE unique). No ID-noise in URLs. Redirects: 301 map managed in code for renamed taxonomies (admin rename creates redirect pair, audited). Dead links purged from sitemap within a sync cycle.

## 7. Discretion vs SEO boundary (documented decision)
Tab-title masking (UX-FLOWS §14) applies to *already-departed* tabs (visibility change) — never to crawlers (no JS-detection of bots). Share previews remain honest per-page OG images in v1. If the neutral-preview flag is enabled later, it applies to all user agents equally (no UA sniffing).

## 8. Monitoring & KPIs
Indexation count trend, crawl errors (source of truth: search console class tooling), CTR by page type, watch-page organic entry share, sitemap freshness lag ≤24h. Alerts: indexation drop >20% week-over-week.

## 9. Acceptance criteria
1. Every indexable page: unique title+description, canonical, one h1, valid JSON-LD. 2. Sitemap valid, fresh, excludes noindex/admin. 3. robots correct incl. sitemap. 4. RTA label present. 5. Structured-data CI fixtures green. 6. No mixed content; HTTPS-only. 7. Removed videos 404; renamed taxonomy 301s. Verified in TESTING §7 T-66…T-69 and PRE-RELEASE §6.
