import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/lib/motion/provider";
import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@/components/ui/tabs";

/**
 * M1-T009 — Tabs contracts (DESIGN-SYSTEM §10 "Tabs"; WAI-ARIA tabs
 * pattern: tablist/tab/tabpanel, aria-selected, roving tabIndex,
 * ArrowLeft/Right + Home/End, automatic activation).
 */

afterEach(() => {
  cleanup();
});

function ui(jsx: React.JSX.Element) {
  return render(<MotionProvider>{jsx}</MotionProvider>);
}

function ControlledHost({ onValueChange }: { onValueChange?: (value: string) => void }) {
  const [value, setValue] = useState("discover");
  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    >
      <TabsList>
        <TabsTrigger value="discover">Discover</TabsTrigger>
        <TabsTrigger value="trending">Trending</TabsTrigger>
        <TabsTrigger value="new">New</TabsTrigger>
      </TabsList>
      <TabsPanel value="discover">Discovery grid</TabsPanel>
      <TabsPanel value="trending">Trending grid</TabsPanel>
      <TabsPanel value="new">Newest grid</TabsPanel>
    </Tabs>
  );
}

describe("M1-T009 Tabs — ARIA structure", () => {
  it("tablist/tab/tabpanel roles with aria-selected + cross wiring", () => {
    ui(<ControlledHost />);
    const tablist = screen.getByRole("tablist");
    expect(tablist.getAttribute("aria-orientation")).toBe("horizontal");
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    const active = screen.getByRole("tab", { selected: true, name: "Discover" });
    expect(active.getAttribute("aria-selected")).toBe("true");
    // aria-controls ↔ aria-labelledby panel wiring.
    const panel = screen.getByRole("tabpanel");
    expect(active.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(active.id);
    expect(panel.textContent).toContain("Discovery grid");
  });

  it("only the active tab is tabbable (roving tabIndex); inactive are -1", () => {
    ui(<ControlledHost />);
    const inactive = screen.getByRole("tab", { name: "Trending" });
    expect(inactive.tabIndex).toBe(-1);
    expect(screen.getByRole("tab", { name: "Discover" }).tabIndex).toBe(0);
  });

  it("only the active panel renders (single-visible-panel contract)", () => {
    ui(<ControlledHost />);
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    expect(screen.queryByText("Trending grid")).not.toBeInTheDocument();
  });
});

describe("M1-T009 Tabs — keyboard (APG arrows/Home/End)", () => {
  it("ArrowRight moves focus and activates with wrap", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    ui(<ControlledHost onValueChange={onValueChange} />);
    screen.getByRole("tab", { name: "Discover" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveAccessibleName("Trending");
    expect(onValueChange).toHaveBeenLastCalledWith("trending");
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveAccessibleName("New");
    await user.keyboard("{ArrowRight}");
    // Wrap to the first tab.
    expect(document.activeElement).toHaveAccessibleName("Discover");
  });

  it("ArrowLeft wraps backwards; Home/End jump", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    ui(<ControlledHost onValueChange={onValueChange} />);
    screen.getByRole("tab", { name: "Discover" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toHaveAccessibleName("New");
    expect(onValueChange).toHaveBeenLastCalledWith("new");
    await user.keyboard("{Home}");
    expect(document.activeElement).toHaveAccessibleName("Discover");
    await user.keyboard("{End}");
    expect(document.activeElement).toHaveAccessibleName("New");
  });

  it("click activation + Space/Enter on the native button (§2)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    ui(<ControlledHost onValueChange={onValueChange} />);
    await user.click(screen.getByRole("tab", { name: "Trending" }));
    expect(onValueChange).toHaveBeenLastCalledWith("trending");
    expect(screen.getByRole("tabpanel").textContent).toContain("Trending grid");
    const focused = screen.getByRole("tab", { name: "New" });
    focused.focus();
    await user.keyboard(" ");
    expect(onValueChange).toHaveBeenLastCalledWith("new");
  });
});

describe("M1-T009 Tabs — uncontrolled mode", () => {
  it("defaultValue drives the initial tab; internal state switches panels", async () => {
    const user = userEvent.setup();
    ui(
      <Tabs defaultValue="trending">
        <TabsList>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>
        <TabsPanel value="discover">Discovery grid</TabsPanel>
        <TabsPanel value="trending">Trending grid</TabsPanel>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { selected: true, name: "Trending" })).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Discover" }));
    expect(screen.getByRole("tab", { selected: true, name: "Discover" })).toBeInTheDocument();
    expect(screen.getByRole("tabpanel").textContent).toContain("Discovery grid");
  });

  it("active tab carries the gold underline (§4 active-nav law) and 44px floor", () => {
    ui(<ControlledHost />);
    const active = screen.getByRole("tab", { name: "Discover" });
    expect(active.className).toContain("border-accent");
    expect(active.style.minHeight).toBe("var(--target-min)");
    const inactive = screen.getByRole("tab", { name: "Trending" });
    expect(inactive.className).toContain("border-transparent");
  });
});

describe("M1-T009 Tabs — axe", () => {
  it("zero critical violations across the state matrix", async () => {
    const user = userEvent.setup();
    const { rerender } = ui(<ControlledHost />);
    await user.click(screen.getByRole("tab", { name: "Trending" }));
    const results = await axe.run(document.body);
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical.map((v) => v.id)).toEqual([]);
    rerender(
      <MotionProvider>
        <Tabs defaultValue="discover">
          <TabsList>
            <TabsTrigger value="discover" disabled>
              Discover
            </TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
          <TabsPanel value="discover">Discovery grid</TabsPanel>
          <TabsPanel value="trending">Trending grid</TabsPanel>
        </Tabs>
      </MotionProvider>,
    );
    const rerun = await axe.run(document.body);
    expect(rerun.violations.filter((v) => v.impact === "critical")).toEqual([]);
  });
});
