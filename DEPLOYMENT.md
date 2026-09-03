# SYCONIA — Production Deployment & HTTPS Configuration

| Field | Value |
|---|---|
| Document | DEPLOYMENT.md · v1.0.2 · 2026-09-03 · `[REQUIRED]` |

---

## 1. Topology (primary path)
**Vercel** (app + ISR/CDN + edge middleware) + **Neon Postgres** (serverless DB, PITR) + **Upstash Redis** (rate limiting) + platform cron → job endpoints. Zero self-managed servers; every component HTTPS/TLS-native.

Alternative path (§7): Docker images on a VPS behind Caddy/Traefik — for jurisdictions/hosts where the primary path is unavailable (adult-content policy of the host must permit the service — see §2; never misrepresent the service to any provider, per LEGAL-COMPLIANCE §3).

## 2. Provider & policy prerequisites (pre-deployment gate)
- Host/CDN/DB providers whose Acceptable Use Policies permit adult (legal, 18+) content — verified and recorded before signup (operator checklist; providers chosen truthfully, service described accurately).
- Domain registered with registrar permitting adult use; DNSSEC enabled.
- Legal pages live (F-10) and RTA label present — deployment to production is blocked by PRE-RELEASE gate §12 without them.

## 3. HTTPS configuration (normative)
- TLS termination at platform edge; TLS 1.2 minimum (prefer 1.3), modern ciphers only (e.g. TLS_AES_128_GCM_SHA256, ECDHE curves), OCSP stapling where applicable.
- HSTS `max-age=63072000; includeSubDomains; preload` from day one (SECURITY §4); preload submission after 2 stable weeks.
- HTTP→HTTPS 308 redirect at edge; apex↔www canonicalized (single host); no mixed content (CSP upgrade rule).
- Certificates auto-managed/renewed by platform; expiry monitored (alert <21 days) — manual CSR flows forbidden.

## 4. Environment variables (validated at boot — ARCHITECTURE §12)
Production set via provider secret stores: `DATABASE_URL`, `DATABASE_POOL_URL`, `AGE_SECRET`, `CURSOR_SECRET`, `SESSION_SECRET`, `CRON_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (argon2id), `SOURCE_<SLUG>_KEY…`, `SITE_URL=https://syconia.example` (operator's real domain), `SITE_NAME=SYCONIA`, `LOG_LEVEL=info`, `RATE_LIMIT_*`. Boot validator fails closed on missing/weak values (secret length ≥ 32, URLs https-only).

## 5. Database deployment
- Migrations: drizzle-kit generate in CI → reviewed SQL → apply at deploy pre-step (forward-only; expand/contract for destructive changes) — CI-CD G-4.
- Roles provisioned per DATABASE §7 (app/jobs/migrate/admin-read); connection via pooler; TLS enforced; statement timeout defaults set at role level.
- Backups: PITR window ≥ 7d + logical dump weekly to encrypted object storage; restore drill monthly on staging (SOP §8). RPO ≤ 15min, RTO ≤ 2h.

## 6. Release & rollback runbook (summary)
Deploy = migrations → app rollout → G-11 smoke (health/ready, age gate, home/search/watch golden path, admin login) → 30-minute watch window (error rate, p95, breaker states). Rollback = redeploy previous image/tag (schema forward-compatible invariant maintained); CDN cache purge of affected tags; incident ticket if user-visible (SOP §9).

## 7. Docker/VPS alternative (container specification)
Multi-stage build: deps → build (Next standalone output) → runtime (non-root user, `NODE_ENV=production`, healthcheck `/api/health`, exposed 3000). Reverse proxy (Caddy recommended: automatic HTTPS via ACME, same header set enforced at proxy too). Process manager: systemd or container orchestration; jobs via system cron hitting `CRON_SECRET` endpoints. Images published with immutable digests; SBOM attached `[PROPOSED]`.

## 8. Post-deploy verification checklist (first boot + every release)
□ `/api/health` 200 · `/api/ready` 200 (DB + breakers) · headers present (SECURITY §17 test) · age gate enforced (T-70 class probe) · admin login works + lockout active · rate limits live (429 probe) · sitemap/robots resolve · CSP report endpoint receiving · uptime monitor registered (60s) · error-rate dashboard live · rollback artifact (previous image/tag) verified present.

## 9. Operational calendar
Daily: takedown queue check (SLA), dashboards glance. Weekly: dependency PRs, unmapped-terms triage, pg_stat review. Monthly: restore drill, dependency audit report, capacity review. Quarterly: pen-test refresh, key rotation (SOP §10), provider AUP re-verification.
