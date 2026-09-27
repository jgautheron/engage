const V = 7;
// Reference task tracker; feature set gated by V (1..12). All mutations go through `mutate`, which
// snapshots state for undo — the design the later iterations reward.

type Status = "todo" | "done";
export interface Task { id: number; title: string; status: Status; priority?: string | number; due?: string; tags?: string[]; project?: string; parent?: number; repeat?: "daily" | "weekly" }
export interface Project { id: string; name: string }
type Ev = { type: string; seq: number };
interface State { tasks: Task[]; projects: Project[]; nextTask: number; nextProject: number; seq: number; events: Record<number, Ev[]> }

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
  let s: State = init ?? { tasks: [], projects: [], nextTask: 1, nextProject: 1, seq: 0, events: {} };
  const past: State[] = [];
  const find = (id: number) => { const t = s.tasks.find((x) => x.id === id); if (!t) throw new Error("unknown task"); return t; };
  const event = (id: number, type: string) => { if (V < 9) return; (s.events[id] ??= []).push({ type, seq: ++s.seq }); };
  function mutate<T>(f: () => T): T {
    const before = clone(s);
    try { const r = f(); if (V >= 5) past.push(before); return r; } catch (e) { s = before; throw e; }
  }
  const out = (t: Task) => clone(t);
  const descendants = (id: number): Task[] => s.tasks.filter((t) => t.parent === id).flatMap((c) => [c, ...descendants(c.id)]);
  const sortTasks = (ts: Task[], byDue = false) => [...ts].sort((a, b) => {
    if (byDue) { const da = a.due ?? "￿", db = b.due ?? "￿"; if (da !== db) return da < db ? -1 : 1; }
    if (V >= 2) { const d = prioKey(a) - prioKey(b); if (d) return d; }
    return a.id - b.id;
  });

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
        t.id = s.nextTask++;
        s.tasks.push(t);
        event(t.id, "created");
        return out(t);
      });
    },
    get: (id: number) => out(find(id)),
    list(f: any = {}): Task[] {
      let ts = s.tasks;
      if (V >= 8 && !f.all) ts = ts.filter((t) => t.parent === undefined);
      if (f.status) ts = ts.filter((t) => t.status === f.status);
      if (f.priority !== undefined) { const p = normPriority(f.priority); ts = ts.filter((t) => t.priority === p); }
      if (f.tag !== undefined) ts = ts.filter((t) => t.tags?.includes(String(f.tag).trim().toLowerCase()));
      if (f.project !== undefined) ts = ts.filter((t) => t.project === f.project);
      return sortTasks(ts, V >= 3 && f.sort === "due").map(out);
    },
    complete(id: number): Task {
      return mutate(() => {
        const t = find(id);
        if (t.status === "done") return out(t);
        if (V >= 8 && descendants(id).some((d) => d.status !== "done")) throw new Error("open subtasks");
        t.status = "done";
        event(id, "completed");
        if (V >= 11 && t.repeat) {
          const n: Task = { ...clone(t), id: s.nextTask++, status: "todo", due: addDays(t.due!, t.repeat === "daily" ? 1 : 7) };
          s.tasks.push(n);
          event(n.id, "created");
        }
        return out(t);
      });
    },
  } as any;
  if (V >= 3) tracker.overdue = (today: string) => s.tasks.filter((t) => t.status !== "done" && t.due && t.due < today)
    .sort((a, b) => (a.due! < b.due! ? -1 : a.due! > b.due! ? 1 : a.id - b.id)).map(out);
  if (V >= 4) {
    tracker.tag = (id: number, tag: string) => mutate(() => { const t = find(id); const n = normTags([...t.tags!, tag]); if (n.length !== t.tags!.length) { t.tags = n; event(id, "tagged"); } return out(t); });
    tracker.untag = (id: number, tag: string) => mutate(() => { const t = find(id); const k = tag.trim().toLowerCase(); if (t.tags!.includes(k)) { t.tags = t.tags!.filter((x) => x !== k); event(id, "untagged"); } return out(t); });
  }
  if (V >= 5) tracker.undo = () => { const p = past.pop(); if (!p) return false; s = p; return true; };
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
    tracker.reopen = (id: number) => mutate(() => { const t = find(id); if (t.status === "done") { t.status = "todo"; event(id, "reopened"); } return out(t); });
    tracker.history = (id: number) => { find(id); return clone(s.events[id] ?? []); };
  }
  if (V >= 12) tracker.stats = () => ({ todo: s.tasks.filter((t) => t.status === "todo").length, done: s.tasks.filter((t) => t.status === "done").length });
  return tracker;
}

export function importTracker(json: string) {
  let d: any;
  try { d = JSON.parse(json); } catch { throw new Error("invalid data"); }
  if (!d || !Array.isArray(d.tasks) || !Array.isArray(d.projects) || typeof d.nextTask !== "number") throw new Error("invalid data");
  if (V >= 10) for (const t of d.tasks) if (typeof t.priority === "string") t.priority = NAMES[t.priority];
  const { v: _v, ...state } = d;
  return createTracker({ seq: 0, events: {}, nextProject: 1, ...state });
}
