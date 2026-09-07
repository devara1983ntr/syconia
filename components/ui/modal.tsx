"use client";

/**
 * SYCONIA Modal — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "Modal"; §9 motion "Modal/sheet: scale .96→1 + fade (200ms)";
 * §6 surface-elevated + radius-lg + elevation-2; SCREENS §213
 * "Centered (d)… focus trap; ESC").
 *
 * - Dialog semantics (ACCESSIBILITY §3 / task: role/aria-modal) on a
 *   native div dialog role; every instance labelled (`label` required).
 * - Focus trap + restore + ESC topmost + body scroll lock via the
 *   overlay core (components/ui/overlay.tsx); scrim tap dismisses.
 * - AnimatePresence exit (§9); reduced-motion = ≤100ms opacity-only
 *   (selectVariants), so the modal never scales under the a11y law.
 * - Width from the D-011 register (states.ts): min(92vw, 480px).
 * - Tokens only (G-8); sizes from the §6 ladder; z from the D-006 rung
 *   --z-modal-sheet (400).
 */

import { useId, useRef, type ReactNode } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

import { selectVariants } from "@/lib/motion/variants";
import { MODAL_WIDTH } from "./states";
import { IconButton } from "./button";
import { PANEL_SURFACE, Portal, Scrim, useDismissableLayer } from "./overlay";

export interface ModalProps {
  /** ACCESSIBILITY §3: every dialog is labelled — REQUIRED. */
  label: string;
  open: boolean;
  onDismiss: () => void;
  children: ReactNode;
  /** Visible heading (rendered as the dialog's h2); default none. */
  title?: string;
  /** Built-in X close (S-00: "Close: X button, scrim tap, ESC"). */
  closeButton?: boolean;
}

export function Modal({
  label,
  open,
  onDismiss,
  children,
  title,
  closeButton = true,
}: ModalProps): React.JSX.Element | null {
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

  return (
    <Portal>
      <AnimatePresence>
        {open ? (
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: "var(--z-modal-sheet)" }}
          >
            <Scrim onClick={onDismiss} />
            <m.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={title ? undefined : label}
              aria-labelledby={title ? titleId : undefined}
              tabIndex={-1}
              variants={v.modal}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`${PANEL_SURFACE} relative flex w-full flex-col rounded-lg`}
              style={{ maxWidth: MODAL_WIDTH, zIndex: "var(--z-modal-sheet)" }}
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
                <h2 id={titleId} className="px-6 pb-2 pt-6 font-serif text-h2 text-text-primary">
                  {title}
                </h2>
              ) : null}
              <div className="px-6 pb-6 pt-4">{children}</div>
            </m.div>
          </div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}
