import { readFile, writeFile } from "node:fs/promises";

const path = "feature_list.json";
const fl = JSON.parse(await readFile(path, "utf8"));
const cmd = process.argv[2];
const id = process.argv[3];

const active = fl.features.filter((f) => f.state === "in_progress");
const failing = fl.features.filter((f) => f.state === "blocked");
const passed = fl.features.filter((f) => f.state === "passing").length;
const activated = passed + active.length + failing.length;
const vcr = activated === 0 ? 1 : passed / activated;

function save() { return writeFile(path, JSON.stringify(fl, null, 2) + "\n"); }
function fail(msg) { console.error(msg); process.exit(2); }

switch (cmd) {
  case "status": {
    console.log(`active:   ${active.map((f) => f.id).join(", ") || "(none)"}`);
    console.log(`blocked:  ${failing.map((f) => f.id).join(", ") || "(none)"}`);
    console.log(`vcr:      ${vcr.toFixed(2)}  (${passed}/${activated})`);
    break;
  }
  case "activate": {
    if (!id) fail("activate requires a feature id");
    if (active.length >= fl.rules.wip_limit) fail(`WIP=${fl.rules.wip_limit}; ${active[0].id} is already active. Finish it first.`);
    if (vcr < fl.rules.vcr_target) fail(`VCR=${vcr.toFixed(2)} below target ${fl.rules.vcr_target}. Resolve blocked features first.`);
    const f = fl.features.find((x) => x.id === id);
    if (!f) fail(`unknown feature id: ${id}`);
    if (f.state !== "not_started") fail(`${id} is in state '${f.state}'; cannot activate.`);
    f.state = "in_progress";
    await save();
    console.log(`activated ${id}`);
    break;
  }
  case "pass": {
    if (!id) fail("pass requires a feature id");
    const f = fl.features.find((x) => x.id === id);
    if (!f) fail(`unknown feature id: ${id}`);
    if (f.state !== "in_progress") fail(`${id} is not in_progress`);
    f.state = "passing";
    await save();
    console.log(`passed ${id}`);
    break;
  }
  case "block": {
    if (!id) fail("block requires a feature id");
    const f = fl.features.find((x) => x.id === id);
    if (!f) fail(`unknown feature id: ${id}`);
    f.state = "blocked";
    await save();
    console.log(`blocked ${id}`);
    break;
  }
  default:
    fail("usage: wip status | activate <id> | pass <id> | block <id>");
}