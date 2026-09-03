# SYCONIA — Interaction & Gesture Specification (touch, mouse, keyboard, video player)

| Field | Value |
|---|---|
| Document | GESTURES.md · v1.0.1 · 2026-09-03 · `[REQUIRED]` target behavior |

---

## 1. Guiding principles
1. **Honesty about embeds.** Playback runs inside third-party official embed players (iframe). SYCONIA controls the *shell* unconditionally, and controls *playback* only when the adapter's `capabilitySet` declares delegation (PRD2 §6). The UI never renders a control a source cannot honor.
2. **No media manipulation.** Gestures translate to official player APIs or shell actions only; SYCONIA never intercepts, re-hosts, or scripts embed internals.
3. **Privacy-first defaults.** Muted-only autoplay, discreet thumbnails, no hover previews when `saveData`/reduced-motion is on.
4. **Platform parity with documented divergence.** iOS Safari restrictions are listed, not hidden (§7).

## 2. Capability model (normative)
| Capability flag | Unlocks |
|---|---|
| `fullscreen-delegation` | Shell fullscreen via Fullscreen API wrapping the stage |
| `tap-overlay` | Tap-to-toggle overlay chrome on the stage |
| `keyboard-passthrough` | Player-native keyboard shortcuts remain active while stage focused |
| `preview-media` | Hover/press animated previews in cards (source-provided media only) |
| `captions-signal` | Shell shows a captions availability hint linking to native control |
| `speed-signal` | Shell shows speed availability hint linking to native control |

Default (any source, always ours): fullscreen toggle, theater mode, report, share, open-at-source, watermark, loading/error states. Source players always keep their own native controls visible within the iframe.

## 3. Video-player touch interactions
| Gesture | Result | Condition |
|---|---|---|
| Single tap on stage | Toggle source-player controls (native) + our corner overlay | `tap-overlay` or native |
| Double-tap left/right third | Seek −10s / +10s with ripple indicator | `player_api` sources only; otherwise no-op (native player handles its own) |
| Double-tap center | Toggle play/pause | same |
| Vertical drag (stage, right half) | Volume slider overlay (native when delegated only) | `player_api` |
| Horizontal drag on stage | Scrub preview with time bubble (native when delegated only) | `player_api` |
| Two-finger horizontal swipe | Next/prev related item — **disabled by default** (accidental-loss risk); enable in drawer settings `[PROPOSED]` | — |
| Swipe down (in fullscreen) | Exit fullscreen (120ms) | shell |
| Swipe down (mini-player, mobile) | Dismiss mini-player | `[PROPOSED]` |
| Long-press (600ms) | 2× speed while held, with chip “2×” (native when delegated only) | `player_api` |
| Pinch | No action (intentionally disabled to protect playback) | — |
| Edge swipe right (mobile) | History back — **only from left 24px edge and never from the stage** | global |

Touch rules: 44×44 minimum targets; 8px movement threshold before a gesture counts (tap vs swipe); gestures never fire while a modal is open; `touch-action` correctly set per region (stage: none; rails: pan-x; pages: auto).

## 4. Mouse / pointer interactions
| Input | Result |
|---|---|
| Hover card | Veil lifts, scale 1.02 (180ms), optional preview (capability + fine pointer + saveData=false) |
| Click card | Open watch |
| Click stage | Native player behavior + our overlay |
| Double-click stage | Fullscreen (shell) |
| Hover overlay buttons | Gold underline grow (120ms) |
| Wheel on rails | Horizontal translate (desktop convenience, 64px/tick, momentum-free) |
| Right-click | Native context menu allowed (no blocking); watermark is non-removable part of stage backdrop, not the media |
| Text selection | Allowed on metadata; disabled on stage only |
| Cursor | `pointer` on affordances; hidden after 2s idle in fullscreen |

## 5. Keyboard shortcuts (global + player)
| Key | Context | Action |
|---|---|---|
| `/` | anywhere (public) | Focus search |
| `?` | anywhere | Shortcuts overlay (this table, contextual) |
| `ESC` | any overlay | Close topmost (drawer/modal/search sheet); in fullscreen exit FS first |
| `Tab` / `Shift+Tab` | everywhere | Cycle focus (visual order, visible ring) |
| `Enter` / `Space` | focused card/button | Activate (Space never scrolls when target is a control) |
| `F` | watch | Toggle fullscreen (shell) |
| `T` | watch | Toggle theater mode |
| `M` | watch | Mute toggle — delegated sources only; otherwise focuses the native player region |
| `←`/`→` (5s), `J`/`L` (10s), `K`/`Space` play-pause, `0–9` seek-to-%, `↑`/`↓` volume, `C` captions, `Shift+.`/`Shift+,` speed | watch | **Deferred to source player** (`keyboard-passthrough`): our shell documents and yields these to the embed; where passthrough is blocked by the iframe, the shortcuts overlay marks them “source player” — no emulation is faked |
| `[` / `]` | listings | Move between filter chips (roving focus) |

Rules: shortcuts never fire while typing in a field; all are discoverable via `?` overlay; player-region shortcuts require stage focus (outlined on focus); arrow-key scrolling of rail groups when group focused.

## 6. Playback state behaviors
- **Play/pause:** user-initiated always; embed-native. Shell play affordance (poster) triggers first init.
- **Seek/scrub:** native control bar inside embed; delegated sources get our overlay seek (§3).
- **Volume/mute:** native; delegated sources mirror state into shell icon (if signal provided).
- **Fullscreen:** shell-level Fullscreen API on the stage wrapper (works even for pure iframes); Safari `<video>`-native webkit fallback belongs to the source player — documented divergence (§7).
- **Playback speed / captions:** where supported by the source player's own UI; shell surfaces a hint chip only (`speed-signal`/`captions-signal`). No fake controls.
- **Buffering:** embed shows its native spinner; our ostiole pulse shows *before* embed init and during shell-level retries; buffering ≥8s offers a gentle “Still loading — Open at source?” chip (dismissable).
- **Autoplay policy:** never on page load. After first user play in a session, *subsequent* watch-page navigations may autoplay muted (sessionStorage flag) — never unmuted, never before interaction; disabled when `saveData` is true.
- **Orientation (mobile):** rotating device while stage active: if fullscreen already on → OS handles; else show one-time chip “Rotate for fullscreen” (tappable, rememberable). No forced landscape lock (respect user control).
- **Mobile browser behavior:** iOS: fullscreen = source-player behavior (webkit) — shell theater mode offered as alternative; inline playback per source policy. Android Chrome: shell fullscreen works; media session notification belongs to source player. Backgrounding the tab pauses embeds natively; we also unload embeds after 30min backgrounded (battery/discretion).
- **Source failure:** E-07 ladder (Retry → Alternate embed variant if provided → Open at source → Report); `player_error` beacon; item flagged `degraded` for probe job.
- **Fallback source:** some sources expose multiple embed endpoints; adapter may supply an ordered `embedFallbacks[]`; the ladder tries each once (8s timeout), then resolves to failure overlay — total failure UX never exceeds 3 user-visible steps.
- **Unsupported/geo-blocked source:** `probe` marks `geo`; UI shows “This selection isn’t available in your region” + Related (no external workaround links — deliberate policy).
- **Privacy/discretion in player:** watermark 128px @20% opacity bottom-right (brand asset, `aria-hidden`); neutral clipboard/title behaviors (UX-FLOWS §14); no history API writes beyond our routes; referrer hygiene on all external links.

## 7. Documented platform divergences (honest limitations)
| Platform | Divergence |
|---|---|
| iOS Safari | No Fullscreen API on iframes → theater mode substitute; native player controls govern; volume gestures n/a (hardware) |
| iOS Safari | `100vh` instability → stage uses `dvh` with fallback; tested at S-02/S-07 |
| Android Chrome | Media-session notification from source player; back-button exits FS before route (history guard) |
| Firefox desktop | Picture-in-Picture belongs to source player; not re-implemented |
| Safari desktop | Wheel-volume n/a; `?:` overlay notes it |

## 8. Non-player gestures (site-wide)
- Pull-to-refresh on listings `[PROPOSED]` (default off to protect scroll anchors).
- Swipe-dismiss: toasts, filter chips, mobile bottom sheets (downward, 25% threshold).
- Long-press card (touch): context sheet (Copy link / Report / Hide locally `[PROPOSED]`).
- Drawer: edge-swipe open (rightward from left 24px), swipe-left close, scrim tap close.
- Overscroll: chained at document level only; rails use `overscroll-behavior: contain`.

## 9. Player interaction acceptance matrix (test basis — TESTING §7 T-40…T-48)
Every capability flag × {tap, double-tap, drag, long-press, keyboard F/T/ESC, fullscreen enter/exit, buffering chip, failure ladder, geo block, autoplay policy, rotate chip, background unload} × {Chromium, Firefox, iOS Safari (manual/BrowserStack), Android Chrome} — expected results per §3–§7; divergence rows assert the *documented* divergence, not an idealized one.
