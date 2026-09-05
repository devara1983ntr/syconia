"use client";

/**
 * SYCONIA Pagination — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "Pagination (Load-more + numbered)"; S-03 "infinite scroll + Load
 * more"; S-07 "server-driven pagination (numbered, 25/page)").
 *
 * One primitive, two presentations (§10):
 *
 * - **numbered** — nav[aria-label] with prev/next chevron IconButtons
 *   (§7 pagination icons), page buttons with aria-current="page",
 *   windowed page ranges with ellipsis markers, 44px floors (§7),
 *   prev/next disabled at the bounds.
 * - **load-more** — a secondary Button ("Load more" §12 verb) that
 *   drives incremental loading through the consumer callback, plus a
 *   role="status" announcement line: the ACCESSIBILITY §3 live-region
 *   example ("12 more videos loaded") — the consumer passes the real
 *   loaded-count string; the primitive provides the a11y region.
 *
 * Tokens only (G-8); spacing/text from the §6/§5 ladder; no invented
 * pagination colors — active page = accent (§4 active states).
 */

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./button";
import { IconButton } from "./button";

export interface NumberedPaginationProps {
  mode?: "numbered";
  /** 1-based current page. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export interface LoadMorePaginationProps {
  mode: "load-more";
  /** §12 verb button — fires the incremental load. */
  onLoadMore: () => void;
  /** Loading state (ostiole dot via the batch-1 Button). */
  loading?: boolean;
  /** Remaining unloaded items (rendered count text). */
  remaining?: number;
  /** Live-region announcement (ACCESSIBILITY §3): the real count line. */
  announcement?: string;
}

export type PaginationProps = NumberedPaginationProps | LoadMorePaginationProps;

/** Windowed page list: first, last, and current ±1 with ellipsis. */
export function pageWindow(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  if (page <= 3) {
    for (const extra of [2, 3, 4]) {
      pages.add(extra);
    }
  }
  if (page >= pageCount - 2) {
    for (const extra of [pageCount - 3, pageCount - 2, pageCount - 1]) {
      pages.add(extra);
    }
  }
  const sorted = Array.from(pages)
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  let previous = 0;
  for (const value of sorted) {
    if (value - previous > 1) {
      result.push("ellipsis");
    }
    result.push(value);
    previous = value;
  }
  return result;
}

export function Pagination(props: PaginationProps): React.JSX.Element {
  if (props.mode === "load-more") {
    const { onLoadMore, loading, remaining, announcement } = props;
    return (
      <div className="flex flex-col items-center gap-2">
        {announcement ? (
          <p role="status" className="text-meta text-text-secondary">
            {announcement}
          </p>
        ) : null}
        <Button variant="secondary" loading={loading} onClick={onLoadMore}>
          Load more
        </Button>
        {typeof remaining === "number" && !loading ? (
          <p className="text-meta text-text-secondary">{remaining} remaining</p>
        ) : null}
      </div>
    );
  }

  const { page, pageCount, onPageChange } = props;
  const windowed = pageWindow(page, pageCount);
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1">
      <IconButton
        aria-label="Previous page"
        variant="ghost"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={20} strokeWidth={1.5} aria-hidden />
      </IconButton>
      {windowed.map((entry, index) =>
        entry === "ellipsis" ? (
          <span key={`ellipsis-${index}`} aria-hidden className="px-2 text-meta text-text-secondary">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            aria-current={entry === page ? "page" : undefined}
            aria-label={`Page ${entry}`}
            onClick={() => onPageChange(entry)}
            className={`sy-press inline-flex min-w-[2.75rem] items-center justify-center rounded-md border px-2 text-body ${
              entry === page
                ? "border-accent bg-accent font-medium text-background"
                : "border-border bg-transparent text-text-primary hover:bg-surface"
            }`}
            style={{ minHeight: "var(--target-min)" }}
          >
            {entry}
          </button>
        ),
      )}
      <IconButton
        aria-label="Next page"
        variant="ghost"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={20} strokeWidth={1.5} aria-hidden />
      </IconButton>
    </nav>
  );
}
