// engage — Codex SessionStart hook. Emits the active style as session context.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { activeStyle, readState } from "../lib/engage.mjs";

const text = activeStyle(readState());
const cli = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "engage.mjs");
const out = text
  ? {
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext:
          `${text}\n\nSwitching (saved for the next session; adopt it now as well): ` +
          `node "${cli}" terse|concise|docs|plain|off|trek on|off`,
      },
    }
  : {};
process.stdout.write(JSON.stringify(out));
