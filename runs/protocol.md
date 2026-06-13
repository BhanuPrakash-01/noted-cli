# Ablation protocol

- Same agent (model + tool surface) for both runs.
- 60 minutes per task, hard cap.
- Fresh repo state at each run start: `git clean -fdx && git checkout .` then `./init.sh`.
- Evaluator scores each task per `evaluator-rubric.md`.
- A run records: time-to-claim-done, verification result, evaluator score,
  failure attribution if not green.