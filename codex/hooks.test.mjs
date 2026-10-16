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
  assert.match(out.hookSpecificOutput.additionalContext, /node ".*codex\/engage\.mjs" terse\|off/);

  assert.equal(run("engage.mjs", "terse").trim(), "engage: style terse · trek off"); // off by default
  assert.equal(run("engage.mjs", "trek", "off").trim(), "engage: style terse · trek off");
  assert.equal(run("engage.mjs").trim(), "engage: style terse · trek off");
  out = JSON.parse(run("activate.mjs"));
  assert.match(out.hookSpecificOutput.additionalContext, /## Voice — terse/);
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

test("codex: comment guard reads apply_patch added lines and follows the engage setting", () => {
  const patch = "*** Begin Patch\n*** Update File: src/a.ts\n@@\n-old();\n+// fixes PAY-12\n+f();\n*** Add File: src/b.py\n+# ok\n*** End Patch";
  const guard = (command) => execFileSync("node", [path.join(here, "comment-guard.mjs")], { env, encoding: "utf8", input: JSON.stringify({ tool_name: "apply_patch", tool_input: { command } }) });
  run("engage.mjs", "terse");
  const out = JSON.parse(guard(patch));
  assert.equal(out.decision, "block");
  assert.match(out.reason, /a\.ts: ticket\/issue reference/);
  assert.equal(guard(patch.replace("// fixes PAY-12", "// why it retries")), "");
  run("engage.mjs", "off");
  assert.equal(guard(patch), "");
});
