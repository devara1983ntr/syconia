# SYCONIA

**The Beauty of the Inward Experience.**

SYCONIA (pronounced *sy-COHN-ee-uh*, from *syconium* — the enclosed fig bloom) is a premium, dark-themed **adult media discovery and streaming platform**. It stores no media: playback is delivered exclusively through the official embed players and APIs of approved third-party sources, wrapped in a cinematic, editorial, discreet brand experience. There are no accounts, no payments, no premium tiers — an anonymous 18+ age gate is the only barrier.

- **Developer credit:** Roshan
- **Documentation:** v1.0.1 (QA-audited baseline) — 2026-09-03
- **Status:** Documentation-complete, pre-implementation (see [CHANGELOG.md](./CHANGELOG.md))

---

## Stack (planned — see [ARCHITECTURE.md](./ARCHITECTURE.md))

| Layer | Choice |
|---|---|
| Framework | Next.js 15+ (App Router, RSC, TypeScript 5 strict) |
| Database | PostgreSQL 16+ |
| ORM | Drizzle ORM |
| Animation | `motion` (Framer Motion, `motion/react`) |
| Client data | TanStack Query v5 |
| Styling | Tailwind CSS v4 implementing SYCONIA design tokens |
| Validation / icons / fonts | Zod · lucide-react · Fraunces + Inter (SIL OFL, self-hosted) |
| Tests / CI | Vitest · Testing Library · Playwright · axe-core · GitHub Actions |

## Documentation index

**Product:** [PRD.md](./PRD.md) · [PRD2.md](./PRD2.md) · [UX-FLOWS.md](./UX-FLOWS.md) · [SCREENS.md](./SCREENS.md)
**Design:** [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) · [GESTURES.md](./GESTURES.md)
**Engineering:** [ARCHITECTURE.md](./ARCHITECTURE.md) · [DATABASE.md](./DATABASE.md) · [API.md](./API.md) · [CI-CD.md](./CI-CD.md) · [TESTING.md](./TESTING.md)
**Quality & ops:** [SECURITY.md](./SECURITY.md) · [PERFORMANCE.md](./PERFORMANCE.md) · [SEO.md](./SEO.md) · [ACCESSIBILITY.md](./ACCESSIBILITY.md) · [ERROR-STATES.md](./ERROR-STATES.md) · [SOP.md](./SOP.md) · [DEPLOYMENT.md](./DEPLOYMENT.md) · [PRE-RELEASE.md](./PRE-RELEASE.md)
**Agents & governance:** [AGENT.md](./AGENT.md) · [CHANGELOG.md](./CHANGELOG.md) · [docs/DOCUMENTATION-INDEX.md](./docs/DOCUMENTATION-INDEX.md) · [docs/LEGAL-COMPLIANCE.md](./docs/LEGAL-COMPLIANCE.md)
**Consolidated:** [docs/SYCONIA-PROJECT-SPECIFICATION.pdf](./docs/SYCONIA-PROJECT-SPECIFICATION.pdf)

## Repository layout

```
/branding/      Official SYCONIA brand assets (source of truth for identity)
/docs/          Documentation index, legal compliance spec, consolidated PDF, release records
/.skills/       Cloned development aids (ui-ux-pro-max design skill; advisory only, git-ignored)
/*.md           Project specification suite (this index)
```

## Brand quick reference

Night Emerald `#012A21` · Obsidian Black `#09090B` · Ostiole Gold `#C5A059` · Champagne Gold `#E6D3A0` · Alabaster `#FAF9F6`. Logo assets, clear-space rule (4× ostiole dot), variants and usage rules: [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) §2–3.

## Setup (when implementation begins — [SOP.md](./SOP.md) §1)

```bash
npm ci
cp .env.example .env.local   # fill per ARCHITECTURE §12
npm run db:migrate
npm run dev
```

## Content & legal posture

18+ only · age-gated server-side · playback via approved official embed sources only · DMCA/takedown workflow with SLA · zero-tolerance prohibited-content policy · truthful business representation (the brand-guidelines "Corporate Decoy" concept is explicitly rejected — PRD §17, docs/LEGAL-COMPLIANCE.md §3).
