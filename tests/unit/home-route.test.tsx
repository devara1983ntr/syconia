import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/(public)/page";

/**
 * M1-T002 harness smoke: proves Vitest + jsdom + React Testing Library +
 * the Vite React pipeline + the `@/` alias all run, against the real
 * (stripped) scaffold home route — no fabricated app behavior.
 */
describe("scaffold home route (harness smoke)", () => {
  it("renders the stripped semantic home landmark", () => {
    render(<HomePage />);
    expect(screen.getByRole("main", { name: "SYCONIA home" })).toBeDefined();
  });
});
