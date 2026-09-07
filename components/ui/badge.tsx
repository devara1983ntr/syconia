/**
 * SYCONIA Badge — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "Badge (status/count/source)").
 *
 * - Non-interactive status mark: pills (radius-full, §6) in outline
 *   (hairline border + variant tone) or solid (variant fill +
 *   Obsidian text) forms. The §7 44px floor does not apply (no
 *   target), documented here so the a11y audit reads it correctly.
 * - Text at the §5 meta size (13px): variant tones all compute ≥ 8:1
 *   on background (§4 table) and neutral uses text-secondary (9.9:1)
 *   — never tertiary at 13px (§4 law: tertiary ≥ 14px only).
 * - Variants: status (success/warning/error), count/source
 *   (accent/neutral). Optional leading icon slot (§7, currentColor).
 * - Tokens only (G-8); spacing from the §6 ladder.
 */

import type { ReactNode } from "react";

export type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "error";

export interface BadgeProps {
  variant?: BadgeVariant;
  /** Solid pill (variant fill + Obsidian text) vs outline (default). */
  solid?: boolean;
  /** Optional leading icon (§7, 16px in-badge scale). */
  icon?: ReactNode;
  children: ReactNode;
}

const OUTLINE_STYLES: Record<BadgeVariant, string> = {
  neutral: "border-border text-text-secondary",
  accent: "border-accent text-accent",
  success: "border-success text-success",
  warning: "border-warning text-warning",
  error: "border-error text-error",
};

const SOLID_STYLES: Record<BadgeVariant, string> = {
  neutral: "border-border bg-surface-elevated text-text-primary",
  accent: "border-accent bg-accent text-background",
  success: "border-success bg-success text-background",
  warning: "border-warning bg-warning text-background",
  error: "border-error bg-error text-background",
};

export function Badge({
  variant = "neutral",
  solid = false,
  icon,
  children,
}: BadgeProps): React.JSX.Element {
  const classes = solid ? SOLID_STYLES[variant] : OUTLINE_STYLES[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-meta font-medium ${classes}`}
    >
      {icon ? (
        <span aria-hidden className="inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
