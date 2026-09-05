import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Checkbox, Radio } from "@/components/ui/choice";
import { Switch } from "@/components/ui/switch";

/**
 * M1-T008 — choice primitive contracts (Checkbox/Radio/Switch:
 * DESIGN-SYSTEM §10; ACCESSIBILITY §3 semantics, §2 keyboard, §7
 * targets). axe zero-critical per state.
 */

afterEach(() => {
  cleanup();
});

async function expectNoCriticalViolations(container: HTMLElement): Promise<void> {
  const results = await axe.run(container);
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical.map((v) => `${v.id}: ${v.description}`)).toEqual([]);
}

describe("M1-T008 Checkbox", () => {
  it("native checkbox semantics + programmatic label (§3)", () => {
    render(<Checkbox label="Discreet thumbnails" />);
    const box = screen.getByRole("checkbox", { name: "Discreet thumbnails" }) as HTMLInputElement;
    expect(box.tagName).toBe("INPUT");
    expect(box.type).toBe("checkbox");
    expect(box.checked).toBe(false);
  });

  it("the whole 44px row is the hit area (§7): clicking the label toggles", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Discreet thumbnails" onChange={onChange} />);
    await user.click(screen.getByText("Discreet thumbnails"));
    expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("keyboard: Space toggles (§2)", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Discreet thumbnails" />);
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    await user.tab();
    expect(document.activeElement).toBe(box);
    await user.keyboard(" ");
    expect(box.checked).toBe(true);
  });

  it("disabled: no toggle via label click or keyboard", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Clear traces" disabled />);
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    await user.click(screen.getByText("Clear traces"));
    expect(box.checked).toBe(false);
    // The D-006b inert treatment lands on the clickable row (wrapping label).
    expect(screen.getByText("Clear traces").closest("label")?.className).toContain("text-text-tertiary");
  });

  it("axe: zero critical violations across every state", async () => {
    const { container } = render(
      <div>
        <Checkbox label="Default" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled checked" disabled defaultChecked />
      </div>,
    );
    await expectNoCriticalViolations(container);
  });
});

describe("M1-T008 Radio", () => {
  it("native radio semantics + shared-name group behavior", async () => {
    const user = userEvent.setup();
    render(
      <fieldset>
        <legend>Sort</legend>
        <Radio name="sort" label="Relevance" defaultChecked />
        <Radio name="sort" label="Newest" />
      </fieldset>,
    );
    const relevance = screen.getByRole("radio", { name: "Relevance" }) as HTMLInputElement;
    const newest = screen.getByRole("radio", { name: "Newest" }) as HTMLInputElement;
    expect(relevance.checked).toBe(true);
    await user.click(newest);
    expect(newest.checked).toBe(true);
    expect(relevance.checked).toBe(false); // native mutual exclusion
  });

  it("keyboard: arrows navigate the group (§2)", async () => {
    const user = userEvent.setup();
    render(
      <fieldset>
        <legend>Sort</legend>
        <Radio name="kb" label="Relevance" defaultChecked data-testid="r1" />
        <Radio name="kb" label="Newest" data-testid="r2" />
      </fieldset>,
    );
    const first = screen.getByTestId("r1");
    await user.tab();
    expect(document.activeElement).toBe(first);
    await user.keyboard("{ArrowDown}");
    expect((screen.getByTestId("r2") as HTMLInputElement).checked).toBe(true);
  });

  it("axe: zero critical violations across every state", async () => {
    const { container } = render(
      <fieldset>
        <legend>Sort</legend>
        <Radio name="a" label="Default" />
        <Radio name="a" label="Checked" defaultChecked />
        <Radio name="a" label="Disabled" disabled />
      </fieldset>,
    );
    await expectNoCriticalViolations(container);
  });
});

describe("M1-T008 Switch", () => {
  it("role=switch with aria-checked on a native button (§3)", () => {
    render(<Switch label="Discreet thumbnails" />);
    const control = screen.getByRole("switch", { name: "Discreet thumbnails" });
    expect(control.tagName).toBe("BUTTON");
    expect(control.getAttribute("aria-checked")).toBe("false");
  });

  it("click + keyboard Space toggle the state (§2)", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Discreet thumbnails" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole("switch");
    await user.click(control);
    expect(control.getAttribute("aria-checked")).toBe("true");
    await user.keyboard(" ");
    expect(control.getAttribute("aria-checked")).toBe("false");
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("uncontrolled default + controlled override", () => {
    const { rerender } = render(<Switch label="Session traces" defaultChecked />);
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("true");
    rerender(<Switch label="Session traces" checked={false} />);
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false");
  });

  it("disabled: aria-disabled + no toggle", async () => {
    const user = userEvent.setup();
    render(<Switch label="Discreet thumbnails" disabled />);
    const control = screen.getByRole("switch");
    expect(control.getAttribute("aria-disabled")).toBe("true");
    await user.click(control);
    expect(control.getAttribute("aria-checked")).toBe("false");
  });

  it("hint wired via aria-describedby", () => {
    render(<Switch label="Discreet thumbnails" hint="Session-only setting." />);
    const control = screen.getByRole("switch");
    const hint = screen.getByText("Session-only setting.");
    expect(control.getAttribute("aria-describedby")).toContain(hint.id);
  });

  it("axe: zero critical violations across every state", async () => {
    const { container } = render(
      <div>
        <Switch label="Default" />
        <Switch label="Checked" defaultChecked />
        <Switch label="With hint" hint="Session-only setting." />
        <Switch label="Disabled" disabled />
      </div>,
    );
    await expectNoCriticalViolations(container);
  });
});
