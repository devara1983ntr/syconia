# SYCONIA — Documentation Index

Version 1.0.0 · 2026-09-03 · Owner: Roshan · Consolidated PDF: [SYCONIA-PROJECT-SPECIFICATION.pdf](./SYCONIA-PROJECT-SPECIFICATION.pdf)

## Reading order (recommended)

1. **README.md** — orientation, stack, index of indexes.
2. **PRD.md** — what SYCONIA is; product laws; conflicts register (§17).
3. **ARCHITECTURE.md** / **DATABASE.md** / **API.md** — how it is built.
4. **SCREENS.md** / **UX-FLOWS.md** / **GESTURES.md** / **DESIGN-SYSTEM.md** — what it looks like and how it behaves.
5. **Quality block** — SECURITY / PERFORMANCE / SEO / ACCESSIBILITY / ERROR-STATES.
6. **Delivery block** — TESTING / CI-CD / DEPLOYMENT / PRE-RELEASE / SOP.
7. **Governance** — AGENT (build executor), docs/LEGAL-COMPLIANCE, CHANGELOG.

## Complete document register

| # | Document | Path | Purpose |
|---|---|---|---|
| 1 | Master PRD | [PRD.md](../PRD.md) | Product requirements, scope laws, feature specs, conflicts register |
| 2 | Advanced spec | [PRD2.md](../PRD2.md) | Ranking math, cursors, cache matrix, adapter contract, SLOs, risks |
| 3 | SOP | [SOP.md](../SOP.md) | Dev/test/release/maintenance/incident procedures |
| 4 | Agent instructions | [AGENT.md](../AGENT.md) | Laws + milestones M1–M5 for AI coding agents |
| 5 | Screens | [SCREENS.md](../SCREENS.md) | 22 screen specs (public + admin) with layouts/states/a11y |
| 6 | UX flows | [UX-FLOWS.md](../UX-FLOWS.md) | IA, navigation rules, 15 workflows, back-arrow semantics |
| 7 | Design system | [DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md) | Brand assets, tokens, typography, motion, components |
| 8 | Gestures | [GESTURES.md](../GESTURES.md) | Touch/mouse/keyboard + player interaction model |
| 9 | Architecture | [ARCHITECTURE.md](../ARCHITECTURE.md) | Hybrid 3-plane architecture, stack, env, invariants |
| 10 | Database | [DATABASE.md](../DATABASE.md) | 17-table schema, indexes, lifecycle, retention, roles |
| 11 | API | [API.md](../API.md) | Public/admin endpoints + external adapter contracts |
| 12 | Security | [SECURITY.md](../SECURITY.md) | Threat model, CSP/SSRF/privacy, checklist |
| 13 | Performance | [PERFORMANCE.md](../PERFORMANCE.md) | CWV budgets, loading, caching, containment |
| 14 | SEO | [SEO.md](../SEO.md) | Technical/on-page/structured-data + adult-policy compliance |
| 15 | Testing | [TESTING.md](../TESTING.md) | Strategy, browser matrix, traceability (T-01…T-86) |
| 16 | CI/CD | [CI-CD.md](../CI-CD.md) | Pipeline stages, gates G-1…G-12, release flow |
| 17 | Error states | [ERROR-STATES.md](../ERROR-STATES.md) | E-01…E-20 catalogue + retry/offline semantics |
| 18 | Accessibility | [ACCESSIBILITY.md](../ACCESSIBILITY.md) | WCAG 2.2 AA requirements + embed gap statement |
| 19 | Deployment | [DEPLOYMENT.md](../DEPLOYMENT.md) | Topology, HTTPS, env, rollback, ops calendar |
| 20 | Pre-release | [PRE-RELEASE.md](../PRE-RELEASE.md) | PASS/FAIL production gate (16 sections) |
| 21 | README | [README.md](../README.md) | Project overview + documentation index |
| 22 | Changelog | [CHANGELOG.md](../CHANGELOG.md) | Version history (1.0.0 documentation baseline) |
| 23 | This index | [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md) | Register + reading order |
| + | Legal compliance | [LEGAL-COMPLIANCE.md](./LEGAL-COMPLIANCE.md) | Age verification, sources/ToS, DMCA/2257 posture, jurisdictional notes |
| + | Brand assets | `/branding/` | Official logo variants + guidelines PDF (`[EXISTING]`) |

## Maintenance rules
- Every behavioral change ships with its paired doc update in the same PR (SOP §6).
- This index, CHANGELOG, and the consolidated PDF regenerate on documentation releases (`npm run docs:pdf`).
- Status vocabulary across the suite: `[EXISTING]` verified in repo · `[REQUIRED]` to implement · `[PROPOSED]` future phase · `[CONFLICT]` documented conflict.
