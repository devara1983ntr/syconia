import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

/**
 * M1-T009 — Alert + Badge contracts (DESIGN-SYSTEM §10; ACCESSIBILITY
 * §3 roles: assertive alert for warning/error, polite status for
 * info/success; §4 tone mapping; §6 pill radius for badges).
 */

afterEach(() => {
  cleanup();
});

async function expectZeroCritical(scope: HTMLElement): Promise<void> {
  const results = await axe.run(scope);
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical.map((v) => v.id)).toEqual([]);
}

describe("M1-T009 Alert", () => {
  it("info/success are polite (role=status); warning/error are assertive (role=alert)", () => {
    const { container, rerender } = render(
      <Alert variant="info">Scheduled maintenance tonight.</Alert>,
    );
    expect(container.querySelector('[role="status"]')).not.toBeNull();
    rerender(<Alert variant="success">Reference TKN-4821 recorded.</Alert>);
    expect(container.querySelector('[role="status"]')).not.toBeNull();
    rerender(<Alert variant="warning">This source is under review.</Alert>);
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    rerender(<Alert variant="error">The gallery is unreachable. Retry.</Alert>);
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
  });

  it("variant tones: border + icon/text in the §4 semantic colors; body stays Alabaster", () => {
    const { container, rerender } = render(<Alert variant="error">Retry now.</Alert>);
    expect(container.firstChild!.firstChild).not.toBeNull();
    const alert = container.firstChild as HTMLElement;
    expect(alert.className).toContain("border-error");
    expect(alert.textContent).toContain("Retry now.");
    rerender(<Alert variant="success" title="Recorded">Reference TKN-9 recorded.</Alert>);
    const success = container.firstChild as HTMLElement;
    expect(success.className).toContain("border-success");
    expect(success.textContent).toContain("Recorded");
    expect(screen.getByText("Recorded").className).toContain("text-success");
  });

  it("axe: zero critical violations across the variant matrix", async () => {
    render(
      <div>
        <Alert variant="info">Scheduled maintenance tonight.</Alert>
        <Alert variant="success" title="Recorded">
          Reference TKN-9 recorded.
        </Alert>
        <Alert variant="warning" title="Under review">
          This source is under review.
        </Alert>
        <Alert variant="error" title="Unreachable">
          The gallery is unreachable. Retry.
        </Alert>
      </div>,
    );
    await expectZeroCritical(document.body.firstElementChild as HTMLElement);
  });
});

describe("M1-T009 Badge", () => {
  it("outline pills: hairline border + §4 variant tone (status/count/source roles)", () => {
    const { container, rerender } = render(<Badge variant="success">Verified</Badge>);
    let badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("rounded-full");
    expect(badge.className).toContain("border-success");
    expect(badge.className).toContain("text-success");
    rerender(<Badge variant="accent">12 videos</Badge>);
    badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("border-accent");
    expect(badge.className).toContain("text-accent");
    rerender(<Badge>Provided by VX</Badge>);
    badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("border-border");
    expect(badge.className).toContain("text-text-secondary");
  });

  it("solid pills: variant fill + Obsidian text (§4 inverse pairs all AA)", () => {
    render(
      <div>
        <Badge variant="accent" solid>
          3
        </Badge>
        <Badge variant="error" solid>
          Blocked
        </Badge>
      </div>,
    );
    const accent = screen.getByText("3");
    expect(accent.className).toContain("bg-accent");
    expect(accent.className).toContain("text-background");
    expect(screen.getByText("Blocked").className).toContain("bg-error");
  });

  it("never uses the 13px-illegal tertiary tone (§4 ≥14px-only law)", () => {
    const { container } = render(
      <div>
        <Badge>Neutral</Badge>
        <Badge variant="warning">Caution</Badge>
      </div>,
    );
    for (const node of container.querySelectorAll("span")) {
      expect(node.className).not.toContain("text-text-tertiary");
    }
  });

  it("axe: zero critical violations across the variant matrix", async () => {
    const { container } = render(
      <div>
        <Badge>Provided by VX</Badge>
        <Badge variant="accent">12 videos</Badge>
        <Badge variant="success">Verified</Badge>
        <Badge variant="warning">SLA 24h</Badge>
        <Badge variant="error">Blocked</Badge>
        <Badge variant="accent" solid>
          3
        </Badge>
      </div>,
    );
    await expectZeroCritical(container);
  });
});
