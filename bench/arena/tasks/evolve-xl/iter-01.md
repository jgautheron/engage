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
