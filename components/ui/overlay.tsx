"use client";

/**
 * SYCONIA overlay core — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * overlay family, ACCESSIBILITY §2, GESTURES §62, SCREENS §213).
 *
 * Shared machinery for every floating/overlay layer (Modal, Drawer,
 * BottomSheet, Dropdown, Tooltip, Toast):
 *
 * 1. **ESC closes topmost** (GESTURES §62 + task acceptance): a module
 *    stack of open layers; only the LAST-registered entry acts on ESC.
 *    Both modal layers (focus-trapping) and transient layers (tooltip,
 *    dropdown) register, so a tooltip hovering over an open modal is
 *    dismissed by the first ESC and the modal by the next.
 * 2. **Focus trap while open + return on close** (ACCESSIBILITY §2 "no
 *    keyboard traps: modals/drawer trap focus *while open* and return
 *    focus on close"): Tab/Shift+Tab wrap within the panel for the
 *    topmost modal layer; focus returns to the pre-open active element.
 * 3. **Body scroll lock** for modal layers only (the scrim must not
 *    wheel-scroll the page behind it); reference-counted so stacked
 *    layers release exactly once.
 * 4. **Portal** — overlays mount at document.body so no ancestor
 *    clipping context can crop them (position: fixed per layer).
 * 5. **Scrim** — the §9 scrim variant (fade 200ms; reduced-motion ≤
 *    100ms opacity-only) on the `--color-scrim` token (D-011: §4 wins
 *    over the SCREENS "40%" figure), z from the D-006 ladder.
 *
 * No Radix/floating deps: native dialog semantics per ACCESSIBILITY §3
 * ("semantic HTML first; ARIA only where semantics are insufficient").
 */

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { m, useReducedMotion } from "motion/react";

import { selectVariants } from "@/lib/motion/variants";

/* ── ESC ordering: the open-layer stack (GESTURES §62) ─────────────── */

interface LayerEntry {
  id: number;
  /** Modal layers trap focus + lock scroll; transient ones do neither. */
  modal: boolean;
  /** Called when this entry is the topmost layer and ESC is pressed. */
  onEscape: () => void;
}

let layerSeq = 0;
const LAYER_STACK: LayerEntry[] = [];

/* ── Reference-counted body scroll lock (modal layers only) ────────── */

let scrollLockCount = 0;

function lockScroll(): void {
  if (++scrollLockCount === 1) {
    document.documentElement.style.overflow = "hidden";
  }
}

function unlockScroll(): void {
  if (scrollLockCount > 0 && --scrollLockCount === 0) {
    document.documentElement.style.overflow = "";
  }
}

/* ── Focusable query for the trap (native semantics, no deps) ──────── */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function focusablesWithin(root: HTMLElement | null): HTMLElement[] {
  if (!root) {
    return [];
  }
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    // Hidden elements cannot receive focus (focus() is a no-op), so the
    // trap stays intact; visibility is not re-derived here.
    (el) => !el.hasAttribute("hidden") && el.getAttribute("aria-hidden") !== "true",
  );
}

export interface DismissableLayerOptions {
  /** Layer is open (registering/unregistering is keyed to this). */
  open: boolean;
  /** ESC-as-topmost dismissal (task: "ESC closes topmost"). */
  onDismiss: () => void;
  /** The focus-trapped panel (modal layers focus it on open). */
  panelRef: RefObject<HTMLElement | null>;
  /** Modal: focus trap + scroll lock + initial panel focus. */
  modal: boolean;
  /** Restore focus to the pre-open element on close (default true). */
  restoreFocus?: boolean;
  /** Pointerdown outside panel+trigger dismisses (Dropdown). */
  dismissOnOutsidePointer?: boolean;
  /** Outside trigger element (paired with dismissOnOutsidePointer). */
  anchorRef?: RefObject<HTMLElement | null>;
}

/**
 * Registers a dismissable layer while `open`: ESC-topmost handling,
 * focus trap/restore (modal), scroll lock (modal), outside-pointer
 * dismissal (transient menus). All listeners are document-capture so
 * they see keys before the focused child and ordering is exact.
 */
export function useDismissableLayer({
  open,
  onDismiss,
  panelRef,
  modal,
  restoreFocus = true,
  dismissOnOutsidePointer = false,
  anchorRef,
}: DismissableLayerOptions): void {
  const onDismissRef = useRef(onDismiss);
  const savedFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const id = ++layerSeq;
    LAYER_STACK.push({ id, modal, onEscape: () => onDismissRef.current() });
    // Snapshot the panel node for the cleanup (the ref may be null by
    // then — the exit animation unmounts the node after this effect).
    const panel = panelRef.current;

    savedFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (modal) {
      lockScroll();
      // APG dialog: initial focus on the dialog itself (tabIndex -1 on
      // the panel element); Tab then walks the focusables.
      panelRef.current?.focus();
    }

    const isTopmost = () => LAYER_STACK[LAYER_STACK.length - 1]?.id === id;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isTopmost()) {
        // Consume for this layer only — lower layers stay open.
        event.preventDefault();
        event.stopPropagation();
        onDismissRef.current();
        return;
      }
      if (!modal || !isTopmost()) {
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const panel = panelRef.current;
      if (!panel) {
        return;
      }
      const items = focusablesWithin(panel);
      const active = document.activeElement;
      if (items.length === 0) {
        // Nothing tabbable inside: keep focus on the panel itself.
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey) {
        if (active === first || active === panel || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || active === panel || !panel.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Node ? event.target : null;
      if (!target) {
        return;
      }
      if (panelRef.current?.contains(target)) {
        return;
      }
      if (anchorRef?.current?.contains(target)) {
        return;
      }
      // Outside click: dismiss; focus follows the natural click target
      // (the dropdown closes its menu without stealing focus).
      onDismissRef.current();
    };

    document.addEventListener("keydown", onKeyDown, true);
    if (dismissOnOutsidePointer) {
      document.addEventListener("pointerdown", onPointerDown, true);
    }

    return () => {
      const index = LAYER_STACK.findIndex((entry) => entry.id === id);
      if (index !== -1) {
        LAYER_STACK.splice(index, 1);
      }
      document.removeEventListener("keydown", onKeyDown, true);
      if (dismissOnOutsidePointer) {
        document.removeEventListener("pointerdown", onPointerDown, true);
      }
      if (modal) {
        unlockScroll();
      }
      if (restoreFocus) {
        const saved = savedFocusRef.current;
        const active = document.activeElement;
        const focusIsFree =
          active === document.body || (panel?.contains(active) ?? false);
        // Restore only when focus is not already where the app moved it
        // (e.g. a consumer switching dialogs or a click landing outside).
        if (saved?.isConnected && focusIsFree) {
          saved.focus();
        }
      }
    };
  }, [open, modal, panelRef, restoreFocus, dismissOnOutsidePointer, anchorRef]);
}

/* ── Portal (SSR-safe; overlays are interactive-only DOM) ──────────── */

export function Portal({ children }: { children: ReactNode }): React.JSX.Element | null {
  // Resolve on the FIRST client render (not after an effect): layer
  // effects in the overlay components must find panel refs already in
  // the DOM — e.g. the initial APG dialog focus. During SSR (no
  // document) the portal yields nothing; client-side the body portal
  // mounts fresh (portal subtrees are outside hydration matching).
  const [mounted] = useState(() => typeof document !== "undefined");
  if (!mounted) {
    return null;
  }
  return createPortal(children, document.body);
}

/* ── Scrim — §9 fade 200ms on the --color-scrim token (D-011) ─────── */

export interface ScrimProps {
  /** Scrim tap dismisses (S-00: "Close: X button, scrim tap, ESC"). */
  onClick: () => void;
}

export function Scrim({ onClick }: ScrimProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const v = selectVariants(reduced);
  return (
    <m.div
      aria-hidden
      variants={v.scrim}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onClick}
      className="fixed inset-0 bg-scrim"
      style={{ zIndex: "var(--z-scrim)" }}
    />
  );
}

/* ── Shared panel surface (§6: elevation-2 drawer/modal, hairline) ── */

export const PANEL_SURFACE =
  "bg-surface-elevated border border-border shadow-elevation-2" as const;
