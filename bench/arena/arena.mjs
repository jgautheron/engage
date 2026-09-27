#!/usr/bin/env node
// engage arena — pits engage against other rule sets on prose + two code tasks.
// usage: node arena.mjs [--n 2]  |  node arena.mjs --rescore 1 --out results/<stamp> [--suites prose,checkout,billing] [--variants base,terse-hook,code-hook,both-hooks,engage]
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
const SUITES = arg("suites", "prose,checkout,billing,evolve").split(",");
const VARIANTS = arg("variants", "base,terse-hook,code-hook,both-hooks,engage").split(",");
const MODELS = { gen: arg("gen-model", "claude-sonnet-5"), mod: arg("mod-model", "haiku"), prose: arg("prose-model", "claude-sonnet-5") };
const JOBS = +arg("jobs", 4);
const OUT = path.resolve(arg("out", path.join(HERE, "results", new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-"))));
const WORK = path.join(OUT, "work");

// ---------- contenders ----------
// Competitor text is produced by running their own hooks from a fresh clone, never stored in the repo.
function competitor(repo, name) {
  const dir = path.join(CACHE, name);
  // Parallel runs share this clone; a refresh that collides falls back to the cached copy.
  if (fs.existsSync(dir)) { try { execFileSync("git", ["-C", dir, "pull", "-q", "--ff-only"], { stdio: "pipe" }); } catch {} }
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
  // Candidate engage revisions to A/B: bench/arena/candidates/<name>.md → contender <name>.
  const cand = path.join(HERE, "candidates");
  if (fs.existsSync(cand)) for (const f of fs.readdirSync(cand).filter((f) => f.endsWith(".md"))) all[f.slice(0, -3)] = { system: fs.readFileSync(path.join(cand, f), "utf8").trim() };
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
    // Read-only tools in an empty dir: a model that looks before answering finds nothing and must still answer.
    const r = await claude({ cwd, model: MODELS.prose, prompt: wrap(c, p.prompt), system: c.system, tools: "Read,Glob,Grep" });
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
// Emit JS with tsc so behaviour can be scored even when native TS loading fails.
function build(dir) {
  const files = fs.readdirSync(path.join(dir, "src"), { recursive: true }).filter((f) => String(f).endsWith(".ts")).map((f) => path.join(dir, "src", String(f)));
  try { execFileSync("bunx", ["tsc", "--outDir", path.join(dir, ".build"), "--rootDir", path.join(dir, "src"), "--target", "es2022", "--module", "esnext", "--moduleResolution", "bundler", "--skipLibCheck", ...files], { stdio: "pipe" }); } catch {}
}
// Does src/index.ts load without a build step (Bun / Node type-stripping / esbuild semantics)?
function loadsNatively(dir) {
  try { execFileSync("bun", ["-e", `await import(${JSON.stringify(path.join(dir, "src/index.ts"))})`], { stdio: "pipe", timeout: 60000 }); return 1; } catch { return 0; }
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
      prompt: wrap(c, `(session ${s})\n` + "Implement the spec in ./spec.md. Write the code under ./src with ./src/index.ts as the entry point. Do not write tests. You cannot run code; get it right in one pass.") });
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
  return scoreCode(task, await pool(gen, JOBS));
}

function scoreCode(task, runs) {
  const T = path.join(HERE, "tasks", task);
  for (const r of runs) {
    const has = (d) => fs.existsSync(path.join(d, "src/index.ts"));
    for (const d of [r.dir, r.modDir]) if (has(d)) build(d);
    r.native = has(r.dir) ? (loadsNatively(r.dir) + (has(r.modDir) ? loadsNatively(r.modDir) : 0)) / 2 : 0;
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

// Evolution: the same contender builds v1 from scratch, then applies change requests v2..v5 in fresh
// sessions, seeing only its own code and the new request. Scored per iteration against cumulative tests.
function churn(a, b) {
  let out = "";
  try { out = execFileSync("git", ["diff", "--no-index", "--numstat", a, b], { encoding: "utf8" }); } catch (e) { out = String(e.stdout ?? ""); }
  const rows = out.trim().split("\n").filter(Boolean).map((l) => l.split("\t"));
  return { lines: rows.reduce((s, [ad, rm]) => s + (+ad || 0) + (+rm || 0), 0), files: rows.length };
}
// Evolution configs: hard = iterations where architecture decides the cost; trivial = should stay tiny.
const EVOLVE = {
  evolve: { hard: [3, 4], trivial: 5 },
  "evolve-xl": { hard: [5, 9, 10, 11], trivial: 12 },
};
async function evolveTask(task, contenders) {
  const T = path.join(HERE, "tasks", task);
  const files = fs.readdirSync(T).filter((f) => /^iter-\d+\.md$/.test(f)).sort((a, b) => parseInt(a.slice(5)) - parseInt(b.slice(5)));
  const jobs = [];
  for (const [v, c] of Object.entries(contenders)) for (let s = 1; s <= N; s++) jobs.push(async () => {
    const dir = path.join(WORK, task, `${v}-${s}`);
    fs.mkdirSync(dir, { recursive: true });
    const iters = [];
    for (const [i, f] of files.entries()) {
      const k = i + 1;
      fs.copyFileSync(path.join(T, f), path.join(dir, "REQUEST.md"));
      const prompt = k === 1
        ? "Build what ./REQUEST.md asks for, under ./src. Do not write tests. You cannot run code; get it right in one pass."
        : "./REQUEST.md is a change request for this codebase (./src). Implement it. Do not write tests. You cannot run code; get it right in one pass.";
      const r = await claude({ cwd: dir, model: MODELS.gen, system: c.system, tools: "Read,Write,Edit,Glob,Grep", prompt: wrap(c, `(session ${s}, step ${k})\n${prompt}`) });
      const snap = `${dir}@v${k}`;
      fs.rmSync(snap, { recursive: true, force: true });
      if (fs.existsSync(path.join(dir, "src"))) fs.cpSync(path.join(dir, "src"), path.join(snap, "src"), { recursive: true });
      iters.push({ k, snap, outTok: r.outTok, cost: r.cost });
    }
    return { variant: v, sample: s, dir, iters, cost: iters.reduce((a, i) => a + i.cost, 0) };
  });
  console.log(`${task}: ${jobs.length} projects × ${files.length} iterations`);
  return scoreEvolve(task, await pool(jobs, JOBS));
}
function scoreEvolve(task, runs) {
  const T = path.join(HERE, "tasks", task);
  for (const r of runs) {
    let prev = null;
    for (const it of r.iters) {
      const has = fs.existsSync(path.join(it.snap, "src/index.ts"));
      if (has) build(it.snap);
      const args = ["score.ts", it.snap, String(it.k), ...(prev ? [prev] : [])];
      const j = has ? JSON.parse(bun(args, T) || "{}") : { pass: 0, total: 1, failed: [] };
      it.score = j.total ? j.pass / j.total : 0;
      it.regressions = (j.failed ?? []).filter((f) => +f.slice(1, f.indexOf(":")) < it.k).length;
      it.native = has ? loadsNatively(it.snap) : 0;
      it.tok = has ? JSON.parse(bun(["metrics.ts", it.snap], path.join(REPO, "bench/multifile")) || "{}").tok ?? 0 : 0;
      it.churn = prev ? churn(path.join(prev, "src"), path.join(it.snap, "src")) : { lines: 0, files: 0 };
      prev = it.snap;
    }
    r.health = health(path.join(r.iters[r.iters.length - 1].snap, "src"));
  }
  return runs;
}

// AST code-health metrics (bench/arena/health.ts, TypeScript 5 API).
function health(srcDir) {
  try { return JSON.parse(execFileSync("bun", [path.join(HERE, "health.ts"), srcDir], { encoding: "utf8", cwd: HERE, stdio: ["ignore", "pipe", "ignore"] })); } catch { return null; }
}

// Blind maintenance: a rule-free weaker model applies the extra change requests (iterations after the
// last one the contender built) to each finished project from an earlier evolve run.
async function maintainFrom(runDir, task) {
  const prior = JSON.parse(fs.readFileSync(path.join(runDir, "results.json"), "utf8"))[task];
  const T = path.join(HERE, "tasks", task);
  const all = fs.readdirSync(T).filter((f) => /^iter-\d+\.md$/.test(f)).sort((a, b) => parseInt(a.slice(5)) - parseInt(b.slice(5)));
  const built = prior[0].iters.length;
  const extra = all.slice(built);
  const jobs = prior.filter((r) => VARIANTS.includes(r.variant)).map((r) => async () => {
    const last = r.iters[built - 1].snap;
    const dir = path.join(WORK, "maintain", `${r.variant}-${r.sample}`);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.cpSync(path.join(last, "src"), path.join(dir, "src"), { recursive: true });
    const iters = [{ k: built, snap: last, outTok: 0, cost: 0 }];
    for (const [i, f] of extra.entries()) {
      const k = built + i + 1;
      fs.copyFileSync(path.join(T, f), path.join(dir, "REQUEST.md"));
      const res = await claude({ cwd: dir, model: MODELS.mod, tools: "Read,Write,Edit,Glob,Grep",
        prompt: `(session ${r.sample}, step ${k})\n./REQUEST.md is a change request for this codebase (./src). Implement it. Do not write tests. You cannot run code; get it right in one pass.` });
      const snap = `${dir}@v${k}`;
      fs.rmSync(snap, { recursive: true, force: true });
      fs.cpSync(path.join(dir, "src"), path.join(snap, "src"), { recursive: true });
      iters.push({ k, snap, outTok: res.outTok, cost: res.cost });
    }
    return { variant: r.variant, sample: r.sample, health: health(path.join(last, "src")), iters, cost: iters.reduce((a, i) => a + i.cost, 0) };
  });
  console.log(`maintain: ${jobs.length} finished projects × ${extra.length} blind change requests (${MODELS.mod}, no rules)`);
  const runs = await pool(jobs, JOBS);
  scoreEvolve(task, runs);
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
    add(`${t}: runs without a build step`, "max", (v) => mean(R(v).map((r) => r.native ?? 0)), pct);
    add(`${t}: strict tsc errors`, "min", (v) => mean(R(v).map((r) => r.tsc ?? 99)), (x) => x.toFixed(1), 0);
    add(`${t}: code size (tok)`, "min", (v) => mean(R(v).map((r) => r.metrics?.tok ?? 0)), (x) => x.toFixed(0), 0.05);
    add(`${t}: generation output tokens`, "min", (v) => mean(R(v).map((r) => r.genOutTok)), (x) => x.toFixed(0), 0.05);
  }
  for (const task of Object.keys(EVOLVE)) if (rows[task]) {
    const { hard, trivial } = EVOLVE[task];
    const R = (v) => rows[task].filter((r) => r.variant === v);
    const K = R(VARIANTS[0])[0]?.iters.length ?? 0;
    const it = (v, k, f) => mean(R(v).map((r) => f(r.iters[k - 1])));
    const ks = Array.from({ length: K }, (_, i) => i + 1);
    const half = Math.floor((K - 1) / 2);
    add(`${task}: tests passed, mean over all ${K} iterations`, "max", (v) => mean(ks.map((k) => it(v, k, (i) => i.score))), pct);
    add(`${task}: tests passed at v${K} (every feature)`, "max", (v) => it(v, K, (i) => i.score), pct);
    add(`${task}: regressions (earlier cases broken, summed)`, "min", (v) => ks.slice(1).reduce((a, k) => a + it(v, k, (i) => i.regressions), 0), (x) => x.toFixed(1), 0);
    add(`${task}: v1 size — no premature abstraction (tok)`, "min", (v) => it(v, 1, (i) => i.tok), (x) => x.toFixed(0), 0.1);
    add(`${task}: lines changed on design-heavy iterations (${hard.map((k) => "v" + k).join(",")})`, "min", (v) => hard.reduce((a, k) => a + it(v, k, (i) => i.churn.lines), 0), (x) => x.toFixed(0), 0.1);
    add(`${task}: lines changed on the trivial v${trivial}`, "min", (v) => it(v, trivial, (i) => i.churn.lines), (x) => x.toFixed(0), 0.1);
    add(`${task}: output tokens, whole project`, "min", (v) => mean(R(v).map((r) => r.iters.reduce((a, i) => a + i.outTok, 0))), (x) => x.toFixed(0), 0.05);
    add(`${task}: cost growth — late vs early iteration tokens`, "min", (v) => mean(R(v).map((r) => {
      const t = r.iters.filter((i) => i.k !== 1 && i.k !== trivial).map((i) => i.outTok);
      const early = mean(t.slice(0, half)), late = mean(t.slice(-half));
      return early ? late / early : 0;
    })), (x) => `${x.toFixed(2)}×`, 0.05);
    add(`${task}: final size (tok)`, "min", (v) => it(v, K, (i) => i.tok), (x) => x.toFixed(0), 0.1);
    const hh = (k) => (v) => mean(R(v).map((r) => r.health?.[k] ?? 0));
    add(`${task}: health — files at the end`, "max", hh("files"), (x) => x.toFixed(1), 0.1);
    add(`${task}: health — largest file (lines)`, "min", hh("maxFileLines"), (x) => x.toFixed(0), 0.1);
    add(`${task}: health — largest function (lines)`, "min", hh("fnLenMax"), (x) => x.toFixed(0), 0.1);
    add(`${task}: health — max branch complexity`, "min", hh("cxMax"), (x) => x.toFixed(1), 0.1);
    add(`${task}: health — duplicated blocks`, "min", hh("dupBlocks"), (x) => x.toFixed(1), 0.1);
    add(`${task}: health — non-null assertions`, "min", hh("nonNull"), (x) => x.toFixed(1), 0.1);
    add(`${task}: runs without a build step (all snapshots)`, "max", (v) => mean(R(v).flatMap((r) => r.iters.map((i) => i.native))), pct);
  }
  if (rows.maintain) {
    const R = (v) => rows.maintain.filter((r) => r.variant === v);
    const last = (r) => r.iters[r.iters.length - 1];
    add("maintain: blind maintainer — tests passed at the end", "max", (v) => mean(R(v).map((r) => last(r).score)), pct);
    add("maintain: blind maintainer — regressions (summed)", "min", (v) => mean(R(v).map((r) => r.iters.slice(1).reduce((a, i) => a + i.regressions, 0))), (x) => x.toFixed(1), 0);
    add("maintain: blind maintainer — lines changed", "min", (v) => mean(R(v).map((r) => r.iters.slice(1).reduce((a, i) => a + i.churn.lines, 0))), (x) => x.toFixed(0), 0.1);
    add("maintain: blind maintainer — output tokens", "min", (v) => mean(R(v).map((r) => r.iters.reduce((a, i) => a + i.outTok, 0))), (x) => x.toFixed(0), 0.05);
    const h = (k) => (v) => mean(R(v).map((r) => r.health?.[k] ?? 0));
    add("health: largest function (lines)", "min", h("fnLenMax"), (x) => x.toFixed(0), 0.1);
    add("health: largest file (lines)", "min", h("maxFileLines"), (x) => x.toFixed(0), 0.1);
    add("health: max branch complexity in a function", "min", h("cxMax"), (x) => x.toFixed(1), 0.1);
    add("health: functions with complexity > 10", "min", h("cxOver10"), (x) => x.toFixed(1), 0.1);
    add("health: duplicated 4-line blocks", "min", h("dupBlocks"), (x) => x.toFixed(1), 0.1);
    add("health: non-null assertions (!)", "min", h("nonNull"), (x) => x.toFixed(1), 0.1);
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
    const rivals = vs.filter((v) => v !== "base" && (v === "engage" || !v.startsWith("engage-")));
    const rv = rivals.map((v) => vals[v]);
    const best = m.dir === "max" ? Math.max(...rv) : Math.min(...rv);
    const within = (x) => (m.dir === "max" ? x >= best - m.tie * Math.max(1, Math.abs(best)) : x <= best + m.tie * Math.max(1, Math.abs(best)));
    const leaders = rivals.filter((v) => within(vals[v]));
    let verdict = "—";
    if (vals.engage !== undefined && rivals.length > 1) {
      // candidates (engage-*) are compared too but never counted as rivals of engage in the verdict

      if (vals.engage === best && leaders.length === 1) { verdict = "✅ best"; wins++; }
      else if (within(vals.engage)) { verdict = "🟰 tied"; ties++; }
      else { verdict = "❌ behind"; losses.push(m.label); }
    }
    md += `| ${m.label} | ${vs.map((v) => m.fmt(vals[v])).join(" | ")} | ${leaders.join(", ")} | ${verdict} |\n`;
  }
  const cost = Object.values(rows).flat().reduce((s, r) => s + (r.cost ?? 0), 0);
  md += `\n**engage: ${wins} best · ${ties} tied · ${losses.length} behind**${losses.length ? ` (${losses.join("; ")})` : ""} · run cost $${cost.toFixed(2)}\n`;
  md += `\nTie band: ±2% for rates, ±5% for token counts, ±10% for code size and lines changed. Small n — rerun with a larger --n before trusting a single-cell gap.\n`;
  return md;
}

// ---------- main ----------
const RESCORE = arg("rescore");
const MAINTAIN = arg("maintain"); // path to an earlier evolve run: blind-maintain its finished projects
let rows = {}, footprint, versions;
if (RESCORE) {
  // Re-score an earlier run in place (no new model calls).
  rows = JSON.parse(fs.readFileSync(path.join(OUT, "results.json"), "utf8"));
  ({ footprint, versions } = JSON.parse(fs.readFileSync(path.join(OUT, "footprint.json"), "utf8")));
  for (const t of ["checkout", "billing"]) if (rows[t]) scoreCode(t, rows[t]);
  for (const t of Object.keys(EVOLVE)) if (rows[t]) scoreEvolve(t, rows[t]);
} else if (MAINTAIN) {
  fs.mkdirSync(WORK, { recursive: true });
  ({ footprint, versions } = JSON.parse(fs.readFileSync(path.join(MAINTAIN, "footprint.json"), "utf8")));
  rows.maintain = await maintainFrom(path.resolve(MAINTAIN), arg("task", "evolve-xl"));
} else {
  fs.mkdirSync(WORK, { recursive: true });
  let contenders;
  ({ contenders, versions, footprint } = buildContenders());
  fs.writeFileSync(path.join(OUT, "footprint.json"), JSON.stringify({ footprint, versions }, null, 2));
  if (SUITES.includes("prose")) rows.prose = await prose(contenders);
  for (const t of ["checkout", "billing"]) if (SUITES.includes(t)) rows[t] = await codeTask(t, contenders);
  for (const t of Object.keys(EVOLVE)) if (SUITES.includes(t)) rows[t] = await evolveTask(t, contenders);
}
fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(rows, null, 1));
const md = scorecard(rows, footprint, versions);
fs.writeFileSync(path.join(OUT, "scorecard.md"), md);
console.log("\n" + md + `\n→ ${OUT}`);
