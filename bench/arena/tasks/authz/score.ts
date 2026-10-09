// bun score.ts <dir> <version> [prevDir] → {"pass","total","failed"} over every case introduced at or before <version>
const [dir, vs] = process.argv.slice(2);
const V = +vs;
const m = await import(`${dir}/src/index.ts`).catch(() => import(`${dir}/.build/index.js`));
const seed = () => ({
  users: ["own", "adm", "mem", "out", "own2", "own3"].map((id) => ({ id, name: id })),
  teams: [
    { id: "t1", ownerId: "own", plan: "pro", members: [{ userId: "adm", role: "admin" }, { userId: "mem", role: "member" }] },
    { id: "t2", ownerId: "own2", plan: "hobby", members: [{ userId: "mem", role: "member" }] },
    { id: "t3", ownerId: "own3", plan: "pro", members: [{ userId: "own", role: "admin" }] },
  ],
  projects: [{ id: "p1", teamId: "t1", name: "one" }, { id: "p2", teamId: "t2", name: "two" }, { id: "p3", teamId: "t1", name: "three" }],
});
const S = () => m.createService(seed());
const err = (f: () => unknown, re: RegExp) => { try { f(); return false; } catch (e) { return re.test(String((e as Error).message)); } };
const ok = (f: () => unknown) => { try { f(); return true; } catch { return false; } };
const cases: [number, string, () => boolean, number?][] = [ // [from version, name, check, until version]
  [1, "get: owner, admin, member allowed", () => { const s = S(); return ["own", "adm", "mem"].every((u) => s.getProject(u, "p1").id === "p1"); }],
  [1, "get: outsider forbidden", () => err(() => S().getProject("out", "p1"), /forbidden/)],
  [1, "get: other team's member forbidden", () => err(() => S().getProject("own2", "p1"), /forbidden/)],
  [1, "get: unknown project / viewer not found", () => err(() => S().getProject("own", "nope"), /not found/) && err(() => S().getProject("ghost", "p1"), /not found/)],
  [1, "get: returns a copy", () => { const s = S(); const p = s.getProject("own", "p1"); p.name = "x"; return s.getProject("own", "p1").name === "one"; }],
  [1, "rename: admin and owner allowed", () => { const s = S(); return s.renameProject("adm", "p1", "A").name === "A" && s.renameProject("own", "p1", "B").name === "B"; }],
  [1, "rename: member and outsider forbidden", () => err(() => S().renameProject("mem", "p1", "x"), /forbidden/) && err(() => S().renameProject("out", "p1", "x"), /forbidden/)],
  [1, "delete: admin forbidden", () => err(() => S().deleteProject("adm", "p1"), /forbidden/)],
  [1, "delete: owner allowed, then not found", () => { const s = S(); s.deleteProject("own", "p1"); return err(() => s.getProject("own", "p1"), /not found/); }],
  [1, "password: admin on pro allowed", () => ok(() => S().setPasswordProtection("adm", "p1", "pw")), 2], // reversed by v3
  [1, "password: member forbidden", () => err(() => S().setPasswordProtection("mem", "p1", "pw"), /forbidden/)],
  [1, "password: owner on hobby → upgrade required", () => err(() => S().setPasswordProtection("own2", "p2", "pw"), /upgrade required/)],
  [1, "password: outsider on hobby → forbidden before upgrade", () => err(() => S().setPasswordProtection("out", "p2", "pw"), /forbidden/)],
  [1, "password: unauthorized call leaves no password", () => { const s = S(); try { s.setPasswordProtection("mem", "p1", "pw"); } catch {} return s.getProject("own", "p1").password === undefined; }],
  [2, "transfer: source owner + target admin allowed", () => { const s = S(); return s.transferProject("own", "p1", "t3").teamId === "t3"; }],
  [2, "transfer: not a member of target forbidden", () => err(() => S().transferProject("own", "p1", "t2"), /forbidden/)],
  [2, "transfer: source admin (not owner) forbidden", () => err(() => S().transferProject("adm", "p1", "t3"), /forbidden/)],
  [2, "transfer: target owner but not source owner forbidden", () => err(() => S().transferProject("own3", "p1", "t3"), /forbidden/)],
  [2, "transfer: unknown team not found", () => err(() => S().transferProject("own", "p1", "tz"), /not found/)],
  [2, "transfer: old team member loses access", () => { const s = S(); s.transferProject("own", "p1", "t3"); return err(() => s.getProject("mem", "p1"), /forbidden/); }],
  [2, "transfer: forbidden transfer changes nothing", () => { const s = S(); try { s.transferProject("adm", "p1", "t3"); } catch {} return s.getProject("own", "p1").teamId === "t1"; }],
  [3, "password: admin now forbidden", () => err(() => S().setPasswordProtection("adm", "p1", "pw"), /forbidden/)],
  [3, "password: owner on pro allowed", () => ok(() => S().setPasswordProtection("own", "p1", "pw"))],
  [3, "remove password: owner allowed", () => { const s = S(); s.setPasswordProtection("own", "p1", "pw"); s.removePasswordProtection("own", "p1"); return s.getProject("own", "p1").password === undefined; }],
  [3, "remove password: admin and member forbidden", () => err(() => S().removePasswordProtection("adm", "p1"), /forbidden/) && err(() => S().removePasswordProtection("mem", "p1"), /forbidden/)],
  [3, "remove password: owner on hobby → upgrade required", () => err(() => S().removePasswordProtection("own2", "p2"), /upgrade required/)],
  [3, "remove password: outsider forbidden", () => err(() => S().removePasswordProtection("out", "p1"), /forbidden/)],
  [4, "list: member sees team projects in id order", () => S().listProjects("mem", "t1").map((p: any) => p.id).join() === "p1,p3"],
  [4, "list: outsider forbidden", () => err(() => S().listProjects("out", "t1"), /forbidden/)],
  [4, "list: deleted projects excluded", () => { const s = S(); s.deleteProject("own", "p1"); return s.listProjects("own", "t1").map((p: any) => p.id).join() === "p3"; }],
  [4, "add member: admin adds a member", () => { const s = S(); s.addMember("adm", "t1", "out", "member"); return s.getProject("out", "p1").id === "p1"; }],
  [4, "add member: admin can't add an admin", () => err(() => S().addMember("adm", "t1", "out", "admin"), /forbidden/)],
  [4, "add member: owner adds an admin", () => { const s = S(); s.addMember("own", "t1", "out", "admin"); return s.renameProject("out", "p1", "z").name === "z"; }],
  [4, "add member: member forbidden", () => err(() => S().addMember("mem", "t1", "out", "member"), /forbidden/)],
  [4, "add member: already a member", () => err(() => S().addMember("own", "t1", "mem", "member"), /already a member/)],
  [4, "add member: unknown user not found", () => err(() => S().addMember("own", "t1", "ghost", "member"), /not found/)],
];
const failed: string[] = [];
let total = 0;
for (const [v, name, f, until] of cases) { if (v > V || (until && V > until)) continue; total++; let r = false; try { r = f(); } catch { r = false; } if (!r) failed.push(`v${v}: ${name}`); }
console.log(JSON.stringify({ pass: total - failed.length, total, failed }));
