import { runImport } from "./commands/import.ts";
import { runIndex } from "./commands/index.ts";

const [cmd, ...rest] = process.argv.slice(2);

const HELP = `noted - a tiny notes CLI

Usage:
  noted import <dir>   Walk <dir>, ingest .md files into .noted/notes.json
  noted index          Build .noted/index.json from current notes
  noted --help         Print this help.
`;

try {
  switch (cmd) {
    case undefined:
    case "--help":
    case "-h":
      console.log(HELP);
      process.exit(0);
    case "import":
      if (!rest[0]) { console.error("import requires a directory"); process.exit(2); }
      process.exit(await runImport(rest[0]));
    case "index":
      process.exit(await runIndex());
    default:
      console.error(`unknown command: ${cmd}`);
      process.exit(2);
  }
} catch (e: any) {
  console.error(`error: ${e.message ?? e}`);
  process.exit(1);
}