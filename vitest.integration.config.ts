import { defineConfig } from "vitest/config";

/**
 * Integration harness (TESTING.md §2): route handlers / services / jobs
 * against ephemeral Postgres with drizzle migrations applied. The first
 * integration tests arrive with M2-T001 (schema + migrations) — until then
 * this config exists, is CI-ready, and fails loudly on zero test files
 * rather than reporting a green run.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
  },
});
