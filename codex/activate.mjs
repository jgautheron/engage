// engage — Codex SessionStart hook. Emits the active style as session context.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { activeStyle, readState } from "../lib/engage.mjs";

// After a compaction Codex may start a blank window; without this the model greets as if new.
const COMPACT_NOTE = "Context was just compacted: continue the work already in progress — do not greet or ask for the task again.";

let source = "";
try { source = JSON.parse(fs.readFileSync(0, "utf8") || "{}").source ?? ""; } catch { /* no stdin */ }

const text = activeStyle(readState());
const cli = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "engage.mjs");
const context = text
  ? `${text}\n\nSwitching (saved for the next session; adopt it now as well): node "${cli}" terse|off|trek on|off` +
    (source === "compact" ? `\n\n${COMPACT_NOTE}` : "")
  : "";
process.stdout.write(JSON.stringify(context ? { hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: context } } : {}));
