# Change request — subtasks

- `addTask` opts gain `parent?: number` (a task id; unknown throws "unknown task"). Tasks carry
  `parent` when set. Nesting can go any depth.
- `list()` now returns only tasks without a parent, unless the filter has `all: true` (then every
  task). All other filters still apply.
- `subtasks(id): Task[]` returns direct children in id order.
- Completing a task that has any subtask (at any depth) not yet done throws "open subtasks".
- Subtasks survive export/import and are undoable like everything else.

All existing behaviour stays as is.
