// bun locality.ts <prevSrc> <curSrc> → {"added","changed","removed"} named functions between two snapshots
import * as ts from "typescript";
import { Glob } from "bun";
async function fnMap(dir: string) {
  const m = new Map<string, string>();
  for await (const f of new Glob("**/*.ts").scan(dir)) {
    const sf = ts.createSourceFile(f, await Bun.file(`${dir}/${f}`).text(), ts.ScriptTarget.Latest, true);
    const visit = (n: ts.Node, owner: string) => {
      let name: string | null = null;
      if ((ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n)) && n.name) name = n.name.getText(sf);
      else if ((ts.isArrowFunction(n) || ts.isFunctionExpression(n)) && n.parent) {
        const p = n.parent;
        if (ts.isVariableDeclaration(p) || ts.isPropertyAssignment(p) || ts.isPropertyDeclaration(p)) name = p.name.getText(sf);
        else if (ts.isBinaryExpression(p)) name = p.left.getText(sf);
      }
      if (name && (n as any).body) { const key = `${owner}/${name}`; m.set(key, (n as any).body.getText(sf).replace(/\s+/g, " ")); ts.forEachChild(n, (c) => visit(c, key)); return; }
      ts.forEachChild(n, (c) => visit(c, owner));
    };
    visit(sf, f);
  }
  return m;
}
const [a, b] = await Promise.all(process.argv.slice(2).map(fnMap));
let added = 0, changed = 0, removed = 0;
for (const [k, v] of b) { if (!a.has(k)) added++; else if (a.get(k) !== v) changed++; }
for (const k of a.keys()) if (!b.has(k)) removed++;
console.log(JSON.stringify({ added, changed, removed }));
