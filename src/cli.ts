import { runImport } from "./commands/import.ts";
import { runIndex } from "./commands/index.ts";
import { runAsk } from "./commands/ask.ts";
import { runStatus } from "./commands/status.ts";
import { log } from "./log.ts";

const [cmd, ...rest] = process.argv.slice(2);

const HELP = `noted - a tiny notes CLI

Usage:
  noted import <dir>   Walk <dir>, ingest .md files into .noted/notes.json
  noted index          Build .noted/index.json from current notes
  noted ask <query>    Search notes; prints title, snippet, and cite path
  noted --help         Print this help.
  noted status         Print the current status of the notes
`;

// 1. Log the start of the command execution
log("cmd_start", { cmd, args: rest });

try {
  let exitCode = 0;

  switch (cmd) {
    case undefined:
    case "--help":
    case "-h":
      console.log(HELP);
      exitCode = 0;
      break;
    case "import":
      if (!rest[0]) {
        console.error("import requires a directory");
        exitCode = 2;
      } else {
        exitCode = await runImport(rest[0], rest.slice(1));
      }
      break;
    case "index":
      exitCode = await runIndex(rest);
      break;
    case "ask":
      if (!rest[0]) { 
        console.error("ask requires a query"); 
        exitCode = 2; 
      } else {
        exitCode = await runAsk(rest);
      }
      break;
    case "status":
      exitCode = await runStatus();
      break;
    default:
      console.error(`unknown command: ${cmd}`);
      exitCode = 2;
      break;
  }

  // 2. Log successful execution or expected validations failures (exit code 0 or 2)
  log("cmd_end", { cmd, exit: exitCode });
  process.exit(exitCode);

} catch (e: unknown) {
  const errorMsg = e instanceof Error ? e.message : String(e);
  console.error(`error: ${errorMsg}`);
  
  // 3. Log hard system crashes/unhandled exceptions (exit code 1)
  log("cmd_end", { cmd, exit: 1, error: errorMsg });
  process.exit(1);
}