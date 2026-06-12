# DECISIONS.md

Decisions kept here outlive any single session. Each entry: date, decision,
context, consequences. Append-only — strike through, never delete.

## D-001 — JSON in `.noted/` is the only persistence layer
- Date: 2025-MM-DD (Module 02)
- Context: A real notes app might use SQLite or a vector store. Course
  scope rules them out (`docs/PRODUCT.md`). JSON keeps state grep-able and
  diff-able, which makes verification labs trivial.
- Consequence: Token index is rebuilt from scratch each `noted index`.
  Acceptable while the corpus is small.

## D-002 — Citation rule is load-bearing
- Date: 2025-MM-DD (Module 04)
- Context: `noted ask` could return clean output without paths. The course
  uses citations to make verification machine-checkable.
- Consequence: Every change to `runAsk` must preserve the `cite:` line.
  Module 09's e2e test will assert it.

## D-003 — `./init.sh` is the only supported entry path
- Date: 2025-MM-DD (Module 06)
- Context: Agents otherwise run `pnpm test` directly and skip the contract probe.
- Consequence: Anything that breaks `./init.sh` blocks every session. The
  failure exit codes (11–14) are stable and referenced from `docs/BOOTSTRAP.md`.