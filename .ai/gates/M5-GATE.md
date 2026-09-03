# M5-GATE — HARDENING / RELEASE (project COMPLETE only after this + FINAL-VERIFICATION)

**Status: NOT_STARTED** · Source: PRE-RELEASE.md (authoritative 16-section PASS/FAIL), SECURITY §17, PERFORMANCE, SEO, ACCESSIBILITY §10, DEPLOYMENT, CI-CD §5, LEGAL-COMPLIANCE.

| # | Criterion (objective) | Evidence (fill on pass) |
|---|---|---|
| 5.1 | PRE-RELEASE.md fully executed for the release — **every line PASS (or N/A + owner justification)**; archived at `/docs/releases/vX.Y.Z.md` | |
| 5.2 | CI/CD gates G-1…G-12 all green on the release commit (incl. G-5 audit, G-6 secrets, G-7 placeholder, G-9 budgets, G-12 changelog) | |
| 5.3 | Security checklist SECURITY §17 fully re-run (HTTPS/HSTS, headers, CSP enforced, pen-test WSTG-lite no open High) | |
| 5.4 | Performance: Lighthouse CI budgets green (mobile ≥90/95/95/100); lab CWV LCP ≤2.0s CLS ≤0.02 on home/search/watch; RUM receiving | |
| 5.5 | Accessibility §10 all seven criteria met (axe, keyboard journeys, reduced-motion, 200% zoom, SR script sign-off, statement published) | |
| 5.6 | SEO: metadata/canonicals/sitemap/robots/RTA/JSON-LD validators green (G-10); zero broken links | |
| 5.7 | Deployment: HTTPS + HSTS active, health/ready 200, rollback artifact verified, uptime monitor live, maintenance mode tested | |
| 5.8 | **B-002 resolved** (legal copy counsel-approved; designated agent current) and **B-003 resolved** (adult-permitting host/registrar recorded truthfully) | *(blockers — required)* |
| 5.9 | M2 source posture re-verified (terms records complete for all enabled sources; PRE-RELEASE §15) | |
| 5.10 | FINAL-VERIFICATION.md executed — all sections PASS with evidence; release record archived; CHANGELOG published | |
