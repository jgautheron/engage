// bun health.ts <srcDir> [testDir] → code-health metrics via the TypeScript 5 AST
import * as ts from "typescript";
import { Glob } from "bun";
import path from "node:path";
const [dir, testDir] = process.argv.slice(2);
const fns: { len: number; cx: number; depth: number; pure: boolean }[] = [];
let asAny = 0, nonNull = 0, files = 0, maxFile = 0, literalUnions = 0, taggedUnions = 0, exhaustive = 0, brandedIds = 0;
const lines: string[] = [];
const imports = new Map<string, string[]>(); // file → relative imports (resolved, no extension)
const MUTATORS = new Set(["push", "pop", "shift", "unshift", "splice", "set", "delete", "clear", "add", "sort", "reverse", "fill"]);

// Root identifier of a.b.c / a[0].b
const rootOf = (e: ts.Expression): string | null => {
  while (ts.isPropertyAccessExpression(e) || ts.isElementAccessExpression(e) || ts.isNonNullExpression(e) || ts.isParenthesizedExpression(e)) e = (e as any).expression;
  return ts.isIdentifier(e) ? e.text : e.kind === ts.SyntaxKind.ThisKeyword ? "this" : null;
};
// A function is pure-ish if it mutates nothing declared outside itself (params count as outside).
function isPure(fn: ts.FunctionLikeDeclaration): boolean {
  const local = new Set<string>();
  let pure = true;
  const collect = (n: ts.Node) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name)) local.add(n.name.text);
    if (ts.isVariableDeclaration(n) && (ts.isObjectBindingPattern(n.name) || ts.isArrayBindingPattern(n.name))) n.name.elements.forEach((el: any) => el.name && ts.isIdentifier(el.name) && local.add(el.name.text));
    if ((ts.isFunctionDeclaration(n) || ts.isClassDeclaration(n)) && n.name) local.add(n.name.text);
    ts.forEachChild(n, collect);
  };
  if (fn.body) collect(fn.body);
  const check = (n: ts.Node) => {
    if (!pure) return;
    if (ts.isBinaryExpression(n) && n.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && n.operatorToken.kind <= ts.SyntaxKind.LastAssignment) {
      const r = rootOf(n.left as ts.Expression); if (r && !local.has(r)) pure = false;
    }
    if ((ts.isPrefixUnaryExpression(n) || ts.isPostfixUnaryExpression(n)) && [ts.SyntaxKind.PlusPlusToken, ts.SyntaxKind.MinusMinusToken].includes(n.operator)) {
      const r = rootOf(n.operand as ts.Expression); if (r && !local.has(r)) pure = false;
    }
    if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && MUTATORS.has(n.expression.name.text)) {
      const r = rootOf(n.expression.expression); if (r && !local.has(r)) pure = false;
    }
    if (ts.isDeleteExpression(n)) { const r = rootOf(n.expression); if (r && !local.has(r)) pure = false; }
    ts.forEachChild(n, check);
  };
  if (fn.body) check(fn.body);
  return pure;
}

for await (const f of new Glob("**/*.ts").scan(dir)) {
  const text = await Bun.file(`${dir}/${f}`).text();
  files++; const L = text.split("\n"); maxFile = Math.max(maxFile, L.length);
  lines.push(...L.map((l) => l.trim()).filter((l) => l.length > 12 && !l.startsWith("//") && !l.startsWith("*") && !l.startsWith("import")));
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true);
  const rel: string[] = [];
  const visit = (n: ts.Node, inFn: { cx: number } | null, depth: number, maxD: { v: number }) => {
    if (ts.isImportDeclaration(n) || (ts.isExportDeclaration(n) && n.moduleSpecifier)) {
      const spec = ((n as any).moduleSpecifier as ts.StringLiteral).text;
      if (spec.startsWith(".")) rel.push(path.normalize(path.join(path.dirname(f), spec)).replace(/\.(ts|js)$/, ""));
    }
    if (ts.isAsExpression(n) && n.type.kind === ts.SyntaxKind.AnyKeyword) asAny++;
    if (ts.isNonNullExpression(n)) nonNull++;
    if (ts.isTypeAliasDeclaration(n) && ts.isUnionTypeNode(n.type)) {
      const ms = n.type.types;
      if (ms.every((m) => ts.isLiteralTypeNode(m))) literalUnions++;
      else if (ms.length > 1 && ms.every((m) => ts.isTypeLiteralNode(m) || ts.isTypeReferenceNode(m))) taggedUnions++;
    }
    if (ts.isIntersectionTypeNode(n) && n.getText(sf).includes("__brand")) brandedIds++;
    if ((ts.isTypeReferenceNode(n) || n.kind === ts.SyntaxKind.NeverKeyword) && n.getText(sf) === "never" && n.parent && (ts.isVariableDeclaration(n.parent) || ts.isParameter(n.parent))) exhaustive++;
    const isFn = ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n);
    if (isFn && (n as any).body) {
      const rec = { cx: 1 }; const md = { v: 0 };
      ts.forEachChild(n, (c) => visit(c, rec, 0, md));
      const s = sf.getLineAndCharacterOfPosition(n.getStart()).line, e = sf.getLineAndCharacterOfPosition(n.getEnd()).line;
      if (e - s >= 2) fns.push({ len: e - s + 1, cx: rec.cx, depth: md.v, pure: isPure(n as ts.FunctionLikeDeclaration) });
      return;
    }
    if (inFn) {
      if (ts.isIfStatement(n) || ts.isForStatement(n) || ts.isForOfStatement(n) || ts.isForInStatement(n) || ts.isWhileStatement(n) || ts.isCaseClause(n) || ts.isConditionalExpression(n) || ts.isCatchClause(n)) inFn.cx++;
      if (ts.isBinaryExpression(n) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(n.operatorToken.kind)) inFn.cx++;
    }
    const nests = ts.isIfStatement(n) || ts.isForStatement(n) || ts.isForOfStatement(n) || ts.isWhileStatement(n) || ts.isSwitchStatement(n) || ts.isTryStatement(n);
    const d = nests ? depth + 1 : depth; maxD.v = Math.max(maxD.v, d);
    ts.forEachChild(n, (c) => visit(c, inFn, d, maxD));
  };
  visit(sf, null, 0, { v: 0 });
  imports.set(f.replace(/\.ts$/, ""), rel);
}
// Coupling: relative imports per file and import cycles.
const edges = [...imports.values()].reduce((a, r) => a + r.length, 0);
let cycles = 0;
const color = new Map<string, number>();
const dfs = (u: string) => { color.set(u, 1); for (const v of imports.get(u) ?? []) { if (color.get(v) === 1) cycles++; else if (!color.has(v) && imports.has(v)) dfs(v); } color.set(u, 2); };
for (const u of imports.keys()) if (!color.has(u)) dfs(u);
// Duplication: identical 4-line windows appearing more than once.
const seen = new Map<string, number>();
for (let i = 0; i + 4 <= lines.length; i++) { const k = lines.slice(i, i + 4).join("\n"); seen.set(k, (seen.get(k) ?? 0) + 1); }
const dup = [...seen.values()].filter((c) => c > 1).reduce((a, c) => a + c - 1, 0);
// Tests (agent mode): files and test cases.
let testFiles = 0, testCases = 0;
if (testDir) for await (const f of new Glob("**/*.ts").scan(testDir)) { testFiles++; testCases += ((await Bun.file(`${testDir}/${f}`).text()).match(/\b(test|it)\s*\(/g) ?? []).length; }
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const cx = fns.map((f) => f.cx).sort((a, b) => b - a);
console.log(JSON.stringify({
  files, maxFileLines: maxFile, fns: fns.length,
  fnLenMean: +mean(fns.map((f) => f.len)).toFixed(1), fnLenMax: Math.max(0, ...fns.map((f) => f.len)),
  cxMean: +mean(cx).toFixed(2), cxMax: cx[0] ?? 0, cxOver10: cx.filter((c) => c > 10).length,
  depthMax: Math.max(0, ...fns.map((f) => f.depth)), dupBlocks: dup, asAny, nonNull,
  pureShare: +(fns.length ? fns.filter((f) => f.pure).length / fns.length : 0).toFixed(2),
  literalUnions, taggedUnions, exhaustive, brandedIds,
  importsPerFile: +(files ? edges / files : 0).toFixed(2), importCycles: cycles,
  testFiles, testCases,
}));
