// node validate.mjs <tasks.json> → adds `discriminating` (test names failing on the parent, passing on the real commit)
import { execFileSync } from "node:child_process"; import fs from "node:fs"; import os from "node:os"; import path from "node:path";
const file = process.argv[2]; const tasks = JSON.parse(fs.readFileSync(file, "utf8"));
process.env.CARGO_TARGET_DIR = path.join(tasks[0].repo, "target");
const results = (rev, t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rpv-"));
  execFileSync("sh", ["-c", `git -C "${t.repo}" archive ${rev} | tar -x -C "${dir}"`]);
  const map = {};
  for (const f of t.tests) {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
    fs.writeFileSync(path.join(dir, f), execFileSync("git", ["-C", t.repo, "show", `${t.commit}:${f}`], { encoding: "utf8", maxBuffer: 1 << 26 }));
    let out = ""; try { out = execFileSync("cargo", ["test", "-p", t.package, "--test", path.basename(f, ".rs"), "--", "--test-threads=4"], { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 900000 }); } catch (e) { out = String(e.stdout) + String(e.stderr); }
    for (const m of out.matchAll(/^test (\S+) \.\.\. (ok|FAILED)/gm)) map[`${path.basename(f, ".rs")}::${m[1]}`] = m[2] === "ok";
  }
  fs.rmSync(dir, { recursive: true, force: true });
  return map;
};
for (const t of tasks) {
  const parent = results(t.commit + "^", t), real = results(t.commit, t);
  t.discriminating = Object.keys(real).filter((k) => real[k] && parent[k] !== true);
  console.log(t.commit.slice(0, 9), t.package, `real ok ${Object.values(real).filter(Boolean).length}/${Object.keys(real).length}`, `parent ok ${Object.values(parent).filter(Boolean).length}`, `→ discriminating ${t.discriminating.length}`);
}
fs.writeFileSync(file, JSON.stringify(tasks, null, 1));
