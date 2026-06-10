import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runImport } from "./import.ts";
import { readNotes } from "../store/io.ts";

test("import ingests .md files and writes notes.json", async () => {
  const src = await mkdtemp(join(tmpdir(), "noted-src-"));
  await writeFile(join(src, "a.md"), "# Alpha\nbody-a");
  await writeFile(join(src, "b.md"), "# Bravo\nbody-b");

  const cwd = process.cwd();
  const work = await mkdtemp(join(tmpdir(), "noted-work-"));
  await mkdir(work, { recursive: true });
  process.chdir(work);
  try {
    const code = await runImport(src);
    assert.equal(code, 0);
    const { notes } = await readNotes();
    assert.equal(notes.length, 2);
    assert.deepEqual(notes.map((n) => n.title).sort(), ["Alpha", "Bravo"]);
  } finally {
    process.chdir(cwd);
    await rm(src, { recursive: true, force: true });
    await rm(work, { recursive: true, force: true });
  }
});