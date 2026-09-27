import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const env = { ...process.env, XDG_CONFIG_HOME: fs.mkdtempSync(path.join(os.tmpdir(), "engage-cx-")) };
const run = (file, ...args) => execFileSync("node", [path.join(here, file), ...args], { env, encoding: "utf8", input: "" });
const hook = (source) => JSON.parse(execFileSync("node", [path.join(here, "activate.mjs")], { env, encoding: "utf8", input: JSON.stringify({ source }) }));

test("codex: activate emits SessionStart context; CLI switches persist", () => {
  let out = JSON.parse(run("activate.mjs"));
  assert.deepEqual(Object.keys(out), ["hookSpecificOutput"]);
  assert.equal(out.hookSpecificOutput.hookEventName, "SessionStart");
  assert.match(out.hookSpecificOutput.additionalContext, /## Voice — terse/);
  assert.match(out.hookSpecificOutput.additionalContext, /node ".*codex\/engage\.mjs" terse\|concise/);

  assert.equal(run("engage.mjs", "docs").trim(), "engage: style docs · trek on");
  assert.equal(run("engage.mjs", "trek", "off").trim(), "engage: style docs · trek off");
  assert.equal(run("engage.mjs").trim(), "engage: style docs · trek off");
  out = JSON.parse(run("activate.mjs"));
  assert.match(out.hookSpecificOutput.additionalContext, /technical documentation/);
  assert.doesNotMatch(out.hookSpecificOutput.additionalContext, /Star Trek garnish/);

  assert.equal(run("engage.mjs", "off").trim(), "engage: style off · trek off");
  assert.deepEqual(JSON.parse(run("activate.mjs")), {});
});

test("codex: compaction re-injects the style with a continue-don't-greet note; startup doesn't", () => {
  run("engage.mjs", "terse");
  assert.match(hook("compact").hookSpecificOutput.additionalContext, /continue the work already in progress/);
  assert.doesNotMatch(hook("startup").hookSpecificOutput.additionalContext, /compacted/);

  assert.throws(() => run("engage.mjs", "ultra"), /unknown style/);
});
