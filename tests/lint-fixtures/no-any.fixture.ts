// Deliberate G-8 fixture — violates @typescript-eslint/no-explicit-any ON
// PURPOSE. eslint-ignored by the main config; scripts/ci/lint-rules-check.sh
// asserts the rule fires on this file.
export function loosen(value: unknown): any {
  return value;
}
