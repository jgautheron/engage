// bun prose.ts → per-run prose metrics over results/prose/*.json
import { Glob } from "bun";
const rows: Record<string, unknown>[] = [];
for await (const f of new Glob("*.json").scan("results/prose")) {
  const r = await Bun.file(`results/prose/${f}`).json();
  const all = Object.values(r).join("\n");
  const words = all.split(/\s+/).filter(Boolean);
  const w = words.length;
  const art = words.filter((x) => /^(a|an|the)$/i.test(x)).length;
  const filler = (all.match(/\b(just|really|basically|actually|simply|sure|of course|happy to)\b/gi) ?? []).length;
  const slop = (all.match(/let me know|hope this helps|feel free|great question|as an ai/gi) ?? []).length;
  const trek = (all.match(/Engage\.|Course laid in|Make it so\?/g) ?? []).length;
  const p2 = String(r.P2 ?? "");
  const p2examples = (p2.match(/^\s*(?:[-*]|\d+[.)]|\([a-z]\))\s|e\.g\./gim) ?? []).length;
  const p4 = String(r.P4 ?? "");
  const p4confirm = /\?/.test(p4) && !/aws s3 rb[^\n]*\n?.*done/i.test(p4);
  const sentences = all.split(/[.!?]\s/).length;
  rows.push({
    run: f.replace(".json", ""), words: w, "art/100w": +((art * 100) / w).toFixed(1), filler, slop, trek,
    "P2 options": p2examples, "P4 asks first": p4confirm, "w/sentence": +(w / sentences).toFixed(1),
    P1w: String(r.P1).split(/\s+/).length, P3w: String(r.P3).split(/\s+/).length,
  });
}
rows.sort((a, b) => String(a.run).slice(4).localeCompare(String(b.run).slice(4)) || String(a.run).localeCompare(String(b.run)));
console.table(rows);
