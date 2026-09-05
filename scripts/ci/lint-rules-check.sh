#!/usr/bin/env bash
# SYCONIA G-8 lint-rule verification: lints the deliberate fixtures in
# tests/lint-fixtures/ with eslint.fixtures.config.mjs and asserts each
# custom rule reports. The fixtures must remain violations — that is the
# point of the check (`npm run ci:lint-rules`).
set -euo pipefail
cd "$(dirname "$0")/../.."

OUT="$(mktemp)"
trap 'rm -f "$OUT"' EXIT

# ESLint exits 1 when it reports violations — the expected outcome here.
set +e
npx eslint -c eslint.fixtures.config.mjs tests/lint-fixtures/ >"$OUT" 2>&1
STATUS=$?
set -e

if [ "$STATUS" -eq 0 ]; then
  echo "G-8 lint-rule check: FAIL — fixtures produced no violations; the custom rules are not firing." >&2
  exit 1
fi

MISSING=0
for rule in "syconia/no-raw-hex" "syconia/no-dangerously-set-inner-html" "@typescript-eslint/no-explicit-any"; do
  if ! grep -q "$rule" "$OUT"; then
    echo "G-8 lint-rule check: FAIL — rule did not report: $rule" >&2
    MISSING=1
  fi
done

if [ "$MISSING" -ne 0 ]; then
  cat "$OUT" >&2
  exit 1
fi

# G-8 CSS pass: raw hex colors in stylesheet sources outside the token layer
# (app/styles/tokens.css is the sanctioned exemption — DESIGN-SYSTEM §13).
TOKENS_FILE="app/styles/tokens.css"
CSS_HITS="$(grep -rniE '#[0-9a-fA-F]{3,8}([^0-9a-zA-Z]|$)' \
  --include='*.css' app components lib drizzle scripts 2>/dev/null \
  | grep -v "^${TOKENS_FILE}:" || true)"

if [ -n "$CSS_HITS" ]; then
  echo "G-8 lint-rule check: FAIL — raw hex outside the token layer:" >&2
  printf '  %s\n' $CSS_HITS >&2
  exit 1
fi

echo "G-8 lint-rule check: PASS — all three custom rules fired on the deliberate fixtures; no raw hex outside the token layer."
