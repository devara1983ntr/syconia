"use client";

/**
 * SYCONIA Button + IconButton — primitives batch 1 (M1-T008;
 * DESIGN-SYSTEM §10 "Button (primary gold / secondary ghost /
 * destructive / sizes sm-md-lg; loading state with ostiole dot) ·
 * IconButton"; states default/hover/active/focus/disabled/loading per
 * §10; values fixed per D-006b in components/ui/states.ts).
 *
 * - Client component: the §9 loading pulse is motion/react (the spec's
 *   animation engine — LazyMotion domAnimation strict is mounted at the
 *   root, so `m.` components are the sanctioned path); reduced motion
 *   renders the dot static (§9 law: no pulse loops).
 * - Tokens only (G-8): every color/size flows from the §4/§6 layer —
 *   no raw hex, no ad-hoc sizes (state values come from states.ts;
 *   press scale via the --press-scale token / .sy-press class).
 * - ACCESSIBILITY §7: all sizes ≥ 44px targets; §2: the global
 *   :focus-visible ring applies (never outline:none); §3: icon-only
 *   buttons REQUIRE aria-label (type-enforced).
 * - D-006b disabled: surface bg + tertiary text + not-allowed cursor.
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";

import { MOTION } from "@/lib/motion/variants";
import { CONTROL_TEXT_SIZES, OSTIOLE_DOT, type ControlSize } from "./states";

export type ButtonVariant = "primary" | "secondary" | "destructive";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** §12 voice: specific verbs — "Enter", "Watch", "Retry"… */
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ControlSize;
  /** Loading: ostiole-dot pulse + label retained, interaction suspended (§10). */
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // Primary gold: Obsidian text on Ostiole Gold (8.1:1, §4); hover = Champagne (Obsidian text 13.4:1).
  primary:
    "bg-accent text-background border border-accent hover:bg-accent-strong hover:border-accent-strong",
  // Secondary ghost: transparent surface, hairline border (§6), Alabaster text; hover lifts to surface.
  secondary:
    "bg-transparent text-text-primary border border-border hover:bg-surface",
  // Destructive: Obsidian text on error tone (§4 semantic error, 5.6:1 AA).
  destructive: "bg-error text-background border border-error hover:brightness-110",
};

const SIZE_CLASSES: Record<ControlSize, string> = {
  sm: `px-3 ${CONTROL_TEXT_SIZES.sm}`,
  md: `px-4 ${CONTROL_TEXT_SIZES.md}`,
  lg: `px-5 ${CONTROL_TEXT_SIZES.md}`,
};

/** The ostiole loader dot — the brand loading signal (§9; never a generic spinner). */
function OstioleDot(): React.JSX.Element {
  const reduced = useReducedMotion();
  const { scale } = OSTIOLE_DOT.pulse;
  const dot = (
    <span
      aria-hidden
      className="inline-block rounded-full bg-current"
      style={{ width: OSTIOLE_DOT.size, height: OSTIOLE_DOT.size }}
    />
  );
  if (reduced) {
    // §9 reduced motion: no loops — the static dot.
    return dot;
  }
  return (
    <m.span
      aria-hidden
      className="inline-block rounded-full bg-current"
      style={{ width: OSTIOLE_DOT.size, height: OSTIOLE_DOT.size }}
      animate={{ scale: [1, scale, 1], opacity: [1, 0.6, 1] }}
      transition={{
        duration: MOTION.loader.duration,
        times: [0, 0.5, 1],
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    className,
    type = "button",
    ...rest
  },
  ref,
) {
  const inert = disabled || loading;
  const base = [
    "sy-press inline-flex items-center justify-center gap-2 rounded-md leading-none font-medium select-none",
    // Exclusive branches — equal-specificity utilities must never coexist.
    inert
      ? "bg-surface text-text-tertiary border-border cursor-not-allowed"
      : VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
  ];
  if (className) base.push(className);
  return (
    <button
      ref={ref}
      type={type}
      disabled={inert}
      aria-busy={loading || undefined}
      className={base.filter(Boolean).join(" ")}
      style={{ minHeight: `var(--target-min)` }}
      {...rest}
    >
      {loading ? <OstioleDot /> : null}
      {children}
    </button>
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** ACCESSIBILITY §3: icon-only buttons carry aria-label — REQUIRED (type-enforced). */
  "aria-label": string;
  /** The icon element (lucide-react; DS §7 — 1.5px stroke, 20/24px, currentColor). */
  children: ReactNode;
  variant?: "solid" | "ghost";
  size?: ControlSize;
  loading?: boolean;
}

const ICON_VARIANT_CLASSES = {
  solid: "bg-accent text-background border border-accent hover:bg-accent-strong hover:border-accent-strong",
  ghost:
    "bg-transparent text-text-primary border border-transparent hover:bg-surface hover:border-border",
} as const;

const ICON_SIZES: Record<ControlSize, string> = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      children,
      variant = "ghost",
      size = "md",
      loading = false,
      disabled,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) {
    const inert = disabled || loading;
    const base = [
      "sy-press inline-flex items-center justify-center rounded-md leading-none select-none",
      inert
        ? "bg-surface text-text-tertiary border-border cursor-not-allowed"
        : ICON_VARIANT_CLASSES[variant],
      ICON_SIZES[size],
    ];
    if (className) base.push(className);
    return (
      <button
        ref={ref}
        type={type}
        disabled={inert}
        aria-busy={loading || undefined}
        className={base.filter(Boolean).join(" ")}
        style={{ minHeight: "var(--target-min)", minWidth: "var(--target-min)" }}
        {...rest}
      >
        {loading ? <OstioleDot /> : children}
      </button>
    );
  },
);
