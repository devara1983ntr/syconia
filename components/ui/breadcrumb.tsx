/**
 * SYCONIA Breadcrumb — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "Breadcrumb"; §7 chevron-right "breadcrumbs").
 *
 * - nav[aria-label="Breadcrumb"] > ol > li structure (semantic HTML
 *   first — ACCESSIBILITY §3); the current page is a span with
 *   aria-current="page"; ancestors are links in the accent tone (§4
 *   "links" role) with a gold hover (§4 active states).
 * - Separators: chevron-right (§7, 20px dense-chrome, 1.5px stroke),
 *   aria-hidden + decorative (the list structure carries the
 *   hierarchy for AT).
 * - Server-compatible (no client state); tokens only; text at the §5
 *   meta size with the §4 secondary tone (9.9:1 — legal at 13px);
 *   wraps on narrow viewports (no horizontal overflow at 320px — §8).
 */

import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  /** Destination; the last item (current page) needs none. */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps): React.JSX.Element {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="inline-flex text-text-tertiary">
                  <ChevronRight size={20} strokeWidth={1.5} />
                </span>
              ) : null}
              {isCurrent || !item.href ? (
                <span aria-current="page" className="text-meta text-text-primary">
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="text-meta text-accent hover:text-accent-strong">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
