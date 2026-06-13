# Sprint Contract — Module 10 sprint

## Scope

- Add structured runtime logging to `src/cli.ts`.
- Add a sprint contract (this file) and an evaluator rubric.
- Write `scripts/clean-exit.mjs` that probes the five clean-state dimensions.
- Promote `clean-exit` into the bootstrap-contract probe.

## Verification standard

- `./verify.sh` exits 0.
- `node scripts/clean-exit.mjs` exits 0.
- `feature_list.json` shows no `in_progress` features at session end.

## Exclusions

- No new feature commands. No LLM integration (sidebar only, in `docs/LLM_SIDEBAR.md`).
- No changes to the citation rule.
- No removal of the boundary check.

## Definition of done

All four scope items shipped, all three verification standards green,
`PROGRESS.md` updated, commit recorded.