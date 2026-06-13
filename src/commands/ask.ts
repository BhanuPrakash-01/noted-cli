import { readNotes, readIndex } from "../store/io.ts";

const STOP = new Set(["the", "and", "for", "with", "a", "an", "of", "to", "is", "in", "on"]);
const SNIPPET_LEN = 120;
const TOP_K = 5;
const JSON_TOP_K = 3;

function tokenize(s: string): string[] {
  return s.toLowerCase().match(/[a-z0-9]{3,}/g)?.filter((t) => !STOP.has(t)) ?? [];
}

function snippet(body: string): string {
  const s = body.replace(/\s+/g, " ").trim();
  return s.length <= SNIPPET_LEN ? s : s.slice(0, SNIPPET_LEN).trimEnd() + "…";
}

export async function runAsk(args: string[]): Promise<number> {
  const jsonMode = args.includes("--json");

  const topIdx = args.indexOf("--top");
  let topK = jsonMode ? JSON_TOP_K : TOP_K;
  if (topIdx !== -1) {
    const val = parseInt(args[topIdx + 1] ?? "", 10);
    if (isNaN(val) || val < 0) {
      console.error("--top requires a positive integer");
      return 2;
    }
    if (val === 0) return 2;
    topK = val;
  }

  const queryArgs = args.filter((a, i) => {
    if (a === "--json" || a === "--top") return false;
    if (i > 0 && args[i - 1] === "--top") return false;
    return true;
  });
  const query = queryArgs.join(" ");

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    console.error("ask requires a non-empty query");
    return 2;
  }

  const { notes } = await readNotes();
  const { tokens } = await readIndex();

  const scores = new Map<string, number>();
  for (const { token, note_ids } of tokens) {
    if (queryTokens.includes(token)) {
      for (const id of note_ids) {
        scores.set(id, (scores.get(id) ?? 0) + 1);
      }
    }
  }

  if (scores.size === 0) {
    if (jsonMode) {
      console.log(JSON.stringify({ results: [] }));
    } else {
      console.log("no matches");
    }
    return 0;
  }

  const ranked = Array.from(scores.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, topK)
    .map(([id]) => notes.find((n) => n.id === id))
    .filter(Boolean) as typeof notes;

  if (jsonMode) {
    const results = ranked.map((note) => ({
      title: note.title,
      snippet: snippet(note.body),
      path: note.path,
    }));
    console.log(JSON.stringify({ results }));
  } else {
    for (const note of ranked) {
      console.log(`[${note.id}] ${note.title} — ${snippet(note.body)}`);
      console.log(`  cite: ${note.path}`);
    }
  }

  return 0;
}
