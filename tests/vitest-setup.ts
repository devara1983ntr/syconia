import "@testing-library/jest-dom/vitest";

/**
 * Vitest global setup (wired at M1-T009): registers the
 * @testing-library/jest-dom matchers (toBeInTheDocument,
 * toHaveAccessibleName, …) used by the a11y-contract suites.
 *
 * Pinned explicitly as a devDependency (v6.9.1 — the version already
 * resolved transitively in the sandbox lockfile; TESTING §5/§8
 * keyboard + semantics assertions are the spec basis). Batch-1 suites
 * use plain Chai assertions and are unaffected.
 */
