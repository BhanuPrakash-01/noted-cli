# PROGRESS.md

## Current State
- Last verified: Module 10 checkpoint — all five `clean-exit` dimensions green.
- Structured runtime logging added to `src/cli.ts` via `src/log.ts`.
- `scripts/clean-exit.mjs` written and probes five clean-state dimensions.
- Evaluator rubric and sprint contract committed.

## Session Log
### 2025-MM-DD — finishing Module 05
- Added `PROGRESS.md` and `DECISIONS.md`.
- Added `noted status` command.
- Practised clock-in routine; rebuild cost ≈ 90s.

### Module 10 — structured logging + clean-exit
- Added `src/log.ts` (JSONL appender to `logs/run.jsonl`).
- Wired `log("cmd_start")` / `log("cmd_end")` into `src/cli.ts`; removed inline `process.exit` calls.
- Wrote `scripts/clean-exit.mjs` — five-dimension clean-state gate.
- Added evaluator rubric and sprint contract.
- `init.sh` now tails `logs/run.jsonl` in the bootstrap output.

## Next Action
Open Module 11 and decide on the next feature; update `feature_list.json` accordingly.
