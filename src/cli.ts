import { runImport } from "./commands/import.ts";
import { runIndex } from "./commands/index.ts";
import { runAsk } from "./commands/ask.ts";

const [cmd, ...rest] = process.argv.slice(2);

const HELP = `noted - a tiny notes CLI

Usage:
  noted import <dir>   Walk <dir>, ingest .md files into .noted/notes.json
  noted index          Build .noted/index.json from current notes
  noted ask <query>    Search notes; prints title, snippet, and cite path
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
    case "ask":
      if (!rest[0]) { console.error("ask requires a query"); process.exit(2); }
      process.exit(await runAsk(rest.join(" ")));
    default:
      console.error(`unknown command: ${cmd}`);
      process.exit(2);
  }
} catch (e: any) {
  console.error(`error: ${e.message ?? e}`);
  process.exit(1);
}