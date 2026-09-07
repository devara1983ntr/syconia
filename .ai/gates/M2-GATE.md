# M2-GATE — CATALOG (BACKEND) (v1.1.0)

**Status: NOT_STARTED — and structurally BLOCKED while B-001 (source authorization gate G-04) is OPEN.**

| # | Criterion (objective) | Evidence (fill on pass) |
|---|---|---|
| 1 | **structurally BLOCKED while B-001 (source authorization G-04) is OPEN — unchanged by the platform migration.** All non-gated backend tasks may complete (honest stubs/fixtures only). No provider may be invented (AGENT §2.1.10). MIGRATIONS: g-migrate-1 schema+migrations clean (G-4) | |
| 2 | g-migrate-2 integration+EXPLAIN green | |
| 3 | g-migrate-3 contract tests §4 both directions | |
| 4 | g-migrate-4 sync idempotent + FR-8 stickiness | |
| 5 | g-migrate-5 SSRF suite rejected | |
| 6 | g-migrate-6 ★ terms verification recorded (terms_verified_at + reference URL) → **cannot PASS until B-001 resolved** | |
| 7 | g-migrate-7 first adapter live sync SUCCESS | |
| 8 | g-migrate-8 search relevance + rate limits | |
| 9 | g-migrate-9 events/report intake + purge ≤60s | |
| 10 | g-migrate-10 rollups/purge fixtures match | |
