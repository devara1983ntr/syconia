"use client";

/**
 * SYCONIA Drawer — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "Drawer"; §9 "Drawer: translateX −100%→0, 260ms,
 * cubic-bezier(0.22,1,0.36,1); scrim fade 200ms").
 *
 * - S-00: width 88vw max 320px (states.ts register); glass surface —
 *   the §6 three-glass-surface law: `background: var(--color-glass);
 *   backdrop-filter: blur(12px)` (the drawer is one of the three).
 * - Dialog semantics (role=dialog + aria-modal — ACCESSIBILITY §3
 *   "drawer dialog"); label REQUIRED; focus trap/restore + ESC topmost
 *   + scroll lock via the overlay core; scrim tap + X close.
 * - side="right" mirrors the §9 travel (+100%→0) for filter drawers;
 *   reduced-motion is the shared ≤100ms opacity-only fade.
 * - Elevation-2 (§6 drawer/modal); z rung --z-drawer (300) over the
 *   scrim rung (200) — the D-006 ladder, no other z values.
 * - Swipe-left/right dismissal needs drag gestures (domMax — not
 *   loaded, see lib/motion/provider.tsx) and arrives with the owning
 *   navigation task; ACCESSIBILITY §7 already requires the button
 *   equivalents (X + ESC + scrim), which are live here.
 */

import { useId, useRef, type ReactNode } from "react";
import { AnimatePresence, m, useReducedMotion, type Variants } from "motion/react";
import { X } from "lucide-react";

import { MOTION, selectVariants } from "@/lib/motion/variants";
import { DRAWER_WIDTH } from "./states";
import { IconButton } from "./button";
import { Portal, Scrim, useDismissableLayer } from "./overlay";

export interface DrawerProps {
  /** ACCESSIBILITY §3: every dialog is labelled — REQUIRED. */
  label: string;
  open: boolean;
  onDismiss: () => void;
  children: ReactNode;
  /** Visible heading (the dialog's h2); default none (S-00 nav drawer). */
  title?: string;
  /** Edge the panel slides from; "left" is the S-00 nav drawer. */
  side?: "left" | "right";
  /** Built-in X close (S-00: "Close: X button, scrim tap, ESC"). */
  closeButton?: boolean;
}

/** §9 right-edge mirror: translateX 100%→0 with the drawer easing. */
const drawerRight: Variants = {
  initial: { x: "100%" },
  animate: { x: "0%", transition: { duration: MOTION.drawer.duration, ease: MOTION.drawer.ease } },
  exit: { x: "100%", transition: { duration: MOTION.drawer.duration, ease: MOTION.drawer.ease } },
};

export function Drawer({
  label,
  open,
  onDismiss,
  children,
  title,
  side = "left",
  closeButton = true,
}: DrawerProps): React.JSX.Element | null {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  useDismissableLayer({
    open,
    onDismiss,
    panelRef,
    modal: true,
  });

  const reduced = useReducedMotion();
  const v = selectVariants(reduced);
  const travel = side === "right" ? drawerRight : v.drawer;

  return (
    <Portal>
      <AnimatePresence>
        {open ? (
          <div
            className="fixed inset-0"
            style={{ zIndex: "var(--z-drawer)" }}
          >
            <Scrim onClick={onDismiss} />
            <m.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={title ? undefined : label}
              aria-labelledby={title ? titleId : undefined}
              tabIndex={-1}
              variants={travel}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`absolute inset-y-0 flex w-full flex-col border-border bg-glass shadow-elevation-2 backdrop-blur-glass ${
                side === "right" ? "right-0 border-l" : "left-0 border-r"
              }`}
              style={{ width: DRAWER_WIDTH, zIndex: "var(--z-drawer)" }}
            >
              {closeButton ? (
                <IconButton
                  aria-label="Close"
                  onClick={onDismiss}
                  size="sm"
                  variant="ghost"
                  className="absolute right-3 top-3"
                >
                  <X size={20} strokeWidth={1.5} aria-hidden />
                </IconButton>
              ) : null}
              {title ? (
                <h2 id={titleId} className="px-4 pt-6 font-serif text-h3 text-text-primary">
                  {title}
                </h2>
              ) : null}
              <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
            </m.div>
          </div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}
