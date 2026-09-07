// Deliberate G-8 fixture — violates syconia/no-raw-hex ON PURPOSE.
// eslint-ignored by the main config; scripts/ci/lint-rules-check.sh asserts
// the rule fires on this file.
const surfaceTone = "#09090b";

export function FixtureRawHex() {
  return <span data-tone={surfaceTone} />;
}
