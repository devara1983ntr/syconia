import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/lib/motion/provider";
import { Tooltip } from "@/components/ui/tooltip";
import { TOOLTIP_DELAY_MS } from "@/components/ui/states";
import { Button } from "@/components/ui/button";

/**
 * M1-T009 — Tooltip contracts (DESIGN-SYSTEM §10 "Tooltip (focus+
 * hover, 300ms delay, ESC-dismiss)"; ACCESSIBILITY §3 aria-describedby).
 * Fake timers drive the 300ms delay deterministically; interactions use
 * fireEvent (userEvent's async act machinery deadlocks under faked
 * timers in this React 19/jsdom environment — pinned finding, see the
 * toast suite note).
 */

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function ui(jsx: React.JSX.Element) {
  return render(<MotionProvider>{jsx}</MotionProvider>);
}

describe("M1-T009 Tooltip", () => {
  it("stays hidden until the 300ms §10 delay elapses (focus path)", async () => {
    ui(
      <Tooltip label="Copy link">
        <Button>Copy link</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Copy link" });
    await act(async () => {
      trigger.focus();
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(TOOLTIP_DELAY_MS);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("hides immediately on blur (no hide delay in the spec)", async () => {
    ui(
      <Tooltip label="Copy link">
        <Button>Copy link</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Copy link" });
    await act(async () => {
      trigger.focus();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(TOOLTIP_DELAY_MS);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await act(async () => {
      trigger.blur();
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("wire: trigger carries aria-describedby → the tooltip id only while open", async () => {
    ui(
      <Tooltip label="Copy link">
        <Button>Copy link</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Copy link" });
    expect(trigger.getAttribute("aria-describedby")).toBeNull();
    await act(async () => {
      trigger.focus();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(TOOLTIP_DELAY_MS);
    });
    const tooltip = screen.getByRole("tooltip");
    expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);
    expect(tooltip.textContent).toBe("Copy link");
  });

  it("ESC dismisses the open tooltip (§10 ESC-dismiss)", async () => {
    ui(
      <Tooltip label="Copy link">
        <Button>Copy link</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Copy link" });
    await act(async () => {
      trigger.focus();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(TOOLTIP_DELAY_MS);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await act(async () => {
      fireEvent.keyDown(trigger, { key: "Escape" });
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    // ESC consumed by the tooltip — the trigger keeps focus.
    expect(document.activeElement).toBe(trigger);
  });

  it("hover path: mouseenter arms the delay, mouseleave cancels it", async () => {
    ui(
      <Tooltip label="Retry">
        <Button>Retry</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Retry" });
    await act(async () => {
      // React synthesizes mouseenter from mouseover (relatedTarget null = entering).
      fireEvent.mouseOver(trigger, { relatedTarget: null });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(TOOLTIP_DELAY_MS - 1);
    });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await act(async () => {
      // Leaving toward another element synthesizes mouseleave → cancel.
      fireEvent.mouseOut(trigger, { relatedTarget: document.body });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(TOOLTIP_DELAY_MS);
    });
    // The leave cancelled the pending timer — nothing shows.
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("hover path: the full delay elapses → tooltip shows", async () => {
    ui(
      <Tooltip label="Retry">
        <Button>Retry</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Retry" });
    await act(async () => {
      fireEvent.mouseOver(trigger, { relatedTarget: null });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(TOOLTIP_DELAY_MS);
    });
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("tooltip").textContent).toBe("Retry");
  });

  it("axe: zero critical violations with the tooltip open", async () => {
    ui(
      <Tooltip label="Copy link">
        <Button>Copy link</Button>
      </Tooltip>,
    );
    await act(async () => {
      screen.getByRole("button", { name: "Copy link" }).focus();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(TOOLTIP_DELAY_MS);
    });
    vi.useRealTimers();
    await waitFor(async () => {
      const results = await axe.run(document.body);
      const critical = results.violations.filter((v) => v.impact === "critical");
      expect(critical.map((v) => v.id)).toEqual([]);
    });
  });
});
