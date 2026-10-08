// engage — Claude Code SubagentStart hook. Output styles only reach the main thread; this gives every
// subagent the active engage style too (without the Trek garnish — subagents don't talk to the user).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadStyle, STYLES } from "../lib/engage.mjs";

/** Active engage style from Claude Code settings (local → project → user), or null if engage isn't the output style. */
export function activeClaudeStyle(projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd(), configDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude")) {
  const files = [path.join(projectDir, ".claude", "settings.local.json"), path.join(projectDir, ".claude", "settings.json"), path.join(configDir, "settings.json")];
  for (const f of files) {
    let style;
    try { style = JSON.parse(fs.readFileSync(f, "utf8")).outputStyle; } catch { continue; }
    if (typeof style !== "string") continue;
    const m = /^(?:engage:)?engage-(\w+)$/.exec(style);
    return m && STYLES.includes(m[1]) ? m[1] : null;
  }
  return null;
}

if (import.meta.main ?? process.argv[1] === new URL(import.meta.url).pathname) {
  const style = activeClaudeStyle();
  if (style) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "SubagentStart", additionalContext: loadStyle(style) } }));
}
