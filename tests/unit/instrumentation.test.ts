import { describe, expect, it, vi } from "vitest";

import { register } from "@/instrumentation";

/**
 * M1-T007 boot wiring: instrumentation.register() performs the fail-closed
 * environment validation exactly once per server boot on the Node runtime
 * (ARCHITECTURE §12). lib/env is mocked to observe the call.
 */

const bootValidateEnv = vi.hoisted(() => vi.fn());

vi.mock("@/lib/env", () => ({
  bootValidateEnv,
}));

describe("instrumentation.register (boot gate wiring)", () => {
  it("validates the environment on the nodejs runtime", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    bootValidateEnv.mockClear();
    await register();
    expect(bootValidateEnv).toHaveBeenCalledTimes(1);
    expect(bootValidateEnv).toHaveBeenCalledWith();
  });

  it("skips validation on non-node runtimes (edge)", async () => {
    vi.stubEnv("NEXT_RUNTIME", "edge");
    bootValidateEnv.mockClear();
    await register();
    expect(bootValidateEnv).not.toHaveBeenCalled();
  });
});
