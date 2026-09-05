"use client";

/**
 * SYCONIA BottomSheet — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "BottomSheet (≤767px)"; §9 "sheet translateY 100%→0 (280ms)";
 * SCREENS §213 "Centered (d) / bottom-sheet (m ≤767px)").
 *
 * - The sheet is the ≤767px presentation ONLY: it renders while the
 *   (max-width: 767px) media query matches and auto-dismisses (calls
 *   onDismiss) when the viewport grows past it — the honest reading of
 *   the §10 scope row. Consumers pair it with Modal ≥768px (S-00/S-02
 *   pattern: "bottom sheet on mobile, dropdown on desktop").
 * - Dialog semantics + focus trap/restore + ESC topmost + scroll lock
 *   via the overlay core; scrim tap + X close. Drag-to-dismiss needs
 *   domMax (not loaded — see provider.tsx) and stays with the owning
 *   gesture task; the §7 button equivalents are live.
 * - Full-width panel, radius-lg top corners (§6 modals/sheets),
 *   surface-elevated + elevation-2, tall content scrolls under the
 *   SHEET_MAX_HEIGHT register ceiling (states.ts).
 */

import { useCallback, useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

import { selectVariants } from "@/lib/motion/variants";
import { SHEET_MAX_HEIGHT } from "./states";
import { IconButton } from "./button";
import { PANEL_SURFACE, Portal, Scrim, useDismissableLayer } from "./overlay";

export interface BottomSheetProps {
  /** ACCESSIBILITY §3: every dialog is labelled — REQUIRED. */
  label: string;
  open: boolean;
  onDismiss: () => void;
  children: ReactNode;
  /** Visible heading (the dialog's h2); default none. */
  title?: string;
  /** Built-in X close (S-00: "Close: X button, scrim tap, ESC"). */
  closeButton?: boolean;
}

/**
 * matchMedia hook via useSyncExternalStore (SSR-safe: the server
 * snapshot is false — the sheet is a client-only layer; jsdom tests
 * stub window.matchMedia).
 */
function useMediaMatches(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function BottomSheet({
  label,
  open,
  onDismiss,
  children,
  title,
  closeButton = true,
}: BottomSheetProps): React.JSX.Element | null {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  /** §10: the sheet exists only at ≤767px. */
  const isMobileViewport = useMediaMatches("(max-width: 767px)");
  const effectiveOpen = open && isMobileViewport;

  useEffect(() => {
    // Viewport grew past 767px while open: dismiss honestly — the sheet
    // is not the ≥768px presentation and never renders there.
    if (open && !isMobileViewport) {
      onDismiss();
    }
  }, [open, isMobileViewport, onDismiss]);

  useDismissableLayer({
    open: effectiveOpen,
    onDismiss,
    panelRef,
    modal: true,
  });

  const reduced = useReducedMotion();
  const v = selectVariants(reduced);

  return (
    <Portal>
      <AnimatePresence>
        {effectiveOpen ? (
          <div
            className="fixed inset-0 flex flex-col justify-end"
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
              variants={v.sheet}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`${PANEL_SURFACE} relative flex flex-col rounded-t-lg border-b-0`}
              style={{ maxHeight: SHEET_MAX_HEIGHT, zIndex: "var(--z-modal-sheet)" }}
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
                <h2 id={titleId} className="px-6 pb-2 pt-6 font-serif text-h3 text-text-primary">
                  {title}
                </h2>
              ) : null}
              <div className="overflow-y-auto px-6 pb-6 pt-2">{children}</div>
            </m.div>
          </div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}
