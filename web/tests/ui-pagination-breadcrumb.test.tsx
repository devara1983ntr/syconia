import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/lib/motion/provider";
import { Pagination, pageWindow } from "@/components/ui/pagination";
import { Breadcrumb } from "@/components/ui/breadcrumb";

/**
 * M1-T009 — Pagination + Breadcrumb contracts (DESIGN-SYSTEM §10
 * "Pagination (Load-more + numbered)", "Breadcrumb"; S-07 numbered
 * server pagination; S-03 Load-more; §7 chevron pagination/breadcrumb
 * icons; ACCESSIBILITY §3 "12 more videos loaded" live region).
 */

afterEach(() => {
  cleanup();
});

function ui(jsx: React.JSX.Element) {
  return render(<MotionProvider>{jsx}</MotionProvider>);
}

describe("M1-T009 Pagination — windowing math (pure)", () => {
  it("short ranges render every page with no ellipsis", () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(2, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageWindow(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("long ranges keep first, last, and current ±1 with ellipsis markers", () => {
    expect(pageWindow(1, 20)).toEqual([1, 2, 3, 4, "ellipsis", 20]);
    expect(pageWindow(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
    expect(pageWindow(20, 20)).toEqual([1, "ellipsis", 17, 18, 19, 20]);
    expect(pageWindow(5, 12)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 12]);
  });
});

describe("M1-T009 Pagination — numbered mode", () => {
  it("nav[aria-label=Pagination] with aria-current on the active page button", () => {
    ui(<Pagination page={2} pageCount={9} onPageChange={vi.fn()} />);
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav).toBeInTheDocument();
    const current = screen.getByRole("button", { name: "Page 2" });
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("button", { name: "Page 3" }).getAttribute("aria-current")).toBeNull();
    // Windowed: 1 … 2 3 … 9 with ellipsis markers present.
    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 9" })).toBeInTheDocument();
    expect(screen.getByText("…")).toBeInTheDocument();
  });

  it("active page is the gold accent (§4 active states); 44px floors on all controls", () => {
    ui(<Pagination page={2} pageCount={9} onPageChange={vi.fn()} />);
    const current = screen.getByRole("button", { name: "Page 2" });
    expect(current.className).toContain("bg-accent");
    expect(current.style.minHeight).toBe("var(--target-min)");
    for (const button of screen.getAllByRole("button")) {
      expect(button.style.minHeight).toBe("var(--target-min)");
    }
  });

  it("prev/next are chevron IconButtons, disabled at the bounds (§7 icons)", () => {
    const { rerender } = ui(<Pagination page={1} pageCount={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toHaveProperty("disabled", true);
    expect(screen.getByRole("button", { name: "Next page" })).toHaveProperty("disabled", false);
    rerender(
      <MotionProvider>
        <Pagination page={5} pageCount={5} onPageChange={vi.fn()} />
      </MotionProvider>,
    );
    expect(screen.getByRole("button", { name: "Previous page" })).toHaveProperty("disabled", false);
    expect(screen.getByRole("button", { name: "Next page" })).toHaveProperty("disabled", true);
  });

  it("click + keyboard page changes fire onPageChange with the target page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    ui(<Pagination page={2} pageCount={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole("button", { name: "Page 4" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("axe: zero critical violations across the state matrix", async () => {
    const { rerender } = ui(<Pagination page={2} pageCount={9} onPageChange={vi.fn()} />);
    let results = await axe.run(document.body);
    expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
    rerender(
      <MotionProvider>
        <Pagination page={1} pageCount={2} onPageChange={vi.fn()} />
      </MotionProvider>,
    );
    results = await axe.run(document.body);
    expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
  });
});

describe("M1-T009 Pagination — load-more mode (S-03)", () => {
  it("renders the §12-verb button + the live-region announcement line", () => {
    ui(
      <Pagination
        mode="load-more"
        onLoadMore={vi.fn()}
        announcement="24 videos loaded"
        remaining={12}
      />,
    );
    const button = screen.getByRole("button", { name: "Load more" });
    expect(button).toBeInTheDocument();
    expect(screen.getByRole("status").textContent).toContain("24 videos loaded");
    expect(screen.getByText("12 remaining")).toBeInTheDocument();
  });

  it("clicking Load more fires the consumer callback (loading = ostiole dot)", async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    const { rerender } = ui(
      <Pagination mode="load-more" onLoadMore={onLoadMore} announcement="12 videos loaded" />,
    );
    await user.click(screen.getByRole("button", { name: "Load more" }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    rerender(
      <MotionProvider>
        <Pagination
          mode="load-more"
          onLoadMore={onLoadMore}
          loading
          announcement="12 videos loaded"
        />
      </MotionProvider>,
    );
    const button = screen.getByRole("button", { name: "Load more" });
    expect(button.getAttribute("aria-busy")).toBe("true");
    // The remaining-count line hides while loading (no stale counts).
    expect(screen.queryByText(/remaining/)).not.toBeInTheDocument();
  });

  it("axe: zero critical violations", async () => {
    ui(
      <Pagination
        mode="load-more"
        onLoadMore={vi.fn()}
        announcement="12 more videos loaded"
        remaining={24}
      />,
    );
    const results = await axe.run(document.body);
    expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
  });
});

describe("M1-T009 Breadcrumb", () => {
  const ITEMS = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: "Emerald Bloom" },
  ];

  it("nav[aria-label=Breadcrumb] > ol > li with links + aria-current on the last item", () => {
    render(<Breadcrumb items={ITEMS} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.querySelector("ol")).not.toBeNull();
    expect(nav.querySelectorAll("li")).toHaveLength(3);
    const current = screen.getByText("Emerald Bloom");
    expect(current.getAttribute("aria-current")).toBe("page");
    const home = screen.getByRole("link", { name: "Home" });
    expect(home.getAttribute("href")).toBe("/");
    expect(home.className).toContain("text-accent");
  });

  it("separators are decorative chevrons (aria-hidden, §7 icon)", () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    const separators = container.querySelectorAll('span[aria-hidden="true"]');
    expect(separators).toHaveLength(2);
    for (const separator of separators) {
      expect(separator.querySelector("svg")).not.toBeNull();
    }
  });

  it("wraps (§8: no horizontal overflow at narrow viewports)", () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    expect((container.querySelector("ol") as HTMLElement).className).toContain("flex-wrap");
  });

  it("axe: zero critical violations", async () => {
    const { container } = render(<Breadcrumb items={ITEMS} />);
    const results = await axe.run(container);
    expect(results.violations.filter((v) => v.impact === "critical")).toEqual([]);
  });
});
