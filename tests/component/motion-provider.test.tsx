import { cleanup, render, waitFor } from "@testing-library/react";
import { m, motion } from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/lib/motion/provider";
import { selectVariants } from "@/lib/motion/variants";

/**
 * M1-T006 provider tests — LazyMotion + domAnimation + strict (PERFORMANCE
 * §3): children render and animate through the lightweight `m` components,
 * `motion.*` is rejected under strict (bundle discipline), and the
 * reduced-motion switch renders opacity-only (no transform styles).
 *
 * RTL auto-cleanup is not active (vitest globals are off), so cleanup runs
 * explicitly after each test.
 */

function PageProbe({
  reduced = false,
  testId = "probe",
}: {
  reduced?: boolean;
  testId?: string;
}) {
  const v = selectVariants(reduced);
  return (
    <m.div data-testid={testId} variants={v.page} initial="initial" animate="animate">
      content
    </m.div>
  );
}

afterEach(cleanup);

describe("M1-T006 MotionProvider (LazyMotion domAnimation strict)", () => {
  it("renders children and runs the page animation to opacity 1", async () => {
    const { getByTestId } = render(
      <MotionProvider>
        <PageProbe />
      </MotionProvider>,
    );
    const probe = getByTestId("probe");
    await waitFor(() => expect(probe.style.opacity).toBe("1"), { timeout: 2000 });
  });

  it("applies the §9 initial state synchronously on mount (opacity 0, translateY 8px)", () => {
    const { getByTestId } = render(
      <MotionProvider>
        <PageProbe />
      </MotionProvider>,
    );
    const probe = getByTestId("probe");
    expect(probe.style.opacity).toBe("0");
    expect(probe.style.transform).toBe("translateY(8px)");
  });

  it("rejects motion.* components under strict mode (enforces m.*)", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <MotionProvider>
          <motion.div>bad</motion.div>
        </MotionProvider>,
      ),
    ).toThrow();
    spy.mockRestore();
  });
});

describe("M1-T006 reduced-motion switch at the component level", () => {
  it("standard page sets an initial transform; reduced page never sets one", async () => {
    const { getByTestId } = render(
      <MotionProvider>
        <PageProbe />
      </MotionProvider>,
    );
    const standard = getByTestId("probe");
    expect(standard.style.transform).toBe("translateY(8px)");
    await waitFor(() => expect(standard.style.opacity).toBe("1"), { timeout: 2000 });

    const { getByTestId: getReduced } = render(
      <MotionProvider>
        <PageProbe reduced testId="probe-reduced" />
      </MotionProvider>,
    );
    const reduced = getReduced("probe-reduced");
    expect(reduced.style.transform).toBe("");
    await waitFor(() => expect(reduced.style.opacity).toBe("1"), { timeout: 2000 });
    expect(reduced.style.transform).toBe("");
  });
});
