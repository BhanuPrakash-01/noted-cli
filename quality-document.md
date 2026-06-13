# Quality Document

A quality snapshot for each product domain and architectural layer. Both agents and humans can use this document to quickly understand where the codebase is strong and where it needs work.

**Update cadence:** After each significant session, or before starting a new phase of work.

**Grading scale:**

- **A**: All verification passing, clean architecture, agent-legible, stable tests
- **B**: Verification passing, mostly clean, minor gaps in legibility or test coverage
- **C**: Partially working, known gaps, some code areas hard for agents to understand
- **D**: Not working, or major structural issues

---

## Product Domains

| Domain | Grade | Verification | Agent Legibility | Test Stability | Key Gaps | Last Updated |
|--------|-------|-------------|-----------------|---------------|----------|-------------|
| Document Import | B | Layer 1–3 green; `pnpm wip pass` evidence for `ask-002` | `runImport` is 71 lines, single responsibility, easy to follow | 1 unit test (happy path only); no `>1 MB skip` test (`import-003` not started); no e2e test | Error paths untested (bad dir, unreadable file); `--since` and size-skip features pending | 2026-06-13 |
| Document Indexing | C | `verify.sh` green transitively (via ask tests); no direct unit or e2e test | `runIndex` is 25 lines, straightforward inverted-index loop | Zero dedicated tests; exercised only through ask's setup | `runIndex` has no unit test; no e2e coverage; `--bigrams` not implemented | 2026-06-13 |
| Q&A Flow | A | Layer 1–3 green; 4 unit tests + 2 e2e tests; citation rule machine-checked | `runAsk` is 87 lines, clearly split into tokenise → score → rank → print | All happy paths and the empty-query error path are covered | `--top <n>` flag not yet implemented; `--json` caps at 3 but limit is a magic constant | 2026-06-13 |
| Status | C | `pnpm wip pass` evidence for `status-002` (`bin/noted status \| grep -q '^active: '`) | `runStatus` is 15 lines, readable | No unit test; no e2e test | No dedicated test coverage at any layer beyond the wip verification command | 2026-06-13 |

## Architectural Layers

| Layer | Grade | Boundary Enforcement | Agent Legibility | Key Gaps | Last Updated |
|-------|-------|---------------------|-----------------|----------|-------------|
| CLI dispatcher (`src/cli.ts`) | A | Only file permitted to call `process.exit`; rule documented in ARCHITECTURE.md | 70 lines; one `switch` block; easy to extend | `process.exit` invariant is documented but not boundary-checked by `check-boundaries.mjs` | 2026-06-13 |
| Commands (`src/commands/*.ts`) | B | Commands import store; store never imports commands — enforced by `check-boundaries.mjs` | Each verb is one file, one export (`run<Verb>`), < 90 lines | Cross-command imports not prohibited by checker; `import.ts` and `index.ts` lack dedicated test files | 2026-06-13 |
| Store / I/O (`src/store/`) | A | Import direction enforced; all file I/O centralised in `io.ts` | `io.ts` 28 lines; `types.ts` 14 lines; schema mirrors on-disk JSON exactly | `IndexFile` does not yet model the `bigrams` field needed for future work | 2026-06-13 |
| On-disk state (`.noted/`) | B | JSON only; no external dependencies; grep-able and diff-able | Schema is self-describing; all reads/writes go through `io.ts` helpers | `notes.json` is fully rewritten on every import (no partial update); index is rebuilt from scratch on every `noted index` — acceptable at current corpus size | 2026-06-13 |
| Observability (`src/log.ts`, `logs/`) | A | Centralised in `src/log.ts`; `cmd_start` and `cmd_end` events with exit codes on every invocation | `log.ts` is 12 lines; log path overridable via `NOTED_LOG` env var | Log only records start/end; no timing or per-note counts in structured form | 2026-06-13 |

## Layer scores (verify.sh)

| verify.sh layer | Result | Detail |
|---|---|---|
| 1a — typecheck | **PASS** | `tsc --noEmit` exits 0; zero diagnostics; `catch (e: unknown)` everywhere |
| 1b — lint | **PASS** | ESLint exits 0; `no-explicit-any` and single-quote rules active |
| 1c — boundaries | **PASS** | `check-boundaries.mjs` exits 0; store→commands direction clean |
| 2 — unit tests | **PASS** | 5/5; `ask` fully covered; `index` and `status` have no dedicated tests |
| 3 — e2e | **PASS** | 2/2; import→index→ask citation path and `--json` shape verified against real binary |
| clean-exit | **4/5** | Fails on `artifacts` (untracked `runs/` harness directory); all other dimensions pass |

## Rubric scores (evaluator-rubric.md)

| Dimension | Score | Basis |
|---|---|---|
| Correctness | 2 | `verify.sh` green; e2e drives real binary and asserts citation shape |
| Scope adherence | 2 | Feature commits touch only declared scope files |
| Verification rigor | 1 | Layers 1+2 fully green; layer 3 covers `ask` only — `index` and `status` untested end-to-end |
| Handoff readiness | 1 | `PROGRESS.md` current; `DECISIONS.md` missing entry for the `catch (e: unknown)` rule promoted in Module 10 |
| Clean state | 2 | `logs/run.jsonl` tail shows structured `cmd_start`/`cmd_end` pairs; `artifacts` fail is pre-existing harness directory, not a code regression |

**Session total: 8 / 10**

## Change History

### 2026-06-13

- Changes: Quality document populated from scratch against Module 10 baseline.
- Domains promoted: Q&A Flow → A (citation rule machine-checked, 4 unit + 2 e2e tests passing).
- Demoted: Document Indexing → C (no dedicated tests at any layer); Status → C (no unit or e2e test).
- New gaps identified: `runIndex` and `runStatus` have zero dedicated test coverage; `check-boundaries.mjs` does not enforce `process.exit` invariant or cross-command import prohibition.
- Gaps closed: n/a (baseline snapshot).
