import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Input, Select, Textarea } from "@/components/ui/field";

/**
 * M1-T008 — field primitive contracts (Input/Select/Textarea:
 * DESIGN-SYSTEM §10 "with hint/error slots"; ACCESSIBILITY §3 label +
 * describedby wiring, §7 44px targets). axe zero-critical per state.
 */

afterEach(() => {
  cleanup();
});

async function expectNoCriticalViolations(container: HTMLElement): Promise<void> {
  const results = await axe.run(container);
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical.map((v) => `${v.id}: ${v.description}`)).toEqual([]);
}

describe("M1-T008 Input", () => {
  it("wires the programmatic label (htmlFor ↔ id, §3)", () => {
    render(<Input label="Search" placeholder="Titles…" />);
    const input = screen.getByLabelText("Search");
    expect(input.tagName).toBe("INPUT");
  });

  it("hint slot: aria-describedby points at the hint node", () => {
    render(<Input label="Search" hint="Suggests as you type." />);
    const input = screen.getByLabelText("Search");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const hint = screen.getByText("Suggests as you type.");
    expect(describedBy).toContain(hint.id);
  });

  it("error state: aria-invalid + role=alert message + error border class", () => {
    render(<Input label="Search" error="Check your terms." />);
    const input = screen.getByLabelText("Search");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.className).toContain("border-error");
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("Check your terms.");
    expect(input.getAttribute("aria-describedby")).toContain(alert.id);
  });

  it("required: aria-required + visual gold asterisk (decorative)", () => {
    render(<Input label="Contact email" required />);
    // The visible label carries the decorative asterisk; the input's
    // accessible name stays clean (aria-hidden excluded from name calc).
    const input = screen.getByLabelText(/Contact email/) as HTMLInputElement;
    expect(input.getAttribute("aria-required")).toBe("true");
    const marker = document.querySelector("span[aria-hidden='true']");
    expect(marker?.textContent).toBe("*");
  });

  it("disabled: attribute + D-006b inert classes + no input accepted", async () => {
    const user = userEvent.setup();
    render(<Input label="Search" disabled />);
    const input = screen.getByLabelText("Search") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.className).toContain("cursor-not-allowed");
    await user.type(input, "x");
    expect(input.value).toBe("");
  });

  it("typing works when enabled (keyboard §2)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input label="Search" onChange={onChange} />);
    const input = screen.getByLabelText("Search");
    await user.type(input, "bloom");
    expect((input as HTMLInputElement).value).toBe("bloom");
    expect(onChange).toHaveBeenCalled();
  });

  it("44px target floor (§7)", () => {
    const { container } = render(<Input label="Search" />);
    expect(container.querySelector("input")?.style.minHeight).toBe("var(--target-min)");
  });

  it("axe: zero critical violations across every state", async () => {
    const { container } = render(
      <div>
        <Input label="Search" />
        <Input label="Search" hint="Suggests as you type." />
        <Input label="Search" error="Check your terms." />
        <Input label="Search" disabled />
        <Input label="Email" required />
      </div>,
    );
    await expectNoCriticalViolations(container);
  });
});

describe("M1-T008 Select", () => {
  const OPTIONS = [
    { value: "relevance", label: "Relevance" },
    { value: "newest", label: "Newest" },
  ];

  it("native combobox semantics with label + options", () => {
    render(<Select label="Sort" options={OPTIONS} />);
    const select = screen.getByLabelText("Sort") as HTMLSelectElement;
    expect(select.tagName).toBe("SELECT");
    expect(select.options.length).toBe(2);
    expect(select.options[0]?.value).toBe("relevance");
  });

  it("chevron affordance is decorative (§3) — lucide icon, aria-hidden", () => {
    const { container } = render(<Select label="Sort" options={OPTIONS} />);
    const svg = container.querySelector("select ~ svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("change events fire (keyboard operable native control)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Sort" options={OPTIONS} onChange={onChange} />);
    const select = screen.getByLabelText("Sort");
    await user.selectOptions(select, "newest");
    expect((select as HTMLSelectElement).value).toBe("newest");
    expect(onChange).toHaveBeenCalled();
  });

  it("error + disabled states", () => {
    const { rerender } = render(<Select label="Sort" options={OPTIONS} error="Unavailable offline." />);
    expect(screen.getByRole("alert").textContent).toBe("Unavailable offline.");
    rerender(<Select label="Sort" options={OPTIONS} disabled />);
    expect((screen.getByLabelText("Sort") as HTMLSelectElement).disabled).toBe(true);
  });

  it("axe: zero critical violations across every state", async () => {
    const { container } = render(
      <div>
        <Select label="Sort" options={OPTIONS} />
        <Select label="Sort" options={OPTIONS} hint="Applies to the filter set." />
        <Select label="Sort" options={OPTIONS} error="Unavailable offline." />
        <Select label="Sort" options={OPTIONS} disabled />
      </div>,
    );
    await expectNoCriticalViolations(container);
  });
});

describe("M1-T008 Textarea", () => {
  it("label wiring + rows attribute", () => {
    render(<Textarea label="Report details" rows={6} />);
    const area = screen.getByLabelText("Report details") as HTMLTextAreaElement;
    expect(area.tagName).toBe("TEXTAREA");
    expect(area.rows).toBe(6);
  });

  it("typing works; hint/error slots shared with Input", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Report details" hint="Optional context." />);
    const area = screen.getByLabelText("Report details");
    await user.type(area, "context");
    expect((area as HTMLTextAreaElement).value).toBe("context");
    expect(screen.getByText("Optional context.")).toBeTruthy();
  });

  it("axe: zero critical violations across every state", async () => {
    const { container } = render(
      <div>
        <Textarea label="Report details" />
        <Textarea label="Report details" hint="Optional context." />
        <Textarea label="Report details" error="Could not submit." />
        <Textarea label="Report details" disabled />
      </div>,
    );
    await expectNoCriticalViolations(container);
  });
});
