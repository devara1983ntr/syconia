# Phase M1-ANDROID-FOUNDATION (v1.1.0)

**Objective:** Gradle scaffold, M3 theme/tokens, fonts, icons, components, age gate, chrome, navigation, legal, system states, E2E, data/domain layer.

**Entry:** prior phase gate PASS · **Exit:** [M1-GATE](../../gates/M1-GATE.md) with evidence

| ID | Title | Status | Deps | Disposition |
|---|---|---|---|---|
| [M1-T001](../../tasks/M1/M1-T001.md) | Android Gradle scaffold (Kotlin, Compose, Hilt, multi-module) | NOT_STARTED | M0-T003 | REPLACE (was Next.js scaffold) |
| [M1-T002](../../tasks/M1/M1-T002.md) | Android quality toolchain (detekt, ktlint, unit/emulator harness, CI android track) | NOT_STARTED | M1-T001 | MODIFY (was web tooling) |
| [M1-T003](../../tasks/M1/M1-T003.md) | SyconiaTheme: Material 3 theme from SYCONIA tokens | NOT_STARTED | M1-T001 | REPLACE (was tokens.css/Tailwind wiring) |
| [M1-T004](../../tasks/M1/M1-T004.md) | Bundled fonts (Fraunces + Inter) in Compose | NOT_STARTED | M1-T003 | MODIFY (was next/font self-hosting) |
| [M1-T005](../../tasks/M1/M1-T005.md) | Launcher + adaptive icons from official assets | NOT_STARTED | M1-T002 | REPLACE (was favicon wiring) |
| [M1-T006](../../tasks/M1/M1-T006.md) | Motion spec in Compose (DS §9 values) | NOT_STARTED | M1-T003 | MODIFY (was motion/react config) |
| [M1-T007](../../tasks/M1/M1-T007.md) | App config + secure defaults (endpoint config, no secrets) | NOT_STARTED | M1-T001 | MODIFY (was env.ts) |
| [M1-T008](../../tasks/M1/M1-T008.md) | Component batch 1 — controls (Button, IconButton, TextField, Select, Checkbox, Switch, Slider) | NOT_STARTED | M1-T003, M1-T004 | MODIFY (was web primitives) |
| [M1-T009](../../tasks/M1/M1-T009.md) | Component batch 2 — overlays & navigation (Badge, Tooltip, Dropdown, Modal/Dialog, DrawerSheet, BottomSheet, Tabs, Toast, Alert, Pagination, Breadcrumb) | NOT_STARTED | M1-T008 | MODIFY |
| [M1-T010](../../tasks/M1/M1-T010.md) | Component batch 3 — media/data/states (Card, Skeleton, SearchField, FilterBar, EmptyState, ErrorState, OfflineBanner, chips, DurationBadge, MetaRow, ProvenanceChip) | NOT_STARTED | M1-T008, M1-T009 | MODIFY |
| [M1-T011](../../tasks/M1/M1-T011.md) | Age gate: first-run 18+ gate + DataStore persistence + API attestation header | NOT_STARTED | M1-T007 | MODIFY (was middleware+cookie) |
| [M1-T012](../../tasks/M1/M1-T012.md) | Age Gate screen S-01 (Compose) | NOT_STARTED | M1-T005, M1-T008, M1-T011 | MODIFY (was web S-01) |
| [M1-T013](../../tasks/M1/M1-T013.md) | Global chrome S-00: top bar, navigation drawer, system back, search entry | NOT_STARTED | M1-T009 | MODIFY (was header/hamburger web chrome) |
| [M1-T014](../../tasks/M1/M1-T014.md) | Navigation graph: all destinations + deep links + state restoration | NOT_STARTED | M1-T010, M1-T013 | MODIFY (was routing scaffold) |
| [M1-T015](../../tasks/M1/M1-T015.md) | In-app legal + about + contact surfaces | NOT_STARTED | M1-T008, M1-T014 | MODIFY (was web legal pages) |
| [M1-T016](../../tasks/M1/M1-T016.md) | System screens: error/offline/no-connectivity compositions (E-05/E-16/E-17) | NOT_STARTED | M1-T010, M1-T014 | MODIFY (was 404/500/offline web) |
| [M1-T017](../../tasks/M1/M1-T017.md) | E2E smoke suite (golden journeys) on emulator | NOT_STARTED | M1-T002, M1-T012, M1-T013, M1-T016 | MODIFY (was Playwright smoke) |
| [M1-T018](../../tasks/M1/M1-T018.md) | Component gallery: previews + screenshot regression baselines | NOT_STARTED | M1-T008, M1-T009, M1-T010 | MODIFY (was Storybook) |
| [M1-T019](../../tasks/M1/M1-T019.md) | Data/domain architecture layer (Retrofit services, DTO mapping, repositories, DataStore) | NOT_STARTED | M1-T001, M1-T007 | REPLACE (supersedes retired M2-T018 TanStack layer) |
