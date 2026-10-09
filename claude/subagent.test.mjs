import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { activeClaudeStyle } from "./subagent.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const dirs = () => { const p = fs.mkdtempSync(path.join(os.tmpdir(), "eng-p-")), c = fs.mkdtempSync(path.join(os.tmpdir(), "eng-c-")); fs.mkdirSync(path.join(p, ".claude")); return { p, c }; };
const put = (file, style) => fs.writeFileSync(file, JSON.stringify({ outputStyle: style }));

test("claude subagent: resolves the active engage style with Claude Code precedence", () => {
  const { p, c } = dirs();
  assert.equal(activeClaudeStyle(p, c), null);
  put(path.join(c, "settings.json"), "engage:engage-terse");
  assert.equal(activeClaudeStyle(p, c), "terse");
  put(path.join(p, ".claude", "settings.json"), "engage:engage-docs"); // removed style → nothing
  assert.equal(activeClaudeStyle(p, c), null);
  put(path.join(p, ".claude", "settings.local.json"), "Explanatory");
  assert.equal(activeClaudeStyle(p, c), null); // a non-engage style wins → nothing injected
});

test("claude subagent: hook emits the style without the Trek garnish, or nothing when engage is off", () => {
  const { p, c } = dirs();
  const run = () => execFileSync("node", [path.join(here, "subagent.mjs")], { env: { ...process.env, CLAUDE_PROJECT_DIR: p, CLAUDE_CONFIG_DIR: c }, encoding: "utf8" });
  assert.equal(run(), "");
  put(path.join(c, "settings.json"), "engage:engage-terse");
  const out = JSON.parse(run()).hookSpecificOutput;
  assert.equal(out.hookEventName, "SubagentStart");
  assert.match(out.additionalContext, /## Voice — terse/);
  assert.match(out.additionalContext, /Best code = none/);
  assert.doesNotMatch(out.additionalContext, /Star Trek/);
});
