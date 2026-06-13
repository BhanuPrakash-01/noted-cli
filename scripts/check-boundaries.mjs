import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const RULES = [
  { dir: "src/store", forbid: ["src/commands"], reason: "store must not import commands" },
];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (p.endsWith(".ts")) yield p;
  }
}

let violations = 0;
for (const rule of RULES) {
  for await (const f of walk(rule.dir)) {
    const src = await readFile(f, "utf8");
    for (const bad of rule.forbid) {
      const re = new RegExp(`from\\s+["'][^"']*${bad.replace("/", "/")}`);
      if (re.test(src)) {
        console.error(`BOUNDARY: ${f}: ${rule.reason}`);
        violations++;
      }
    }
  }
}

if (violations) process.exit(3);
console.log("boundaries OK");