// bun health.ts <srcDir> → code-health metrics via the TypeScript AST
import * as ts from "typescript";
import { Glob } from "bun";
const dir = process.argv[2];
const fns: { len: number; cx: number; depth: number }[] = [];
let asAny = 0, nonNull = 0, lines: string[] = [], files = 0, maxFile = 0;
for await (const f of new Glob("**/*.ts").scan(dir)) {
  const text = await Bun.file(`${dir}/${f}`).text();
  files++; const L = text.split("\n"); maxFile = Math.max(maxFile, L.length);
  lines.push(...L.map((l) => l.trim()).filter((l) => l.length > 12 && !l.startsWith("//") && !l.startsWith("*") && !l.startsWith("import")));
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true);
  const visit = (n: ts.Node, inFn: { cx: number } | null, depth: number, maxD: { v: number }) => {
    if (ts.isAsExpression(n) && n.type.kind === ts.SyntaxKind.AnyKeyword) asAny++;
    if (ts.isNonNullExpression(n)) nonNull++;
    const isFn = ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n);
    if (isFn && (n as any).body) {
      const rec = { cx: 1 }; const md = { v: 0 };
      ts.forEachChild(n, (c) => visit(c, rec, 0, md));
      const s = sf.getLineAndCharacterOfPosition(n.getStart()).line, e = sf.getLineAndCharacterOfPosition(n.getEnd()).line;
      if (e - s >= 2) fns.push({ len: e - s + 1, cx: rec.cx, depth: md.v });
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
}
// duplication: identical 4-line windows appearing more than once
const seen = new Map<string, number>();
for (let i = 0; i + 4 <= lines.length; i++) { const k = lines.slice(i, i + 4).join("\n"); seen.set(k, (seen.get(k) ?? 0) + 1); }
const dup = [...seen.values()].filter((c) => c > 1).reduce((a, c) => a + c - 1, 0);
const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const cx = fns.map((f) => f.cx).sort((a, b) => b - a);
console.log(JSON.stringify({
  files, maxFileLines: maxFile, fns: fns.length,
  fnLenMean: +mean(fns.map((f) => f.len)).toFixed(1), fnLenMax: Math.max(0, ...fns.map((f) => f.len)),
  cxMean: +mean(cx).toFixed(2), cxMax: cx[0] ?? 0, cxOver10: cx.filter((c) => c > 10).length,
  depthMax: Math.max(0, ...fns.map((f) => f.depth)), dupBlocks: dup, asAny, nonNull,
}));
