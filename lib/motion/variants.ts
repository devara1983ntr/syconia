import type { Transition, Variants } from "motion/react";

/*
 * SYCONIA shared motion variants — DESIGN-SYSTEM §9 (verbatim table),
 * PERFORMANCE §4 (animation performance law), M1-T006.
 *
 * Laws encoded here (test-enforced):
 * 1. Transform/opacity ONLY — no layout properties (width/height/top/
 *    left/margin/padding…) are ever animated.
 * 2. Durations/easings are the §9 table values, nothing else.
 * 3. Reduced motion: every transition collapses to opacity-only with
 *    duration ≤ 100ms; loops/shimmer/pulse are absent from the reduced set.
 *
 * The full-fidelity set is `variants`; the accessibility set is
 * `reducedVariants`; `selectVariants(reduced)` picks per environment
 * (components call the reduced-motion switch with the user's
 * prefers-reduced-motion media query result).
 *
 * Component duties beyond variants (documented for the owning tasks):
 * - `STAGGER_CAP`: components must render at most 12 animated children per
 *   region (`capStaggerChildren` slices for you).
 * - Infinite loops (skeleton shimmer 1.6s, Ostiole loader 1.2s pulse) are
 *   component-local animations owned by their primitives (M1-T009/T010,
 *   loader M1-T005); under reduced motion they render static — the
 *   constants below are the single timing source for those tasks.
 */

/** §9 motion timing tokens (seconds — Motion's unit). */
export const MOTION = {
  /** Page/route: 180ms ease-out. */
  page: { duration: 0.18, ease: "easeOut" },
  /** Drawer: 260ms, §9 easing cubic-bezier(0.22, 1, 0.36, 1). */
  drawer: { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const },
  /** Drawer scrim fade: 200ms. */
  scrim: { duration: 0.2 },
  /** Modal: 200ms. */
  modal: { duration: 0.2 },
  /** Sheet: 280ms. */
  sheet: { duration: 0.28 },
  /** Card hover/focus: 180ms. */
  card: { duration: 0.18 },
  /** Card→watch shared-element: 280ms (fade under reduced motion). */
  sharedElement: { duration: 0.28 },
  /** Toast: 200ms in; auto-dismiss 4s (pause on hover/focus). */
  toast: { duration: 0.2, autoDismissMs: 4000 },
  /** Stagger: 40ms between children, at most 12 animated nodes. */
  stagger: { delay: 0.04, cap: 12 },
  /** Skeleton shimmer: 1.6s linear loop (reduced motion: static). */
  shimmer: { duration: 1.6 },
  /** Ostiole loader: 1.2s alternating scale 1→1.12 + opacity pulse. */
  loader: { duration: 1.2, scale: 1.12 },
  /** Reduced-motion ceiling: transitions ≤ 100ms. */
  reducedMax: 0.1,
  /** Page/route translateY distance (§9: "translateY 8→0"). */
  pageTravel: 8,
} as const;

/**
 * Toast slide-up travel. §9 specifies timing only ("slide-up + fade in
 * 200ms"); the distance is the minimal compositor-friendly travel,
 * aligned with the §9 vertical vocabulary — tunable at the Toast
 * primitive (M1-T009) if the spec ever fixes a value.
 */
export const TOAST_TRAVEL = 16;

const pageTransition: Transition = {
  duration: MOTION.page.duration,
  ease: MOTION.page.ease,
};
const drawerTransition: Transition = {
  duration: MOTION.drawer.duration,
  ease: MOTION.drawer.ease,
};
const scrimTransition: Transition = { duration: MOTION.scrim.duration };
const modalTransition: Transition = { duration: MOTION.modal.duration };
const sheetTransition: Transition = { duration: MOTION.sheet.duration };
const cardTransition: Transition = { duration: MOTION.card.duration };
const toastTransition: Transition = { duration: MOTION.toast.duration };
const staggerTransition: Transition = { staggerChildren: MOTION.stagger.delay };

/**
 * Full-fidelity §9 variants (standard motion). Families: page, scrim,
 * drawer, modal, sheet, card (+ veil), toast, stagger container/child.
 */
export const variants = {
  /** Page/route transition: opacity 0→1 + translateY 8→0, 180ms ease-out. */
  page: {
    initial: { opacity: 0, y: MOTION.pageTravel },
    animate: { opacity: 1, y: 0, transition: pageTransition },
    exit: { opacity: 0, y: 0, transition: pageTransition },
  } satisfies Variants,
  /** Drawer scrim: opacity 0→1, 200ms. */
  scrim: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: scrimTransition },
    exit: { opacity: 0, transition: scrimTransition },
  } satisfies Variants,
  /** Drawer panel: translateX −100%→0, 260ms, cubic-bezier(0.22,1,0.36,1). */
  drawer: {
    initial: { x: "-100%" },
    animate: { x: "0%", transition: drawerTransition },
    exit: { x: "-100%", transition: drawerTransition },
  } satisfies Variants,
  /** Modal: scale .96→1 + opacity 0→1, 200ms. */
  modal: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1, transition: modalTransition },
    exit: { opacity: 0, scale: 0.96, transition: modalTransition },
  } satisfies Variants,
  /** Bottom sheet: translateY 100%→0, 280ms. */
  sheet: {
    initial: { y: "100%" },
    animate: { y: "0%", transition: sheetTransition },
    exit: { y: "100%", transition: sheetTransition },
  } satisfies Variants,
  /** Card hover/focus: scale 1→1.02, 180ms (drive via whileHover/whileFocus). */
  card: {
    rest: { scale: 1, transition: cardTransition },
    hover: { scale: 1.02, transition: cardTransition },
    focus: { scale: 1.02, transition: cardTransition },
  } satisfies Variants,
  /** Card veil overlay: opacity 0.4→0 on hover/focus, 180ms. */
  cardVeil: {
    rest: { opacity: 0.4, transition: cardTransition },
    hover: { opacity: 0, transition: cardTransition },
    focus: { opacity: 0, transition: cardTransition },
  } satisfies Variants,
  /** Toast: slide-up + fade in 200ms. */
  toast: {
    initial: { opacity: 0, y: TOAST_TRAVEL },
    animate: { opacity: 1, y: 0, transition: toastTransition },
    exit: { opacity: 0, y: 0, transition: toastTransition },
  } satisfies Variants,
  /**
   * Stagger container: children 40ms apart. Components must cap animated
   * children at `STAGGER_CAP` (PERFORMANCE §4 "≤12 staggered nodes per
   * region" — `capStaggerChildren` enforces it while slicing).
   */
  stagger: {
    animate: { transition: staggerTransition },
  } satisfies Variants,
  /** Stagger child entry (pair with the container; travel mirrors page). */
  staggerChild: {
    initial: { opacity: 0, y: MOTION.pageTravel },
    animate: { opacity: 1, y: 0, transition: pageTransition },
    exit: { opacity: 0, y: 0, transition: pageTransition },
  } satisfies Variants,
} as const;

const reducedTransition: Transition = { duration: MOTION.reducedMax };

/**
 * Reduced-motion variants (DS §9 last row): every transition is
 * opacity-only and ≤100ms; no transforms, no loops. Drawers/sheets/modals
 * appear/disappear with a short fade instead of sliding/scaling. Card
 * hover/focus targets are empty (no hover transforms at all) and the veil
 * holds its static rest opacity — hover feedback comes from focus rings.
 */
export const reducedVariants = {
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTransition },
    exit: { opacity: 0, transition: reducedTransition },
  } satisfies Variants,
  scrim: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTransition },
    exit: { opacity: 0, transition: reducedTransition },
  } satisfies Variants,
  drawer: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTransition },
    exit: { opacity: 0, transition: reducedTransition },
  } satisfies Variants,
  modal: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTransition },
    exit: { opacity: 0, transition: reducedTransition },
  } satisfies Variants,
  sheet: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTransition },
    exit: { opacity: 0, transition: reducedTransition },
  } satisfies Variants,
  card: {
    rest: {},
    hover: {},
    focus: {},
  } satisfies Variants,
  cardVeil: {
    rest: { opacity: 0.4 },
    hover: { opacity: 0.4 },
    focus: { opacity: 0.4 },
  } satisfies Variants,
  toast: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTransition },
    exit: { opacity: 0, transition: reducedTransition },
  } satisfies Variants,
  stagger: {
    animate: { transition: { staggerChildren: 0 } },
  } satisfies Variants,
  staggerChild: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: reducedTransition },
    exit: { opacity: 0, transition: reducedTransition },
  } satisfies Variants,
} as const;

/** Variant family names shared by both sets. */
export type VariantFamily = keyof typeof variants;

/** Select the §9 variant set for the user's motion preference. */
export function selectVariants(reduced: boolean) {
  return reduced ? reducedVariants : variants;
}

/** §9/P §4: at most 12 animated children per stagger region. */
export const STAGGER_CAP = MOTION.stagger.cap;

/** Slice a list to the stagger cap (the rest render without animation). */
export function capStaggerChildren<T>(items: readonly T[]): T[] {
  return items.slice(0, STAGGER_CAP);
}
