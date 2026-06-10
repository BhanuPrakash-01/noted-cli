import { readNotes, writeJson } from "../store/io.ts";
import type { IndexEntry } from "../store/types.ts";

const STOP = new Set(["the", "and", "for", "with", "a", "an", "of", "to", "is", "in", "on"]);

function tokenize(s: string): string[] {
  return s.toLowerCase().match(/[a-z0-9]{3,}/g)?.filter((t) => !STOP.has(t)) ?? [];
}

export async function runIndex(): Promise<number> {
  const { notes } = await readNotes();
  const inv = new Map<string, Set<string>>();
  for (const n of notes) {
    for (const tok of new Set(tokenize(`${n.title} ${n.body}`))) {
      if (!inv.has(tok)) inv.set(tok, new Set());
      inv.get(tok)!.add(n.id);
    }
  }
  const tokens: IndexEntry[] = Array.from(inv.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([token, ids]) => ({ token, note_ids: Array.from(ids).sort() }));
  await writeJson("index.json", { tokens });
  console.log(`indexed ${notes.length} note(s); ${tokens.length} token(s)`);
  return 0;
}