const V = 25;
// Reference task tracker; feature set gated by V (1..35). All mutations go through `mutate`, which
// snapshots state for undo — the design the later iterations reward.
type Status = "todo" | "done";
export interface Task { id: number; title: string; status: Status; priority?: string | number; due?: string; tags?: string[]; project?: string; parent?: number; repeat?: "daily" | "weekly"; estimate?: number; archived?: boolean; locked?: boolean }
export interface Project { id: string; name: string }
type Ev = { type: string; seq: number; actor?: string };
interface State { tasks: Task[]; projects: Project[]; nextTask: number; nextProject: number; seq: number; events: Record<number, Ev[]>; comments: Record<number, { text: string; actor: string }[]>; deps: Record<number, number[]>; limits: Record<string, number> }

const NAMES: Record<string, number> = { high: 1, normal: 3, low: 5 };
const RANK: Record<string, number> = { high: 0, normal: 1, low: 2 };
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

function normPriority(p: unknown): string | number {
  if (V >= 10) {
    if (p === undefined) return 3;
    if (typeof p === "string" && p in NAMES) return NAMES[p];
    if (typeof p === "number" && Number.isInteger(p) && p >= 1 && p <= 5) return p;
    throw new Error("invalid priority");
  }
  if (p === undefined) return "normal";
  if (p === "low" || p === "normal" || p === "high") return p;
  throw new Error("invalid priority");
}
const prioKey = (t: Task) => (V >= 10 ? (t.priority as number) : RANK[t.priority as string]);
function validDate(d: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const dt = new Date(d + "T00:00:00Z");
  return !isNaN(dt.getTime()) && dt.toISOString().slice(0, 10) === d;
}
const addDays = (d: string, n: number) => new Date(Date.parse(d + "T00:00:00Z") + n * 86400000).toISOString().slice(0, 10);
const normTags = (tags: string[]) => [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))].sort();

export function createTracker(init?: State) {
  let s: State = init ?? { tasks: [], projects: [], nextTask: 1, nextProject: 1, seq: 0, events: {}, comments: {}, deps: {}, limits: {} };
  const past: State[] = [];
  let future: State[] = [];
  const find = (id: number) => { const t = s.tasks.find((x) => x.id === id); if (!t) throw new Error("unknown task"); return t; };
  let actor = "system";
  const event = (id: number, type: string) => { if (V < 9) return; const e: Ev = { type, seq: ++s.seq }; if (V >= 13) e.actor = actor; (s.events[id] ??= []).push(e); };
  const todoIn = (st: State, pid: string) => st.tasks.filter((t) => t.project === pid && t.status === "todo").length;
  function mutate<T>(f: () => T): T {
    const before = clone(s);
    try {
      const r = f();
      if (V >= 29) for (const [pid, cap] of Object.entries(s.limits)) { const n = todoIn(s, pid); if (n > cap && n > todoIn(before, pid)) throw new Error("project full"); }
      if (V >= 5) past.push(before);
      future = [];
      return r;
    } catch (e) { s = before; throw e; }
  }
  const editable = (t: Task) => { if (V >= 33 && t.locked) throw new Error("locked"); return t; };
  const isHidden = (t: Task): boolean => V >= 20 && (!!t.archived || (t.parent !== undefined && s.tasks.some((p) => p.id === t.parent && isHidden(p))));
  const visible = () => s.tasks.filter((t) => !isHidden(t));
  const textMatch = (t: Task, q: string) => t.title.toLowerCase().includes(q.trim().toLowerCase());
  const normEstimate = (e: unknown) => { if (typeof e !== "number" || !Number.isInteger(e) || e < 1) throw new Error("invalid estimate"); return e; };
  const needDate = (d: string) => { if (!validDate(d)) throw new Error("invalid date"); };
  const out = (t: Task) => clone(t);
  const descendants = (id: number): Task[] => s.tasks.filter((t) => t.parent === id).flatMap((c) => [c, ...descendants(c.id)]);
  const sortTasks = (ts: Task[], byDue: boolean | "title" = false) => [...ts].sort((a, b) => {
    if (byDue === "title") { const ta = a.title.toLowerCase(), tb = b.title.toLowerCase(); if (ta !== tb) return ta < tb ? -1 : 1; return a.id - b.id; }
    if (byDue) { const da = a.due ?? "￿", db = b.due ?? "￿"; if (da !== db) return da < db ? -1 : 1; }
    if (V >= 2) { const d = prioKey(a) - prioKey(b); if (d) return d; }
    return a.id - b.id;
  });

  function completeOne(id: number): Task {
    const t = editable(find(id));
    if (t.status === "done") return out(t);
    if (V >= 8 && descendants(id).some((d) => d.status !== "done")) throw new Error("open subtasks");
    if (V >= 22 && (s.deps[id] ?? []).some((d) => find(d).status !== "done")) throw new Error("blocked");
    t.status = "done";
    event(id, "completed");
    if (V >= 11 && t.repeat) {
      const n: Task = { ...clone(t), id: s.nextTask++, status: "todo", due: addDays(t.due!, t.repeat === "daily" ? 1 : 7) };
      delete n.locked;
      s.tasks.push(n);
      event(n.id, "created");
    }
    return out(t);
  }
  const tracker = {
    addTask(title: string, opts: any = {}): Task {
      return mutate(() => {
        const t: Task = { id: 0, title: String(title).trim(), status: "todo" };
        if (!t.title) throw new Error("empty title");
        if (V >= 2) t.priority = normPriority(opts.priority);
        if (V >= 3 && opts.due !== undefined) { if (!validDate(opts.due)) throw new Error("invalid date"); t.due = opts.due; }
        if (V >= 4) t.tags = normTags(opts.tags ?? []);
        if (V >= 6 && opts.project !== undefined) { if (!s.projects.some((p) => p.id === opts.project)) throw new Error("unknown project"); t.project = opts.project; }
        if (V >= 8 && opts.parent !== undefined) { find(opts.parent); t.parent = opts.parent; }
        if (V >= 11 && opts.repeat !== undefined) { if (!t.due) throw new Error("repeat needs due"); t.repeat = opts.repeat; }
        if (V >= 19 && opts.estimate !== undefined) t.estimate = normEstimate(opts.estimate);
        t.id = s.nextTask++;
        s.tasks.push(t);
        event(t.id, "created");
        return out(t);
      });
    },
    get: (id: number) => out(find(id)),
    list(f: any = {}): Task[] {
      let ts = visible();
      if (V >= 8 && !f.all) ts = ts.filter((t) => t.parent === undefined);
      if (V >= 23 && f.dueBefore !== undefined) { needDate(f.dueBefore); ts = ts.filter((t) => t.due !== undefined && t.due < f.dueBefore); }
      if (V >= 23 && f.text !== undefined) ts = ts.filter((t) => textMatch(t, String(f.text)));
      if (f.status) ts = ts.filter((t) => t.status === f.status);
      if (f.priority !== undefined) { const p = normPriority(f.priority); ts = ts.filter((t) => t.priority === p); }
      if (f.tag !== undefined) ts = ts.filter((t) => t.tags?.includes(String(f.tag).trim().toLowerCase()));
      if (f.project !== undefined) ts = ts.filter((t) => t.project === f.project);
      return sortTasks(ts, V >= 30 && f.sort === "title" ? "title" : V >= 3 && f.sort === "due").map(out);
    },
    complete(id: number): Task { return mutate(() => completeOne(id)); },
  } as any;
  if (V >= 3) tracker.overdue = (today: string) => visible().filter((t) => t.status !== "done" && t.due && t.due < today)
    .sort((a, b) => (a.due! < b.due! ? -1 : a.due! > b.due! ? 1 : a.id - b.id)).map(out);
  const tagOne = (id: number, tag: string) => { const t = editable(find(id)); const n = normTags([...t.tags!, tag]); if (n.length !== t.tags!.length) { t.tags = n; event(id, "tagged"); } return out(t); };
  if (V >= 4) {
    tracker.tag = (id: number, tag: string) => mutate(() => tagOne(id, tag));
    tracker.untag = (id: number, tag: string) => mutate(() => { const t = editable(find(id)); const k = tag.trim().toLowerCase(); if (t.tags!.includes(k)) { t.tags = t.tags!.filter((x) => x !== k); event(id, "untagged"); } return out(t); });
  }
  if (V >= 5) tracker.undo = () => { const p = past.pop(); if (!p) return false; future.push(s); s = p; return true; };
  if (V >= 27) tracker.redo = () => { const n = future.pop(); if (!n) return false; past.push(s); s = n; return true; };
  if (V >= 6) {
    tracker.createProject = (name: string) => mutate(() => {
      const n = String(name).trim();
      if (s.projects.some((p) => p.name.trim().toLowerCase() === n.toLowerCase())) throw new Error("duplicate project");
      const p = { id: `p${s.nextProject++}`, name };
      s.projects.push(p);
      return clone(p);
    });
    tracker.projects = () => clone(s.projects);
    tracker.deleteProject = (id: string) => mutate(() => {
      if (!s.projects.some((p) => p.id === id)) throw new Error("unknown project");
      s.projects = s.projects.filter((p) => p.id !== id);
      for (const t of s.tasks) if (t.project === id) { delete t.project; event(t.id, "unprojected"); }
    });
  }
  if (V >= 7) tracker.export = () => JSON.stringify({ v: V >= 10 ? 2 : 1, ...s });
  if (V >= 8) tracker.subtasks = (id: number) => { find(id); return s.tasks.filter((t) => t.parent === id).map(out); };
  if (V >= 9) {
    tracker.reopen = (id: number) => mutate(() => { const t = editable(find(id)); if (t.status === "done") { t.status = "todo"; event(id, "reopened"); } return out(t); });
    tracker.history = (id: number, f: any = {}) => { find(id); return clone((s.events[id] ?? []).filter((e) => V < 34 || ((f.type === undefined || e.type === f.type) && (f.actor === undefined || e.actor === f.actor)))); };
  }
  if (V >= 13) tracker.setActor = (name: string) => { actor = name; };
  if (V >= 14) tracker.completeMany = (ids: number[]) => mutate(() => ids.map((id) => completeOne(id)));
  if (V >= 15) tracker.edit = (id: number, ch: any) => mutate(() => {
    const t = editable(find(id));
    const before = JSON.stringify(t);
    if ("title" in ch) { const x = String(ch.title).trim(); if (!x) throw new Error("empty title"); t.title = x; }
    if ("priority" in ch) t.priority = normPriority(ch.priority);
    if ("due" in ch) { if (!validDate(ch.due)) throw new Error("invalid date"); t.due = ch.due; }
    if ("tags" in ch) t.tags = normTags(ch.tags ?? []);
    if ("project" in ch) { if (ch.project === null) delete t.project; else { if (!s.projects.some((p) => p.id === ch.project)) throw new Error("unknown project"); t.project = ch.project; } }
    if (V >= 19 && "estimate" in ch) { if (ch.estimate === null) delete t.estimate; else t.estimate = normEstimate(ch.estimate); }
    if (JSON.stringify(t) !== before) event(id, "edited");
    return out(t);
  });
  if (V >= 12) tracker.stats = () => ({ todo: visible().filter((t) => t.status === "todo").length, done: visible().filter((t) => t.status === "done").length });
  if (V >= 16) tracker.delete = (id: number) => mutate(() => {
    const gone = [find(id), ...descendants(id)];
    gone.forEach(editable);
    const ids = new Set(gone.map((t) => t.id));
    s.tasks = s.tasks.filter((t) => !ids.has(t.id));
    for (const k of Object.keys(s.deps)) s.deps[+k] = s.deps[+k].filter((d) => !ids.has(d));
  });
  if (V >= 17) tracker.search = (q: string) => { if (!String(q).trim()) throw new Error("empty query"); return sortTasks(visible().filter((t) => textMatch(t, q))).map(out); };
  if (V >= 18) tracker.move = (id: number, parent: number | null) => mutate(() => {
    const t = editable(find(id));
    if (parent !== null) { find(parent); if (parent === id || descendants(id).some((d) => d.id === parent)) throw new Error("cycle"); }
    if ((t.parent ?? null) !== parent) { if (parent === null) delete t.parent; else t.parent = parent; event(id, "moved"); }
    return out(t);
  });
  if (V >= 19) tracker.remaining = () => visible().filter((t) => t.status !== "done").reduce((sum, t) => sum + (t.estimate ?? 0), 0);
  if (V >= 20) {
    tracker.archive = (id: number) => mutate(() => {
      const t = editable(find(id));
      if (t.status !== "done") throw new Error("not done");
      if (t.parent !== undefined) throw new Error("is a subtask");
      if (!t.archived) { t.archived = true; event(id, "archived"); }
      return out(t);
    });
    tracker.unarchive = (id: number) => mutate(() => { const t = editable(find(id)); if (t.archived) { delete t.archived; event(id, "unarchived"); } return out(t); });
  }
  if (V >= 21) {
    tracker.comment = (id: number, text: string) => mutate(() => {
      editable(find(id));
      const x = String(text).trim();
      if (!x) throw new Error("empty comment");
      (s.comments[id] ??= []).push({ text: x, actor });
      event(id, "commented");
    });
    tracker.comments = (id: number) => { find(id); return clone(s.comments[id] ?? []); };
  }
  if (V >= 22) {
    const reaches = (from: number, to: number): boolean => from === to || (s.deps[from] ?? []).some((d) => reaches(d, to));
    tracker.dependsOn = (id: number, other: number) => mutate(() => {
      editable(find(id)); find(other);
      if (reaches(other, id)) throw new Error("cycle");
      const list = (s.deps[id] ??= []);
      if (!list.includes(other)) { list.push(other); list.sort((a, b) => a - b); event(id, "linked"); }
    });
    tracker.dependencies = (id: number) => { find(id); return [...(s.deps[id] ?? [])]; };
  }
  if (V >= 24) tracker.renameTag = (from: string, to: string) => mutate(() => {
    const [f, t2] = [from, to].map((x) => String(x).trim().toLowerCase());
    if (!f || !t2) throw new Error("empty tag");
    let n = 0;
    for (const t of s.tasks) {
      if (!t.tags!.includes(f) || f === t2 || (V >= 33 && t.locked)) continue;
      t.tags = normTags([...t.tags!.filter((x) => x !== f), t2]);
      event(t.id, "edited");
      n++;
    }
    return n;
  });
  if (V >= 25) tracker.snooze = (id: number, days: number) => mutate(() => {
    const t = editable(find(id));
    if (!Number.isInteger(days) || days < 1) throw new Error("invalid days");
    if (!t.due) throw new Error("no due date");
    t.due = addDays(t.due, days);
    event(id, "snoozed");
    return out(t);
  });
  if (V >= 26) tracker.renameProject = (id: string, name: string) => mutate(() => {
    const p = s.projects.find((x) => x.id === id);
    if (!p) throw new Error("unknown project");
    const n = String(name).trim();
    if (s.projects.some((x) => x.id !== id && x.name.trim().toLowerCase() === n.toLowerCase())) throw new Error("duplicate project");
    p.name = n;
    return clone(p);
  });
  if (V >= 28) tracker.escalate = (today: string) => mutate(() => {
    needDate(today);
    let n = 0;
    for (const t of visible()) {
      if (t.status === "done" || !t.due || t.due >= today || (t.priority as number) <= 1 || (V >= 33 && t.locked)) continue;
      t.priority = (t.priority as number) - 1;
      event(t.id, "escalated");
      n++;
    }
    return n;
  });
  if (V >= 29) tracker.setProjectLimit = (pid: string, limit: number | null) => mutate(() => {
    if (!s.projects.some((p) => p.id === pid)) throw new Error("unknown project");
    if (limit === null) { delete s.limits[pid]; return; }
    if (!Number.isInteger(limit) || limit < 1) throw new Error("invalid limit");
    s.limits[pid] = limit;
  });
  if (V >= 31) tracker.clone = (id: number) => mutate(() => {
    const src = find(id);
    const n: Task = { ...clone(src), id: s.nextTask++, title: src.title + " (copy)", status: "todo" };
    delete n.archived; delete n.locked;
    s.tasks.push(n);
    event(n.id, "created");
    return out(n);
  });
  if (V >= 32) tracker.report = (today: string) => {
    needDate(today);
    const ts = visible(), open = ts.filter((t) => t.status !== "done");
    return { todo: open.length, done: ts.length - open.length, overdue: open.filter((t) => t.due && t.due < today).length, dueToday: open.filter((t) => t.due === today).length };
  };
  if (V >= 33) {
    tracker.lock = (id: number) => mutate(() => { const t = find(id); if (!t.locked) { t.locked = true; event(id, "locked"); } return out(t); });
    tracker.unlock = (id: number) => mutate(() => { const t = find(id); if (t.locked) { delete t.locked; event(id, "unlocked"); } return out(t); });
  }
  if (V >= 35) tracker.tagMany = (ids: number[], tag: string) => mutate(() => ids.map((id) => tagOne(id, tag)));
  return tracker;
}

export function importTracker(json: string) {
  let d: any;
  try { d = JSON.parse(json); } catch { throw new Error("invalid data"); }
  if (!d || !Array.isArray(d.tasks) || !Array.isArray(d.projects) || typeof d.nextTask !== "number") throw new Error("invalid data");
  if (V >= 10) for (const t of d.tasks) if (typeof t.priority === "string") t.priority = NAMES[t.priority];
  const { v: _v, ...state } = d;
  return createTracker({ seq: 0, events: {}, nextProject: 1, comments: {}, deps: {}, limits: {}, ...state });
}
