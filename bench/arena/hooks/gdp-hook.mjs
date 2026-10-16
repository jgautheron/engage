// PostToolUse hook (Write|Edit): if src/ has sensitive operations but no evidence types anywhere, block once
// with the gdp pattern. Quiet once the codebase has any branded/proof type (public APIs may keep raw ids).
import fs from "node:fs";
import path from "node:path";
let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch {}
const file = input.tool_input?.file_path ?? "";
const i = file.indexOf("/src/");
if (i >= 0 && file.endsWith(".ts")) {
  const src = file.slice(0, i + 4);
  const all = fs.readdirSync(src, { recursive: true }).map(String).filter((f) => f.endsWith(".ts")).map((f) => fs.readFileSync(path.join(src, f), "utf8")).join("\n");
  const sensitive = [...all.matchAll(/\b(delete|set|transfer|remove|add|rename)[A-Z]\w*\s*[(:=]/g)].map((m) => m[0].replace(/\W+$/, ""));
  const hasEvidence = /__brand|unique symbol|\bProof\b|Proof<|interface \w*(Proof|Evidence|Can[A-Z]\w*)\b|type \w*(Proof|Evidence)\b/.test(all);
  if (sensitive.length && !hasEvidence) {
    process.stdout.write(JSON.stringify({
      decision: "block",
      reason: `Sensitive operations (${[...new Set(sensitive)].slice(0, 4).join(", ")}) run on raw ids with nothing tying them to their authorization check. Make the check return evidence the operation requires: brand the ids (\`type ProjectId = string & { readonly __brand: "ProjectId" }\`), have the check return a proof only it can create (\`CanDelete | null\`), and make the inner operation take that proof. Public APIs may keep raw ids and convert at the boundary.`,
    }));
  }
}
