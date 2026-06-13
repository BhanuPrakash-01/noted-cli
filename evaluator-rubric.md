# Evaluator Rubric — noted-cli

Score each session 0/1/2 along these dimensions. A 0 anywhere is a fail.

| Dimension                | 0 (fail)                          | 1 (acceptable)                | 2 (strong)                    |
|--------------------------|-----------------------------------|-------------------------------|-------------------------------|
| Correctness              | verify.sh red                     | verify.sh green               | + e2e exercises new behavior  |
| Scope adherence          | edits outside `feature.scope`     | scope respected               | + scope reduced where possible|
| Verification rigor       | unit tests only                   | layers 1 + 2 green            | + layer 3 covers new behavior |
| Handoff readiness        | PROGRESS.md stale                 | PROGRESS.md current           | + DECISIONS.md updated if needed |
| Clean state              | clean-exit fails                  | clean-exit passes             | + logs/ tail informative      |