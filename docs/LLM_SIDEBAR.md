# Sidebar — wiring `noted ask` to Claude

This is optional course material; not required to finish Module 11.

## Steps

1. `pnpm add @anthropic-ai/sdk`
2. Set `ANTHROPIC_API_KEY` in your environment.
3. Add a flag `--llm` to `noted ask`. When set, the command:
   - retrieves top-k snippets via the existing keyword index;
   - calls Claude with a small prompt that includes the snippets and the
     query;
   - prints the model's answer followed by the citation lines.

## Caching

Use prompt caching: mark the snippet block with the SDK's
`cache_control: { type: "ephemeral" }` so repeated questions over the same
corpus are cheap.

## Why this is a sidebar

The course is about the harness, not the model. Whether `noted ask` uses
keyword retrieval or a frontier model, the verification rules from
`docs/citation-rule.md` and the layers in `verify.sh` are unchanged.