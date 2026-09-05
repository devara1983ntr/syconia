"use client";

/**
 * SYCONIA field primitives — Input / Select / Textarea with shared
 * label + hint/error slot anatomy (M1-T008; DESIGN-SYSTEM §10
 * "Input (with hint/error slots) · Select · Textarea").
 *
 * - Anatomy: <label> + control + hint slot + error slot, wired with
 *   aria-describedby / aria-invalid (ACCESSIBILITY §3: programmatic
 *   labels; errors announced through the describedby chain).
 * - Client components: interactive form controls (useId for stable
 *   label wiring); no animation JS — all states are CSS (tokens only,
 *   G-8; values fixed per D-006b in components/ui/states.ts).
 * - Icons: lucide-react only, 1.5px stroke (DS §7 — custom icons
 *   prohibited); the Select chevron is lucide's ChevronDown.
 * - ACCESSIBILITY §7: 44px control targets (Textarea grows by rows);
 *   §2: global :focus-visible ring (never outline:none).
 */

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

import { CONTROL_TEXT_SIZES, type ControlSize } from "./states";

export interface FieldIds {
  labelId: string;
  hintId: string;
  errorId: string;
  controlId: string;
}

function useFieldIds(fallback: string): FieldIds {
  const uid = useId();
  const base = `${fallback}-${uid}`;
  return {
    labelId: `${base}-label`,
    hintId: `${base}-hint`,
    errorId: `${base}-error`,
    controlId: `${base}-control`,
  };
}

/** aria-describedby chain: hint always, error when present (error wins the visible slot). */
function describeIds(hint: string | undefined, error: string | undefined, ids: FieldIds): string | undefined {
  const parts = [hint ? ids.hintId : null, error ? ids.errorId : null].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  ids: FieldIds;
  children: ReactNode;
}

/** Label + hint/error slots around a control (shared by all field primitives). */
function Field({ label, required, hint, error, ids, children }: FieldProps): React.JSX.Element {
  return (
    <div
      className="flex w-full flex-col gap-2"
      data-field
      data-field-error={error ? "true" : undefined}
    >
      <label htmlFor={ids.controlId} className="text-meta select-none text-text-secondary">
        {label}
        {required ? (
          <span aria-hidden className="ml-1 text-accent">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={ids.hintId} className="text-meta text-text-tertiary">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={ids.errorId} role="alert" className="text-meta text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Shared control classes: surface + hairline border + §6 radius-sm (inputs/chips) + 44px target. */
const CONTROL_BASE =
  "w-full rounded-sm bg-surface text-text-primary placeholder:text-text-tertiary transition-colors duration-200";

const FIELD_SIZES: Record<ControlSize, string> = {
  sm: `${CONTROL_TEXT_SIZES.sm} px-3`,
  md: `${CONTROL_TEXT_SIZES.md} px-3`,
  lg: `${CONTROL_TEXT_SIZES.md} px-4`,
};

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  hint?: string;
  error?: string;
  size?: ControlSize;
}

export function Input({
  label,
  hint,
  error,
  required,
  disabled,
  size = "md",
  className,
  id,
  ...rest
}: InputProps): React.JSX.Element {
  const ids = useFieldIds(id ?? "input");
  const describedBy = describeIds(hint, error, ids);
  const base = [
    CONTROL_BASE,
    FIELD_SIZES[size],
    disabled
      ? "border border-border bg-surface-elevated/40 text-text-tertiary cursor-not-allowed"
      : error
        ? "border border-error hover:bg-surface-elevated/60"
        : "border border-border hover:bg-surface-elevated/60",
  ];
  if (className) base.push(className);
  return (
    <Field label={label} required={required} hint={hint} error={error} ids={ids}>
      <input
        id={ids.controlId}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        className={base.filter(Boolean).join(" ")}
        style={{ minHeight: "var(--target-min)" }}
        {...rest}
      />
    </Field>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "children"> {
  label: string;
  hint?: string;
  error?: string;
  size?: ControlSize;
  /** Options rendered as semantic <option> elements. */
  options: ReadonlyArray<SelectOption>;
}

export function Select({
  label,
  hint,
  error,
  required,
  disabled,
  size = "md",
  className,
  id,
  options,
  ...rest
}: SelectProps): React.JSX.Element {
  const ids = useFieldIds(id ?? "select");
  const describedBy = describeIds(hint, error, ids);
  const base = [
    CONTROL_BASE,
    "appearance-none pr-10",
    FIELD_SIZES[size],
    disabled
      ? "border border-border bg-surface-elevated/40 text-text-tertiary cursor-not-allowed"
      : error
        ? "border border-error"
        : "border border-border",
  ];
  if (className) base.push(className);
  return (
    <Field label={label} required={required} hint={hint} error={error} ids={ids}>
      <div className="relative">
        <select
          id={ids.controlId}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          className={base.filter(Boolean).join(" ")}
          style={{ minHeight: "var(--target-min)" }}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {/* DS §7: lucide icon, 1.5px stroke, currentColor, decorative. */}
        <ChevronDown
          aria-hidden
          strokeWidth={1.5}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          size={20}
        />
      </div>
    </Field>
  );
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  size?: ControlSize;
  /** Visual rows (default 4). */
  rows?: number;
}

export function Textarea({
  label,
  hint,
  error,
  required,
  disabled,
  size = "md",
  className,
  id,
  rows = 4,
  ...rest
}: TextareaProps): React.JSX.Element {
  const ids = useFieldIds(id ?? "textarea");
  const describedBy = describeIds(hint, error, ids);
  const base = [
    CONTROL_BASE,
    FIELD_SIZES[size],
    "py-3 leading-relaxed",
    disabled
      ? "border border-border bg-surface-elevated/40 text-text-tertiary cursor-not-allowed"
      : error
        ? "border border-error"
        : "border border-border",
  ];
  if (className) base.push(className);
  return (
    <Field label={label} required={required} hint={hint} error={error} ids={ids}>
      <textarea
        id={ids.controlId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        className={base.filter(Boolean).join(" ")}
        {...rest}
      />
    </Field>
  );
}
