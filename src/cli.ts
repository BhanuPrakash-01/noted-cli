import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf-8")) as { version: string };

const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log("noted - a tiny notes CLI");
  console.log("");
  console.log("Usage:");
  console.log("  noted --help        Print this help.");
  process.exit(0);
}

if (args[0] === "version") {
  if (args[1] === "--json") {
    console.log(JSON.stringify({ version: pkg.version }));
  } else {
    console.log(pkg.version);
  }
  process.exit(0);
}

console.error(`unknown command: ${args.join(" ")}`);
process.exit(2);
