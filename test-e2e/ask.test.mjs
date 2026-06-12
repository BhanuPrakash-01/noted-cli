import { test } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = process.cwd();

test("e2e: import then ask returns a citation line", () => {
  const src = mkdtempSync(join(tmpdir(), "noted-e2e-"));
  writeFileSync(join(src, "alpha.md"), "# Alpha\nthe alpha document");
  writeFileSync(join(src, "bravo.md"), "# Bravo\nthe bravo document");

  rmSync(".noted", { recursive: true, force: true });
  execSync(`./bin/noted import ${src}`, { cwd: ROOT, stdio: "pipe" });
  execSync(`./bin/noted index`, { cwd: ROOT, stdio: "pipe" });
  const out = execSync(`./bin/noted ask alpha`, { cwd: ROOT }).toString();

  assert.match(out, /^\[[a-f0-9]{12}\]/m, "expected a [<id>] line");
  assert.match(out, /^\s+cite: /m, "expected a cite: line per result");
  assert.match(out, /Alpha/, "expected the Alpha note to be ranked first");
});

test("e2e: --json shape", () => {
  const out = execSync(`./bin/noted ask alpha --json`, { cwd: ROOT }).toString();
  const parsed = JSON.parse(out);
  assert.ok(Array.isArray(parsed.results));
  assert.ok(parsed.results.length <= 3);
});