# SYCONIA — CI/CD Pipeline & Quality Gates

| Field | Value |
|---|---|
| Document | CI-CD.md · v1.0.1 · 2026-09-03 · `[REQUIRED]` |
| Platform | GitHub Actions + Vercel (primary path); portable to Docker/VPS (DEPLOYMENT §7) |

---

## 1. Branching & flow
Trunk-based: `main` protected (1 approving review + all gates). Feature branches → PR → CI (full) → preview deployment (Vercel) → E2E against preview → squash merge → staging auto-deploy → tagged release `vX.Y.Z` → production deploy (manual approval for major, auto for patch during business hours). Hotfix path: `hotfix/*` → same gates, expedited review, tagged `vX.Y.Z+fix`.

## 2. Environments
| Env | Data | Purpose |
|---|---|---|
| ephemeral (per-CI-run) | migrated clean Postgres + stub adapters | unit/integration/contract |
| preview (per-PR) | staging DB (anonymized real schema, source stubs or limited live probe) | E2E, Lighthouse, visual |
| staging | staging DB + **disabled-egress adapters** (no live source calls) + real auth | acceptance, smoke |
| production | prod DB + enabled sources | live |

Rule: production secrets never present in CI or preview; source adapters live only in production (and explicitly whitelisted staging smoke with disposable keys).

## 3. Pipeline stages (every PR)
1. **setup** — `npm ci` (lockfile-only), Node 20 cache.
2. **lint** — ESLint (+ custom rules: no `dangerouslySetInnerHTML`, no raw hex outside tokens file, no `any`).
3. **typecheck** — `tsc --noEmit` strict.
4. **unit** — Vitest (+ property tests).
5. **integration** — Postgres service container → drizzle migrations → service/route-handler tests + EXPLAIN index asserts.
6. **build** — `next build` (fail on warnings policy), bundle report artifact.
7. **contract** — Zod DTO both-direction tests; JSON-LD fixtures.
8. **e2e** — Playwright (Chromium+Firefox+WebKit) × viewports {375,1280} core / {320,768,1440} nightly; a11y suite; visual regression diff.
9. **perf** — Lighthouse CI budgets (PERFORMANCE §1) on preview.
10. **security** — `npm audit` (fail High+), secret scan (gitleaks), header/CSP contract test, SSRF payload suite.
11. **deploy preview** — Vercel preview URL commented on PR.

Nightly (main): full matrix (all viewports + device-emulated mobile), dependency drift report, link check, visual drift report.

## 4. Quality gates (blocking, mapped G-1…G-12)
| Gate | Check | Failure action |
|---|---|---|
| G-1 lint | zero errors, zero warnings | block |
| G-2 types | strict clean | block |
| G-3 tests | unit+integration+E2E green | block |
| G-4 migrations | generate → no drift vs schema; apply on populated DB succeeds (expand/contract verified for destructive) | block |
| G-5 audit | no High/Critical advisories (defer only via owner-approved exception with expiry) | block |
| G-6 secrets | scan repo+diffs | block |
| G-7 **no-placeholder gate** | grep blocks `TODO`, `FIXME`, `TBD`, `XXX`, `HACK`, `mock`, `dummy`, `fake`, `lorem`, `placeholder`, `coming soon`, `not implemented` in production paths (`app/`, `lib/`, `components/`, `drizzle/`, `scripts/`) — allowlist file for legitimate words in docs/tests with review | block |
| G-8 design-system lint | raw hex only in tokens file; no banned APIs (§3.2) | block |
| G-9 budgets | bundle + Lighthouse budgets | block |
| G-10 SEO fixtures | metadata/JSON-LD/sitemap validators | block |
| G-11 E2E smoke on staging | golden journeys post-deploy | auto-rollback trigger |
| G-12 changelog | release notes updated for user-facing changes | block on release PRs |

## 5. Release process (summary — full SOP in SOP.md §7)
tag → CI full run → migration dry-run vs prod snapshot → deploy (migrations first, forward-only) → G-11 smoke (health/ready, age gate, home, search, watch, admin login) → announce + CHANGELOG → observe 30min (error-rate dashboard). Rollback: redeploy previous tag (schema-compatible invariant); destructive migrations always two-phase (DEPLOYMENT §6).

## 6. Deployment artifacts & provenance
Build provenance: commit SHA, lockfile hash, migration set recorded in release notes; preview URLs reproducible; container path publishes image digests (DEPLOYMENT §7).

## 7. Cron/workflow jobs (GitHub Actions scheduled)
`sync-sources` (per platform cron + `CRON_SECRET` endpoint), `rollup-daily` (00:30 UTC), `purge-expired` (01:00 UTC), `sitemap-refresh` (post-sync), nightly test matrix, weekly dependency PRs, monthly restore drill (staging) — all report to ops channel; failures page on-call for job class `pipeline`.

## 8. Access & audit of CI
Least-privilege GitHub roles; OIDC-based cloud auth (no long-lived deploy keys); workflow files reviewed like code; release approvals logged. Secrets: GitHub Environments (prod approval required).
