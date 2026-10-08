// bun testq.ts <snapshotDir (has src/ + test/)> <refSrcDir> [maxMutants=40]
// → test-quality metrics: own pass rate, mutation score, brittleness vs an independent correct implementation, static smells.
import * as ts from "typescript";
import { Glob } from "bun";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [snap, refSrc, maxArg] = process.argv.slice(2);
const MAX = +(maxArg ?? 40);

function runTests(dir: string, timeoutMs = 30000): { pass: number; fail: number; ok: boolean } {
  const r = Bun.spawnSync(["bun", "test", "--timeout", "5000"], { cwd: dir, stdout: "pipe", stderr: "pipe", timeout: timeoutMs });
  const out = r.stdout.toString() + r.stderr.toString();
  const pass = +(out.match(/^\s*(\d+) pass/m)?.[1] ?? 0);
  const fail = +(out.match(/^\s*(\d+) fail/m)?.[1] ?? 0);
  const errors = /error: /i.test(out) && pass === 0 && fail === 0;
  return { pass, fail: errors ? Math.max(fail, 1) : fail, ok: r.exitCode === 0 && pass > 0 };
}
function copy(dirs: Record<string, string>) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "testq-"));
  for (const [name, from] of Object.entries(dirs)) fs.cpSync(from, path.join(d, name), { recursive: true });
  return d;
}

// --- static smells
let tests = 0, expects = 0, noExpect = 0, weak = 0, errorTests = 0, errorMsg = 0, mocks = 0, snapshots = 0, implNames = 0;
const testFiles: string[] = [];
for await (const f of new Glob("**/*.ts").scan(path.join(snap, "test"))) testFiles.push(f);
for (const f of testFiles) {
  const src = fs.readFileSync(path.join(snap, "test", f), "utf8");
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true);
  const visit = (n: ts.Node) => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && ["test", "it"].includes(n.expression.text) && n.arguments.length >= 2) {
      tests++;
      const name = ts.isStringLiteralLike(n.arguments[0]) ? n.arguments[0].text : "";
      if (/\b(calls?|invokes?|uses|returns? (true|false))\b/i.test(name)) implNames++;
      const body = n.arguments[1].getText(sf);
      const e = (body.match(/\bexpect\s*\(/g) ?? []).length;
      expects += e; if (e === 0) noExpect++;
      weak += (body.match(/\.(toBeDefined|toBeTruthy|toBeFalsy|toBeInstanceOf)\s*\(\s*\)?/g) ?? []).length;
      if (/\.toThrow\s*\(|rejects\./.test(body)) { errorTests++; if (/\.toThrow\s*\(\s*(['"`/]|[A-Z]\w*Error)/.test(body)) errorMsg++; }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  mocks += (src.match(/\b(mock\(|spyOn\(|jest\.fn|vi\.fn|mock\.module)/g) ?? []).length;
  snapshots += (src.match(/toMatchSnapshot|toMatchInlineSnapshot/g) ?? []).length;
}

const result: Record<string, unknown> = { testFiles: testFiles.length, tests, expectsPerTest: tests ? +(expects / tests).toFixed(2) : 0, noExpect, weak, errorTests, errorMsg, mocks, snapshots, implNames };
if (!testFiles.length) { console.log(JSON.stringify({ ...result, ownPass: 0, mutationScore: 0, brittle: 1 })); process.exit(0); }

// --- own pass
const own = copy({ src: path.join(snap, "src"), test: path.join(snap, "test") });
const base = runTests(own);
result.ownPass = base.pass + base.fail ? +(base.pass / (base.pass + base.fail)).toFixed(2) : 0;

// --- brittleness: agent tests vs an independent, correct implementation
const ref = copy({ src: refSrc, test: path.join(snap, "test") });
const rr = runTests(ref);
result.brittle = rr.pass + rr.fail ? +(rr.fail / (rr.pass + rr.fail)).toFixed(2) : 1;

// --- mutation score (only meaningful when the suite is green on its own code)
type Mut = { file: string; start: number; end: number; text: string };
const muts: Mut[] = [];
const swap: Record<number, string> = {
  [ts.SyntaxKind.LessThanToken]: "<=", [ts.SyntaxKind.LessThanEqualsToken]: "<", [ts.SyntaxKind.GreaterThanToken]: ">=",
  [ts.SyntaxKind.GreaterThanEqualsToken]: ">", [ts.SyntaxKind.EqualsEqualsEqualsToken]: "!==", [ts.SyntaxKind.ExclamationEqualsEqualsToken]: "===",
  [ts.SyntaxKind.AmpersandAmpersandToken]: "||", [ts.SyntaxKind.BarBarToken]: "&&", [ts.SyntaxKind.PlusToken]: "-", [ts.SyntaxKind.MinusToken]: "+",
};
for await (const f of new Glob("**/*.ts").scan(path.join(snap, "src"))) {
  const src = fs.readFileSync(path.join(snap, "src", f), "utf8");
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true);
  const visit = (n: ts.Node) => {
    if (ts.isBinaryExpression(n) && swap[n.operatorToken.kind] !== undefined) {
      const isStringConcat = n.operatorToken.kind === ts.SyntaxKind.PlusToken && /["'`]/.test(n.getText(sf));
      if (!isStringConcat) muts.push({ file: f, start: n.operatorToken.getStart(sf), end: n.operatorToken.getEnd(), text: swap[n.operatorToken.kind] });
    }
    if (ts.isNumericLiteral(n) && !ts.isPropertyAssignment(n.parent) && !ts.isElementAccessExpression(n.parent)) muts.push({ file: f, start: n.getStart(sf), end: n.getEnd(), text: String(Number(n.text) + 1) });
    if (n.kind === ts.SyntaxKind.TrueKeyword) muts.push({ file: f, start: n.getStart(sf), end: n.getEnd(), text: "false" });
    if (n.kind === ts.SyntaxKind.FalseKeyword) muts.push({ file: f, start: n.getStart(sf), end: n.getEnd(), text: "true" });
    if (ts.isPrefixUnaryExpression(n) && n.operator === ts.SyntaxKind.ExclamationToken) muts.push({ file: f, start: n.getStart(sf), end: n.operand.getStart(sf), text: "" });
    ts.forEachChild(n, visit);
  };
  visit(sf);
}
// Deterministic spread-out sample.
const step = Math.max(1, muts.length / MAX);
const sample = Array.from({ length: Math.min(MAX, muts.length) }, (_, i) => muts[Math.floor(i * step)]);
let killed = 0;
if (base.pass > 0) {
  for (const m of sample) {
    const d = copy({ src: path.join(snap, "src"), test: path.join(snap, "test") });
    const p = path.join(d, "src", m.file);
    const s = fs.readFileSync(p, "utf8");
    fs.writeFileSync(p, s.slice(0, m.start) + m.text + s.slice(m.end));
    const r = runTests(d, 20000);
    // Killed when the mutant makes more tests fail than the unmutated baseline (works with a partly red suite).
    if (r.fail > base.fail || r.pass < base.pass) killed++;
    fs.rmSync(d, { recursive: true, force: true });
  }
}
result.mutants = sample.length;
result.mutationScore = base.pass > 0 && sample.length ? +(killed / sample.length).toFixed(2) : 0;
console.log(JSON.stringify(result));
