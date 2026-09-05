#!/usr/bin/env bash
# SYCONIA — G-7 no-placeholder gate (CI-CD.md §4; AGENT.md §2.1.11).
# Scans the production paths for prohibited marker vocabulary and exits 1 on
# any hit that is not a reviewed exception in the allowlist file. Designed to
# run identically locally and in CI (`npm run ci:no-placeholder-gate`).
set -euo pipefail
cd "$(dirname "$0")/../.."

ALLOWLIST="scripts/ci/no-placeholder-gate-allowlist.txt"
PATHS=(app lib components drizzle scripts)
PATTERNS=('\bTODO\b' '\bFIXME\b' '\bTBD\b' '\bXXX\b' '\bHACK\b' '\bmock\b' '\bdummy\b' '\bfake\b' '\blorem\b' '\bplaceholder\b' 'coming soon' 'not implemented')

# Reviewed allowlist entries (comments and blank lines stripped).
mapfile -t ALLOWED < <(grep -vE '^[[:space:]]*(#|$)' "$ALLOWLIST" || true)

is_allowed() {
  local file="$1" entry
  for entry in "${ALLOWED[@]}"; do
    [[ "$file" == "$entry" ]] && return 0
  done
  return 1
}

declare -a VIOLATIONS=()
for pattern in "${PATTERNS[@]}"; do
  while IFS= read -r hit; do
    [[ -z "$hit" ]] && continue
    file="${hit%%:*}"
    if ! is_allowed "$file"; then
      VIOLATIONS+=("$hit")
    fi
  done < <(grep -rniIE "$pattern" -- "${PATHS[@]}" 2>/dev/null | grep -vF 'Binary file' || true)
done

if [ "${#VIOLATIONS[@]}" -gt 0 ]; then
  echo "G-7 no-placeholder gate: FAIL — ${#VIOLATIONS[@]} violation(s):" >&2
  printf '  %s\n' "${VIOLATIONS[@]}" >&2
  echo "Reviewed exceptions belong in $ALLOWLIST (one path per line, justification comment required)." >&2
  exit 1
fi

echo "G-7 no-placeholder gate: PASS — 0 violations across: ${PATHS[*]}"
