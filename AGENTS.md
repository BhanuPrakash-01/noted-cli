# AGENTS.md — noted-cli

Hard constraints (read every session):
1. **WIP=1.** Run `pnpm wip status` before any work. If a feature is
   `in_progress`, finish it (or move it to `blocked` with a documented
   reason) before activating another.
2. Citations rule: every `noted ask` line that names a note MUST include
   `cite: <absolute path>`. See `docs/citation-rule.md`.
3. **Three layers, every time.** A feature is not done until `./verify.sh` exits 0.

## Topic docs

| Topic               | File                          |
|---------------------|-------------------------------|
| Architecture        | `docs/ARCHITECTURE.md`        |
| Product scope       | `docs/PRODUCT.md`             |
| Citation rule       | `docs/citation-rule.md`       |
| Style & conventions | `docs/STYLE.md`               |
| Session log         | `PROGRESS.md` (added M05)     |

## Workflow

1. `./init.sh` — must exit 0 before any work.
2. Read `PROGRESS.md` and pick the next item from `feature_list.json`.
3. `pnpm wip activate <id>`.
4. Implement.
5. `./verify.sh` — must be green before claiming done.
6. `pnpm wip pass <id>`.
7. Update `PROGRESS.md`, commit.

## Hard constraints (repeated)

1. One feature at a time.
2. Citations rule: every `noted ask` line that names a note MUST include
   `cite: <absolute path>`.
3. **Three layers, every time.** A feature is not done until `./verify.sh` exits 0.