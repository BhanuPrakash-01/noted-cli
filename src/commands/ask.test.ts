import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runImport } from "./import.ts";
import { runIndex } from "./index.ts";
import { runAsk } from "./ask.ts";

async function setup() {
  const cwd = process.cwd();
  const src = await mkdtemp(join(tmpdir(), "noted-ask-src-"));
  const work = await mkdtemp(join(tmpdir(), "noted-ask-work-"));
  await mkdir(work, { recursive: true });
  process.chdir(work);
  return { cwd, src, work };
}

async function teardown(cwd: string, src: string, work: string) {
  process.chdir(cwd);
  await rm(src, { recursive: true, force: true });
  await rm(work, { recursive: true, force: true });
}

test("ask plain mode prints title and cite for matching notes", async () => {
  const { writeFile } = await import("node:fs/promises");
  const { cwd, src, work } = await setup();
  try {
    await writeFile(join(src, "alpha.md"), "# Alpha Note\nThis is about alpha search.");
    await writeFile(join(src, "bravo.md"), "# Bravo Note\nThis is about bravo only.");
    await runImport(src);
    await runIndex();

    const lines: string[] = [];
    const orig = console.log;
    console.log = (...args: unknown[]) => lines.push(args.join(" "));
    const code = await runAsk(["alpha"]);
    console.log = orig;

    assert.equal(code, 0);
    assert.equal(lines.length, 2, "one result = two lines");
    assert.ok(lines[0].includes("Alpha Note"), "title present");
    assert.ok(/^\[[a-f0-9]{12}\]/.test(lines[0]), "id bracket present");
    assert.ok(lines[1].trimStart().startsWith("cite:"), "cite on second line");
    assert.ok(!lines[0].startsWith("{"), "not JSON");
  } finally {
    await teardown(cwd, src, work);
  }
});

test("ask --json mode emits valid JSON with results array <= 3", async () => {
  const { writeFile } = await import("node:fs/promises");
  const { cwd, src, work } = await setup();
  try {
    for (let i = 1; i <= 5; i++) {
      await writeFile(join(src, `note${i}.md`), `# Note ${i}\nalpha content number ${i}`);
    }
    await runImport(src);
    await runIndex();

    const lines: string[] = [];
    const orig = console.log;
    console.log = (...args: unknown[]) => lines.push(args.join(" "));
    const code = await runAsk(["alpha", "--json"]);
    console.log = orig;

    assert.equal(code, 0);
    assert.equal(lines.length, 1, "exactly one line of output");
    const parsed = JSON.parse(lines[0]);
    assert.ok(Array.isArray(parsed.results), "results is an array");
    assert.ok(parsed.results.length <= 3, `results.length must be <= 3, got ${parsed.results.length}`);
    for (const r of parsed.results) {
      assert.ok("title" in r, "each result has title");
      assert.ok("snippet" in r, "each result has snippet");
      assert.ok("path" in r, "each result has path");
    }
  } finally {
    await teardown(cwd, src, work);
  }
});

test("ask --json mode returns empty results array when no matches", async () => {
  const { writeFile } = await import("node:fs/promises");
  const { cwd, src, work } = await setup();
  try {
    await writeFile(join(src, "one.md"), "# One\nsome content here");
    await runImport(src);
    await runIndex();

    const lines: string[] = [];
    const orig = console.log;
    console.log = (...args: unknown[]) => lines.push(args.join(" "));
    const code = await runAsk(["zzznomatch", "--json"]);
    console.log = orig;

    assert.equal(code, 0);
    const parsed = JSON.parse(lines[0]);
    assert.deepEqual(parsed, { results: [] });
  } finally {
    await teardown(cwd, src, work);
  }
});

test("ask returns exit code 2 for empty query", async () => {
  const orig = console.error;
  console.error = () => {};
  const code = await runAsk(["--json"]);
  console.error = orig;
  assert.equal(code, 2);
});
