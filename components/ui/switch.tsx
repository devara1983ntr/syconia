"use client";

/**
 * SYCONIA Switch — primitives batch 1 (M1-T008; DESIGN-SYSTEM §10).
 *
 * - role="switch" on a native <button> (ACCESSIBILITY §3: semantic
 *   HTML first — Space/Enter toggle by construction, §2 keyboard law);
 *   aria-checked reflects state.
 * - 44×44 hit target (ACCESSIBILITY §7): the button is the target; the
 *   40×24 track + 16px thumb sit centered inside.
 * - Tokens only (G-8): track = surface-elevated + hairline → accent on
 *   check (§4); thumb = Alabaster; global :focus-visible ring applies.
 * - D-006b values fixed in components/ui/states.ts (SWITCH_* constants).
 * - Controlled (checked + onCheckedChange) or uncontrolled
 *   (defaultChecked) usage; label wired via the wrapping <label>-less
 *   pattern: htmlFor is not valid for button — the accessible name
 *   comes from the visible label passed as a sibling with aria
 *   wiring (id ↔ aria-labelledby).
 */

import { useId, useState, type ReactNode } from "react";

import { SWITCH_THUMB, SWITCH_TRACK_H, SWITCH_TRACK_W } from "./states";

export interface SwitchProps {
  /** Accessible name source (visible label text). */
  label: string;
  /** Controlled state. */
  checked?: boolean;
  /** Uncontrolled initial state. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Optional description rendered as hint text under the row. */
  hint?: string;
  className?: string;
  id?: string;
  children?: ReactNode;
}

export function Switch({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  hint,
  className,
  id,
}: SwitchProps): React.JSX.Element {
  const uid = useId();
  const buttonId = id ?? `switch-${uid}`;
  const labelId = `${buttonId}-label`;
  const hintId = `${buttonId}-hint`;
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = checked ?? internal;

  const toggle = (): void => {
    if (disabled) return;
    const next = !isChecked;
    if (checked === undefined) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <div className={className ?? "flex flex-col gap-1"} data-switch data-switch-checked={isChecked}>
      <div className="flex min-h-[var(--target-min)] select-none items-center gap-3">
        <button
          type="button"
          role="switch"
          id={buttonId}
          aria-checked={isChecked}
          aria-labelledby={labelId}
          aria-describedby={hint ? hintId : undefined}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={toggle}
          className={[
            "sy-press grid place-items-center rounded-md",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
          style={{ minHeight: "var(--target-min)", minWidth: "var(--target-min)" }}
        >
          {/* Track + thumb: transform-only motion (§9 law). */}
          <span
            aria-hidden
            className={[
              "relative flex items-center rounded-full border transition-colors duration-200",
              isChecked
                ? "border-accent bg-accent"
                : "border-border bg-surface-elevated",
              disabled ? "opacity-60" : "",
            ].join(" ")}
            style={{ width: SWITCH_TRACK_W, height: SWITCH_TRACK_H, padding: 4 }}
          >
            <span
              aria-hidden
              className={[
                "block rounded-full bg-text-primary transition-transform duration-200",
                disabled ? "opacity-70" : "",
              ].join(" ")}
              style={{
                width: SWITCH_THUMB,
                height: SWITCH_THUMB,
                transform: isChecked ? `translateX(${SWITCH_TRACK_W - SWITCH_THUMB - 8}px)` : "translateX(0)",
              }}
            />
          </span>
        </button>
        <span id={labelId} className={disabled ? "text-body text-text-tertiary" : "text-body text-text-primary"}>
          {label}
        </span>
      </div>
      {hint ? (
        <p id={hintId} className="text-meta text-text-tertiary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
