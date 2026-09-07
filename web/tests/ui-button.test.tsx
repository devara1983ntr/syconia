import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/lib/motion/provider";
import { Button, IconButton } from "@/components/ui/button";

/**
 * M1-T008 — Button + IconButton contracts (DESIGN-SYSTEM §10; states
 * default/hover/active/focus/disabled/loading; ACCESSIBILITY §2/§3/§7).
 * axe zero-critical per state (task acceptance); keyboard operability
 * via userEvent (Space/Enter on native <button>).
 */

afterEach(() => {
  cleanup();
});

/** Renders inside the real MotionProvider (LazyMotion domAnimation strict — the app's root context). */
function ui(jsx: React.JSX.Element): ReturnType<typeof render> {
  return render(<MotionProvider>{jsx}</MotionProvider>);
}

async function expectNoCriticalViolations(container: HTMLElement): Promise<void> {
  const results = await axe.run(container);
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(
    critical.map((v) => `${v.id}: ${v.description}`),
  ).toEqual([]);
}

describe("M1-T008 Button", () => {
  it("renders a native type=button control with the §12 verb label", () => {
    ui(<Button>Enter</Button>);
    const button = screen.getByRole("button", { name: "Enter" });
    expect(button).toHaveProperty("tagName", "BUTTON");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.className).toContain("sy-press");
    expect(button.className).toContain("bg-accent");
    expect(button.className).toContain("text-background");
  });

  it("variants: secondary ghost + destructive classes", () => {
    const { rerender } = ui(<Button variant="secondary">Retry</Button>);
    expect(screen.getByRole("button", { name: "Retry" }).className).toContain("bg-transparent");
    rerender(
      <MotionProvider>
        <Button variant="destructive">Report</Button>
      </MotionProvider>,
    );
    expect(screen.getByRole("button", { name: "Report" }).className).toContain("bg-error");
  });

  it("all sizes keep the 44px target floor (ACCESSIBILITY §7)", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const { container, unmount } = ui(<Button size={size}>Enter</Button>);
      const button = container.querySelector("button") as HTMLButtonElement | null;
      expect(button?.style.minHeight).toBe("var(--target-min)");
      unmount();
    }
  });

  it("loading: aria-busy + disabled + the ostiole dot, label retained (§10/§9)", () => {
    ui(<Button loading>Watch</Button>);
    const button = screen.getByRole("button", { name: "Watch" });
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button).toHaveProperty("disabled", true);
    expect(button.textContent).toContain("Watch");
    const dot = button.querySelector("span[aria-hidden='true']") as HTMLElement | null;
    expect(dot).not.toBeNull();
    expect(dot?.style.width).toBe("8px"); // OSTIOLE_DOT.size
  });

  it("loading suspends interaction but plain disabled does too (D-006b inert branch)", () => {
    const onClick = vi.fn();
    const { rerender } = ui(
      <Button loading onClick={onClick}>
        Watch
      </Button>,
    );
    screen.getByRole("button", { name: "Watch" }).click();
    expect(onClick).not.toHaveBeenCalled();
    rerender(
      <MotionProvider>
        <Button disabled onClick={onClick}>
          Watch
        </Button>,
      </MotionProvider>,
    );
    screen.getByRole("button", { name: "Watch" }).click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disabled renders the D-006b inert treatment (surface + tertiary + not-allowed)", () => {
    ui(<Button disabled>Enter</Button>);
    const button = screen.getByRole("button", { name: "Enter" });
    expect(button.className).toContain("bg-surface");
    expect(button.className).toContain("text-text-tertiary");
    expect(button.className).toContain("cursor-not-allowed");
  });

  it("click + keyboard: Space and Enter activate (§2 keyboard law)", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    ui(<Button onClick={onClick}>Enter</Button>);
    const button = screen.getByRole("button", { name: "Enter" });
    await user.click(button);
    await user.keyboard(" "); // Space on the focused native button
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("axe: zero critical violations across every state", async () => {
    const { container } = ui(
      <div>
        <Button>Enter</Button>
        <Button variant="secondary">Retry</Button>
        <Button variant="destructive">Report</Button>
        <Button loading>Watch</Button>
        <Button disabled>Enter</Button>
        <Button size="sm">sm</Button>
        <Button size="lg">lg</Button>
      </div>,
    );
    await expectNoCriticalViolations(container);
  });
});

describe("M1-T008 IconButton", () => {
  it("renders an icon-only button whose accessible name is the aria-label (§3)", () => {
    ui(
      <IconButton aria-label="Search">
        <svg viewBox="0 0 20 20" width={20} height={20} data-testid="icon" />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Search" });
    expect(button).toBeDefined();
    expect(button.querySelector('[data-testid="icon"]')).not.toBeNull();
  });

  it("target ≥44×44 on both axes (§7)", () => {
    const { container } = ui(
      <IconButton aria-label="Search">
        <svg width={20} height={20} />
      </IconButton>,
    );
    const button = container.querySelector("button") as HTMLButtonElement | null;
    expect(button?.style.minHeight).toBe("var(--target-min)");
    expect(button?.style.minWidth).toBe("var(--target-min)");
  });

  it("loading swaps the icon for the ostiole dot (§9 — loading is never an icon)", () => {
    ui(
      <IconButton aria-label="Retry" loading>
        <svg width={20} height={20} data-testid="icon" />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Retry" });
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.querySelector('[data-testid="icon"]')).toBeNull();
    expect(button.querySelector("span[aria-hidden='true']")).not.toBeNull();
  });

  it("keyboard: Enter activates", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    ui(
      <IconButton aria-label="Close" onClick={onClick}>
        <svg width={20} height={20} />
      </IconButton>,
    );
    await user.keyboard("{Tab}");
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("axe: zero critical violations across states", async () => {
    const { container } = ui(
      <div>
        <IconButton aria-label="Search">
          <svg width={20} height={20} />
        </IconButton>
        <IconButton aria-label="Search" variant="solid">
          <svg width={20} height={20} />
        </IconButton>
        <IconButton aria-label="Retry" loading>
          <svg width={20} height={20} />
        </IconButton>
        <IconButton aria-label="Close" disabled>
          <svg width={20} height={20} />
        </IconButton>
      </div>,
    );
    await expectNoCriticalViolations(container);
  });
});
