// PostToolUse hook (Write|Edit): blocks when a function in the edited src/ file is too long or too branchy.
// Length counts the function's own lines: nested function bodies count toward themselves, so a factory
// closure isn't penalised for the methods inside it.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const MAX_LINES = 50;
const MAX_COMPLEXITY = 12;

/** Functions over either limit in one TypeScript source: { name, lines, complexity }. Limits of -1 list every function. */
export function oversized(file, text, maxLines = MAX_LINES, maxComplexity = MAX_COMPLEXITY) {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const line = (pos) => sf.getLineAndCharacterOfPosition(pos).line;
  const found = [];
  const isFn = (n) => (ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n)) && n.body;
  const nameOf = (n) => n.name?.getText(sf) ?? (n.parent && (ts.isVariableDeclaration(n.parent) || ts.isPropertyAssignment(n.parent)) ? n.parent.name.getText(sf) : "(anonymous)");
  const measure = (fn) => {
    let complexity = 1, nested = 0;
    const walk = (n) => {
      if (isFn(n)) { nested += line(n.getEnd()) - line(n.getStart()) + 1; measure(n); return; }
      if (ts.isIfStatement(n) || ts.isForStatement(n) || ts.isForOfStatement(n) || ts.isForInStatement(n) || ts.isWhileStatement(n) || ts.isCaseClause(n) || ts.isConditionalExpression(n) || ts.isCatchClause(n)) complexity++;
      if (ts.isBinaryExpression(n) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(n.operatorToken.kind)) complexity++;
      ts.forEachChild(n, walk);
    };
    ts.forEachChild(fn, walk);
    const lines = line(fn.getEnd()) - line(fn.getStart()) + 1 - nested;
    if (lines > maxLines || complexity > maxComplexity) found.push({ name: nameOf(fn), lines, complexity });
  };
  const top = (n) => { if (isFn(n)) measure(n); else ts.forEachChild(n, top); };
  top(sf);
  return found;
}

const isMain = process.argv[1] && import.meta.url === `file://${fs.realpathSync(process.argv[1])}`;
if (isMain) {
  let input = {};
  try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch {}
  const file = input.tool_input?.file_path ?? "";
  if (file.includes("/src/") && file.endsWith(".ts") && fs.existsSync(file)) {
    const bad = oversized(file, fs.readFileSync(file, "utf8"));
    if (bad.length) process.stdout.write(JSON.stringify({
      decision: "block",
      reason: `${path.basename(file)}: ${bad.map((f) => `${f.name} (${f.lines} lines, complexity ${f.complexity})`).join(", ")} over the limit (${MAX_LINES} own lines, complexity ${MAX_COMPLEXITY}). Split each into smaller named functions with one job each (validation, a branch, a step), keeping behaviour and the public API identical. Then carry on.`,
    }));
  }
}
