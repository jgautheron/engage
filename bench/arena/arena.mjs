#!/usr/bin/env node
// engage arena — pits engage against other rule sets on prose + two code tasks.
// usage: node arena.mjs [--n 2] [--suites prose,checkout,billing] [--variants base,terse-hook,code-hook,both-hooks,engage]
//        [--gen-model sonnet] [--mod-model haiku] [--prose-model sonnet] [--jobs 4] [--out results/<stamp>]
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../..");
const CACHE = path.join(os.homedir(), ".cache", "engage-bench");
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const N = +arg("n", 2);
const SUITES = arg("suites", "prose,checkout,billing").split(",");
const VARIANTS = arg("variants", "base,terse-hook,code-hook,both-hooks,engage").split(",");
const MODELS = { gen: arg("gen-model", "sonnet"), mod: arg("mod-model", "haiku"), prose: arg("prose-model", "sonnet") };
const JOBS = +arg("jobs", 4);
const OUT = path.resolve(arg("out", path.join(HERE, "results", new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-"))));
const WORK = path.join(OUT, "work");

// ---------- contenders ----------
// Competitor text is produced by running their own hooks from a fresh clone, never stored in the repo.
function competitor(repo, name) {
  const dir = path.join(CACHE, name);
  if (fs.existsSync(dir)) execFileSync("git", ["-C", dir, "pull", "-q"]);
  else execFileSync("git", ["clone", "-q", "--depth", "1", `https://github.com/${repo}`, dir]);
  return { dir, sha: execFileSync("git", ["-C", dir, "rev-parse", "--short", "HEAD"]).toString().trim() };
}
const sandboxes = new Map();
function hook(dir, script, input = "") {
  // One sandbox per competitor, so its prompt hook sees the state its session hook wrote.
  if (!sandboxes.has(dir)) sandboxes.set(dir, fs.mkdtempSync(path.join(os.tmpdir(), "arena-hook-")));
  const sandbox = sandboxes.get(dir);
  const env = { ...process.env, CLAUDE_PLUGIN_ROOT: dir, CLAUDE_CONFIG_DIR: sandbox, XDG_CONFIG_HOME: sandbox };
  const raw = execFileSync("node", [path.join(dir, script)], { env, cwd: sandbox, input }).toString();
  let text = raw;
  try { text = JSON.parse(raw).hookSpecificOutput?.additionalContext ?? raw; } catch {}
  return text.split(/\n\s*STATUSLINE SETUP/)[0].trim(); // drop install nags, keep the ruleset
}
function buildContenders() {
  const cav = competitor("JuliusBrussee/caveman", "caveman");
  const pt = competitor("DietrichGebert/ponytail", "ponytail");
  const ups = JSON.stringify({ prompt: "hello", hook_event_name: "UserPromptSubmit", session_id: "arena" });
  const terse = { start: hook(cav.dir, "src/hooks/caveman-activate.js"), turn: hook(cav.dir, "src/hooks/caveman-mode-tracker.js", ups) };
  const code = { start: hook(pt.dir, "hooks/ponytail-activate.js"), turn: hook(pt.dir, "hooks/ponytail-mode-tracker.js", ups) };
  const engage = fs.readFileSync(path.join(REPO, "output-styles/engage-terse.md"), "utf8").replace(/^---[\s\S]*?\n---\n/, "").trim();
  const all = {
    base: {},
    "terse-hook": { start: [terse.start], turn: [terse.turn] },
    "code-hook": { start: [code.start], turn: [code.turn] },
    "both-hooks": { start: [terse.start, code.start], turn: [terse.turn, code.turn] },
    engage: { system: engage },
  };
  const versions = { "terse-hook": cav.sha, "code-hook": pt.sha, "both-hooks": `${cav.sha}+${pt.sha}`, engage: execFileSync("git", ["-C", REPO, "rev-parse", "--short", "HEAD"]).toString().trim() };
  const footprint = Object.fromEntries(Object.entries(all).map(([k, v]) => [k, {
    once: Math.round(((v.system ?? "") + (v.start ?? []).join("")).length / 4),
    perTurn: Math.round((v.turn ?? []).filter(Boolean).join("").length / 4),
  }]));
  return { contenders: Object.fromEntries(VARIANTS.map((v) => [v, all[v]])), versions, footprint };
}

// Hook text arrives the way hooks deliver it: as reminders in the user turn. engage is a system layer.
function wrap(c, prompt) {
  const r = [];
  for (const s of c.start ?? []) r.push(`<system-reminder>\nSessionStart hook additional context: ${s}\n</system-reminder>`);
  for (const t of (c.turn ?? []).filter(Boolean)) r.push(`<system-reminder>\nUserPromptSubmit hook additional context: ${t}\n</system-reminder>`);
  return [...r, prompt].join("\n");
}

// ---------- claude runner ----------
// --restricted: ignores user/project settings (no output style, plugins, CLAUDE.md), no shell, file tools confined to cwd.
function claude({ cwd, model, prompt, system, tools }) {
  const args = ["-p", "--restricted", "--strict-mcp-config", "--model", model, "--output-format", "json", "--permission-mode", "acceptEdits", "--tools", tools];
  if (system) args.push("--append-system-prompt", system);
  return new Promise((resolve) => {
    // Prompt on stdin: --tools is variadic and would swallow a positional prompt.
    const p = spawn("claude", args, { cwd, stdio: ["pipe", "pipe", "pipe"] });
    p.stdin.end(prompt);
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    const timer = setTimeout(() => p.kill("SIGTERM"), 20 * 60 * 1000);
    p.on("close", () => {
      clearTimeout(timer);
      try { const j = JSON.parse(out); resolve({ ok: !j.is_error, text: j.result ?? "", outTok: j.usage?.output_tokens ?? 0, cost: j.total_cost_usd ?? 0 }); }
      catch { resolve({ ok: false, text: out.slice(0, 500), outTok: 0, cost: 0 }); }
    });
  });
}
async function pool(tasks, n) {
  const results = new Array(tasks.length);
  let next = 0, done = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (next < tasks.length) { const i = next++; results[i] = await tasks[i](); process.stdout.write(`\r  ${++done}/${tasks.length}`); }
  }));
  process.stdout.write("\n");
  return results;
}

// ---------- suites ----------
async function prose(contenders) {
  const prompts = JSON.parse(fs.readFileSync(path.join(HERE, "prose.json"), "utf8"));
  const SLOP = /let me know|hope this helps|great question|happy to help|feel free to/i;
  const jobs = [];
  for (const [v, c] of Object.entries(contenders)) for (const p of prompts) for (let s = 1; s <= N; s++) jobs.push(async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "arena-prose-"));
    const r = await claude({ cwd, model: MODELS.prose, prompt: wrap(c, p.prompt), system: c.system, tools: "" });
    const checks = [...p.must.map((re) => new RegExp(re, "im").test(r.text)), ...(p.mustNot ?? []).map((re) => !new RegExp(re, "im").test(r.text)), !SLOP.test(r.text)];
    const row = { variant: v, id: p.id, sample: s, ok: r.ok, pass: checks.filter(Boolean).length, checks: checks.length, outTok: r.outTok, words: r.text.split(/\s+/).filter(Boolean).length, cost: r.cost };
    fs.mkdirSync(path.join(WORK, "prose"), { recursive: true });
    fs.writeFileSync(path.join(WORK, "prose", `${v}-${p.id}-${s}.md`), r.text);
    return row;
  });
  console.log(`prose: ${jobs.length} runs`);
  return pool(jobs, JOBS);
}

function bun(args, cwd) {
  try { return execFileSync("bun", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 180000 }); } catch (e) { return String(e.stdout ?? ""); }
}
function tscErrors(dir) {
  const files = fs.readdirSync(path.join(dir, "src"), { recursive: true }).filter((f) => String(f).endsWith(".ts")).map((f) => path.join(dir, "src", String(f)));
  try { execFileSync("bunx", ["tsc", "--noEmit", "--strict", "--noUnusedLocals", "--noUnusedParameters", "--target", "es2022", "--moduleResolution", "bundler", "--module", "esnext", "--skipLibCheck", ...files], { stdio: "pipe" }); return 0; }
  catch (e) { return (String(e.stdout).match(/error TS/g) ?? []).length; }
}
const frac = (s) => { const m = /(\d+)\/(\d+)/.exec(s ?? ""); return m ? +m[1] / +m[2] : 0; };

async function codeTask(task, contenders) {
  const T = path.join(HERE, "tasks", task);
  const gen = [];
  for (const [v, c] of Object.entries(contenders)) for (let s = 1; s <= N; s++) gen.push(async () => {
    const dir = path.join(WORK, task, `${v}-${s}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(path.join(T, "spec.md"), path.join(dir, "spec.md"));
    const g = await claude({ cwd: dir, model: MODELS.gen, system: c.system, tools: "Read,Write,Edit,Glob,Grep",
      prompt: wrap(c, "Implement the spec in ./spec.md. Write the code under ./src with ./src/index.ts as the entry point. Do not write tests. You cannot run code; get it right in one pass.") });
    const modDir = `${dir}-mod`;
    fs.cpSync(dir, modDir, { recursive: true });
    fs.copyFileSync(path.join(T, "change.md"), path.join(modDir, "change.md"));
    // Neutral maintainer: a weaker model with no style rules, working blind from the code.
    const m = fs.existsSync(path.join(dir, "src/index.ts"))
      ? await claude({ cwd: modDir, model: MODELS.mod, tools: "Read,Write,Edit,Glob,Grep", prompt: "Implement the change request in ./change.md in this codebase (./src). You cannot run code." })
      : { ok: false, outTok: 0, cost: 0 };
    return { variant: v, sample: s, dir, modDir, genOutTok: g.outTok, modOutTok: m.outTok, cost: g.cost + m.cost };
  });
  console.log(`${task}: ${gen.length} generate+maintain pairs`);
  const runs = await pool(gen, JOBS);
  for (const r of runs) {
    const has = (d) => fs.existsSync(path.join(d, "src/index.ts"));
    r.metrics = has(r.dir) ? JSON.parse(bun(["metrics.ts", r.dir], path.join(REPO, "bench/multifile")) || "{}") : {};
    r.tsc = has(r.dir) ? tscErrors(r.dir) : null;
    if (task === "checkout") {
      const run = path.join(REPO, "bench/multifile/run.sh");
      r.genScore = has(r.dir) ? frac(execFileSync("sh", [run, "gen", r.dir]).toString()) : 0;
      r.modScore = has(r.modDir) ? frac(execFileSync("sh", [run, "mod", r.modDir]).toString()) : 0;
    } else {
      const j = has(r.dir) ? JSON.parse(bun(["score.ts", r.dir, r.modDir], T) || "{}") : {};
      const f = (k) => (j[k] ? j[k].pass / j[k].total : 0);
      Object.assign(r, { genScore: f("spec"), preserve: f("preserve"), seats: f("seats"), specAfter: f("specAfterChange"), modScore: (f("preserve") + f("seats") + f("specAfterChange")) / 3 });
    }
  }
  return runs;
}

// ---------- scorecard ----------
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
function scorecard(rows, footprint, versions) {
  // [label, direction, value(variant)] — engage "wins" if best or within the tie band of best.
  const byV = (v, key, f = (r) => r[key]) => mean((rows[key.split(".")[0]] ?? []).filter((r) => r.variant === v).map(f));
  const metrics = [];
  const add = (label, dir, fn, fmt = (x) => x.toFixed(2), tie = 0.02) => metrics.push({ label, dir, fn, fmt, tie });
  const pct = (x) => `${Math.round(x * 100)}%`;
  if (rows.prose) {
    add("prose: rubric pass rate", "max", (v) => mean(rows.prose.filter((r) => r.variant === v).map((r) => r.pass / r.checks)), pct);
    add("prose: output tokens / reply", "min", (v) => mean(rows.prose.filter((r) => r.variant === v).map((r) => r.outTok)), (x) => x.toFixed(0), 0.05);
  }
  for (const t of ["checkout", "billing"]) if (rows[t]) {
    const R = (v) => rows[t].filter((r) => r.variant === v);
    add(`${t}: spec tests after generation`, "max", (v) => mean(R(v).map((r) => r.genScore)), pct);
    if (t === "billing") {
      add("billing: preserved behaviour after change", "max", (v) => mean(R(v).map((r) => r.preserve)), pct);
      add("billing: seats prorated like plans", "max", (v) => mean(R(v).map((r) => r.seats)), pct);
    }
    add(`${t}: change done correctly (weak maintainer)`, "max", (v) => mean(R(v).map((r) => r.modScore)), pct);
    add(`${t}: strict tsc errors`, "min", (v) => mean(R(v).map((r) => r.tsc ?? 99)), (x) => x.toFixed(1), 0);
    add(`${t}: code size (tok)`, "min", (v) => mean(R(v).map((r) => r.metrics?.tok ?? 0)), (x) => x.toFixed(0), 0.05);
    add(`${t}: generation output tokens`, "min", (v) => mean(R(v).map((r) => r.genOutTok)), (x) => x.toFixed(0), 0.05);
  }
  add("rule footprint, one-time (tok)", "min", (v) => footprint[v].once, (x) => x.toFixed(0), 0);
  add("rule footprint, per turn (tok)", "min", (v) => footprint[v].perTurn, (x) => x.toFixed(0), 0);
  const vs = VARIANTS;
  let md = `# engage arena — ${path.basename(OUT)}\n\nn=${N} per cell · generator ${MODELS.gen} · maintainer ${MODELS.mod} (no rules) · prose ${MODELS.prose} · versions ${JSON.stringify(versions)}\n\n`;
  md += `| metric | ${vs.join(" | ")} | best (excl. base) | engage |\n|---|${vs.map(() => "--:").join("|")}|---|---|\n`;
  let wins = 0, ties = 0, losses = [];
  for (const m of metrics) {
    const vals = Object.fromEntries(vs.map((v) => [v, m.fn(v)]));
    // "base" (no rules) is the reference row, not a contender.
    const rivals = vs.filter((v) => v !== "base");
    const rv = rivals.map((v) => vals[v]);
    const best = m.dir === "max" ? Math.max(...rv) : Math.min(...rv);
    const within = (x) => (m.dir === "max" ? x >= best - m.tie * Math.max(1, Math.abs(best)) : x <= best + m.tie * Math.max(1, Math.abs(best)));
    const leaders = rivals.filter((v) => within(vals[v]));
    let verdict = "—";
    if (vals.engage !== undefined) {
      if (vals.engage === best && leaders.length === 1) { verdict = "✅ best"; wins++; }
      else if (within(vals.engage)) { verdict = "🟰 tied"; ties++; }
      else { verdict = "❌ behind"; losses.push(m.label); }
    }
    md += `| ${m.label} | ${vs.map((v) => m.fmt(vals[v])).join(" | ")} | ${leaders.join(", ")} | ${verdict} |\n`;
  }
  const cost = Object.values(rows).flat().reduce((s, r) => s + (r.cost ?? 0), 0);
  md += `\n**engage: ${wins} best · ${ties} tied · ${losses.length} behind**${losses.length ? ` (${losses.join("; ")})` : ""} · run cost $${cost.toFixed(2)}\n`;
  md += `\nTie band: ±2% for rates, ±5% for token counts. Small n — rerun with a larger --n before trusting a single-cell gap.\n`;
  return md;
}

// ---------- main ----------
fs.mkdirSync(WORK, { recursive: true });
const { contenders, versions, footprint } = buildContenders();
fs.writeFileSync(path.join(OUT, "footprint.json"), JSON.stringify({ footprint, versions }, null, 2));
const rows = {};
if (SUITES.includes("prose")) rows.prose = await prose(contenders);
for (const t of ["checkout", "billing"]) if (SUITES.includes(t)) rows[t] = await codeTask(t, contenders);
fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(rows, null, 1));
const md = scorecard(rows, footprint, versions);
fs.writeFileSync(path.join(OUT, "scorecard.md"), md);
console.log("\n" + md + `\n→ ${OUT}`);
