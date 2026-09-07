# SYCONIA — CI/CD Pipeline & Quality Gates

| Field | Value |
|---|---|
| Document | CI-CD.md · v1.1.0 · 2026-09-03 (Android platform migration) · `[REQUIRED]` |
| Platform (v1.1.0) | GitHub Actions: **android track** (Gradle: JDK 17/21 → detekt+ktlint → unit → build → Compose/UI tests on emulator → AAB) + **backend track** (Node 20, retained pipeline) → Vercel/Docker deploy; portable per DEPLOYMENT §7 |

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
**Android track (every PR touching /android):**
1. **setup** — JDK + Android SDK, Gradle cache (`gradle/actions/setup-gradle`), wrapper validation.
2. **static** — detekt + ktlint (+ forbidden-API conventions: no framework imports in domain, no Retrofit/Room in UI, tokens-only colors).
3. **unit** — JVM tests (domain/viewmodel/repositories).
4. **build** — `assembleDebug` + `bundleDebug`/release AAB (CI-only signing), R8 checks, APK size budget artifact.
5. **instrumented** — Compose UI + instrumentation on emulator matrix (API 26/current).
6. **screenshot/visual** — Compose screenshot tests vs approved baselines (0.1% diff policy retained).
7. **security** — secret scan incl. APK contents, dependency audit (Gradle + OSV), license check.

**Backend track (retained, every PR touching /backend):**
1. **setup** — `npm ci`, Node 20 cache. 2. **lint** — ESLint (+ custom rules). 3. **typecheck** — `tsc --noEmit` strict. 4. **unit** — Vitest (+ property tests). 5. **integration** — Postgres container → drizzle migrations → service/handler tests + EXPLAIN asserts. 6. **build** — Next backend build (fail on warnings). 7. **contract** — Zod DTO both-direction tests. 8. **e2e** — Playwright (console + API). 9. **perf** — API budgets. 10. **security** — `npm audit` High+, gitleaks, header/CSP contract, SSRF suite. 11. **preview deploy** — Vercel preview.

**Never committed:** keystores, signing passwords, service-account JSONs, map passwords — signing exists only in CI environments (G-6 extended to `*.jks|*.keystore|keystore.properties`).

Nightly (main): full matrix (all viewports + device-emulated mobile), dependency drift report, link check, visual drift report.

## 4. Quality gates (blocking, mapped G-1…G-12)
| Gate | Check | Failure action |
|---|---|---|
| G-1 lint | detekt+ktlint zero (android) · ESLint zero (backend) | block |
| G-2 types | Kotlin strict compiler warnings-as-errors · tsc strict clean | block |
| G-3 tests | unit+integration+E2E green | block |
| G-4 migrations | generate → no drift vs schema; apply on populated DB succeeds (expand/contract verified for destructive) | block |
| G-5 audit | no High/Critical advisories (defer only via owner-approved exception with expiry) | block |
| G-6 secrets | scan repo+diffs | block |
| G-7 **no-placeholder gate** | grep blocks `TODO`, `FIXME`, `TBD`, `XXX`, `HACK`, `mock`, `dummy`, `fake`, `lorem`, `placeholder`, `coming soon`, `not implemented` in production paths (**`android/**` Kotlin sources** + backend `app/`, `lib/`, `components/`, `drizzle/`, `scripts/`) — allowlist file for legitimate words in docs/tests with review | block |
| G-8 design-system lint | raw hex only in tokens file; no banned APIs (§3.2) | block |
| G-9 budgets | APK/AAB size + startup (Macrobenchmark) + API p95 + (backend web bundle where applicable) | block |
| G-10 web-surface fixtures | OG/share-page + legal metadata, JSON-LD (VideoObject on share pages), assetlinks.json validation | block |
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
