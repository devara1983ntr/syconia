import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/lib/motion/provider";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { MOTION } from "@/lib/motion/variants";

/**
 * M1-T009 — Toast contracts (DESIGN-SYSTEM §10 "Toast"; §9 "slide-up +
 * fade in 200ms; auto-dismiss 4s (pause on hover/focus)"; S-00
 * "toasts … 4s, dismissible, role=status"; ACCESSIBILITY §3 live
 * region). Fake timers drive the 4s window; rAF stays real so motion
 * exit animations complete once real timers resume for assertions.
 * Date is faked WITH the timers (ToastView pause math uses Date.now()).
 *
 * Interactions use fireEvent: userEvent's async act machinery
 * deadlocks under vi fake timers in this React 19/jsdom environment
 * (reproduced minimally: even user.click hangs ~5s) — a pinned finding
 * recorded here for future suites; real-timer suites keep userEvent.
 */

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function ToastHost() {
  const { toast } = useToast();
  return (
    <div>
      <button type="button" onClick={() => toast({ message: "Link copied", variant: "success" })}>
        Copy link
      </button>
    </div>
  );
}

function ui(jsx: React.JSX.Element) {
  return render(
    <MotionProvider>
      <ToastProvider>{jsx}</ToastProvider>
    </MotionProvider>,
  );
}

describe("M1-T009 Toast — region + live semantics", () => {
  it("the provider mounts a role=status region (task required row)", () => {
    ui(<ToastHost />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("toast() renders the message with the dismiss control", async () => {
    ui(<ToastHost />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });
    const region = screen.getByRole("status");
    expect(region.textContent).toContain("Link copied");
    expect(screen.getAllByRole("button", { name: "Dismiss" })).toHaveLength(1);
  });

  it("useToast outside the provider throws the honest contract error", () => {
    expect(() =>
      render(
        <MotionProvider>
          <ToastHost />
        </MotionProvider>,
      ),
    ).toThrow(/ToastProvider/);
  });
});

describe("M1-T009 Toast — §9 auto-dismiss 4s with pause on hover/focus", () => {
  it("auto-dismisses after the §9 4s window", async () => {
    ui(<ToastHost />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });
    expect(screen.getByText("Link copied")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(MOTION.toast.autoDismissMs);
    });
    vi.useRealTimers();
    await waitFor(() => expect(screen.queryByText("Link copied")).not.toBeInTheDocument());
  });

  it("custom duration overrides the 4s default", async () => {
    function DurationHost() {
      const { toast } = useToast();
      return (
        <button type="button" onClick={() => toast({ message: "Reference recorded", duration: 1000 })}>
          Record
        </button>
      );
    }
    ui(<DurationHost />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Record" }));
    });
    expect(screen.getByText("Reference recorded")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(999);
    });
    expect(screen.getByText("Reference recorded")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    vi.useRealTimers();
    await waitFor(() =>
      expect(screen.queryByText("Reference recorded")).not.toBeInTheDocument(),
    );
  });

  it("hover pauses the timer; leaving resumes the REMAINING time (§9)", async () => {
    ui(<ToastHost />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });
    const toast = screen.getByText("Link copied").closest("div");
    expect(toast).not.toBeNull();
    // Burn 2s, pause, burn far past the total while paused — nothing fires.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    await act(async () => {
      // React synthesizes pointerenter from pointerover (entering from outside).
      fireEvent.pointerOver(toast!, { relatedTarget: null });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });
    expect(screen.getByText("Link copied")).toBeInTheDocument();
    // Resume: the remaining 2s elapse and the toast dismisses.
    await act(async () => {
      fireEvent.pointerOut(toast!, { relatedTarget: document.body });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1999);
    });
    expect(screen.getByText("Link copied")).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    vi.useRealTimers();
    await waitFor(() => expect(screen.queryByText("Link copied")).not.toBeInTheDocument());
  });

  it("focus pauses too (ACCESSIBILITY §2 'toasts pause on focus')", async () => {
    ui(<ToastHost />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    // Focus moves onto the toast's Dismiss control — focusin reaches the
    // toast container (React onFocus) → the timer pauses.
    await act(async () => {
      screen.getByRole("button", { name: "Dismiss" }).focus();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });
    expect(screen.getByText("Link copied")).toBeInTheDocument();
  });

  it("the X dismiss button removes the toast immediately (dismissible)", async () => {
    ui(<ToastHost />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    });
    vi.useRealTimers();
    await waitFor(() => expect(screen.queryByText("Link copied")).not.toBeInTheDocument());
  });

  it("multiple toasts stack inside the single region", async () => {
    function MultiHost() {
      const { toast } = useToast();
      return (
        <div>
          <button type="button" onClick={() => toast({ message: "Link copied", variant: "success" })}>
            Copy
          </button>
          <button type="button" onClick={() => toast({ message: "You are offline", variant: "warning" })}>
            Go offline
          </button>
        </div>
      );
    }
    ui(<MultiHost />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Go offline" }));
    });
    expect(screen.getByText("Link copied")).toBeInTheDocument();
    expect(screen.getByText("You are offline")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Dismiss" })).toHaveLength(2);
    // One region only — the live surface stays unique.
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });
});

describe("M1-T009 Toast — placement + axe", () => {
  it("region sits at the S-00 toast z rung (--z-toast) and bottom placement", async () => {
    ui(<ToastHost />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });
    const region = screen.getByRole("status");
    expect(region.style.zIndex).toBe("var(--z-toast)");
    // S-00: bottom-center ≤767px (base) / bottom-right ≥768px (sm:).
    expect(region.className).toContain("bottom-4");
    expect(region.className).toContain("sm:left-auto");
    expect(region.className).toContain("sm:items-end");
  });

  it("axe: zero critical violations with toasts in the region", async () => {
    ui(<ToastHost />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });
    vi.useRealTimers();
    await waitFor(async () => {
      const results = await axe.run(document.body);
      const critical = results.violations.filter((v) => v.impact === "critical");
      expect(critical.map((v) => v.id)).toEqual([]);
    });
  });
});
