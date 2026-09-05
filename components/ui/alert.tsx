/**
 * SYCONIA Alert — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "Alert").
 *
 * - Inline (non-overlay) status message: role="alert" for the
 *   assertive variants (warning/error) and role="status" for the
 *   polite ones (info/success) — ACCESSIBILITY §3 "error announcements
 *   (aria-live polite / assertive…)".
 * - Variant icons from the §7 inventory: info / check /
 *   triangle-alert / circle-alert (20px dense-chrome size, 1.5px
 *   stroke, currentColor). Icon+title carry the variant tone; message
 *   body stays Alabaster (§4 editorial rule: body copy is
 *   primary/secondary text).
 * - Tokens only: surface + hairline border in the variant tone (§4
 *   semantic colors — all AA ≥ 8:1 on surface, usable for
 *   normal-size text per the §4 contrast table), radius-md (§6 card
 *   class), spacing from the §6 ladder.
 */

import { CircleAlert, Info, Check, TriangleAlert } from "lucide-react";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps {
  variant: AlertVariant;
  /** Heading line (the variant-colored lead). */
  title?: string;
  /** Message body (Alabaster, §5 body size). */
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<AlertVariant, { border: string; text: string; icon: React.JSX.Element }> = {
  info: { border: "border-accent", text: "text-accent", icon: <Info size={20} strokeWidth={1.5} aria-hidden /> },
  success: { border: "border-success", text: "text-success", icon: <Check size={20} strokeWidth={1.5} aria-hidden /> },
  warning: { border: "border-warning", text: "text-warning", icon: <TriangleAlert size={20} strokeWidth={1.5} aria-hidden /> },
  error: { border: "border-error", text: "text-error", icon: <CircleAlert size={20} strokeWidth={1.5} aria-hidden /> },
};

/** §3: assertive for warning/error, polite for info/success. */
const VARIANT_ROLE: Record<AlertVariant, "alert" | "status"> = {
  info: "status",
  success: "status",
  warning: "alert",
  error: "alert",
};

export function Alert({ variant, title, children }: AlertProps): React.JSX.Element {
  const style = VARIANT_STYLES[variant];
  return (
    <div
      role={VARIANT_ROLE[variant]}
      className={`flex items-start gap-3 rounded-md border bg-surface p-4 ${style.border}`}
    >
      <span aria-hidden className={`mt-0.5 inline-flex shrink-0 ${style.text}`}>
        {style.icon}
      </span>
      <div className="min-w-0">
        {title ? <p className={`font-medium text-body ${style.text}`}>{title}</p> : null}
        <div className="text-body text-text-primary">{children}</div>
      </div>
    </div>
  );
}
