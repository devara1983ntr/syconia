import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/lib/motion/provider";
import { BottomSheet } from "@/components/ui/bottom-sheet";

/**
 * M1-T009 — BottomSheet contracts (DESIGN-SYSTEM §10 "BottomSheet
 * (≤767px)"; §9 sheet motion; SCREENS §213 "bottom-sheet (m ≤767px)").
 * matchMedia is stubbed per test (jsdom has no layout engine).
 */

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.documentElement.style.overflow = "";
});

type ChangeHandler = (event: MediaQueryListEvent) => void;

/** Controlled matchMedia stub: one query (max-width: 767px) + real MQL surface. */
function stubViewport(matches: boolean) {
  const listeners = new Set<ChangeHandler>();
  const state = { matches };
  const fire = () => {
    for (const listener of listeners) {
      listener({ matches: state.matches } as MediaQueryListEvent);
    }
  };
  const matchMedia = (query: string) => ({
    matches: query === "(max-width: 767px)" ? state.matches : false,
    media: query,
    addEventListener: (_type: string, listener: ChangeHandler) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: ChangeHandler) => {
      listeners.delete(listener);
    },
    addListener: (listener: ChangeHandler) => {
      listeners.add(listener);
    },
    removeListener: (listener: ChangeHandler) => {
      listeners.delete(listener);
    },
  });
  vi.stubGlobal("matchMedia", matchMedia);
  return {
    setMatches: (next: boolean) => {
      state.matches = next;
      fire();
    },
  };
}

function ui(jsx: React.JSX.Element) {
  return render(<MotionProvider>{jsx}</MotionProvider>);
}

function SheetHost({ onDismiss }: { onDismiss: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open sheet
      </button>
      <BottomSheet
        label="Actions"
        open={open}
        onDismiss={() => {
          setOpen(false);
          onDismiss();
        }}
        title="Choose an action"
      >
        <button type="button">Copy link</button>
      </BottomSheet>
    </div>
  );
}

describe("M1-T009 BottomSheet (≤767px law)", () => {
  it("renders as a dialog while the viewport is ≤767px", () => {
    stubViewport(true);
    ui(<SheetHost onDismiss={vi.fn()} />);
    // Visible title present → accessible name is the h2 (aria-labelledby).
    const dialog = screen.getByRole("dialog", { name: "Choose an action" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    // §6: radius-lg top corners; elevation register; z rung --z-modal-sheet.
    expect(dialog.className).toContain("rounded-t-lg");
    expect(dialog.style.zIndex).toBe("var(--z-modal-sheet)");
    expect(dialog.style.maxHeight).toBe("90dvh");
  });

  it("never renders at ≥768px (§10 scope row) — even with open=true", () => {
    stubViewport(false);
    ui(
      <BottomSheet label="Actions" open onDismiss={vi.fn()}>
        <span>Body</span>
      </BottomSheet>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("auto-dismisses honestly when the viewport grows past 767px while open", async () => {
    const viewport = stubViewport(true);
    const onDismiss = vi.fn();
    ui(
      <BottomSheet label="Actions" open onDismiss={onDismiss}>
        <span>Body</span>
      </BottomSheet>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await act(async () => {
      viewport.setMatches(false);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("ESC closes; X closes; scrim tap closes (S-00 close law)", async () => {
    stubViewport(true);
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    ui(
      <BottomSheet label="Actions" open onDismiss={onDismiss} title="Choose">
        <span>Body</span>
      </BottomSheet>,
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);

    const { unmount } = ui(
      <BottomSheet label="Actions" open onDismiss={onDismiss} title="Choose">
        <span>Body</span>
      </BottomSheet>,
    );
    const scrim = document.querySelector("div[aria-hidden='true']") as HTMLElement;
    fireEvent.click(scrim);
    expect(onDismiss).toHaveBeenCalledTimes(2);
    unmount();
  });

  it("axe: zero critical violations at mobile viewport", async () => {
    stubViewport(true);
    ui(<SheetHost onDismiss={vi.fn()} />);
    const results = await axe.run(document.body);
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical.map((v) => v.id)).toEqual([]);
  });
});
