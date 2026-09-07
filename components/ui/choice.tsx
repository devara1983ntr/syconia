"use client";

/**
 * SYCONIA Checkbox + Radio — primitives batch 1 (M1-T008;
 * DESIGN-SYSTEM §10; ACCESSIBILITY §3 semantic-HTML-first).
 *
 * - Native <input type=checkbox/radio>: keyboard operable by
 *   construction (§2) and native radio-group arrow-key behavior via
 *   shared `name`. The input is visually hidden (sr-only) but focusable;
 *   the styled sibling carries the visual and mirrors the input's
 *   focus-visible ring (peer-focus-visible — §2: never outline:none
 *   without replacement).
 * - Row targets ≥ 44px (ACCESSIBILITY §7): the wrapping <label> pads to
 *   the target height (the whole row is the hit area).
 * - Checked visual: Ostiole Gold fill + Obsidian mark (§4); lucide mark
 *   at DS §7 stroke 1.5.
 * - D-006b control-visual values fixed in components/ui/states.ts
 *   (CHOICE_* constants): 18px box/circle, 14px check mark, 8px dot.
 */

import { useId, type InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

import { CHOICE_BOX, CHOICE_DOT, CHOICE_MARK } from "./states";

const TARGET_ROW = "flex min-h-[var(--target-min)] select-none items-center gap-3 py-2";
const BOX_BASE =
  "grid place-items-center border border-border bg-surface text-text-tertiary transition-colors duration-200 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-background";
/** Ring mirror: the sr-only input owns focus; the visual shows it (§2). */
const RING_MIRROR =
  "peer-focus-visible:outline peer-focus-visible:outline-[var(--focus-ring-width)] peer-focus-visible:outline-offset-[var(--focus-ring-offset)] peer-focus-visible:outline-[var(--color-focus)]";
/** Mark reveal: input:checked ~ box → its .mark child (Tailwind arbitrary variant chain). */
const MARK_REVEAL = "peer-checked:[&_.sy-mark]:opacity-100";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Visible label (programmatic label via the wrapping <label>). */
  label: string;
}

export function Checkbox({
  label,
  disabled,
  id,
  className,
  ...rest
}: CheckboxProps): React.JSX.Element {
  const uid = useId();
  const inputId = id ?? `checkbox-${uid}`;
  const base = [
    TARGET_ROW,
    disabled ? "cursor-not-allowed text-text-tertiary" : "cursor-pointer text-text-primary",
  ];
  if (className) base.push(className);
  return (
    <label htmlFor={inputId} className={base.filter(Boolean).join(" ")}>
      <input type="checkbox" id={inputId} disabled={disabled} className="peer sr-only" {...rest} />
      <span
        aria-hidden
        className={`sy-mark-box ${BOX_BASE} ${RING_MIRROR} ${MARK_REVEAL} rounded-sm`}
        style={{ width: CHOICE_BOX, height: CHOICE_BOX }}
      >
        <Check
          className="sy-mark opacity-0 transition-opacity duration-200"
          strokeWidth={1.5}
          size={CHOICE_MARK}
        />
      </span>
      <span className="text-body">{label}</span>
    </label>
  );
}

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Visible label (programmatic label via the wrapping <label>). */
  label: string;
}

export function Radio({ label, disabled, id, className, ...rest }: RadioProps): React.JSX.Element {
  const uid = useId();
  const inputId = id ?? `radio-${uid}`;
  const base = [
    TARGET_ROW,
    disabled ? "cursor-not-allowed text-text-tertiary" : "cursor-pointer text-text-primary",
  ];
  if (className) base.push(className);
  return (
    <label htmlFor={inputId} className={base.filter(Boolean).join(" ")}>
      <input type="radio" id={inputId} disabled={disabled} className="peer sr-only" {...rest} />
      <span
        aria-hidden
        className={`sy-mark-box ${BOX_BASE} ${RING_MIRROR} ${MARK_REVEAL} rounded-full`}
        style={{ width: CHOICE_BOX, height: CHOICE_BOX }}
      >
        {/* Selected dot: Ostiole Gold (§4) — the ostiole at control scale. */}
        <span
          className="sy-mark rounded-full bg-accent opacity-0 transition-opacity duration-200"
          style={{ width: CHOICE_DOT, height: CHOICE_DOT }}
        />
      </span>
      <span className="text-body">{label}</span>
    </label>
  );
}
