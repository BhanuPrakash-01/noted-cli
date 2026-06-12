import { readFile } from "node:fs/promises";
import { readNotes } from "../store/io.ts";

export async function runStatus(): Promise<number> {
  const { notes } = await readNotes();
  let progress = "PROGRESS.md not found";
  try {
    const lines = (await readFile("PROGRESS.md", "utf8")).split("\n");
    const i = lines.findIndex((l) => l.trim() === "## Next Action");
    if (i >= 0) progress = lines.slice(i, i + 4).join("\n");
  } catch {}

  console.log(`notes:    ${notes.length}`);
  console.log(`storage:  .noted/notes.json`);
  console.log(`---`);
  console.log(progress);
  return 0;
}