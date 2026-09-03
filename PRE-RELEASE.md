# SYCONIA — Production-Readiness Checklist (PASS/FAIL Gate)

| Field | Value |
|---|---|
| Document | PRE-RELEASE.md · v1.0.2 · 2026-09-03 |
| Rule | Release ships only when every line below is **PASS**. Any FAIL blocks release; N/A requires written justification by the owner (Roshan) recorded in the release record. Evidence column cites the artifact (CI run URL, dashboard, screenshot, report). |

Legend: ☐ pending · ✅ PASS · ❌ FAIL · ➖ N/A(+justification). This template is completed per release and archived in `/docs/releases/` `[REQUIRED] artifact`.

---

## 1. Build & static quality
☐ `npm ci` clean from lockfile — evidence: CI run
☐ `next build` zero errors **and zero warnings**
☐ Bundle budgets (home ≤220KB, watch ≤180KB compressed JS) — G-9
☐ ESLint zero (incl. custom design-system rules) — G-8
☐ `tsc --noEmit` strict clean — G-2
☐ No-placeholder gate G-7 green (no TODO/FIXME/mock/dummy/lorem in production paths)

## 2. Tests
☐ Unit suite green — G-3
☐ Integration suite green (migrations applied on clean + populated DB)
☐ E2E matrix green (Chromium/Firefox/WebKit × 375/1280; nightly full matrix green within 7 days)
☐ Player interaction matrix (GESTURES §9) executed incl. documented divergences
☐ Visual regression: zero unapproved diffs
☐ Flaky quarantine list reviewed (nothing silently skipped)

## 3. Database
☐ Migrations generated, reviewed, applied to staging → then prod (forward-only; expand/contract for destructive)
☐ Index usage verified on hot paths (EXPLAIN artifacts)
☐ Retention/purge jobs ran successfully on staging
☐ Backup + PITR verified; **restore drill passed within last 30 days**
☐ DB roles verified (no superuser at runtime; audit_log append-only grants)

## 4. API & integrations
☐ `/api/health` + `/api/ready` 200 in prod
☐ Contract tests green (all endpoints, both directions)
☐ Age-gate enforcement probe: content APIs 403 without cookie; with forged cookie 403 (T-70)
☐ Each enabled source: terms verified (admin record) + first sync success + breaker healthy
☐ Rate limits verified live in prod (429 + Retry-After)
☐ Adapter SSRF suite green (private CIDR/host-suffix payloads rejected)

## 5. Security (SECURITY §17 fully re-run)
☐ HTTPS + HSTS active; SSL Labs-equivalent grade A
☐ All security headers present on every route (automated header test artifact)
☐ CSP verified incl. exact frame-src allowlist; report-only phase completed before enforcement change
☐ Admin: lockout, session expiry, audit rows for mutations, `/admin` noindex
☐ Secret scan clean; secrets rotated post-initial-deploy
☐ `npm audit` zero High/Critical — G-5
☐ Pen-test (OWASP WSTG-lite scope) — no open High findings
☐ Privacy policy matches actual data flows (review vs SECURITY §12)

## 6. SEO
☐ Titles/descriptions unique per template; canonicals correct
☐ Sitemap valid + fresh; robots correct; RTA label present
☐ JSON-LD fixtures validated (G-10)
☐ Redirect map for renamed taxonomy live
☐ Zero broken internal links (crawler run artifact)

## 7. Performance
☐ Lighthouse CI budgets green (mobile: perf ≥90, a11y ≥95, BP ≥95, SEO 100) — G-9
☐ Lab CWV: LCP ≤2.0s, CLS ≤0.02 on home/search/watch (throttled)
☐ RUM pipeline receiving (verify first events in dashboard)
☐ p95 API latencies within SLO for 48h on staging load test

## 8. Accessibility (ACCESSIBILITY §10)
☐ axe zero critical across page matrix
☐ Keyboard-only golden journeys pass
☐ Reduced-motion visual checks pass
☐ 200% zoom / 320px reflow pass
☐ Screen-reader manual script (NVDA/VoiceOver) signed off
☐ Accessibility statement published

## 9. Brand & UI quality gate (DESIGN-SYSTEM §14 — every line)
☐ Logo fidelity (official assets; no recreations) ☐ clear space honored ☐ no wordmark <96px ☐ colors from tokens only ☐ 2-family typography ☐ gold-accent law ☐ glass ≤3 surfaces ☐ favicon/app icon correct ☐ watermark correct ☐ ostiole loader present ☐ empty/error states branded ☐ no generic-SaaS / no tube-site styling ☐ responsive audits at 320/375/390/430/768/1024/1280/1440/1920 clean

## 10. States & content integrity
☐ All E-XX states rendered correctly (catalogue walkthrough artifact)
☐ Zero placeholder/mock content in prod (manual spot-check + G-7)
☐ Legal pages live with final reviewed copy (Terms, Privacy, DMCA, 2257, Cookies)
☐ Contact/report paths deliver (test takedown generates queue item + receipt)

## 11. Console & network hygiene
☐ Zero console errors on golden journeys (all browsers)
☐ Zero failed network requests (except intentionally blocked/security tests)
☐ No 404 assets; fonts/icons load from self-hosted origin
☐ CSP violation log clean after 48h soak

## 12. Environment & configuration
☐ All env vars validated at boot (fail-closed test)
☐ Production secrets unique per environment; no reuse from staging
☐ `SITE_URL` correct (final domain); canonical host redirects
☐ Uptime monitor + alert channels verified (test alert fired & received)

## 13. HTTPS & production config
☐ HTTP→HTTPS 308; apex↔www canonicalized
☐ HSTS preload submission scheduled (2-week mark)
☐ CDN cache rules + purge paths verified (hide → public disappearance ≤60s)
☐ Maintenance mode tested

## 14. Documentation
☐ Docs suite current (any spec deltas merged before release — SOP §6)
☐ Runbooks (SOP §7/§9/§10) reviewed; on-call informed
☐ CHANGELOG release entry complete
☐ Release record archived (`/docs/releases/vX.Y.Z.md`)

## 15. Legal & compliance (docs/LEGAL-COMPLIANCE.md gates)
☐ Age gate verified end-to-end (fresh device)
☐ Takedown SLA workflow rehearsed; designated agent info current
☐ Source terms verification records complete for all enabled sources
☐ Jurisdictional risk review refreshed (target markets list)
☐ Business representation truthful (no decoy naming on legal surfaces) — C-2 resolved

## 16. Rollback readiness
☐ Previous release artifact redeployable (verified on staging)
☐ Migration reversibility strategy documented for this release
☐ Cache-purge path for rollback tested
☐ On-call owner + rollback decision-maker identified (release window)

---

**Sign-off:** Owner (Roshan) ______ · Date ______ · Release tag ______ · Overall: ☐ GO ☐ NO-GO
