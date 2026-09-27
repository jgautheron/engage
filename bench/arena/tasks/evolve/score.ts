// bun score.ts <dir> <version> → {"pass","total","failed"} over every case introduced at or before <version>
const [dir, vs] = process.argv.slice(2);
const V = +vs;
const m = await import(`${dir}/src/index.ts`).catch(() => import(`${dir}/.build/index.js`));

const users = [
  { id: "vic", role: "viewer" }, { id: "eve", role: "editor" }, { id: "ada", role: "admin" }, { id: "own", role: "viewer" },
];
const flat = { users, resources: [{ id: "r1", ownerId: "zed" }, { id: "r2", ownerId: "own" }] };
// root ← mid ← leaf ; side (no parent) ; loop1 ↔ loop2 ; under → loop1
const tree = {
  users,
  resources: [
    { id: "root", ownerId: "zed" }, { id: "mid", ownerId: "zed", parentId: "root" }, { id: "leaf", ownerId: "eve", parentId: "mid" },
    { id: "side", ownerId: "zed" }, { id: "loop1", ownerId: "zed", parentId: "loop2" }, { id: "loop2", ownerId: "zed", parentId: "loop1" },
    { id: "under", ownerId: "zed", parentId: "loop1" }, { id: "orphan", ownerId: "zed", parentId: "ghost" },
  ],
  grants: [{ userId: "vic", resourceId: "root", actions: ["write"] }, { userId: "vic", resourceId: "side", actions: ["delete"] }],
};
const denied = { ...tree, grants: [...tree.grants, { userId: "eve", resourceId: "mid", actions: ["delete"] }],
  denies: [{ userId: "vic", resourceId: "mid", actions: ["write", "read"] }, { userId: "eve", resourceId: "leaf", actions: ["delete"] }, { userId: "ada", resourceId: "root", actions: ["read"] }] };

const throws = (f: () => unknown, re: RegExp) => { try { f(); return false; } catch (e) { return re.test(String((e as Error).message)); } };
const can = (c: any, u: string, a: string, r: string) => m.can(c, u, a, r);
const why = (c: any, u: string, a: string, r: string) => m.explain(c, u, a, r);

const cases: [number, string, () => boolean][] = [
  [1, "viewer reads", () => can(flat, "vic", "read", "r1") === true],
  [1, "viewer can't write", () => can(flat, "vic", "write", "r1") === false],
  [1, "editor writes", () => can(flat, "eve", "write", "r1") === true],
  [1, "editor can't delete", () => can(flat, "eve", "delete", "r1") === false],
  [1, "admin deletes", () => can(flat, "ada", "delete", "r1") === true],
  [1, "unknown user", () => throws(() => can(flat, "nobody", "read", "r1"), /unknown user/)],
  [1, "unknown resource", () => throws(() => can(flat, "vic", "read", "nope"), /unknown resource/)],
  [2, "owner deletes own", () => can(flat, "own", "delete", "r2") === true],
  [2, "owner writes own (viewer role)", () => can(flat, "own", "write", "r2") === true],
  [2, "owner shares own", () => can(flat, "own", "share", "r2") === true],
  [2, "editor can't share", () => can(flat, "eve", "share", "r1") === false],
  [2, "admin shares", () => can(flat, "ada", "share", "r1") === true],
  [2, "non-owner viewer can't delete", () => can(flat, "own", "delete", "r1") === false],
  [3, "grant on root reaches leaf", () => can(tree, "vic", "write", "leaf") === true],
  [3, "grant on root reaches mid", () => can(tree, "vic", "write", "mid") === true],
  [3, "grant doesn't leak sideways", () => can(tree, "vic", "delete", "root") === false],
  [3, "direct grant", () => can(tree, "vic", "delete", "side") === true],
  [3, "grant is per-user", () => can(tree, "eve", "delete", "mid") === false],
  [3, "cycle throws", () => throws(() => can(tree, "vic", "read", "loop1"), /cycle/)],
  [3, "under a cycle throws", () => throws(() => can(tree, "vic", "read", "under"), /cycle/)],
  [3, "missing parent throws", () => throws(() => can(tree, "vic", "read", "orphan"), /unknown resource/)],
  [3, "roles still apply in trees", () => can(tree, "eve", "write", "side") === true],
  [3, "ownership still applies in trees", () => can(tree, "eve", "delete", "leaf") === true],
  [4, "deny on ancestor blocks grant", () => can(denied, "vic", "write", "leaf") === false],
  [4, "deny blocks role", () => can(denied, "vic", "read", "mid") === false],
  [4, "deny overrides owner", () => can(denied, "eve", "delete", "leaf") === false],
  [4, "deny doesn't reach sideways", () => can(denied, "vic", "read", "side") === true],
  [4, "admin ignores deny", () => can(denied, "ada", "read", "leaf") === true],
  [4, "explain admin", () => why(denied, "ada", "read", "leaf").reason === "admin"],
  [4, "explain denied", () => { const x = why(denied, "vic", "write", "leaf"); return x.reason === "denied" && x.allowed === false; }],
  [4, "explain owner", () => why(tree, "eve", "delete", "leaf").reason === "owner"],
  [4, "explain grant", () => why(tree, "vic", "delete", "side").reason === "grant"],
  [4, "explain inherited-grant", () => why(tree, "vic", "write", "leaf").reason === "inherited-grant"],
  [4, "explain inherited over role", () => why(denied, "eve", "delete", "mid").reason === "grant"],
  [4, "explain role", () => why(flat, "eve", "write", "r1").reason === "role"],
  [4, "explain no-rule", () => { const x = why(flat, "vic", "delete", "r1"); return x.reason === "no-rule" && x.allowed === false; }],
  [4, "explain throws like can", () => throws(() => why(tree, "vic", "read", "loop2"), /cycle/) && throws(() => why(flat, "zz", "read", "r1"), /unknown user/)],
  [4, "explain agrees with can everywhere", () => {
    const acts = V >= 5 ? ["read", "write", "delete", "share", "comment"] : ["read", "write", "delete", "share"];
    return ["vic", "eve", "ada", "own"].every((u) => ["root", "mid", "leaf", "side"].every((r) => acts.every((a) => why(denied, u, a, r).allowed === can(denied, u, a, r))));
  }],
  [5, "viewer comments", () => can(flat, "vic", "comment", "r1") === true],
  [5, "comment follows inherited read grant", () => can({ ...tree, grants: [{ userId: "own", resourceId: "root", actions: ["read"] }], users: users.map((u) => u.id === "own" ? { ...u, role: "viewer" } : u) }, "own", "comment", "leaf") === true],
  [5, "read deny blocks comment", () => can(denied, "vic", "comment", "leaf") === false],
  [5, "comment reason = read reason", () => ["vic", "eve", "own"].every((u) => ["root", "leaf", "side"].every((r) => why(denied, u, "comment", r).reason === why(denied, u, "read", r).reason))],
  [5, "owner comments", () => can(flat, "own", "comment", "r2") === true],
];
const failed: string[] = [];
let total = 0;
for (const [v, name, f] of cases) {
  if (v > V) continue;
  total++;
  let ok = false; try { ok = f(); } catch { ok = false; }
  if (!ok) failed.push(`v${v}: ${name}`);
}
console.log(JSON.stringify({ pass: total - failed.length, total, failed }));
