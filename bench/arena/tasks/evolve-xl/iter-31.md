# Change request — clone

- `clone(id): Task` creates a new task (next id) copying title + " (copy)", priority, due, tags,
  project, parent, repeat and estimate. It starts "todo", not archived, without comments or
  dependencies, and records a "created" event.
- Same rules as any other call that adds a task. Undoable.

All existing behaviour stays as is.
