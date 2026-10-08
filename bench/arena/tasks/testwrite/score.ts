// bun score.ts <agentTestDir> → bugs caught (of the 3 planted), tests that fail on the correct code, plus testq metrics
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const testDir = process.argv[2];
const T = import.meta.dir;
function run(srcFile: string) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "tw-"));
  fs.mkdirSync(path.join(d, "src"));
  fs.copyFileSync(srcFile, path.join(d, "src", "index.ts"));
  fs.cpSync(testDir, path.join(d, "test"), { recursive: true });
  const r = Bun.spawnSync(["bun", "test", "--timeout", "5000"], { cwd: d, stdout: "pipe", stderr: "pipe", timeout: 60000 });
  const out = r.stdout.toString() + r.stderr.toString();
  return { pass: +(out.match(/^\s*(\d+) pass/m)?.[1] ?? 0), fail: +(out.match(/^\s*(\d+) fail/m)?.[1] ?? 0) };
}
const correct = run(path.join(T, "correct/src/index.ts"));
const bugs = ["b1", "b2", "b3"].map((b) => { const r = run(path.join(T, `bug-${b}.ts`)); return { bug: b, caught: r.fail > correct.fail || r.pass < correct.pass }; });
// testq on the correct code: mutation score + static smells
const snap = fs.mkdtempSync(path.join(os.tmpdir(), "tw-snap-"));
fs.mkdirSync(path.join(snap, "src"));
fs.copyFileSync(path.join(T, "correct/src/index.ts"), path.join(snap, "src", "index.ts"));
fs.cpSync(testDir, path.join(snap, "test"), { recursive: true });
const q = JSON.parse(Bun.spawnSync(["bun", path.join(T, "../../testq.ts"), snap, path.join(T, "correct/src"), "40"], { stdout: "pipe" }).stdout.toString() || "{}");
console.log(JSON.stringify({
  ...q,
  bugsCaught: bugs.filter((b) => b.caught).length, bugDetail: bugs.map((b) => `${b.bug}:${b.caught ? "caught" : "missed"}`).join(" "),
  failOnCorrect: correct.fail, failOnCorrectShare: correct.pass + correct.fail ? +(correct.fail / (correct.pass + correct.fail)).toFixed(2) : 1,
}));
