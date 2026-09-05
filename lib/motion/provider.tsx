"use client";

import { domAnimation, LazyMotion } from "motion/react";
import type { ReactNode } from "react";

/*
 * SYCONIA motion provider — M1-T006, PERFORMANCE §3.
 *
 * `LazyMotion` + the `domAnimation` feature bundle keep the client JS
 * budget (≤120KB compressed on the home route): only the animation
 * feature subset ships, not the full feature set. `strict` forbids the
 * heavy `motion.*` components — every animated component MUST use the
 * lightweight `m.*` form (import { m } from "motion/react"), which the
 * runtime enforces with an error.
 *
 * domAnimation covers §9 needs: keyframe/variant transitions, exit
 * animations (with AnimatePresence), and hover/tap/focus gestures.
 * drag gestures and layoutId shared-element transitions need domMax —
 * those arrive with their owning tasks (watch-screen shared element,
 * M3) and will be re-evaluated there against the budget law.
 */

/** Mount once at the app root (app/layout.tsx) — never per-route. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
