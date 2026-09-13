#!/usr/bin/env node
// engage installer for hosts without a marketplace: `node install.mjs opencode`
// Adds this checkout's plugin to ~/.config/opencode/opencode.json and copies the two commands.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const host = process.argv[2];

if (host !== "opencode") {
  console.error("usage: node install.mjs opencode   (codex + pi install from git; Claude Code via /plugin)");
  process.exit(2);
}

const cfgDir = process.env.OPENCODE_CONFIG_DIR || path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"), "opencode");
const cfgFile = path.join(cfgDir, "opencode.json");
const plugin = path.join(ROOT, "opencode", "engage.mjs");

let cfg = {};
try { cfg = JSON.parse(fs.readFileSync(cfgFile, "utf8")); } catch { /* new file */ }
const plugins = Array.isArray(cfg.plugin) ? cfg.plugin : [];
if (!plugins.includes(plugin)) cfg.plugin = [...plugins.filter((p) => !String(p).endsWith("/opencode/engage.mjs")), plugin];
cfg.$schema ??= "https://opencode.ai/config.json";
fs.mkdirSync(cfgDir, { recursive: true });
fs.writeFileSync(cfgFile, JSON.stringify(cfg, null, 2) + "\n");

const cmdDir = path.join(cfgDir, "commands");
fs.mkdirSync(cmdDir, { recursive: true });
for (const f of ["engage.md", "trek.md"]) fs.copyFileSync(path.join(ROOT, "opencode", "command", f), path.join(cmdDir, f));

console.log(`opencode: plugin registered in ${cfgFile}; commands /engage and /trek copied to ${cmdDir}`);
