import { readdir, readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { readNotes, writeJson } from "../store/io.ts";
import type { Note } from "../store/types.ts";

function id(path: string): string {
  return createHash("sha1").update(path).digest("hex").slice(0, 12);
}

function titleOf(body: string, fallback: string): string {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.isFile() && p.endsWith(".md")) out.push(p);
  }
  return out;
}

export async function runImport(dir: string, args: string[] = []): Promise<number> {
  const sinceIdx = args.indexOf("--since");
  let sinceDate: Date | null = null;
  if (sinceIdx !== -1) {
    const iso = args[sinceIdx + 1];
    if (!iso) {
      console.error("--since requires an ISO date string");
      return 2;
    }
    sinceDate = new Date(iso);
    if (isNaN(sinceDate.getTime())) {
      console.error(`--since: invalid date "${iso}"`);
      return 2;
    }
  }

  const root = resolve(dir);
  await stat(root);
  const allPaths = await walk(root);

  const ingestPaths = sinceDate
    ? (await Promise.all(allPaths.map(async (p) => {
        const s = await stat(p);
        return s.mtimeMs > sinceDate!.getTime() ? p : null;
      }))).filter((p): p is string => p !== null)
    : allPaths;

  const existing = await readNotes();
  const byPath = new Map(existing.notes.map((n) => [n.path, n]));

  for (const p of ingestPaths) {
    const body = await readFile(p, "utf8");
    const note: Note = {
      id: id(p),
      path: p,
      title: titleOf(body, p.split("/").pop()!),
      body,
      imported_at: new Date().toISOString(),
    };
    byPath.set(p, note);
  }

  const notes = Array.from(byPath.values()).sort((a, b) => a.id.localeCompare(b.id));
  await writeJson("notes.json", { notes });
  console.log(`imported ${ingestPaths.length} note(s); total ${notes.length}`);
  return 0;
}