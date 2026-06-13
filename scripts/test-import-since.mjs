#!/usr/bin/env node
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm, mkdir, utimes } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Run tests inside the module to allow tsx to resolve TypeScript imports.
const { runImport } = await import("../src/commands/import.ts");
const { readNotes } = await import("../src/store/io.ts");

async function setup() {
  const cwd = process.cwd();
  const src = await mkdtemp(join(tmpdir(), "noted-since-src-"));
  const work = await mkdtemp(join(tmpdir(), "noted-since-work-"));
  await mkdir(work, { recursive: true });
  process.chdir(work);
  return { cwd, src, work };
}

async function teardown(cwd, src, work) {
  process.chdir(cwd);
  await rm(src, { recursive: true, force: true });
  await rm(work, { recursive: true, force: true });
}

test("--since keeps old notes and only ingests newer files", async () => {
  const { cwd, src, work } = await setup();
  try {
    // Write an "old" note and backdate its mtime to 2000-01-01
    const oldPath = join(src, "old.md");
    await writeFile(oldPath, "# Old Note\nwritten before the cutoff");
    const pastDate = new Date("2000-01-01T00:00:00Z");
    await utimes(oldPath, pastDate, pastDate);

    // First import (no --since): picks up the old note
    await runImport(src);
    const afterFirst = await readNotes();
    assert.equal(afterFirst.notes.length, 1, "one note after first import");
    assert.ok(afterFirst.notes.some((n) => n.title === "Old Note"), "old note present");

    // Record the cutoff as now (after importing old.md)
    const cutoff = new Date().toISOString();

    // Write a "new" note (mtime will be current time, after cutoff)
    const newPath = join(src, "new.md");
    await writeFile(newPath, "# New Note\nwritten after the cutoff");

    // Import with --since <cutoff>: should ingest new.md but NOT re-process old.md
    await runImport(src, ["--since", cutoff]);
    const afterSecond = await readNotes();

    assert.equal(afterSecond.notes.length, 2, "both notes present after second import");
    assert.ok(afterSecond.notes.some((n) => n.title === "Old Note"), "old note retained");
    assert.ok(afterSecond.notes.some((n) => n.title === "New Note"), "new note ingested");
  } finally {
    await teardown(cwd, src, work);
  }
});

test("--since with future cutoff ingests nothing new but keeps existing notes", async () => {
  const { cwd, src, work } = await setup();
  try {
    const notePath = join(src, "note.md");
    await writeFile(notePath, "# Existing\nbody");

    await runImport(src);
    const afterFirst = await readNotes();
    assert.equal(afterFirst.notes.length, 1);

    // Use a future cutoff — nothing should be ingested
    const future = new Date(Date.now() + 60_000).toISOString();
    await runImport(src, ["--since", future]);
    const afterSecond = await readNotes();

    assert.equal(afterSecond.notes.length, 1, "existing note retained, nothing new added");
    assert.ok(afterSecond.notes.some((n) => n.title === "Existing"), "original note still present");
  } finally {
    await teardown(cwd, src, work);
  }
});

test("--since with invalid date returns exit code 2", async () => {
  const { cwd, src, work } = await setup();
  try {
    const code = await runImport(src, ["--since", "not-a-date"]);
    assert.equal(code, 2);
  } finally {
    await teardown(cwd, src, work);
  }
});
