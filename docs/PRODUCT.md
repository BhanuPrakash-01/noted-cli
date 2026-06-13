# Product

`noted-cli` is a personal research-notes tool. The intended user runs it
locally against a directory of markdown files and asks free-form questions.

## In scope

- Ingest markdown files from a directory tree.
- Maintain a flat token index over titles and bodies.
- Answer keyword queries with the top-k matching note ids and snippets.
- Track a `feature_list.json` and `PROGRESS.md` so any session can resume.

## Out of scope

- Embeddings, vector search, or any external API call.
- A GUI, a server, or any networked endpoint.
- Multi-user state or collaboration.
- Any storage format other than JSON in `.noted/`.

## Definition of Done (project-wide)

A change is done when:

1. `pnpm test` passes locally.
2. `./verify.sh` (added in Module 09) exits 0.
3. The `feature_list.json` entry for the change has `state: "passing"` and
   non-empty `evidence`.
4. `PROGRESS.md` records the change in its session log.