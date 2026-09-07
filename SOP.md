# SYCONIA — Standard Operating Procedures (Development, Testing, Deployment, Maintenance)

| Field | Value |
|---|---|
| Document | SOP.md · v1.1.0 · 2026-09-03 (Android platform migration) · Owner: Roshan |

---

## 1. Local development setup `[REQUIRED]` (v1.1.0 — Android client + backend)
**Android app:** 1. Prerequisites: JDK 17+ (Temurin), Android Studio (current stable) with SDK platform for `targetSdk` + build-tools, emulator/device (API 26…current), Git. 2. Open `/android` in Android Studio → Gradle sync (wrapper-provisioned Gradle; never a system Gradle). 3. Run configurations: `app` (debug variant) — local backend endpoint or recorded-contract mode. 4. Verify: app launches → age gate → honest empty/offline states (no fake data).
**Backend:** 1. Node 20+, npm 10+, PostgreSQL 16 local (or Neon branch). 2. `cd backend` → `npm ci`. 3. `.env.local` per `.env.example` (secrets 32+ chars dev-only; `ADMIN_PASSWORD_HASH` via `npm run hash-password`). 4. `npm run db:migrate` → `npm run dev`. 5. Verify `/api/health` 200; `/admin/login` lockout counter active.
**Fixtures:** adapters and app repository tests run against **recorded contract fixtures** by default (`SOURCE_MODE=fixed` / local fixture JSON); live egress only explicitly with your own keys (never commit them).

## 2. Repository conventions
- Trunk-based; branch `feat|fix|chore|docs/…`; conventional commits (`feat(player): …`).
- Docs live with code: any behavior change updates the paired spec (PRD2 §13 mapping) **in the same PR**.
- Reviewer checklist (every PR): gates G-1…G-12 context · four states covered · a11y · budget diff · audit hooks on admin mutations · no placeholder code (G-7 is blocking) · spec deltas linked.
- Never commit: secrets, node_modules, `.env*`, build output (gitignore enforced), or unofficial logo recreations.

## 3. Coding standards
Kotlin: explicit API mode on domain/core modules; no Android imports in domain; Compose state hoisting per MVVM/UDF; TypeScript strict on backend; no `any`; tokens only (G-8, both stacks); imports ordered (ktlint/ESLint); error handling per ERROR-STATES taxonomy (no swallowed errors); every admin mutation wraps `audit()`; every external fetch via the adapter client (no direct fetch); Zod at every boundary; comments explain *why*, never narrate *what*; zero `TODO/FIXME/mock` markers (tracking issues instead).

## 4. Testing SOP
- Write tests with the feature, not after (TDD encouraged for services/adapters).
- Local minimum before push: lint + typecheck + unit + affected integration.
- E2E run on preview automatically; never merge with red or quarantined-silent suites.
- Fixture policy: contract-accurate source fixtures recorded once (`scripts/record-fixtures`, live mode, reviewed) — they are test artifacts, never shipped as app data.
- Flaky protocol: 1 retry → quarantine with issue → fix within 2 sprints → never delete coverage.

## 5. Design QA loop (with the cloned UI/UX Pro Max skill)
- Skill location: `/.skills/ui-ux-pro-max` (cloned 2026-09-03, v2.13.0; MIT; design-intelligence database + design-system generator CLI).
- Usage: consult for palette/typography/UX-heuristic checklists during component work; **brand tokens and guidelines in `/branding/ + DESIGN-SYSTEM.md always override generic skill suggestions** (the skill informs craft, not brand).
- Cadence: before each primitive PR, run the skill's heuristic scan on the component states; attach summary to PR.

## 6. Documentation change SOP
Specs are versioned with releases. Behavior change = paired doc update (same PR). New screen/flow/state = update SCREENS/UX-FLOWS/ERROR-STATES + test matrix rows. Docs review is part of G-12 on release PRs. CHANGELOG entry mandatory for user-visible or ops-visible changes.

## 7. Release SOP (detail behind CI-CD §5)
1. Freeze: open release branch; full CI green; nightly matrix green.
2. Migration review: drizzle SQL read line-by-line; destructive = two-phase plan.
3. Staging deploy + PRE-RELEASE dry run (staging-scope rows).
4. Tag `vX.Y.Z` → production deploy (migrations first) → G-11 smoke → 30-min watch.
5. Complete PRE-RELEASE.md for the release; archive to `/docs/releases/`; sign-off GO/NO-GO.
6. Post-release: CHANGELOG published; 24h dashboard review scheduled.

## 8. Backup & restore SOP
- Backups: managed PITR (≥7d window) + weekly encrypted logical dumps to object storage (30d retention).
- Monthly restore drill (staging): restore latest dump into scratch DB → run integration suite against it → record timing/artifact in `/docs/releases/drill-YYYYMM.md`.
- Emergency restore: prioritize watch-path tables (videos, taxonomy, blocks) — RTO 2h; comms per §9.

## 9. Incident management
- Severities: **S1** site down / data loss / security breach (page on-call, 15min ack) · **S2** major feature degraded / source breaker open >30min / SLA breach risk (1h ack) · **S3** minor (next business day).
- Containment-first: kill-switches (disable source, maintenance mode E-20), rollback runbook (DEPLOYMENT §6).
- Comms: status note on dashboard; user-facing notice only for S1 (maintenance page).
- Forensics: structured logs + audit_log + beacons (all PII-free by design); preserve job/CI logs.
- Post-mortem (S1/S2, blameless, 48h): timeline, root cause, action items → CHANGELOG/docs updates.

## 10. Credentials & rotation SOP
- Admin password: `npm run hash-password` → update env secret → verify login → old session invalidation (rotate `SESSION_SECRET` if compromise suspected).
- HMAC secrets (`AGE/CURSOR/SESSION`): dual-validity rotation window — deploy accepts old+new for one release cycle, then drop old.
- Source API keys: per-source env; rotation on provider schedule or suspicion; never in repo/logs.
- Quarterly calendar entry: rotate + re-scan (G-6) + record in audit log via settings change.

## 11. Maintenance cadence
Weekly: dependency PRs (audit-driven), unmapped-terms triage (A-07), pg_stat_statements review, CSP violation review. Monthly: restore drill, capacity review (connections/disk), provider AUP re-verification. Quarterly: key rotation, pen-test refresh, brand quality gate (DESIGN-SYSTEM §14) re-audit, docs accuracy sweep. Annually: accessibility statement refresh, threat-model review.

## 12. Content-compliance operations (daily rhythm)
1. Takedown queue (A-08) — oldest first; SLA 48h (target 24h); critical reasons (underage/nc/copyright) auto-hidden on arrival — verify each within 4h.
2. Verify public absence after action (row → “View public” must 404).
3. Log resolution + audit; block records for recurring patterns.
4. Escalation path for unlawful-content reports: preserve record → report to source platform → legal counsel per docs/LEGAL-COMPLIANCE §6.

## 13. Definition of production-ready (per feature)
Four states + tests + a11y + budgets + docs + audit hooks + observability events + no placeholders — all verified by the paired PRE-RELEASE rows.
