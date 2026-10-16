// PostToolUse hook (Write|Edit): a src/ file over 300 lines blocks with a reason Claude Code feeds back to the model.
import fs from "node:fs";
let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch {}
const file = input.tool_input?.file_path ?? "";
if (/\/src\//.test(file) && file.endsWith(".ts") && fs.existsSync(file)) {
  const n = fs.readFileSync(file, "utf8").split("\n").length;
  if (n > 300) {
    const rel = file.slice(file.indexOf("/src/") + 1);
    process.stdout.write(JSON.stringify({
      decision: "block",
      reason: `${rel} is ${n} lines (>300). Before continuing, move one cohesive responsibility into its own module behind the same public API, then carry on.`,
    }));
  }
}
