# AGENTS.md — noted-cli

Hard constraints (read every session):

1. One feature at a time. Do not stack work.
2. Citations rule: every `noted ask` line that names a note MUST include
   `cite: <absolute path>`. See `docs/citation-rule.md`.
3. Definition of Done lives in `docs/PRODUCT.md`. Do not relax it.

## Topic docs

| Topic               | File                          |
|---------------------|-------------------------------|
| Architecture        | `docs/ARCHITECTURE.md`        |
| Product scope       | `docs/PRODUCT.md`             |
| Citation rule       | `docs/citation-rule.md`       |
| Style & conventions | `docs/STYLE.md`               |
| Session log         | `PROGRESS.md` (added M05)     |

## Workflow

1. `./init.sh` (added M06)
2. Read `PROGRESS.md` (added M05)
3. Pick the next item from `feature_list.json` (added M08)
4. Work
5. `./verify.sh` (added M09)
6. Update `PROGRESS.md`, commit

## Hard constraints (repeated)

1. One feature at a time.
2. Citations rule: every `noted ask` line that names a note MUST include
   `cite: <absolute path>`.
3. Definition of Done lives in `docs/PRODUCT.md`.