import { defineConfig, devices } from "@playwright/test";

/**
 * TESTING.md §3 matrix — Playwright-managed engines: Chromium (Chrome
 * latest), Firefox (latest), WebKit (Safari macOS latest). Chrome
 * latest−1, Edge, iOS/Android and BrowserStack layers join with the E2E
 * suite (M1-T017) and release-time device matrix per TESTING §3/§9.
 * Viewports (all suites): 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920.
 */
export const VIEWPORTS = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920] as const;

const baseURL = process.env.SYCONIA_E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
