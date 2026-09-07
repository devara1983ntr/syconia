/**
 * SYCONIA player watermark (M1-T005 component; wiring task M3-T001).
 *
 * Implements the ASSET-WM-001 usage specification verbatim
 * (branding/README.md §Watermark):
 * - official `watermark/syconia-watermark-128.png` at exactly 128 px
 *   (spec-fixed, all viewports);
 * - display opacity 20% (stored at 100% — adaptability preserved);
 * - anchored bottom-right of the player stage, inset 16 px from the
 *   stage edges (documented safe area), never centered, never over the
 *   native source controls (the parent stage provides the positioning
 *   context — this component is `position: absolute`);
 * - decorative: `aria-hidden`, empty alt, non-interactive
 *   (`pointer-events: none`, `draggable={false}`) — a brand mark, not
 *   content protection (GESTURES §4: right-click stays native);
 * - lives in the stage backdrop in our DOM, never inside or over the
 *   provider iframe.
 */

import type { CSSProperties } from "react";

/** ASSET-WM-001 served path (public/branding mirrors the pack 1:1). */
export const WATERMARK_SRC = "/branding/watermark/syconia-watermark-128.png";

/** Spec-fixed display size (px, all viewports). */
export const WATERMARK_SIZE = 128;

/** Spec-fixed stage-edge inset (px). */
export const WATERMARK_INSET = 16;

/** Spec-fixed display opacity. */
export const WATERMARK_OPACITY = 0.2;

/** Stage-relative anchor. */
export const WATERMARK_STYLE: CSSProperties = {
  position: "absolute",
  right: `${WATERMARK_INSET}px`,
  bottom: `${WATERMARK_INSET}px`,
  width: `${WATERMARK_SIZE}px`,
  height: `${WATERMARK_SIZE}px`,
  opacity: WATERMARK_OPACITY,
  pointerEvents: "none",
};

/**
 * Renders the watermark. Parent must be the player stage with a
 * positioning context (`position: relative`/`absolute`). zIndex is left
 * to the stage composition (M3-T001) — the D-006 ladder governs it there.
 */
export function Watermark({ className }: { className?: string }): React.JSX.Element {
  return (
    <span aria-hidden className={className} style={WATERMARK_STYLE}>
      {/* eslint-disable-next-line @next/next/no-img-element -- official pre-optimized pack PNG served from public/ at a spec-fixed size; next/image adds no value. */}
      <img
        src={WATERMARK_SRC}
        alt=""
        width={WATERMARK_SIZE}
        height={WATERMARK_SIZE}
        draggable={false}
        style={{ display: "block" }}
      />
    </span>
  );
}
