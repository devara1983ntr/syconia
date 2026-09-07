# SYCONIA — Accessibility Requirements (WCAG 2.2 AA)

| Field | Value |
|---|---|
| Document | ACCESSIBILITY.md · v1.1.0 · 2026-09-03 (Android platform migration) · `[REQUIRED]` — conformance target: **WCAG 2.2 Level AA principles** (product law; PRD §9) applied via **Android accessibility APIs + guidance** (Compose semantics, TalkBack, font scaling) |

---

## 1. Commitment & scope
All public and admin surfaces conform to WCAG 2.2 AA. Third-party embed players are outside our DOM; we therefore (a) provide every capability we can at the shell level, (b) prefer sources whose players have their own accessibility where choice exists, (c) document residual gaps honestly (§8) rather than claim conformance we cannot control.

## 2. Focus, traversal & non-pointer access (WCAG 2.1.1/2.1.2/2.4.3/2.4.7/2.4.11 via Android)
- Every flow completable with TalkBack + swipe navigation, D-pad/keyboard (external keyboards, TV-style remotes where supported), and switch access — CI-enforced journeys (TESTING §6).
- Compose: sensible traversal order (semantic grouping), `focusable`/`focusProperties` management, focus restoration after dialogs/drawer, no focus traps (back always exits topmost layer); visible focus indication on external-keyboard interactions.
- Skip mechanism: first-content "Skip to main content" semantics honored via heading/navigation semantics; landmark roles via `semantics { }` (navigation/main/contentDescription).
- Every flow (F1–F5) completable keyboard-only — CI-enforced journeys (TESTING §6).
- No keyboard traps: modals/drawer trap focus *while open* and return focus on close; ESC exits topmost layer.
- Visible focus always: 2px Champagne ring + 2px Obsidian offset on all interactive elements; never `outline: none` without replacement.
- Skip link “Skip to content” first tabbable element; landmark regions (`header/nav/main/footer`).
- Shortcuts (`/`, `?`, F, T) never fire while typing; documented in the `?` overlay (GESTURES §5).
- Focus not obscured by sticky elements (2.4.11): header auto-hides when focus would pass beneath; toasts pause on focus.

## 3. Semantics & screen readers (1.3.x, 4.1.x — TalkBack-first; also Voice Access)
- Semantic Compose first: roles emerge from components (Button, NavigationBar, Scaffold); `Modifier.semantics`/`contentDescription` only where meaning is not conveyed by content; decorative art `clearAndSetSemantics {}` (hidden).
- Labels: every control has a programmatic label; icon-only buttons carry `contentDescription`; live regions → `LiveRegionMode.Polite/Assertive` (suggestion counts, "12 more videos loaded", toasts, player failure announcements).
- Cards: single clickable with accessible name "{title}, {duration}, {source}"; custom actions minimized.
- Admin console (web, backend): real tables/ARIA unchanged from v1.0.2.
- Player: stage `contentDescription` labeled region; watermark hidden; failure overlay is a dialog with focus handling.
- Page/task titles unique & descriptive; `locale` correct.
- Semantic HTML first (`button`/`a`/`nav`/`dialog`); ARIA only where semantics are insufficient (combobox search, drawer dialog, live regions).
- Labels: every control has a programmatic label; icon-only buttons carry `aria-label`; decorative art `aria-hidden`.
- Live regions: suggestion count, “12 more videos loaded”, toast region (`role="status"`), error announcements (`aria-live="polite"` / `assertive` for player failure).
- Cards: single link with accessible name = “{title}, {duration}, {source}”.
- Tables (admin): real `<table>` with `<th scope>`, caption, sortable headers `aria-sort`.
- Player stage: `role="region"` labelled; watermark hidden; failure overlay is a labelled dialog.
- Page titles unique & descriptive; `lang="en"`.

## 4. Contrast & color (1.4.1/1.4.3/1.4.11)
Token table (DESIGN-SYSTEM §4) guarantees: body (Alabaster) 18.9:1, secondary ≥ 4.5:1, tertiary ≥ 4.5:1 (≥14px only); gold-on-dark rule per DESIGN-SYSTEM §4 — Ostiole Gold `#C5A059` (8.1:1) and Champagne Gold `#E6D3A0` (13.4:1) on Obsidian both pass AA for normal-size text and may be used for text accents, links and labels; the large-only restriction applies to light surfaces only; focus ring ≥ 3:1 against adjacent, non-text UI (icons/badges) ≥ 3:1. Verified by unit test over computed values + axe on all states.

## 5. Font scaling & layout resilience (1.4.4/1.4.10/1.4.12): usable at **200% font scale** (sp-based type; no fixed-height text containers; wrapping toolbars) and at small-compact widths; text truncation never removes meaning (marquee/ellipsis + full content via detail views); player controls scale with sp.
Usable at 200% zoom and 320px width: no horizontal scroll, no clipped controls (fluid layouts, wrapping toolbars). Text-spacing overrides (line-height/letter/word) never break layouts. Player remains operable at 200% (controls scale with rem).

## 6. Motion, timing, media (2.2.x/2.3.x): honor **Android reduced-motion/removal of animations** (`Settings.Global.ANIMATOR_DURATION_SCALE`/`TRANSITION_ANIMATION_SCALE` detection + AccessibilityManager) → no shimmer/pulse loops, transitions ≤100ms opacity-only, no shared-element expansions. No auto-updating content except toasts (pausable, 4s). No time limits. No autoplay-with-sound ever (player policy GESTURES §6).
`prefers-reduced-motion` fully honored (DESIGN-SYSTEM §9): no shimmer loops, no pulse, transitions ≤100ms opacity-only, no shared-element expansions. No auto-updating content except toasts (pausable, 4s). No time limits anywhere. No autoplay-with-sound ever (player policy GESTURES §6).

## 7. Input modalities & targets (2.5.x): touch targets ≥48dp (controls/nav rows) with ≥8dp spacing; all functionality reachable without complex gestures (swipes have button equivalents — drawer closes via X/back; seek via native embed controls); no path-based gestures; labels include visible text where icon meaning may be ambiguous.
Targets ≥ 44×44 (controls) / 48 (nav rows); spacing ≥8px between adjacent targets (2.5.8). Pointer gestures: all functionality reachable without complex gestures (swipes have button equivalents — drawers close via X/ESC, seek via native controls); no path-based gestures. Component labels include visual text where icon meaning may be ambiguous.

## 8. Embed-player residual gap statement (honest — unchanged in intent): inside third-party embeds (WebView) we cannot control source-player semantics. Mitigations: capability-driven shell controls are fully accessible; TalkBack users interact with the embed region via its native accessibility where the source provides it; where a source player lacks adequate accessibility, the shell surfaces "Open at source" with the same information density. Gap reviewed annually per source; documented in the in-app accessibility statement (`/about` section) + legal web page.
Inside third-party iframes we cannot control source-player semantics. Mitigations: capability-driven shell controls are fully accessible; keyboard users interact with the embed region via its native accessibility; where a source player lacks adequate accessibility, the shell surfaces “Open at source” with the same information density. Gap reviewed annually per source; documented in the accessibility statement page `[REQUIRED]` (`/about` section), which also states our conformance target and feedback channel.

## 9. Testing & governance (TESTING §6)
axe-core zero-critical on every page state; keyboard journeys in CI; TalkBack (primary) + Voice Access + Switch Access scripted manual passes per release (web console: NVDA/VoiceOver retained); contrast unit tests from tokens; a11y regressions block releases (G-3). Accessibility statement published; feedback route monitored with 5-business-day response target.

## 10. Acceptance criteria
1. Full user journey via TalkBack and via external keyboard on a compact device. 2. axe zero critical across matrix. 3. Reduced-motion honored on all animations (visual regression). 4. 200% zoom + text-spacing usable. 5. Screen-reader script passes on core surfaces. 6. Statement published with feedback channel. 7. All WCAG 2.2 AA criteria pass or carry documented §8 gap notes.
