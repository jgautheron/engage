// bun score.ts <dir> <version> [prevDir] → {"pass","total","failed"} over every case introduced at or before <version>.
// prevDir (the same project one iteration earlier) is used by v10 to check old exports still import.
const [dir, vs, prevDir] = process.argv.slice(2);
const V = +vs;
const load = (d: string) => import(`${d}/src/index.ts`).catch(() => import(`${d}/.build/index.js`));
const m = await load(dir);
const prev = prevDir ? await load(prevDir).catch(() => null) : null;

const T = () => m.createTracker();
const throws = (f: () => unknown, re: RegExp) => { try { f(); return false; } catch (e) { return re.test(String((e as Error).message)); } };
const ids = (ts: any[]) => ts.map((t) => t.id).join(",");
const hist2 = (es: any[]) => es.map((e: any) => e.type).join();
const hist = (t: any, id: number) => t.history(id).map((e: any) => `${e.type}@${e.seq}`).join(",");

const cases: [number, string, () => boolean][] = [
  // v1
  [1, "add + ids", () => { const t = T(); t.addTask("a"); const b = t.addTask("  b "); return b.id === 2 && b.title === "b" && b.status === "todo"; }],
  [1, "empty title", () => throws(() => T().addTask("   "), /empty title/)],
  [1, "list in id order", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.addTask("c"); return ids(t.list()) === "1,2,3"; }],
  [1, "complete", () => { const t = T(); t.addTask("a"); return t.complete(1).status === "done" && t.get(1).status === "done"; }],
  [1, "complete twice is no-op", () => { const t = T(); t.addTask("a"); t.complete(1); return t.complete(1).status === "done"; }],
  [1, "unknown task", () => { const t = T(); return throws(() => t.get(9), /unknown task/) && throws(() => t.complete(9), /unknown task/); }],
  [1, "returns copies", () => { const t = T(); const a = t.addTask("a"); a.title = "x"; t.list()[0].title = "y"; return t.get(1).title === "a"; }],
  // v2
  [2, "default priority", () => { const t = T(); const p = t.addTask("a").priority; return V >= 10 ? p === 3 : p === "normal"; }],
  [2, "invalid priority", () => throws(() => T().addTask("a", { priority: "urgent" }), /invalid priority/)],
  [2, "sorted by priority then id", () => { const t = T(); t.addTask("a", { priority: "low" }); t.addTask("b", { priority: "high" }); t.addTask("c"); t.addTask("d", { priority: "high" }); return ids(t.list()) === "2,4,3,1"; }],
  [2, "filter status + priority", () => { const t = T(); t.addTask("a", { priority: "high" }); t.addTask("b", { priority: "high" }); t.addTask("c"); t.complete(2); return ids(t.list({ status: "todo", priority: "high" })) === "1"; }],
  // v3
  [3, "invalid date", () => { const t = T(); return throws(() => t.addTask("a", { due: "2026-02-30" }), /invalid date/) && throws(() => t.addTask("a", { due: "26-1-1" }), /invalid date/); }],
  [3, "overdue", () => { const t = T(); t.addTask("a", { due: "2026-03-05" }); t.addTask("b", { due: "2026-03-01" }); t.addTask("c", { due: "2026-03-10" }); t.addTask("d", { due: "2026-03-02" }); t.complete(4); return ids(t.overdue("2026-03-06")) === "2,1"; }],
  [3, "sort by due, undated last", () => { const t = T(); t.addTask("a"); t.addTask("b", { due: "2026-05-01" }); t.addTask("c", { due: "2026-04-01", priority: "low" }); t.addTask("d", { due: "2026-04-01", priority: "high" }); return ids(t.list({ sort: "due" })) === "4,3,2,1"; }],
  [3, "default order unchanged", () => { const t = T(); t.addTask("a", { due: "2026-01-01", priority: "low" }); t.addTask("b"); return ids(t.list()) === "2,1"; }],
  // v4
  [4, "tags normalised", () => T().addTask("a", { tags: [" Home", "work", "home", ""] }).tags.join() === "home,work"],
  [4, "tags default empty", () => Array.isArray(T().addTask("a").tags) && T().addTask("a").tags.length === 0],
  [4, "tag/untag", () => { const t = T(); t.addTask("a", { tags: ["x"] }); t.tag(1, " B "); t.untag(1, "X"); t.untag(1, "zzz"); return t.get(1).tags.join() === "b"; }],
  [4, "filter by tag", () => { const t = T(); t.addTask("a", { tags: ["work"] }); t.addTask("b"); return ids(t.list({ tag: "WORK" })) === "1"; }],
  // v5
  [5, "undo add restores next id", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.undo(); return t.list().length === 1 && t.addTask("c").id === 2; }],
  [5, "undo complete", () => { const t = T(); t.addTask("a"); t.complete(1); t.undo(); return t.get(1).status === "todo"; }],
  [5, "undo tag + untag", () => { const t = T(); t.addTask("a", { tags: ["x"] }); t.tag(1, "y"); t.untag(1, "x"); t.undo(); const mid = t.get(1).tags.join(); t.undo(); return mid === "x,y" && t.get(1).tags.join() === "x"; }],
  [5, "undo empty = false", () => { const t = T(); return t.undo() === false; }],
  [5, "failed calls not recorded", () => { const t = T(); t.addTask("a"); try { t.complete(9); } catch {} return t.undo() === true && t.list().length === 0 && t.undo() === false; }],
  // v6
  [6, "projects", () => { const t = T(); const p = t.createProject("Home"); t.createProject("Work"); return p.id === "p1" && t.projects().map((x: any) => x.id).join() === "p1,p2"; }],
  [6, "duplicate project", () => { const t = T(); t.createProject("Home"); return throws(() => t.createProject(" home "), /duplicate project/); }],
  [6, "task in project + filter", () => { const t = T(); t.createProject("H"); t.addTask("a", { project: "p1" }); t.addTask("b"); return ids(t.list({ project: "p1" })) === "1" && throws(() => t.addTask("c", { project: "p9" }), /unknown project/); }],
  [6, "delete project detaches tasks", () => { const t = T(); t.createProject("H"); t.addTask("a", { project: "p1" }); t.deleteProject("p1"); return t.get(1).project === undefined && t.projects().length === 0 && throws(() => t.deleteProject("p1"), /unknown project/); }],
  [6, "undo project ops", () => { const t = T(); t.createProject("H"); t.addTask("a", { project: "p1" }); t.deleteProject("p1"); t.undo(); const back = t.get(1).project === "p1" && t.projects().length === 1; t.undo(); t.undo(); return back && t.projects().length === 0 && t.createProject("Z").id === "p1"; }],
  // v7
  [7, "round trip", () => { const t = T(); t.createProject("H"); t.addTask("a", { priority: "high", due: "2026-01-02", tags: ["x"], project: "p1" }); t.addTask("b"); t.complete(2); const u = m.importTracker(t.export()); return JSON.stringify(u.list()) === JSON.stringify(t.list()) && JSON.stringify(u.projects()) === JSON.stringify(t.projects()); }],
  [7, "next ids survive", () => { const t = T(); t.createProject("H"); t.addTask("a"); t.addTask("b"); const u = m.importTracker(t.export()); return u.addTask("c").id === 3 && u.createProject("Z").id === "p2"; }],
  [7, "import has empty undo", () => { const t = T(); t.addTask("a"); return m.importTracker(t.export()).undo() === false; }],
  [7, "invalid data", () => throws(() => m.importTracker("{nope"), /invalid data/) && throws(() => m.importTracker('{"x":1}'), /invalid data/)],
  // v8
  [8, "subtasks hidden from list", () => { const t = T(); t.addTask("a"); t.addTask("b", { parent: 1 }); t.addTask("c", { parent: 2 }); return ids(t.list()) === "1" && ids(t.list({ all: true })) === "1,2,3"; }],
  [8, "subtasks()", () => { const t = T(); t.addTask("a"); t.addTask("b", { parent: 1 }); t.addTask("c", { parent: 1 }); t.addTask("d", { parent: 2 }); return ids(t.subtasks(1)) === "2,3" && throws(() => t.addTask("x", { parent: 99 }), /unknown task/); }],
  [8, "open subtasks block complete (deep)", () => { const t = T(); t.addTask("a"); t.addTask("b", { parent: 1 }); t.addTask("c", { parent: 2 }); t.complete(2 + 1); return throws(() => t.complete(1), /open subtasks/) && (t.complete(2), t.complete(1).status === "done"); }],
  [8, "subtasks export + undo", () => { const t = T(); t.addTask("a"); t.addTask("b", { parent: 1 }); const u = m.importTracker(t.export()); t.undo(); return u.subtasks(1).length === 1 && t.subtasks(1).length === 0; }],
  // v9
  [9, "history + seq", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.tag(1, "x"); t.complete(1); t.reopen(1); return hist(t, 1) === "created@1,tagged@3,completed@4,reopened@5"; }],
  [9, "no-op calls record nothing", () => { const t = T(); t.addTask("a", { tags: ["x"] }); t.tag(1, "X"); t.untag(1, "nope"); t.reopen(1); t.complete(1); t.complete(1); return hist(t, 1) === "created@1,completed@2"; }],
  [9, "unprojected event", () => { const t = T(); t.createProject("H"); t.addTask("a", { project: "p1" }); t.deleteProject("p1"); return hist(t, 1) === "created@1,unprojected@2"; }],
  [9, "undo rolls back events + counter", () => { const t = T(); t.addTask("a"); t.complete(1); t.undo(); t.tag(1, "z"); return hist(t, 1) === "created@1,tagged@2"; }],
  [9, "history survives export", () => { const t = T(); t.addTask("a"); t.complete(1); const u = m.importTracker(t.export()); u.reopen(1); return hist(u, 1) === "created@1,completed@2,reopened@3"; }],
  [9, "reopen undoable", () => { const t = T(); t.addTask("a"); t.complete(1); t.reopen(1); t.undo(); return t.get(1).status === "done"; }],
  // v10
  [10, "numeric priority + legacy names", () => { const t = T(); return t.addTask("a", { priority: 2 }).priority === 2 && t.addTask("b", { priority: "high" }).priority === 1 && t.addTask("c").priority === 3 && t.addTask("d", { priority: "low" }).priority === 5; }],
  [10, "invalid numeric", () => { const t = T(); return throws(() => t.addTask("a", { priority: 0 }), /invalid priority/) && throws(() => t.addTask("a", { priority: 2.5 }), /invalid priority/); }],
  [10, "sort numeric", () => { const t = T(); t.addTask("a", { priority: 4 }); t.addTask("b", { priority: 2 }); t.addTask("c", { priority: "high" }); return ids(t.list()) === "3,2,1"; }],
  [10, "filter accepts both", () => { const t = T(); t.addTask("a", { priority: 1 }); t.addTask("b"); return ids(t.list({ priority: "high" })) === "1" && ids(t.list({ priority: 3 })) === "2"; }],
  [10, "imports previous version's export", () => {
    if (!prev?.createTracker) return false;
    const o = prev.createTracker(); o.addTask("a", { priority: "high" }); o.addTask("b", { priority: "low" }); o.addTask("c");
    const u = m.importTracker(o.export());
    return u.get(1).priority === 1 && u.get(2).priority === 5 && u.get(3).priority === 3 && ids(u.list()) === "1,3,2";
  }],
  // v11
  [11, "repeat needs due", () => throws(() => T().addTask("a", { repeat: "daily" }), /repeat needs due/)],
  [11, "complete spawns next", () => { const t = T(); t.createProject("H"); t.addTask("a", { due: "2026-01-31", repeat: "daily", tags: ["x"], priority: 2, project: "p1" }); const c = t.complete(1); const n = t.get(2); return c.id === 1 && n.status === "todo" && n.due === "2026-02-01" && n.repeat === "daily" && n.tags.join() === "x" && n.priority === 2 && n.project === "p1"; }],
  [11, "weekly across month", () => { const t = T(); t.addTask("a", { due: "2026-12-29", repeat: "weekly" }); t.complete(1); return t.get(2).due === "2027-01-05"; }],
  [11, "spawn has created event", () => { const t = T(); t.addTask("a", { due: "2026-01-01", repeat: "daily" }); t.complete(1); return hist(t, 2) === "created@3"; }],
  [11, "one undo reverts both", () => { const t = T(); t.addTask("a", { due: "2026-01-01", repeat: "daily" }); t.complete(1); t.undo(); return t.list({ all: true }).length === 1 && t.get(1).status === "todo" && t.addTask("b").id === 2; }],
  [11, "spawn keeps parent", () => { const t = T(); t.addTask("p"); t.addTask("a", { parent: 1, due: "2026-01-01", repeat: "daily" }); t.complete(2); return t.get(3).parent === 1 && throws(() => t.complete(1), /open subtasks/); }],
  // v13
  [13, "events carry actor", () => { const t = T(); t.addTask("a"); t.setActor("ann"); t.complete(1); return t.history(1).map((e: any) => `${e.type}:${e.actor}`).join() === "created:system,completed:ann"; }],
  [13, "setActor not undoable", () => { const t = T(); t.addTask("a"); t.setActor("bo"); t.undo(); return t.list().length === 0 && (t.addTask("b"), t.history(1)[0].actor === "bo"); }],
  [13, "actor on every mutation event", () => { const t = T(); t.setActor("cy"); t.createProject("H"); t.addTask("a", { project: "p1", tags: ["x"] }); t.tag(1, "y"); t.untag(1, "x"); t.complete(1); t.reopen(1); t.deleteProject("p1"); return t.history(1).every((e: any) => e.actor === "cy") && t.history(1).length === 6; }],
  [13, "actor survives export", () => { const t = T(); t.setActor("di"); t.addTask("a"); return m.importTracker(t.export()).history(1)[0].actor === "di"; }],
  // v14
  [14, "completeMany", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.addTask("c"); return ids(t.completeMany([3, 1])) === "3,1" && t.get(2).status === "todo" && t.get(1).status === "done"; }],
  [14, "completeMany all-or-nothing", () => { const t = T(); t.addTask("a"); t.addTask("b"); return throws(() => t.completeMany([1, 9]), /unknown task/) && t.get(1).status === "todo"; }],
  [14, "completeMany open subtasks rolls back", () => { const t = T(); t.addTask("a"); t.addTask("p"); t.addTask("c", { parent: 2 }); return throws(() => t.completeMany([1, 2]), /open subtasks/) && t.get(1).status === "todo" && t.history(1).length === 1; }],
  [14, "completeMany one undo + recurring", () => { const t = T(); t.addTask("a"); t.addTask("r", { due: "2026-01-01", repeat: "daily" }); t.completeMany([1, 2]); const spawned = t.list({ all: true }).length === 3; t.undo(); return spawned && t.list({ all: true }).length === 2 && t.get(1).status === "todo" && t.get(2).status === "todo"; }],
  // v15
  [15, "edit fields", () => { const t = T(); t.createProject("H"); t.addTask("a"); const e = t.edit(1, { title: " b ", priority: "high", due: "2026-02-03", tags: ["Y", "x"], project: "p1" }); return e.title === "b" && e.priority === 1 && e.due === "2026-02-03" && e.tags.join() === "x,y" && e.project === "p1"; }],
  [15, "edit validates, all or nothing", () => { const t = T(); t.addTask("a"); return throws(() => t.edit(1, { title: "z", due: "2026-13-01" }), /invalid date/) && t.get(1).title === "a" && throws(() => t.edit(1, { priority: 9 }), /invalid priority/) && throws(() => t.edit(1, { title: " " }), /empty title/); }],
  [15, "edit project null removes", () => { const t = T(); t.createProject("H"); t.addTask("a", { project: "p1" }); t.edit(1, { project: null }); return t.get(1).project === undefined && throws(() => t.edit(1, { project: "p9" }), /unknown project/); }],
  [15, "edited event only on change", () => { const t = T(); t.addTask("a"); t.edit(1, { title: "a" }); t.edit(1, { title: "b" }); return t.history(1).map((e: any) => e.type).join() === "created,edited"; }],
  [15, "edit one undo", () => { const t = T(); t.addTask("a", { tags: ["x"] }); t.edit(1, { title: "b", tags: [] }); t.undo(); return t.get(1).title === "a" && t.get(1).tags.join() === "x"; }],
  // v12
  [12, "stats", () => { const t = T(); t.addTask("a"); t.addTask("b", { parent: 1 }); t.addTask("c"); t.complete(2); return JSON.stringify(t.stats()) === JSON.stringify({ todo: 2, done: 1 }); }],
  // v16
  [16, "delete removes subtree", () => { const t = T(); t.addTask("a"); t.addTask("b", { parent: 1 }); t.addTask("c", { parent: 2 }); t.addTask("d"); t.delete(1); return ids(t.list({ all: true })) === "4" && throws(() => t.get(3), /unknown task/) && throws(() => t.history(2), /unknown task/); }],
  [16, "delete never reuses ids", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.delete(2); return t.addTask("c").id === 3 && throws(() => t.delete(9), /unknown task/); }],
  [16, "delete undo", () => { const t = T(); t.addTask("a"); t.addTask("b", { parent: 1 }); t.delete(1); t.undo(); return ids(t.list({ all: true })) === "1,2" && t.addTask("c").id === 3; }],
  // v17
  [17, "search", () => { const t = T(); t.addTask("Buy milk", { priority: "low" }); t.addTask("milk run", { parent: 1 }); t.addTask("Other"); t.addTask("MILKSHAKE", { priority: "high" }); return ids(t.search("  Milk ")) === "4,2,1"; }],
  [17, "empty query", () => throws(() => T().search("  "), /empty query/)],
  // v18
  [18, "move", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.move(2, 1); const under = ids(t.subtasks(1)) === "2"; t.move(2, null); return under && t.get(2).parent === undefined && ids(t.list()) === "1,2"; }],
  [18, "move cycle", () => { const t = T(); t.addTask("a"); t.addTask("b", { parent: 1 }); t.addTask("c", { parent: 2 }); return throws(() => t.move(1, 3), /cycle/) && throws(() => t.move(1, 1), /cycle/) && throws(() => t.move(1, 9), /unknown task/); }],
  [18, "move event + undo", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.move(2, 1); t.move(2, 1); const h = t.history(2).map((e: any) => e.type).join(); t.undo(); t.undo(); return h === "created,moved" && t.get(2).parent === undefined; }],
  // v19
  [19, "estimate validate", () => { const t = T(); return t.addTask("a", { estimate: 30 }).estimate === 30 && throws(() => t.addTask("b", { estimate: 0 }), /invalid estimate/) && throws(() => t.addTask("b", { estimate: 1.5 }), /invalid estimate/); }],
  [19, "remaining", () => { const t = T(); t.addTask("a", { estimate: 30 }); t.addTask("b", { estimate: 15, parent: 1 }); t.addTask("c", { estimate: 5 }); t.addTask("d"); t.complete(3); return t.remaining() === 45; }],
  [19, "edit estimate", () => { const t = T(); t.addTask("a", { estimate: 30 }); t.edit(1, { estimate: 10 }); const ten = t.get(1).estimate === 10; t.edit(1, { estimate: null }); return ten && t.get(1).estimate === undefined && throws(() => t.edit(1, { estimate: -2 }), /invalid estimate/); }],
  // v20
  [20, "archive rules", () => { const t = T(); t.addTask("a"); t.addTask("b", { parent: 1 }); t.complete(2); return throws(() => t.archive(1), /not done/) && throws(() => t.archive(2), /is a subtask/); }],
  [20, "archive hides everywhere", () => { const t = T(); t.addTask("a", { due: "2026-01-01" }); t.addTask("b", { parent: 1, estimate: 5 }); t.complete(2); t.complete(1); t.addTask("a2"); t.archive(1); return ids(t.list({ all: true })) === "3" && t.search("a").length === 1 && JSON.stringify(t.stats()) === JSON.stringify({ todo: 1, done: 0 }) && t.get(1).archived === true; }],
  [20, "archive events, undo, export", () => { const t = T(); t.addTask("a"); t.complete(1); t.archive(1); t.archive(1); const u = m.importTracker(t.export()); t.unarchive(1); t.undo(); return t.history(1).map((e: any) => e.type).join() === "created,completed,archived" && t.get(1).archived === true && u.list().length === 0; }],
  // v21
  [21, "comments", () => { const t = T(); t.addTask("a"); t.comment(1, "  hi "); t.setActor("ann"); t.comment(1, "yo"); return JSON.stringify(t.comments(1)) === JSON.stringify([{ text: "hi", actor: "system" }, { text: "yo", actor: "ann" }]) && throws(() => t.comment(1, " "), /empty comment/); }],
  [21, "comment event, undo, export", () => { const t = T(); t.addTask("a"); t.comment(1, "x"); t.comment(1, "y"); t.undo(); const u = m.importTracker(t.export()); return u.comments(1).length === 1 && t.history(1).map((e: any) => e.type).join() === "created,commented"; }],
  // v22
  [22, "dependencies block completion", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.addTask("c"); t.dependsOn(1, 3); t.dependsOn(1, 2); t.dependsOn(1, 2); const d = t.dependencies(1).join() === "2,3"; const blocked = throws(() => t.complete(1), /blocked/); t.complete(2); t.complete(3); return d && blocked && t.complete(1).status === "done"; }],
  [22, "dependency cycle", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.addTask("c"); t.dependsOn(1, 2); t.dependsOn(2, 3); return throws(() => t.dependsOn(3, 1), /cycle/) && throws(() => t.dependsOn(1, 1), /cycle/) && throws(() => t.dependsOn(1, 9), /unknown task/); }],
  [22, "completeMany blocked all-or-nothing", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.addTask("c"); t.dependsOn(2, 3); return throws(() => t.completeMany([1, 2]), /blocked/) && t.get(1).status === "todo"; }],
  [22, "delete drops dependency, export", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.dependsOn(1, 2); const u = m.importTracker(t.export()); t.delete(2); return t.dependencies(1).length === 0 && u.dependencies(1).join() === "2" && t.history(1).map((e: any) => e.type).join() === "created,linked"; }],
  // v23
  [23, "dueBefore + text filters", () => { const t = T(); t.addTask("Pay rent", { due: "2026-03-01" }); t.addTask("pay tax", { due: "2026-05-01" }); t.addTask("Walk", { due: "2026-01-01" }); return ids(t.list({ dueBefore: "2026-04-01", text: "PAY" })) === "1" && throws(() => t.list({ dueBefore: "2026-02-31" }), /invalid date/); }],
  // v24
  [24, "renameTag", () => { const t = T(); t.addTask("a", { tags: ["old", "z"] }); t.addTask("b", { tags: ["Old", "new"] }); t.addTask("c"); const n = t.renameTag(" OLD ", "New"); return n === 2 && t.get(1).tags.join() === "new,z" && t.get(2).tags.join() === "new" && throws(() => t.renameTag(" ", "x"), /empty tag/); }],
  [24, "renameTag events + one undo", () => { const t = T(); t.addTask("a", { tags: ["x"] }); t.addTask("b", { tags: ["x"] }); t.renameTag("x", "y"); const e = t.history(2).map((e: any) => e.type).join(); t.undo(); return e === "created,edited" && t.get(1).tags.join() === "x" && t.get(2).tags.join() === "x"; }],
  // v25
  [25, "snooze", () => { const t = T(); t.addTask("a", { due: "2026-02-27" }); t.addTask("b"); return t.snooze(1, 3).due === "2026-03-02" && throws(() => t.snooze(1, 0), /invalid days/) && throws(() => t.snooze(2, 1), /no due date/) && t.history(1).map((e: any) => e.type).join() === "created,snoozed"; }],
  // v26
  [26, "renameProject", () => { const t = T(); t.createProject("Home"); t.createProject("Work"); const r = t.renameProject("p1", "  Garden "); const dup = throws(() => t.renameProject("p1", "work"), /duplicate project/); t.renameProject("p2", "WORK"); t.undo(); return r.name === "Garden" && dup && t.projects()[1].name === "Work" && throws(() => t.renameProject("p9", "x"), /unknown project/); }],
  // v27
  [27, "redo", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.complete(1); t.undo(); t.undo(); const r = t.redo() && t.redo(); return r && t.list({ all: true }).length === 2 && t.get(1).status === "done" && t.redo() === false; }],
  [27, "new mutation clears redo", () => { const t = T(); t.addTask("a"); t.undo(); t.addTask("b"); return t.redo() === false && m.importTracker(t.export()).redo() === false; }],
  // v28
  [28, "escalate", () => { const t = T(); t.addTask("a", { due: "2026-01-01", priority: 3 }); t.addTask("b", { due: "2026-01-01", priority: 1 }); t.addTask("c", { due: "2026-09-01", priority: 4 }); t.addTask("d", { due: "2026-01-01", priority: 5 }); t.complete(4); const n = t.escalate("2026-02-01"); return n === 1 && t.get(1).priority === 2 && t.get(4).priority === 5 && throws(() => t.escalate("x"), /invalid date/); }],
  [28, "escalate events + one undo", () => { const t = T(); t.addTask("a", { due: "2026-01-01" }); t.addTask("b", { due: "2026-01-01" }); t.escalate("2026-02-01"); const e = t.history(1).map((e: any) => e.type).join(); t.undo(); return e === "created,escalated" && t.get(1).priority === 3 && t.get(2).priority === 3; }],
  // v29
  [29, "project limit blocks add", () => { const t = T(); t.createProject("H"); t.addTask("a", { project: "p1" }); t.setProjectLimit("p1", 1); return throws(() => t.addTask("b", { project: "p1" }), /project full/) && t.list().length === 1 && t.addTask("c").id === 2; }],
  [29, "limit blocks edit + reopen", () => { const t = T(); t.createProject("H"); t.addTask("a", { project: "p1" }); t.addTask("b"); t.complete(1); t.addTask("c", { project: "p1" }); t.setProjectLimit("p1", 1); return throws(() => t.edit(2, { project: "p1" }), /project full/) && t.get(2).project === undefined && throws(() => t.reopen(1), /project full/); }],
  [29, "limit validation, null, export", () => { const t = T(); t.createProject("H"); t.addTask("a", { project: "p1" }); t.addTask("b", { project: "p1" }); t.setProjectLimit("p1", 1); const u = m.importTracker(t.export()); const blocked = throws(() => u.addTask("c", { project: "p1" }), /project full/); t.setProjectLimit("p1", null); return blocked && t.addTask("c", { project: "p1" }).id === 3 && throws(() => t.setProjectLimit("p1", 0), /invalid limit/) && throws(() => t.setProjectLimit("p9", 1), /unknown project/); }],
  // v30
  [30, "sort by title", () => { const t = T(); t.addTask("beta", { priority: "high" }); t.addTask("Alpha"); t.addTask("alpha"); t.addTask("Gamma"); return ids(t.list({ sort: "title" })) === "2,3,1,4"; }],
  // v31
  [31, "clone", () => { const t = T(); t.createProject("H"); t.addTask("p"); t.addTask("a", { priority: 2, due: "2026-01-01", tags: ["x"], project: "p1", parent: 1, estimate: 9 }); t.comment(2, "c"); t.addTask("dep"); t.dependsOn(2, 3); t.complete(3); const c = t.clone(2); return c.id === 4 && c.title === "a (copy)" && c.status === "todo" && c.priority === 2 && c.parent === 1 && c.estimate === 9 && t.comments(4).length === 0 && t.dependencies(4).length === 0 && t.history(4).map((e: any) => e.type).join() === "created"; }],
  [31, "clone respects limit + undo", () => { const t = T(); t.createProject("H"); t.addTask("a", { project: "p1" }); t.setProjectLimit("p1", 1); const full = throws(() => t.clone(1), /project full/); t.setProjectLimit("p1", null); t.clone(1); t.undo(); return full && t.list().length === 1; }],
  // v32
  [32, "report", () => { const t = T(); t.addTask("a", { due: "2026-01-01" }); t.addTask("b", { due: "2026-02-01", parent: 1 }); t.addTask("c", { due: "2026-03-01" }); t.addTask("d"); t.complete(4); return JSON.stringify(t.report("2026-02-01")) === JSON.stringify({ todo: 3, done: 1, overdue: 1, dueToday: 1 }) && throws(() => t.report("nope"), /invalid date/); }],
  // v33
  [33, "locked task rejects changes", () => { const t = T(); t.addTask("a", { due: "2026-01-01" }); t.addTask("b"); t.lock(1); return [() => t.complete(1), () => t.tag(1, "x"), () => t.edit(1, { title: "z" }), () => t.move(1, 2), () => t.snooze(1, 1), () => t.comment(1, "c"), () => t.dependsOn(1, 2), () => t.delete(1)].every((f) => throws(f, /locked/)) && t.get(1).title === "a" && t.list().length === 2; }],
  [33, "locked subtask blocks delete; unknown first", () => { const t = T(); t.addTask("a"); t.addTask("b", { parent: 1 }); t.lock(2); return throws(() => t.delete(1), /locked/) && t.list({ all: true }).length === 2 && throws(() => t.complete(9), /unknown task/); }],
  [33, "escalate + renameTag skip locked", () => { const t = T(); t.addTask("a", { due: "2026-01-01", tags: ["x"] }); t.addTask("b", { due: "2026-01-01", tags: ["x"] }); t.lock(1); return t.escalate("2026-02-01") === 1 && t.renameTag("x", "y") === 1 && t.get(1).priority === 3 && t.get(1).tags.join() === "x"; }],
  [33, "unlock, events, undo", () => { const t = T(); t.addTask("a"); t.lock(1); t.lock(1); t.unlock(1); t.complete(1); t.undo(); t.undo(); return throws(() => t.complete(1), /locked/) && t.history(1).map((e: any) => e.type).join() === "created,locked"; }],
  // v34
  [34, "history filter", () => { const t = T(); t.addTask("a"); t.setActor("ann"); t.tag(1, "x"); t.complete(1); t.setActor("bo"); t.reopen(1); return hist2(t.history(1, { actor: "ann" })) === "tagged,completed" && hist2(t.history(1, { type: "reopened", actor: "bo" })) === "reopened" && t.history(1).length === 4; }],
  // v35
  [35, "tagMany", () => { const t = T(); t.addTask("a"); t.addTask("b"); return t.tagMany([2, 1], " X ").map((x: any) => x.id).join() === "2,1" && t.get(1).tags.join() === "x"; }],
  [35, "tagMany all-or-nothing + one undo", () => { const t = T(); t.addTask("a"); t.addTask("b"); t.lock(2); const e = throws(() => t.tagMany([1, 2], "x"), /locked/) && t.get(1).tags.length === 0; t.unlock(2); t.tagMany([1, 2], "y"); t.undo(); return e && t.get(1).tags.length === 0 && t.get(2).tags.length === 0; }],
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
