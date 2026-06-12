import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { NotesFile, IndexFile } from "./types.ts";

const DIR = ".noted";

export async function readNotes(): Promise<NotesFile> {
  try {
    return JSON.parse(await readFile(`${DIR}/notes.json`, "utf8"));
  } catch (e: any) {
    if (e.code === "ENOENT") return { notes: [] };
    throw e;
  }
}

export async function readIndex(): Promise<IndexFile> {
  try {
    return JSON.parse(await readFile(`${DIR}/index.json`, "utf8"));
  } catch (e: any) {
    if (e.code === "ENOENT") return { tokens: [] };
    throw e;
  }
}

export async function writeJson(rel: string, data: unknown): Promise<void> {
  const path = `${DIR}/${rel}`;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + "\n");
}