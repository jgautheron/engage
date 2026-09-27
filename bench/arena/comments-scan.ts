// bun comments-scan.ts <srcDir>... → per dir: longest comment block, blocks > 2 lines, ticket refs, with the offenders
import { Glob } from "bun";
const TICKET = /\b[A-Z][A-Z0-9]{1,9}-\d+\b|#\d{2,}\b|\b(jira|ticket|issue|incident)\b/i;
for (const dir of process.argv.slice(2)) {
  let maxBlock = 0, over2 = 0, tickets = 0, lines = 0;
  const offenders: string[] = [];
  for await (const f of new Glob("**/*.ts").scan(dir)) {
    const src = (await Bun.file(`${dir}/${f}`).text()).split("\n");
    let run: string[] = [], inBlock = false;
    const flush = () => { if (run.length > 2) { over2++; offenders.push(`${f}: ${run.join(" ⏎ ").slice(0, 160)}`); } maxBlock = Math.max(maxBlock, run.length); run = []; };
    for (const raw of src) {
      const t = raw.trim();
      const isComment = inBlock || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*");
      if (t.startsWith("/*")) inBlock = !t.includes("*/"); else if (inBlock && t.includes("*/")) inBlock = false;
      const trailing = !isComment && /\S.*\/\/\s*\S/.test(t) ? t.slice(t.indexOf("//")) : "";
      const text = isComment ? t : trailing;
      if (text) { lines++; if (TICKET.test(text)) tickets++; }
      if (isComment) run.push(t); else { flush(); if (trailing) maxBlock = Math.max(maxBlock, 1); }
    }
    flush();
  }
  console.log(JSON.stringify({ dir: dir.split("/").slice(-2).join("/"), lines, maxBlock, over2, tickets, offenders: offenders.slice(0, 3) }));
}
