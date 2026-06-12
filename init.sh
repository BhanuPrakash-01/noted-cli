#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Replace these commands with the correct commands for your repository.
INSTALL_CMD=(pnpm install)
VERIFY_CMD=(pnpm test)
START_CMD=(node bin/noted --help)

echo "==> Working directory: $PWD"
echo "==> Syncing dependencies"
"${INSTALL_CMD[@]}"

echo "==> Running baseline verification"
"${VERIFY_CMD[@]}"

echo "==> Startup command"
printf '    %q' "${START_CMD[@]}"
printf '\n'

if [ "${RUN_START_COMMAND:-0}" = "1" ]; then
  echo "==> Starting the app"
  exec "${START_CMD[@]}"
fi

echo "Set RUN_START_COMMAND=1 if you want init.sh to launch the app directly."


echo "==> Verifying bootstrap contract"

if ! ./bin/noted --help >/dev/null 2>&1; then
  echo "FAIL: can-start (./bin/noted --help)"; exit 11
fi

if ! pnpm test >/dev/null 2>&1; then
  echo "FAIL: can-test (pnpm test)"; exit 12
fi

if [ ! -f PROGRESS.md ] || ! grep -q "## Next Action" PROGRESS.md; then
  echo "FAIL: can-see-progress (PROGRESS.md missing or no Next Action)"; exit 13
fi

if [ ! -f AGENTS.md ]; then
  echo "FAIL: can-pick-next-steps (AGENTS.md missing)"; exit 14
fi

echo "OK: bootstrap contract holds"
echo "    can-start          PASS"
echo "    can-test           PASS"
echo "    can-see-progress   PASS"
echo "    can-pick-next-steps PASS"
echo
echo "Next action (from PROGRESS.md):"
awk '/^## Next Action/{flag=1; next} flag{print "    " $0}' PROGRESS.md | head -3