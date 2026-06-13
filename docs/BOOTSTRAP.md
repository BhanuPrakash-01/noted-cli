# Bootstrap

`./init.sh` is the only supported way to bring a fresh clone to a verified
start. It is idempotent. It must finish in under three minutes on a
machine with Node 20 and `pnpm` installed.

## Contract

After `./init.sh` exits 0, the repository satisfies all four:

| Property              | Probe                               |
|-----------------------|-------------------------------------|
| can-start             | `./bin/noted --help` exits 0        |
| can-test              | `pnpm test` exits 0                 |
| can-see-progress      | `PROGRESS.md` exists with `## Next Action` |
| can-pick-next-steps   | `feature_list.json` exists          |

Failure exit codes: 11 = can-start, 12 = can-test, 13 = can-see-progress,
14 = can-pick-next-steps, 15 = feature_list invalid.

## Updating

When you add a new initialization step (e.g., creating a logs directory in
Module 10), add it to `init.sh` and update this contract table if a new
property is introduced.