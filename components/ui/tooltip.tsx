"use client";

/**
 * SYCONIA Tooltip — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "Tooltip (focus+hover, 300ms delay, ESC-dismiss)").
 *
 * - Wraps the single child trigger in a relative inline-block span;
 *   focus/hover detection uses the WRAPPER's synthetic events
 *   (focusin/focusout bubble; mouseenter/leave synthesize across the
 *   boundary) — the child keeps its own handlers and ref untouched.
 *   While open, the trigger carries aria-describedby → the tooltip id
 *   (ACCESSIBILITY §3) — the only prop merged onto the child.
 * - 300ms show delay (states.ts register, §10); immediate hide on
 *   blur/leave; ESC-dismiss via the overlay-core topmost stack (a
 *   tooltip over an open modal consumes the first ESC — GESTURES §62).
 * - role="tooltip"; no §9 family exists for tooltips, so the popup
 *   appears/disappears instantly (motion law: only §9 durations are
 *   legal — an unlisted invented transition is forbidden).
 * - Positioned above the trigger (bottom-full + §6 space-2 gap),
 *   centered, pointer-events-none (never intercepts the pointer).
 * - Surface-elevated + hairline + radius-sm (§6 chips/inputs class) +
 *   elevation-2 (D-011 popover depth); z rung --z-header-sticky (the
 *   D-006 ladder has no popover rung — D-011 maps anchored transients
 *   there: above base content, below the scrim layers).
 */

import { useCallback, useEffect, useId, useRef, useState, type ReactElement } from "react";
import { cloneElement } from "react";

import { TOOLTIP_DELAY_MS } from "./states";
import { PANEL_SURFACE, useDismissableLayer } from "./overlay";

export interface TooltipProps {
  /** The tooltip text (§12 voice: microcopy). */
  label: string;
  /** The single trigger element (button/link — any focusable). */
  children: ReactElement;
}

export function Tooltip({ label, children }: TooltipProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback(() => {
    clearTimer();
    // §10: 300ms delay before the tooltip appears.
    timerRef.current = setTimeout(() => setOpen(true), TOOLTIP_DELAY_MS);
  }, [clearTimer]);

  const hide = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  useDismissableLayer({
    open,
    onDismiss: hide,
    panelRef: tooltipRef,
    modal: false,
    // The tooltip never moves focus — nothing to restore.
    restoreFocus: false,
  });

  // Only the aria wiring merges onto the child (its own handlers and
  // ref are untouched — wrapper events handle open/close).
  const trigger = cloneElement(children as ReactElement<{ "aria-describedby"?: string }>, {
    "aria-describedby": open ? tooltipId : undefined,
  });

  return (
    <span
      className="relative inline-block"
      onFocus={show}
      onBlur={hide}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {trigger}
      {open ? (
        <div
          ref={tooltipRef}
          role="tooltip"
          id={tooltipId}
          className={`${PANEL_SURFACE} pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-sm px-2 py-1 text-meta text-text-primary`}
          style={{ zIndex: "var(--z-header-sticky)", maxWidth: "20rem", width: "max-content" }}
        >
          {label}
        </div>
      ) : null}
    </span>
  );
}
