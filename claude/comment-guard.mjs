// engage — Claude Code PostToolUse hook (Write|Edit|MultiEdit). Prose alone left ticket refs in 8% of runs; this
// checks only the text just written (legacy comments never trigger it) and hands the model a fix-it reason.
import fs from "node:fs";
import path from "node:path";
import { activeClaudeStyle } from "./subagent.mjs";

const MAX_LINES = 2;
const TICKET = /\b[A-Z][A-Z0-9]{1,9}-\d+\b|(?:^|\s)#\d{2,}\b|\b(?:ticket|issue|jira|bug|incident|pr)\s*#?\d+/i;
const SLASH = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".go", ".rs", ".swift", ".kt", ".java", ".c", ".cc", ".cpp", ".h", ".cs", ".scala", ".dart"]);
const HASH = new Set([".py", ".rb", ".sh", ".bash", ".zsh", ".ex", ".exs"]);
const EXEMPT = /SPDX|copyright|licen[cs]e|eslint|prettier|@ts-|biome-|noqa|type:\s*ignore|swiftlint|nolint|#!|^\s*(?:\/\/|#)\s*(?:region|endregion|MARK)/i;

/** Comment problems in freshly written source text; [] when clean or the file type isn't covered. */
export function commentProblems(file, text) {
  const ext = path.extname(file).toLowerCase();
  if (!SLASH.has(ext) && !HASH.has(ext)) return [];
  const problems = [];
  let block = [];
  let inBlock = false;
  const flush = () => {
    const words = block.filter((l) => /[A-Za-z0-9]/.test(l));
    if (words.length > MAX_LINES && !words.some((l) => EXEMPT.test(l))) problems.push(`${words.length}-line comment starting "${words[0].slice(0, 60)}"`);
    block = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const opensBlock = SLASH.has(ext) && line.startsWith("/*");
    const isComment = inBlock || opensBlock || (SLASH.has(ext) ? line.startsWith("//") : line.startsWith("#"));
    if (opensBlock) inBlock = !line.includes("*/");
    else if (inBlock && line.includes("*/")) inBlock = false;
    const trailing = !isComment && SLASH.has(ext) ? /\s\/\/\s.*$/.exec(raw)?.[0] ?? "" : "";
    const comment = isComment ? line : trailing;
    if (comment && TICKET.test(comment) && !EXEMPT.test(comment)) problems.push(`ticket/issue reference in "${comment.slice(0, 60)}"`);
    if (isComment) block.push(line);
    else flush();
  }
  flush();
  return problems;
}

function written(input) {
  const t = input.tool_input ?? {};
  if (typeof t.content === "string") return t.content;
  if (typeof t.new_string === "string") return t.new_string;
  return (t.edits ?? []).map((e) => e.new_string ?? "").join("\n");
}

/** Hook output for one PostToolUse event: a block decision with the reason, or null when the comments are clean. */
export function guard(input) {
  const file = input.tool_input?.file_path ?? "";
  const problems = commentProblems(file, written(input));
  if (!problems.length) return null;
  return {
    decision: "block",
    reason: `${path.basename(file)}: ${problems.slice(0, 3).join("; ")}. Comments stay at most ${MAX_LINES} lines, say only a why the code can't, and carry no ticket/issue numbers (those belong in the commit or PR). Fix these comments, then carry on.`,
  };
}

if (import.meta.main ?? process.argv[1] === new URL(import.meta.url).pathname) {
  let input = {};
  try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch {}
  const out = activeClaudeStyle() ? guard(input) : null;
  if (out) process.stdout.write(JSON.stringify(out));
}
