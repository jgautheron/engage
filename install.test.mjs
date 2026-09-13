import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

test("install.mjs opencode: registers plugin path once, copies commands, keeps other config", () => {
  const cfgDir = fs.mkdtempSync(path.join(os.tmpdir(), "engage-oc-cfg-"));
  fs.writeFileSync(path.join(cfgDir, "opencode.json"), JSON.stringify({ theme: "x", plugin: ["other"] }));
  const env = { ...process.env, OPENCODE_CONFIG_DIR: cfgDir };
  execFileSync("node", [path.join(ROOT, "install.mjs"), "opencode"], { env });
  execFileSync("node", [path.join(ROOT, "install.mjs"), "opencode"], { env }); // idempotent
  const cfg = JSON.parse(fs.readFileSync(path.join(cfgDir, "opencode.json"), "utf8"));
  assert.equal(cfg.theme, "x");
  assert.deepEqual(cfg.plugin, ["other", path.join(ROOT, "opencode", "engage.mjs")]);
  assert.ok(fs.existsSync(path.join(cfgDir, "commands", "engage.md")));
  assert.ok(fs.existsSync(path.join(cfgDir, "commands", "trek.md")));
  assert.throws(() => execFileSync("node", [path.join(ROOT, "install.mjs"), "codex"], { env, stdio: "pipe" }));
});
