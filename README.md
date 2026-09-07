# SYCONIA

**The Beauty of the Inward Experience.**

SYCONIA (pronounced *sy-COHN-ee-uh*, from *syconium* — the enclosed fig bloom) is a premium, dark-themed **adult media discovery and streaming application**. It stores no media: playback is delivered exclusively through the official embed players and APIs of approved third-party sources, wrapped in a cinematic, editorial, discreet brand experience. There are no accounts, no payments, no premium tiers — an anonymous 18+ age gate is the only barrier.

- **Developer credit:** Roshan
- **Documentation:** v1.1.0 (Android platform migration) — 2026-09-03
- **Status:** Documentation-complete, pre-implementation. **SYCONIA is now a native Android application** (platform migration from the former web-oriented baseline; see [CHANGELOG.md](./CHANGELOG.md) §1.0.3 and [.ai/DECISIONS.md](./.ai/DECISIONS.md) D-010…D-019). No application code exists yet — nothing here claims implemented features.

---

## Platform & stack (planned — see [ARCHITECTURE.md](./ARCHITECTURE.md))

| Layer | Choice |
|---|---|
| **Client** | Native Android · **Kotlin** · **Jetpack Compose** · **Material 3** (themed from SYCONIA tokens) |
| Architecture | Clean Architecture (ui/domain/data) · **MVVM + UDF** · **Coroutines/Flow** |
| DI / Navigation | **Hilt** · **Navigation Compose** (App Links, predictive back) |
| Networking / Imaging | Retrofit + OkHttp + kotlinx-serialization · Coil (decisions D-011/D-012) |
| Playback | Hardened **WebView embed shell** (official source embeds only; gated by B-001/G-04) — D-013 |
| Persistence | DataStore; Room only where task-justified; **no local media ever** — D-014 |
| **Backend service** | Node.js 20+ · TypeScript strict · Next.js in **backend-only role** (public API, admin console, legal/share web surface, jobs) — D-010 |
| Database / ORM | PostgreSQL 16+ · Drizzle ORM (backend concern only) |
| Fonts / brand | Fraunces + Inter (SIL OFL, bundled from `branding/fonts/`) · official brand assets only |
| Tests / CI | JUnit/Turbine/MockK · Compose UI tests · Espresso · Macrobenchmark · detekt/ktlint; Vitest/Playwright retained on backend; GitHub Actions dual track |

## Documented vs implemented vs gated (honest)

- **Documented:** the full v1.1.0 specification suite (below) — architecture, screens, flows, quality gates.
- **Implemented:** nothing. No app code, no backend code. `.ai/CURRENT-STATE.md` is the live truth.
- **Gated:** media-source integration (G-04/**B-001** — operator authorization; no provider invented), production hosting (B-003), final legal copy (B-002), Play/distribution choice (M5-T006 decision). SVG brand masters remain open (AG-001).

## Documentation index

**Product:** [PRD.md](./PRD.md) · [PRD2.md](./PRD2.md) · [UX-FLOWS.md](./UX-FLOWS.md) · [SCREENS.md](./SCREENS.md)
**Design:** [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) · [GESTURES.md](./GESTURES.md) · [branding/](./branding) (asset manifest · icon system · category-art system)
**Engineering:** [ARCHITECTURE.md](./ARCHITECTURE.md) · [DATABASE.md](./DATABASE.md) · [API.md](./API.md) · [CI-CD.md](./CI-CD.md) · [TESTING.md](./TESTING.md)
**Quality & ops:** [SECURITY.md](./SECURITY.md) · [PERFORMANCE.md](./PERFORMANCE.md) · [SEO.md](./SEO.md) · [ACCESSIBILITY.md](./ACCESSIBILITY.md) · [ERROR-STATES.md](./ERROR-STATES.md) · [SOP.md](./SOP.md) · [DEPLOYMENT.md](./DEPLOYMENT.md) · [PRE-RELEASE.md](./PRE-RELEASE.md)
**Agents & governance:** [AGENT.md](./AGENT.md) · [CHANGELOG.md](./CHANGELOG.md) · [docs/DOCUMENTATION-INDEX.md](./docs/DOCUMENTATION-INDEX.md) · [docs/LEGAL-COMPLIANCE.md](./docs/LEGAL-COMPLIANCE.md) · [.ai/](./.ai) (execution-control system)
**Consolidated:** [docs/SYCONIA-PROJECT-SPECIFICATION.pdf](./docs/SYCONIA-PROJECT-SPECIFICATION.pdf)

**Primary client & identity (D-023):** Android (`com.syconia.android` — canonical application ID/namespace; Kotlin · Compose · Material 3) is the **current primary client implementation target**. The web implementation is **historical/superseded, preserved** (isolation under `/web` planned as task M0-T006). The backend stays a separate service plane. **No Android implementation exists yet** — foundation begins at M1-T001; nothing in `/android` may exist before that task explicitly starts.

## Repository layout

```
/branding/      Official SYCONIA brand assets + asset manifest + design tokens (identity truth)
/docs/          Documentation index, legal compliance spec, consolidated PDF, release records
/.ai/           78-record execution-control system (tasks, gates, audits, decisions)
/web/           Web client plane [ISOLATED — M0-T006]: Storybook gallery + stories + web component tests (design-system library shared at root for backend web surfaces)
/android/       [PLANNED — M1-T001] native Android client (Gradle multi-module — ARCHITECTURE §3); NO implementation exists yet
/backend/       [PLANNED] backend service (API + admin console + legal/share web + jobs; physically root app/, lib/, drizzle/)
/.skills/       Cloned development aids (ui-ux-pro-max design skill; advisory only, git-ignored)
```

## Development rules (summary)

Zero-placeholder policy (AGENT.md §2.1): no fake data/UI/media/logos/icons/markers — honest loading/empty/error/offline states instead. Official brand assets only. No media storage. Scope laws: no accounts, no payments, no creator surfaces, no public developer API. Gates B-001/B-002/B-003 are never bypassed or fabricated. Setup/build/test/lint/release procedures: [SOP.md](./SOP.md) (they become executable when implementation begins — M0-T003 → M1-T001).
