// PostToolUse hook (Write|Edit): blocks when a function in the edited src/ file is hard to follow —
// Cognitive Complexity over 15 (SonarSource's default) or control flow nested more than 3 deep.
import fs from "node:fs";
import path from "node:path";
import { cognitive } from "./cognitive.mjs";

const MAX_COGNITIVE = 15;
const MAX_DEPTH = 3;

let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch {}
const file = input.tool_input?.file_path ?? "";
if (file.includes("/src/") && file.endsWith(".ts") && fs.existsSync(file)) {
  const bad = cognitive(file, fs.readFileSync(file, "utf8")).filter((f) => f.cognitive > MAX_COGNITIVE || f.depth > MAX_DEPTH);
  if (bad.length) process.stdout.write(JSON.stringify({
    decision: "block",
    reason: `${path.basename(file)}: ${bad.map((f) => `${f.name} (line ${f.line}: cognitive complexity ${f.cognitive}, nesting ${f.depth})`).join(", ")} too hard to follow (limits: ${MAX_COGNITIVE}, nesting ${MAX_DEPTH}). Flatten it, keeping behaviour and the public API identical: return or throw early instead of nesting; replace if/else ladders that map a value to a result with a lookup table (Record); repeated per-field checks or updates become a table of field rules plus one loop; a switch on a union ends in a never check; a compound condition becomes a named predicate. Inline callbacks and arrays of closures count toward the function that holds them, so moving branches into lambdas doesn't help. Then carry on.`,
  }));
}
