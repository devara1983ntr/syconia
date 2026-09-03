# SYCONIA — Accessibility Requirements (WCAG 2.2 AA)

| Field | Value |
|---|---|
| Document | ACCESSIBILITY.md · v1.0.1 · 2026-09-03 · `[REQUIRED]` — conformance target: **WCAG 2.2 Level AA** (product law; PRD §9) |

---

## 1. Commitment & scope
All public and admin surfaces conform to WCAG 2.2 AA. Third-party embed players are outside our DOM; we therefore (a) provide every capability we can at the shell level, (b) prefer sources whose players have their own accessibility where choice exists, (c) document residual gaps honestly (§8) rather than claim conformance we cannot control.

## 2. Keyboard access (2.1.1/2.1.2/2.4.3/2.4.7/2.4.11)
- Every flow (F1–F5) completable keyboard-only — CI-enforced journeys (TESTING §6).
- No keyboard traps: modals/drawer trap focus *while open* and return focus on close; ESC exits topmost layer.
- Visible focus always: 2px Champagne ring + 2px Obsidian offset on all interactive elements; never `outline: none` without replacement.
- Skip link “Skip to content” first tabbable element; landmark regions (`header/nav/main/footer`).
- Shortcuts (`/`, `?`, F, T) never fire while typing; documented in the `?` overlay (GESTURES §5).
- Focus not obscured by sticky elements (2.4.11): header auto-hides when focus would pass beneath; toasts pause on focus.

## 3. Semantics & screen readers (1.3.x, 4.1.x)
- Semantic HTML first (`button`/`a`/`nav`/`dialog`); ARIA only where semantics are insufficient (combobox search, drawer dialog, live regions).
- Labels: every control has a programmatic label; icon-only buttons carry `aria-label`; decorative art `aria-hidden`.
- Live regions: suggestion count, “12 more videos loaded”, toast region (`role="status"`), error announcements (`aria-live="polite"` / `assertive` for player failure).
- Cards: single link with accessible name = “{title}, {duration}, {source}”.
- Tables (admin): real `<table>` with `<th scope>`, caption, sortable headers `aria-sort`.
- Player stage: `role="region"` labelled; watermark hidden; failure overlay is a labelled dialog.
- Page titles unique & descriptive; `lang="en"`.

## 4. Contrast & color (1.4.1/1.4.3/1.4.11)
Token table (DESIGN-SYSTEM §4) guarantees: body ≥ 7:1, secondary ≥ 4.5:1, tertiary ≥ 4.5:1 (≥14px only), gold-as-accent law (large/UI use only), focus ring ≥ 3:1 against adjacent, non-text UI (icons/badges) ≥ 3:1. Verified by unit test over computed values + axe on all states.

## 5. Zoom, reflow, text spacing (1.4.4/1.4.10/1.4.12)
Usable at 200% zoom and 320px width: no horizontal scroll, no clipped controls (fluid layouts, wrapping toolbars). Text-spacing overrides (line-height/letter/word) never break layouts. Player remains operable at 200% (controls scale with rem).

## 6. Motion, timing, media (2.2.x/2.3.x)
`prefers-reduced-motion` fully honored (DESIGN-SYSTEM §9): no shimmer loops, no pulse, transitions ≤100ms opacity-only, no shared-element expansions. No auto-updating content except toasts (pausable, 4s). No time limits anywhere. No autoplay-with-sound ever (player policy GESTURES §6).

## 7. Input modalities (2.5.x)
Targets ≥ 44×44 (controls) / 48 (nav rows); spacing ≥8px between adjacent targets (2.5.8). Pointer gestures: all functionality reachable without complex gestures (swipes have button equivalents — drawers close via X/ESC, seek via native controls); no path-based gestures. Component labels include visual text where icon meaning may be ambiguous.

## 8. Embed-player residual gap statement (honest)
Inside third-party iframes we cannot control source-player semantics. Mitigations: capability-driven shell controls are fully accessible; keyboard users interact with the embed region via its native accessibility; where a source player lacks adequate accessibility, the shell surfaces “Open at source” with the same information density. Gap reviewed annually per source; documented in the accessibility statement page `[REQUIRED]` (`/about` section), which also states our conformance target and feedback channel.

## 9. Testing & governance (TESTING §6)
axe-core zero-critical on every page state; keyboard journeys in CI; NVDA/VoiceOver scripted manual passes per release; contrast unit tests from tokens; a11y regressions block releases (G-3). Accessibility statement published; feedback route monitored with 5-business-day response target.

## 10. Acceptance criteria
1. Full user journey keyboard-only on 360px viewport. 2. axe zero critical across matrix. 3. Reduced-motion honored on all animations (visual regression). 4. 200% zoom + text-spacing usable. 5. Screen-reader script passes on core surfaces. 6. Statement published with feedback channel. 7. All WCAG 2.2 AA criteria pass or carry documented §8 gap notes.
