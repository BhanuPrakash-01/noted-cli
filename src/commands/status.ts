import { readFile } from "node:fs/promises";
import { readNotes } from "../store/io.ts";

export async function runStatus(): Promise<number> {
  const { notes } = await readNotes();
  let active = "(none)";
  try {
    const fl = JSON.parse(await readFile("feature_list.json", "utf8"));
    const a = (fl.features as { id: string; state: string }[]).find((f) => f.state === "in_progress");
    if (a) active = a.id;
  } catch {}

  console.log(`notes:    ${notes.length}`);
  console.log(`active:   ${active}`);
  return 0;
}