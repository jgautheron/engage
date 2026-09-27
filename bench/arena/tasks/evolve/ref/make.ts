// Reference for version V (1..5); writes ref/v{V}/src/index.ts.
const V = +process.argv[2];
const actions = ['"read"', '"write"', '"delete"', V >= 2 && '"share"', V >= 5 && '"comment"'].filter(Boolean).join(" | ");
const src = `export type Role = "viewer" | "editor" | "admin";
export type Action = ${actions};
export interface User { id: string; role: Role }
export interface Resource { id: string; ownerId: string${V >= 3 ? "; parentId?: string" : ""} }
type Rule = { userId: string; resourceId: string; actions: Action[] };
export interface Context { users: User[]; resources: Resource[]${V >= 3 ? "; grants?: Rule[]" : ""}${V >= 4 ? "; denies?: Rule[]" : ""} }
export type Reason = "admin" | "denied" | "owner" | "grant" | "inherited-grant" | "role" | "no-rule";
const ROLE: Record<Role, string[]> = { viewer: ["read"], editor: ["read", "write"], admin: [] };
const find = <T extends { id: string }>(xs: T[], id: string, what: string) => { const x = xs.find((y) => y.id === id); if (!x) throw new Error("unknown " + what); return x; };
function ancestors(ctx: Context, r: Resource): Resource[] {
  const out: Resource[] = []; const seen = new Set([r.id]); let cur: Resource = r;
  while (${V >= 3 ? "cur.parentId" : "false"}) {
    const p = find(ctx.resources, (cur as any).parentId, "resource");
    if (seen.has(p.id)) throw new Error("cycle");
    seen.add(p.id); out.push(p); cur = p;
  }
  return out;
}
export function explain(ctx: Context, userId: string, action: Action, resourceId: string): { allowed: boolean; reason: Reason } {
  const u = find(ctx.users, userId, "user"); const r = find(ctx.resources, resourceId, "resource");
  const up = ancestors(ctx, r);
  const a = ${V >= 5 ? `(action as string) === "comment" ? "read" : action` : "action"};
  const has = (rules: Rule[] | undefined, ids: string[]) => (rules ?? []).some((g) => g.userId === userId && ids.includes(g.resourceId) && (g.actions as string[]).includes(a));
  if (u.role === "admin") return { allowed: true, reason: "admin" };
  ${V >= 4 ? 'if (has(ctx.denies, [r.id, ...up.map((x) => x.id)])) return { allowed: false, reason: "denied" };' : ""}
  ${V >= 2 ? 'if (r.ownerId === userId) return { allowed: true, reason: "owner" };' : ""}
  ${V >= 3 ? 'if (has(ctx.grants, [r.id])) return { allowed: true, reason: "grant" };\n  if (has(ctx.grants, up.map((x) => x.id))) return { allowed: true, reason: "inherited-grant" };' : ""}
  if (ROLE[u.role].includes(a)) return { allowed: true, reason: "role" };
  return { allowed: false, reason: "no-rule" };
}
export function can(ctx: Context, userId: string, action: Action, resourceId: string): boolean { return explain(ctx, userId, action, resourceId).allowed; }
`;
await Bun.write(`${import.meta.dir}/v${V}/src/index.ts`, src);
