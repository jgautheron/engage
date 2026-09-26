// usage: bun metrics.ts <dir>  → JSON structure metrics over <dir>/src/**/*.ts
import { Glob } from "bun";
const dir = process.argv[2];
const files: string[] = [];
for await (const f of new Glob("src/**/*.ts").scan(dir)) files.push(f);
let src = "", loc = 0, comments = 0, contracts = 0, exportsN = 0;
const literalFiles: Record<string, Set<string>> = { "5000": new Set(), "499": new Set(), "10000": new Set(), "99": new Set() };
for (const f of files) {
  const t = await Bun.file(`${dir}/${f}`).text();
  src += t + "\n";
  const lines = t.split("\n");
  lines.forEach((l, i) => {
    const s = l.trim();
    if (s && !s.startsWith("//") && !s.startsWith("*") && !s.startsWith("/*")) loc++;
    if (s.startsWith("//") || s.startsWith("*") || s.startsWith("/*")) comments++;
    if (/^export (async )?(function|const|type|interface|class)\b/.test(s)) {
      exportsN++;
      const prev = lines.slice(Math.max(0, i - 4), i).join("\n");
      if (/\*\/\s*$/.test(prev.trim()) || /^\s*\/\/.+$/m.test(lines[i - 1] ?? "")) contracts++;
    }
    for (const lit of Object.keys(literalFiles)) if (new RegExp(`(?<![\\w.])${lit}(?![\\w.])`).test(s) && !s.startsWith("//") && !s.startsWith("*")) literalFiles[lit].add(f);
  });
}
const count = (re: RegExp) => (src.match(re) ?? []).length;
console.log(JSON.stringify({
  files: files.length,
  tok: Math.round(src.length / 4),
  loc, comments, exports: exportsN, contracts,
  any: count(/:\s*any\b|as any\b/g),
  truthy: count(/\|\|\s*0\b|\?\?\s*0\b(?!\))|!!\w/g),
  upperConsts: count(/\bconst [A-Z][A-Z0-9_]{2,}\s*=/g),
  tuples: count(/\):\s*\[[^\]]+,[^\]]+\]/g),
  dupLiteralFiles: Object.fromEntries(Object.entries(literalFiles).map(([k, v]) => [k, v.size])),
}));
