# Task tracker — build it

Build a small task-tracker library in TypeScript under `src/`, entry `src/index.ts`. No dependencies,
in-memory only. The project will keep growing through later requests; today's scope is only this.

`createTracker()` returns a tracker object with these methods:

- `addTask(title: string): Task` — title is trimmed; an empty title throws an Error whose message
  contains "empty title". Ids are 1, 2, 3, … in creation order. A new task is
  `{ id, title, status: "todo" }`.
- `get(id: number): Task` — unknown id throws "unknown task".
- `list(): Task[]` — all tasks in id order.
- `complete(id: number): Task` — sets status to "done" and returns the task. Unknown id throws
  "unknown task". Completing a done task changes nothing.

Returned tasks must be copies: mutating them must not change the tracker. Export `createTracker`
and the `Task` type from `src/index.ts`.
# Change request — priorities

- `addTask(title, opts?)` takes an optional `{ priority?: "low" | "normal" | "high" }`, default
  "normal". Any other value throws "invalid priority". Tasks carry `priority`.
- `list(filter?)` takes an optional `{ status?, priority? }` filter and returns tasks sorted
  high → normal → low, then by id.

All existing behaviour stays as is.
# Change request — due dates

- `addTask` opts gain `due?: string` in `YYYY-MM-DD` form; anything that is not a real calendar date
  in that form throws "invalid date". Tasks carry `due` when set.
- `overdue(today: string): Task[]` — tasks not done whose `due` is before `today`, sorted by due date
  then id.
- `list` filter gains `sort?: "due"`: due date ascending (tasks without a due date last), then the
  usual priority order, then id. Without `sort`, ordering is unchanged.

All existing behaviour stays as is.
# Change request — tags

- `addTask` opts gain `tags?: string[]`. Tags are stored trimmed, lowercased, de-duplicated and
  sorted alphabetically; empty tags are dropped. Every task carries `tags` (possibly empty).
- `tag(id, tag): Task` adds a tag (same normalisation); `untag(id, tag): Task` removes it (no change
  if absent). Unknown id throws "unknown task".
- `list` filter gains `tag?: string` (case-insensitive match).

All existing behaviour stays as is.
# Change request — undo

- `undo(): boolean` reverts the most recent successful mutating call that has not been undone yet,
  restoring the tracker exactly as it was before that call — including which id the next task will
  get. Returns `false` when there is nothing to undo. Calls that throw are not recorded.
- Mutating calls are `addTask`, `complete`, `tag`, `untag` — **and every mutating method added in
  the future**. Plan for that.
- Undo can be repeated to walk back several steps.

All existing behaviour stays as is.
# Change request — projects

- `createProject(name: string): Project` returns `{ id, name }` with ids "p1", "p2", … . A name that
  matches an existing project case-insensitively (after trimming) throws "duplicate project".
- `projects(): Project[]` in creation order.
- `addTask` opts gain `project?: string` (a project id; unknown throws "unknown project"). Tasks carry
  `project` when set.
- `deleteProject(id)` removes the project; its tasks keep existing with no project. Unknown id throws
  "unknown project".
- `list` filter gains `project?: string`.
- `createProject` and `deleteProject` are undoable like every other mutation.

All existing behaviour stays as is.
# Change request — save and load

- `tracker.export(): string` returns a JSON string with everything needed to restore the tracker
  (tasks, projects, and which ids come next). Undo history is not saved.
- Export a function `importTracker(json: string): Tracker` from `src/index.ts`. It returns a tracker
  that behaves exactly like the exported one (same `list`, `get`, `projects`, next ids), with an empty
  undo history. Input that is not valid exported data throws "invalid data".

All existing behaviour stays as is.
# Change request — subtasks

- `addTask` opts gain `parent?: number` (a task id; unknown throws "unknown task"). Tasks carry
  `parent` when set. Nesting can go any depth.
- `list()` now returns only tasks without a parent, unless the filter has `all: true` (then every
  task). All other filters still apply.
- `subtasks(id): Task[]` returns direct children in id order.
- Completing a task that has any subtask (at any depth) not yet done throws "open subtasks".
- Subtasks survive export/import and are undoable like everything else.

All existing behaviour stays as is.
# Change request — history

- `reopen(id): Task` sets a done task back to "todo" (no change if already todo). Undoable.
- `history(id): { type: string; seq: number }[]` lists what happened to a task, oldest first.
  Types: "created" (addTask), "completed", "reopened", "tagged", "untagged", "unprojected" (its project
  was deleted). `seq` is a tracker-wide counter starting at 1 that increases with every event.
  Calls that change nothing (completing a done task, re-adding an existing tag, removing an absent
  tag, reopening a todo task) record no event.
- Undo also removes the undone call's events and rolls the counter back.
- History and the counter survive export/import. Unknown id throws "unknown task".

All existing behaviour stays as is.
# Change request — numeric priorities

Priority is now a number from 1 (most urgent) to 5.

- `addTask` accepts a number 1–5 or, for compatibility, the old names: "high" → 1, "normal" → 3,
  "low" → 5. Tasks now carry the number. Default 3. Anything else throws "invalid priority".
- Sorting that used priority now sorts by number ascending (1 first). The `list` priority filter
  accepts a number or an old name.
- `importTracker` must still load data exported by the previous version of this library (old
  priority names), converting them.

All other behaviour stays as is.
# Change request — recurring tasks

- `addTask` opts gain `repeat?: "daily" | "weekly"`; it requires `due` (else throw
  "repeat needs due"). Tasks carry `repeat` when set.
- Completing a repeating task also creates the next occurrence: a new task (next id) with the same
  title, priority, tags, project, parent and repeat, status "todo", and `due` moved 1 or 7 days later.
  `complete` still returns the completed task. The new task gets a "created" history event.
- One `undo` of that `complete` reverts both the completion and the new occurrence.

All existing behaviour stays as is.
# Change request — stats

Add `stats(): { todo: number; done: number }` counting every task, subtasks included.

All existing behaviour stays as is.
# Change request — actors

- `setActor(name: string)` sets who is acting from now on (default "system"). It is not a mutation:
  it is not undoable and records no event.
- Every history event gains `actor: string` — the actor set when the event happened.
- Events restored by `importTracker` keep their actor.

All existing behaviour stays as is.
# Change request — bulk complete

- `completeMany(ids: number[]): Task[]` completes the tasks in order, with exactly the rules of
  `complete` (including recurring tasks and open-subtask checks), returning the completed tasks.
- All or nothing: if any id fails, nothing changes and the same error is thrown.
- One `undo` reverts the whole call.

All existing behaviour stays as is.
# Change request — edit

- `edit(id, changes): Task` where `changes` may hold `title`, `priority`, `due`, `tags`, `project`.
  Each value is validated and normalised exactly as in `addTask` (same errors). `project: null`
  removes the task's project.
- All or nothing: if any value is invalid, nothing changes.
- If anything actually changed, record one "edited" history event; otherwise no event.
- One `undo` reverts the edit.

All existing behaviour stays as is.
