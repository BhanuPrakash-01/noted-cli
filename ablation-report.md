# Ablation Report — noted-cli

## Setup

- Agent: Claude Sonnet 4.5
- Date: 2026-06-13
- Tasks: T1, T2, T3 from `runs/tasks.md`
- Time cap: 60 min/task
- Evaluator: `evaluator-rubric.md`

## Results

| Task |         Run A (harness)              |                 Run B (no harness)            |
|------|--------------------------------------|-----------------------------------------------|
| T1   | done in 1.5m, rubric 8, verify GREEN | done in 1m, rubric 0, verify RED              |
| T2   | done in 2m, rubric 8, verify GREEN   | done in 1m, rubric 0, verify RED              |
| T3   | done in 2m, rubric 8, verify GREEN   | done in 1m, rubric 0, verify RED              |

VCR(A): 3/3.   VCR(B): 0/3.

## Failure attribution (Run B reds)

For each task that did not turn green in Run B, name the defense layer:

- Task T1: layer task-spec / context / env / verification / state.
- Task T2: layer task-spec / context / env / verification / state.
- Task T3: layer task-spec / context / env / verification / state.

## Observations

- The Run A task with Harness performed incredible well compared to the Run B task without harness.
- Run B declared success to early did not verify what it did works or not.
- Run B didn't executed implemented the tasks consistently ,because of no explicit specifications.
- Run A Had a clear path on what to do, how to , where to find , how to verify , When to call done . Which Run B cannot implement because of no explict info and throwing a task on a fresh repo and a task
- Run A had access to all tools which gave it more clarity on implementing integration, unit , lint etc..
- Run A had logging which helped it to find where the bug is persisiting , withhout the need of rerunning it.
## Caveats

- Sample size of one. The ablation shows *direction*, not effect size.
- Both runs share the same human reading the rubric; bias is possible.