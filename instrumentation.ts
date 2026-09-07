/**
 * SYCONIA server boot hook — M1-T007, ARCHITECTURE §12.
 *
 * `register()` runs once when the Next.js server process boots (dev,
 * `next start`, and each server instance). It performs the fail-closed
 * environment validation: on an invalid environment the server logs the
 * safe issue list (variable names + reasons only — never values) and
 * exits with code 1 instead of serving traffic.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bootValidateEnv } = await import("./lib/env");
    bootValidateEnv();
  }
}
