// bun compliance.ts <projectHome> → per-rule compliance over a project's iteration snapshots (<home>@v1..vK).
// Each rule reports {opportunities, followed}: how often its trigger happened and how often it was obeyed.
import * as ts from "typescript";
import fs from "node:fs";
import path from "node:path";

const home = process.argv[2];
// Snapshots may start above v1 (maintenance runs continue from an earlier project).
const snaps: { k: number; dir: string }[] = fs.readdirSync(path.dirname(home))
  .map((d) => { const m = new RegExp(`^${path.basename(home).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}@v(\\d+)$`).exec(d); return m ? { k: +m[1], dir: path.join(path.dirname(home), d) } : null; })
  .filter((x): x is { k: number; dir: string } => !!x && fs.existsSync(path.join(x.dir, "src")))
  .sort((a, b) => a.k - b.k);

const srcFiles = (dir: string) => fs.existsSync(path.join(dir, "src")) ? fs.readdirSync(path.join(dir, "src"), { recursive: true }).map(String).filter((f) => f.endsWith(".ts")) : [];
const lines = (dir: string, f: string) => fs.readFileSync(path.join(dir, "src", f), "utf8").split("\n").length;
const text = (dir: string, f: string) => fs.readFileSync(path.join(dir, "src", f), "utf8");

// Rule: split past ~300 lines. Opportunity = an iteration edits a file that was already >300 lines.
// Followed = that iteration added at least one new src module.
const split = { opportunities: 0, followed: 0 };
for (let i = 1; i < snaps.length; i++) {
  const prev = snaps[i - 1].dir, cur = snaps[i].dir;
  const before = new Set(srcFiles(prev)), after = srcFiles(cur);
  const bigEdited = [...before].some((f) => lines(prev, f) > 300 && after.includes(f) && text(prev, f) !== text(cur, f));
  if (!bigEdited) continue;
  split.opportunities++;
  if (after.some((f) => !before.has(f))) split.followed++;
}

// Rule: exhaustive switches. Opportunity = a switch whose subject is a union of literals (type checker).
// Followed = the switch ends in a never check (default assigning/passing the subject to a `never`).
const never = { opportunities: 0, followed: 0 };
const last = snaps.at(-1);
if (last) {
  const files = srcFiles(last.dir).map((f) => path.join(last.dir, "src", f));
  const program = ts.createProgram(files, { strict: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true, noEmit: true });
  const checker = program.getTypeChecker();
  for (const sf of program.getSourceFiles()) {
    if (!files.includes(sf.fileName)) continue;
    const visit = (n: ts.Node) => {
      if (ts.isSwitchStatement(n)) {
        const t = checker.getTypeAtLocation(n.expression);
        const members = t.isUnion() ? t.types : [t];
        if (t.isUnion() && members.every((m) => m.isLiteral() || (m.flags & ts.TypeFlags.BooleanLiteral) !== 0)) {
          never.opportunities++;
          const dflt = n.caseBlock.clauses.find(ts.isDefaultClause);
          if (dflt && /\bnever\b|assertNever|exhaustive/i.test(dflt.getText(sf))) never.followed++;
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
}

// Rule: preconditions as types (gdp). Opportunity = a sensitive mutating function (delete/set/transfer/remove/add/rename);
// followed = it takes a branded id or proof parameter. Brands are collected across every file first.
const SENSITIVE = /^(delete|set|transfer|remove|add|rename)/i;
const evidence = { opportunities: 0, followed: 0 };
if (last) {
  const files = srcFiles(last.dir).map((f) => ts.createSourceFile(f, text(last.dir, f), ts.ScriptTarget.Latest, true));
  const brands = new Set<string>();
  for (const sf of files) {
    const collect = (n: ts.Node) => {
      if (ts.isTypeAliasDeclaration(n) && /__brand|__proof|unique symbol|Proof|Evidence/.test(n.type.getText(sf))) brands.add(n.name.text);
      if (ts.isInterfaceDeclaration(n) && /__brand|__proof|unique symbol|Proof/.test(n.getText(sf))) brands.add(n.name.text);
      ts.forEachChild(n, collect);
    };
    collect(sf);
  }
  const fnName = (n: ts.Node) =>
    (ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n)) && n.name ? n.name.getText()
    : ts.isArrowFunction(n) && (ts.isPropertyAssignment(n.parent) || ts.isVariableDeclaration(n.parent)) ? n.parent.name.getText() : "";
  for (const sf of files) {
    const visit = (n: ts.Node) => {
      const name = fnName(n);
      if (SENSITIVE.test(name) && (n as ts.FunctionLikeDeclaration).parameters.length) {
        evidence.opportunities++;
        if ((n as ts.FunctionLikeDeclaration).parameters.some((p) => p.type && [...brands].some((b) => new RegExp(`\\b${b}\\b`).test(p.type!.getText(sf))))) evidence.followed++;
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
}

// Rule: keep the suite green (drift). Opportunity = every iteration that has a test dir; followed = own tests pass.
const green = { opportunities: 0, followed: 0 };
for (const { dir } of snaps) {
  if (!fs.existsSync(path.join(dir, "test"))) continue;
  green.opportunities++;
  const r = Bun.spawnSync(["bun", "test", "--timeout", "5000"], { cwd: dir, stdout: "pipe", stderr: "pipe", timeout: 120000 });
  const out = r.stdout.toString() + r.stderr.toString();
  if (r.exitCode === 0 && /\d+ pass/.test(out)) green.followed++;
}

// Transcript rules (need stream-json logs: <home>@v<k>.transcript.jsonl).
type Ev = { type: string; message?: { content?: any[] } };
const toolSeq = (k: number) => {
  const f = `${home}@v${k}.transcript.jsonl`;
  if (!fs.existsSync(f)) return null;
  const seq: { kind: "text" | "tool"; name?: string; input?: any; text?: string }[] = [];
  for (const line of fs.readFileSync(f, "utf8").split("\n")) {
    let e: Ev; try { e = JSON.parse(line); } catch { continue; }
    if (e.type !== "assistant") continue;
    for (const c of e.message?.content ?? []) {
      if (c.type === "tool_use") seq.push({ kind: "tool", name: c.name, input: c.input });
      if (c.type === "text") seq.push({ kind: "text", text: c.text });
    }
  }
  return seq;
};
const isWrite = (x: any) => x.kind === "tool" && ["Write", "Edit", "MultiEdit"].includes(x.name);
const writesTo = (x: any, dir: string) => isWrite(x) && String(x.input?.file_path ?? "").includes(`/${dir}/`);
// Rule: test first. Opportunity = an iteration that edits both src/ and test/; followed = first edit is to test/.
const testFirst = { opportunities: 0, followed: 0 };
// Rule: plan first. Opportunity = v1; followed = before the first file write, a reply names a data model and modules.
const planFirst = { opportunities: 0, followed: 0 };
for (const { k } of snaps) {
  const seq = toolSeq(k);
  if (!seq) continue;
  const firstSrc = seq.findIndex((x) => writesTo(x, "src")), firstTest = seq.findIndex((x) => writesTo(x, "test"));
  if (firstSrc >= 0 && firstTest >= 0) { testFirst.opportunities++; if (firstTest < firstSrc) testFirst.followed++; }
  if (k === 1) {
    planFirst.opportunities++;
    const firstWrite = seq.findIndex(isWrite);
    const before = seq.slice(0, firstWrite < 0 ? seq.length : firstWrite).filter((x) => x.kind === "text").map((x) => x.text).join(" ");
    if (/data model|types?:|interface|state/i.test(before) && /module|file|src\//i.test(before)) planFirst.followed++;
  }
}

console.log(JSON.stringify({ split, never, evidence, green, testFirst, planFirst }));
