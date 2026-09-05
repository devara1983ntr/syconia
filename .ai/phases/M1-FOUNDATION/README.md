# Phase M1-FOUNDATION

**Objective (AGENT.md §4):** Scaffold, tokens/primitives, middleware+headers, chrome, age gate, routing, legal, system pages, test harness.

**Entry:** M0-RECON gate PASS · **Exit:** [M1-GATE](../../gates/M1-GATE.md) with evidence

**Tasks:**

| ID | Title | Status | Depends on |
|---|---|---|---|
| [M1-T001](../../tasks/M1/M1-T001.md) | Initialize Next.js + TypeScript strict scaffold | COMPLETE | M0-T003 |
| [M1-T002](../../tasks/M1/M1-T002.md) | Install test/quality toolchain (Vitest, Testing Library, Playwright, axe, custom lint rules) | COMPLETE | M1-T001 |
| [M1-T003](../../tasks/M1/M1-T003.md) | Implement design tokens layer + Tailwind v4 wiring | COMPLETE | M1-T001 |
| [M1-T004](../../tasks/M1/M1-T004.md) | Self-host fonts (Fraunces + Inter) via next/font | COMPLETE | M1-T003 |
| [M1-T005](../../tasks/M1/M1-T005.md) | Integrate official brand assets (favicon, icons, logo components) | COMPLETE | M1-T003, M1-T004 |
| [M1-T006](../../tasks/M1/M1-T006.md) | Configure Motion (motion/react LazyMotion) | COMPLETE | M1-T001 |
| [M1-T007](../../tasks/M1/M1-T007.md) | Env validation + Zod boundary schemas (/lib/env.ts, /lib/validation) | COMPLETE | M1-T001 |
| [M1-T008](../../tasks/M1/M1-T008.md) | Primitives batch 1 — form controls (Button, IconButton, Input, Select, Textarea, Checkbox, Radio, Switch) | COMPLETE | M1-T003, M1-T004, M1-T006 |
| [M1-T009](../../tasks/M1/M1-T009.md) | Primitives batch 2 — overlays & navigation (Badge, Tooltip, Dropdown, Modal, Drawer, BottomSheet, Tabs, Toast, Alert, Pagination, Breadcrumb) | NOT_STARTED | M1-T008 |
| [M1-T010](../../tasks/M1/M1-T010.md) | Primitives batch 3 — media/data/states (Card, Avatar, Skeleton, SearchBar combobox, FilterBar, EmptyState, LoadingState, ErrorState, OfflineBanner, chips/badges) | NOT_STARTED | M1-T008, M1-T009 |
| [M1-T011](../../tasks/M1/M1-T011.md) | Middleware: age-gate enforcement + security headers + request-id | NOT_STARTED | M1-T007 |
| [M1-T012](../../tasks/M1/M1-T012.md) | Age Gate screen S-01 | NOT_STARTED | M1-T005, M1-T008, M1-T011 |
| [M1-T013](../../tasks/M1/M1-T013.md) | Global chrome S-00 (header, hamburger drawer, back arrow, footer) | NOT_STARTED | M1-T005, M1-T009 |
| [M1-T014](../../tasks/M1/M1-T014.md) | Public routing scaffold for all screens + four-state wiring | NOT_STARTED | M1-T010, M1-T013 |
| [M1-T015](../../tasks/M1/M1-T015.md) | Legal/info pages S-08 with real draft copy + contact form | NOT_STARTED | M1-T008, M1-T014 |
| [M1-T016](../../tasks/M1/M1-T016.md) | System pages: 404 / 500 / offline + E-16/E-17/E-05 compositions | NOT_STARTED | M1-T010, M1-T014 |
| [M1-T017](../../tasks/M1/M1-T017.md) | E2E smoke suite + axe wiring (golden journeys) | NOT_STARTED | M1-T002, M1-T012, M1-T013, M1-T016 |
| [M1-T018](../../tasks/M1/M1-T018.md) | Storybook primitive gallery + visual-regression harness | NOT_STARTED | M1-T008, M1-T009, M1-T010 |
