import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/lib/motion/provider";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { Check } from "lucide-react";

/**
 * M1-T009 — Dropdown contracts (DESIGN-SYSTEM §10 "Dropdown"; APG menu
 * button keyboard model: open+focus via Enter/Space/ArrowDown/ArrowUp,
 * arrow cycling with wrap, Home/End, ESC restores trigger focus, Tab
 * closes and flows, outside pointerdown closes without focus theft).
 */

afterEach(() => {
  cleanup();
});

function ui(jsx: React.JSX.Element) {
  return render(<MotionProvider>{jsx}</MotionProvider>);
}

const ITEMS: DropdownItem[] = [
  { id: "copy", label: "Copy link", icon: <Check size={20} strokeWidth={1.5} aria-hidden /> },
  { id: "report", label: "Report" },
  { id: "hide", label: "Hide this video", destructive: true },
];

describe("M1-T009 Dropdown", () => {
  it("trigger exposes aria-haspopup=menu + aria-expanded wired to open state", async () => {
    const user = userEvent.setup();
    ui(<Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("menu + menuitem roles; panel is labelled by the trigger", async () => {
    const user = userEvent.setup();
    ui(<Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    const menu = screen.getByRole("menu");
    expect(menu.getAttribute("aria-labelledby")).toBe(
      screen.getByRole("button", { name: "Actions" }).id,
    );
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("opening focuses the first item; ArrowDown/ArrowUp cycle with wrap", async () => {
    const user = userEvent.setup();
    ui(<Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await waitFor(() =>
      expect(document.activeElement).toHaveAccessibleName(/Copy link/),
    );
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveAccessibleName("Report");
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveAccessibleName(/Hide this video/);
    // Wrap to the first item.
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveAccessibleName(/Copy link/);
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toHaveAccessibleName(/Hide this video/);
  });

  it("Home/End jump to the first/last items", async () => {
    const user = userEvent.setup();
    ui(<Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName(/Copy link/));
    await user.keyboard("{End}");
    expect(document.activeElement).toHaveAccessibleName(/Hide this video/);
    await user.keyboard("{Home}");
    expect(document.activeElement).toHaveAccessibleName(/Copy link/);
  });

  it("ArrowDown on a closed trigger opens the menu with focus on the first item", async () => {
    const user = userEvent.setup();
    ui(<Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
      expect(document.activeElement).toHaveAccessibleName(/Copy link/);
    });
  });

  it("ESC closes and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    ui(<Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("menu")).toBeInTheDocument());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("selecting an item fires onSelect(id) and restores trigger focus", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    ui(<Dropdown label="Actions" items={ITEMS} onSelect={onSelect} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("menu")).toBeInTheDocument());
    await user.click(screen.getByRole("menuitem", { name: "Report" }));
    expect(onSelect).toHaveBeenCalledWith("report");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(document.activeElement).toBe(trigger);
  });

  it("outside pointerdown closes without stealing focus; inside clicks do not close", async () => {
    const user = userEvent.setup();
    ui(
      <div>
        <Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />
        <button type="button">Elsewhere</button>
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await waitFor(() => expect(screen.getByRole("menu")).toBeInTheDocument());
    // Pointerdown outside dismisses the menu (focus follows the click).
    fireEvent.pointerDown(screen.getByRole("button", { name: "Elsewhere" }));
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    // Pointerdown on the menu itself keeps it open.
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await waitFor(() => expect(screen.getByRole("menu")).toBeInTheDocument());
    fireEvent.pointerDown(screen.getByRole("menu"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("destructive item renders in the §4 error tone", async () => {
    const user = userEvent.setup();
    ui(<Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    const item = screen.getByRole("menuitem", { name: /Hide this video/ });
    expect(item.className).toContain("text-error");
  });

  it("panel carries the D-011 register geometry (44px floors, scroll ceiling, popover rung)", async () => {
    const user = userEvent.setup();
    ui(<Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    const menu = screen.getByRole("menu");
    expect(menu.style.maxHeight).toBe("352px");
    expect(menu.style.zIndex).toBe("var(--z-header-sticky)");
    for (const item of screen.getAllByRole("menuitem")) {
      expect(item.style.minHeight).toBe("var(--target-min)");
    }
  });

  it("axe: zero critical violations across the open/closed matrix", async () => {
    const user = userEvent.setup();
    ui(
      <div>
        <Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />
        <button type="button">Elsewhere</button>
      </div>,
    );
    await expectZeroCritical(document.body);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await waitFor(() => expect(screen.getByRole("menu")).toBeInTheDocument());
    await expectZeroCritical(document.body);
  });

  it("Tab from the menu closes it and continues the natural tab order (APG)", async () => {
    const user = userEvent.setup();
    ui(
      <div>
        <Dropdown label="Actions" items={ITEMS} onSelect={vi.fn()} />
        <button type="button">Elsewhere</button>
      </div>,
    );
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await waitFor(() => expect(document.activeElement).toHaveAccessibleName(/Copy link/));
    await user.tab();
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(document.activeElement).toHaveAccessibleName("Elsewhere");
  });
});

async function expectZeroCritical(scope: HTMLElement): Promise<void> {
  const results = await axe.run(scope);
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical.map((v) => v.id)).toEqual([]);
}
