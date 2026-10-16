# Change request — move

- `move(id, parent: number | null): Task` gives the task a new parent, or none with `null`.
- Unknown id or parent throws "unknown task". Moving a task under itself or under one of its own
  subtasks throws "cycle".
- If the parent actually changes, record a "moved" history event. Undoable.

All existing behaviour stays as is.
