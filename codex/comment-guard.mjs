// engage — Codex PostToolUse hook: the Claude Code comment guard, gated on the shared engage setting.
import fs from "node:fs";
import { guard } from "../claude/comment-guard.mjs";
import { activeStyle, readState } from "../lib/engage.mjs";

let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch { /* no stdin */ }
const out = activeStyle(readState()) ? guard(input) : null;
if (out) process.stdout.write(JSON.stringify(out));
