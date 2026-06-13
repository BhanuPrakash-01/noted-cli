# Architecture

`noted-cli` is a single Node 20 + TypeScript binary that ingests markdown
notes, builds a token index, and answers keyword queries.

## Layout

- `bin/noted` — executable shim, resolves `tsx` from local `node_modules`.
- `src/cli.ts` — argv dispatcher; the only file that calls `process.exit`.
- `src/commands/<verb>.ts` — one file per CLI verb, exports `run<Verb>(...)`.
- `src/store/types.ts` — JSON schema types for on-disk state.
- `src/store/io.ts` — read/write helpers for `.noted/*.json`.
- `.noted/` — local state directory; never committed.

## Data flow

markdown files    .noted/notes.json               .noted/index.json
      │                   │                               │
      ▼                   ▼                               ▼
`noted import` ───► notes (id,path,title,body) ───► noted index ───► tokens
                                                          │
                                                          ▼
                                                    `noted ask` (Module 04+)

## Boundaries

- `src/commands/*` may import from `src/store/*`, never the other way around.
- Only `src/cli.ts` is allowed to call `process.exit`. Everything else returns an
  exit code as a number.
- All file I/O goes through `src/store/io.ts`. No `fs` calls scattered through
  command files.