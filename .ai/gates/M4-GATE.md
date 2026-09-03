# M4-GATE — ADMIN (PASS required before M5)

**Status: NOT_STARTED** · Source: AGENT §4 M4, SCREENS A-01…A-10, API §5–5.1, SECURITY §6, DATABASE §2.11–2.17.

| # | Criterion (objective) | Evidence (fill on pass) |
|---|---|---|
| 4.1 | Admin E2E green: T-31…T-35 (takedown hide→public 404→sync-sticky, lockout, audit rows for every mutation, sources enable-gate `terms_not_verified`, mapping backfill) + T-89/T-90 (contact, admin contracts) | |
| 4.2 | Every admin mutation writes an audit row (whitelist API §8); `audit_log` UPDATE/DELETE denied at DB role level (T-81) | |
| 4.3 | Hide→CDN purge→public disappearance **≤60s** invariant test passes (FR-7/8, ARCH §8 invariant) | |
| 4.4 | Auth security: argon2 verify, lockout per username AND truncated IP (5/15min), session 8h/24h, CSRF rotation on login, cookie contracts per SECURITY §6 | |
| 4.5 | `/admin` noindex + `X-Robots-Tag`; middleware auth wall — no admin route reachable unauthenticated (probe test) | |
| 4.6 | Admin contracts: all §5.1 DTO/sort/confirm/validation rules pass both-direction contract tests (incl. `confirmation_required`, `slug_immutable`, `weights_invalid`) | |
| 4.7 | Dashboard renders honest zeros on fresh install (no fabricated KPIs) — verified with empty DB | |
| 4.8 | Settings kill-switches effective ≤120s (suggest off, maintenance mode) — verified | |
| 4.9 | Zero-placeholder scan green (admin tables/fixtures isolated from production) | |
