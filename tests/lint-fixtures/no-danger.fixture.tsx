// Deliberate G-8 fixture — violates syconia/no-dangerously-set-inner-html
// ON PURPOSE. eslint-ignored by the main config; scripts/ci/lint-rules-check.sh
// asserts the rule fires on this file.
export function FixtureDanger() {
  return <div dangerouslySetInnerHTML={{ __html: "" }} />;
}
