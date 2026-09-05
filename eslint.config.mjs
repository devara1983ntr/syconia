import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";
import syconia from "./eslint-local-rules.mjs";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "coverage/**",
    ".skills/**",
    // Deliberate G-8 violation fixtures — validated by `npm run ci:lint-rules`
    // (which asserts each rule fires); excluded here so `npm run lint` stays
    // the clean zero-warning gate (G-1).
    "tests/lint-fixtures/**",
  ]),
  nextCoreWebVitals,
  nextTypescript,
  {
    plugins: {
      syconia,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // G-8 custom rules (CI-CD.md §3.2/§4): raw hex only in the token layer,
      // no dangerouslySetInnerHTML, no `any`. Two reviewed exemptions:
      // - tests/unit/tokens.test.ts quotes the DESIGN-SYSTEM §4/§5 tables
      //   verbatim — that is the verification source, not production
      //   styling.
      // - app/manifest.ts must emit literal theme_color/background_color:
      //   the web-app-manifest spec takes CSS color strings only (var()
      //   is not a valid manifest value); the values are byte-equal to
      //   tokens.css §4 Obsidian and unit-asserted against the token
      //   layer (tests/unit/manifest-metadata.test.ts).
      "syconia/no-raw-hex": [
        "error",
        {
          allowedFiles: [
            "app/styles/tokens.css",
            "tests/unit/tokens.test.ts",
            "app/manifest.ts",
          ],
        },
      ],
      "syconia/no-dangerously-set-inner-html": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);

export default eslintConfig;
