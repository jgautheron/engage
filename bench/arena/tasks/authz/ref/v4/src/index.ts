export type Role = "admin" | "member";
export interface User { id: string; name: string }
export interface Team { id: string; ownerId: string; plan: "hobby" | "pro"; members: { userId: string; role: Role }[] }
export interface Project { id: string; teamId: string; name: string; password?: string }
export interface Seed { users: User[]; teams: Team[]; projects: Project[] }
const V = 4;
export function createService(seed: Seed) {
  const s: Seed = JSON.parse(JSON.stringify(seed));
  const deleted = new Set<string>();
  const user = (id: string) => { const u = s.users.find((x) => x.id === id); if (!u) throw new Error("not found"); return u; };
  const team = (id: string) => { const t = s.teams.find((x) => x.id === id); if (!t) throw new Error("not found"); return t; };
  const project = (id: string) => { const p = s.projects.find((x) => x.id === id); if (!p || deleted.has(id)) throw new Error("not found"); return p; };
  const role = (t: Team, uid: string) => (t.ownerId === uid ? "owner" : t.members.find((m) => m.userId === uid)?.role ?? null);
  const need = (ok: boolean) => { if (!ok) throw new Error("forbidden"); };
  const copy = (p: Project) => ({ ...p });
  const svc: any = {
    getProject(v: string, pid: string) { user(v); const p = project(pid); need(role(team(p.teamId), v) !== null); return copy(p); },
    renameProject(v: string, pid: string, name: string) { user(v); const p = project(pid); const r = role(team(p.teamId), v); need(r === "owner" || r === "admin"); p.name = name; return copy(p); },
    deleteProject(v: string, pid: string) { user(v); const p = project(pid); need(role(team(p.teamId), v) === "owner"); deleted.add(pid); },
    setPasswordProtection(v: string, pid: string, pw: string) { user(v); const p = project(pid); const t = team(p.teamId); const r = role(t, v); need(V >= 3 ? r === "owner" : r === "owner" || r === "admin"); if (t.plan !== "pro") throw new Error("upgrade required"); p.password = pw; },
  };
  if (V >= 2) svc.transferProject = (v: string, pid: string, tid: string) => { user(v); const p = project(pid); const target = team(tid); need(role(team(p.teamId), v) === "owner"); const r = role(target, v); need(r === "owner" || r === "admin"); p.teamId = tid; return copy(p); };
  if (V >= 3) svc.removePasswordProtection = (v: string, pid: string) => { user(v); const p = project(pid); const t = team(p.teamId); need(role(t, v) === "owner"); if (t.plan !== "pro") throw new Error("upgrade required"); delete p.password; };
  if (V >= 4) {
    svc.listProjects = (v: string, tid: string) => { user(v); const t = team(tid); need(role(t, v) !== null); return s.projects.filter((p) => p.teamId === tid && !deleted.has(p.id)).sort((a, b) => (a.id < b.id ? -1 : 1)).map(copy); };
    svc.addMember = (v: string, tid: string, uid: string, r: Role) => { user(v); const t = team(tid); user(uid); const vr = role(t, v); need(vr === "owner" || vr === "admin"); need(r !== "admin" || vr === "owner"); if (role(t, uid) !== null) throw new Error("already a member"); t.members.push({ userId: uid, role: r }); };
  }
  return svc;
}
