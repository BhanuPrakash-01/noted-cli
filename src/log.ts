import { mkdirSync, appendFileSync } from "node:fs";

const LOG_PATH = process.env.NOTED_LOG ?? "logs/run.jsonl";

function ensure() {
  mkdirSync(LOG_PATH.replace(/\/[^/]+$/, ""), { recursive: true });
}

export function log(event: string, fields: Record<string, unknown> = {}) {
  ensure();
  const line = JSON.stringify({ ts: new Date().toISOString(), event, ...fields });
  appendFileSync(LOG_PATH, line + "\n");
}