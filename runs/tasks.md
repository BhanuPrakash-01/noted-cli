# Capstone task set

Each task has a verification command. The harness run will encode each
into `feature_list.json`; the no-harness run is given only this file.

## T1 — noted ask --top <n>
Behavior: `noted ask "<q>" --top 5` returns up to 5 results, each with the
required `cite:` line. `--top 0` exits 2.
Verify: ./bin/noted ask alpha --top 5 | grep -c '^\[' is between 1 and 5.

## T2 — noted import --since <iso>
Behavior: only ingest files whose mtime > <iso>; previously-imported notes
remain present.
Verify: scripted in scripts/test-import-since.mjs (you write this file).

## T3 — noted index --bigrams
Behavior: index.json gains a `bigrams` array; `ask` is unchanged.
Verify: ./bin/noted index --bigrams && jq '.bigrams | length > 0' .noted/index.json.
