import tseslint from "typescript-eslint";
import syconia from "./eslint-local-rules.mjs";

/**
 * Fixture-only ESLint config: lints the deliberate G-8 violation fixtures in
 * tests/lint-fixtures/ with exactly the three custom rules (no framework
 * presets). scripts/ci/lint-rules-check.sh asserts each rule reports here.
 * The main eslint.config.mjs ignores the fixture directory on purpose.
 */
const fixturesConfig = [
  {
    files: ["tests/lint-fixtures/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      syconia,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "syconia/no-raw-hex": ["error", { allowedFiles: ["app/styles/tokens.css"] }],
      "syconia/no-dangerously-set-inner-html": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];

export default fixturesConfig;
