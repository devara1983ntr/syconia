# M2-GATE — MEDIA SOURCE / CATALOG (PASS required before M3)

**Status: NOT_STARTED — and structurally BLOCKED while B-001 (source authorization gate G-04) is OPEN.** All non-gated M2 tasks may complete; the gate itself cannot PASS until B-001 is resolved with evidence. No provider may be invented to unblock this gate (AGENT §2.1.10; ROADMAP blocked conditions).

| # | Criterion (objective) | Evidence (fill on pass) |
|---|---|---|
| 2.1 | G-4 migrations: generated SQL reviewed; apply succeeds on clean **and** populated DB (expand/contract for destructive) | |
| 2.2 | Integration suite green incl. EXPLAIN index-usage asserts on hot paths (DATABASE §5) and retention/purge job test | |
| 2.3 | API contract tests green: T-10…T-21, T-36…T-39, T-87 (interaction whitelist), T-88 (csp-report) — request+response both directions | |
| 2.4 | FR-8 stickiness test: takedown-blocked entry never resurfaces across re-sync (T-31 class, DB level) | |
| 2.5 | SSRF suite green: private-CIDR/host-suffix/redirect payloads rejected by adapter client (T-77 class) | |
| 2.6 | Rate limits live: 429 + Retry-After on suggest/search/events (T-18) | |
| 2.7 | **B-001 resolved:** source selected by operator; terms verification recorded (`terms_verified_at` + reference URL); admin record exists | *(blocker — required)* |
| 2.8 | First adapter module code-reviewed + enabled; first `sync_runs` SUCCESS with real items; breaker healthy; capability set recorded | |
| 2.9 | Discovery screens render **real catalog data** or the honest E-02 empty state (zero fake content — G-7 scan green on all screens) | |
| 2.10 | Cursor pagination + signed-cursor tamper test (400/403) + race policy (last-write-wins) verified (T-11 + PRD2 §2.7) | |
| 2.11 | Analytics: beacons → `watch_events`/`interaction_events` → rollups pipeline verified end-to-end; 90-day purge job dry-run | |
| 2.12 | Zero-placeholder scan green; no mock wired into production (`SOURCE_MODE=fixed` remains dev/test-only) | |
