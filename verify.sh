#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

step() { printf '\n==> %s\n' "$1"; }

step "Layer 1a: typecheck"
pnpm typecheck

step "Layer 1b: lint"
pnpm lint

step "Layer 1c: architecture boundaries"
node scripts/check-boundaries.mjs

step "Layer 2: unit tests"
pnpm test

step "Layer 3: end-to-end"
pnpm e2e

step "Feature list integrity"
node scripts/wip.mjs status

echo
echo "verify: ALL LAYERS GREEN"
