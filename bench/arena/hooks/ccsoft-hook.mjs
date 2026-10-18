// PostToolUse hook (Write|Edit): like cc-hook, but a nudge instead of a block — it tells the model which
// functions are over the limit and lets it decide.
import fs from "node:fs";
import path from "node:path";
import { cognitive } from "./cognitive.mjs";

let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch {}
const file = input.tool_input?.file_path ?? "";
if (file.includes("/src/") && file.endsWith(".ts") && fs.existsSync(file)) {
  const bad = cognitive(file, fs.readFileSync(file, "utf8")).filter((f) => f.cognitive > 15 || f.depth > 3);
  if (bad.length) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse",
    additionalContext: `Note: ${path.basename(file)} now has ${bad.map((f) => `${f.name} (cognitive complexity ${f.cognitive}, nesting ${f.depth})`).join(", ")} — over 15 / nesting 3. Consider flattening with named helpers, early returns or lookup tables.` } }));
}
