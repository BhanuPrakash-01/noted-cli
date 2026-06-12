import { readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const PATH = "feature_list.json";
const fl = JSON.parse(await readFile(PATH, "utf8"));
const cmd = process.argv[2];
const id = process.argv[3];

const REQUIRED = ["id","priority","area","title","user_visible_behavior","verification_command","scope","state","evidence"];
const STATES = new Set(["not_started","in_progress","blocked","passing"]);

function fail(msg) { console.error(msg); process.exit(2); }
function save() { return writeFile(PATH, JSON.stringify(fl, null, 2) + "\n"); }

// Always validate first; a malformed list is a hard error.
for (const f of fl.features) {
  for (const k of REQUIRED) if (!(k in f)) fail(`feature ${f.id ?? "?"} missing field: ${k}`);
  if (!STATES.has(f.state)) fail(`feature ${f.id} has invalid state: ${f.state}`);
  if (f.state === "passing" && fl.rules.passing_requires_evidence && f.evidence.length === 0) {
    fail(`feature ${f.id} is 'passing' with no evidence; corrupted state.`);
  }
}

const active = fl.features.filter((f) => f.state === "in_progress");
const blocked = fl.features.filter((f) => f.state === "blocked");
const passed = fl.features.filter((f) => f.state === "passing").length;
const activated = passed + active.length + blocked.length;
const vcr = activated === 0 ? 1 : passed / activated;

switch (cmd) {
  case "status": {
    console.log(`active:   ${active.map((f) => f.id).join(", ") || "(none)"}`);
    console.log(`blocked:  ${blocked.map((f) => f.id).join(", ") || "(none)"}`);
    console.log(`vcr:      ${vcr.toFixed(2)}  (${passed}/${activated})`);
    break;
  }
  case "activate": {
    if (!id) fail("activate requires an id");
    if (active.length >= fl.rules.wip_limit) fail(`WIP=${fl.rules.wip_limit}; ${active[0].id} already active.`);
    if (vcr < fl.rules.vcr_target) fail(`VCR=${vcr.toFixed(2)} below ${fl.rules.vcr_target}; resolve blocked features first.`);
    const f = fl.features.find((x) => x.id === id) ?? fail(`unknown id: ${id}`);
    if (f.state !== "not_started") fail(`${id} is in state '${f.state}'`);
    f.state = "in_progress";
    await save();
    console.log(`activated ${id}`);
    break;
  }
  case "pass": {
    if (!id) fail("pass requires an id");
    const f = fl.features.find((x) => x.id === id) ?? fail(`unknown id: ${id}`);
    if (f.state !== "in_progress") fail(`${id} is not in_progress`);
    console.log(`==> running verification: ${f.verification_command}`);
    try {
      execSync(f.verification_command, { stdio: "inherit" });
    } catch {
      fail(`verification failed; ${id} stays in_progress`);
    }
    f.state = "passing";
    f.evidence.push({ ts: new Date().toISOString(), command: f.verification_command, exit: 0 });
    await save();
    console.log(`passed ${id}; evidence recorded`);
    break;
  }
  case "block": {
    if (!id) fail("block requires an id");
    const f = fl.features.find((x) => x.id === id) ?? fail(`unknown id: ${id}`);
    f.state = "blocked";
    f.notes = process.argv.slice(4).join(" ") || f.notes;
    await save();
    console.log(`blocked ${id}`);
    break;
  }
  default:
    fail("usage: wip status | activate <id> | pass <id> | block <id> [reason]");
}