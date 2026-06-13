import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";

let dim, fail = 0;
function check(name, fn) {
  process.stdout.write(`  ${name.padEnd(20)} `);
  try { fn(); console.log("PASS"); }
  catch (e) { console.log("FAIL — " + (e.message ?? e)); fail++; }
}

console.log("clean-exit dimensions:");

check("build/typecheck", () => execSync("pnpm typecheck", { stdio: "pipe" }));
check("tests", () => { execSync("pnpm test", { stdio: "pipe" }); execSync("pnpm e2e", { stdio: "pipe" }); });

check("progress", () => {
  const md = readFileSync("PROGRESS.md", "utf8");
  if (!/## Next Action/.test(md)) throw new Error("no Next Action");
  if (/TODO\s*$/m.test(md)) throw new Error("Next Action ends with TODO");
});

check("artifacts", () => {
  const dirty = execSync("git status --porcelain").toString();
  if (dirty.trim()) throw new Error("cuncommitted changes");
  const tmp = execSync("git ls-files --others --exclude-standard | grep -E '\\.(tmp|swp|bak)$|^\\.DS_Store$' || true").toString();
  if (tmp.trim()) throw new Error("scratch files: " + tmp.trim());
});

check("startup", () => execSync("./init.sh", { stdio: "pipe" }));

if (fail) { console.error(`\n${fail} dimension(s) failed; not clean`); process.exit(1); }
console.log("\nclean state: all five dimensions green");