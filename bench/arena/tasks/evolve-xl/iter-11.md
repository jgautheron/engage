# Change request — recurring tasks

- `addTask` opts gain `repeat?: "daily" | "weekly"`; it requires `due` (else throw
  "repeat needs due"). Tasks carry `repeat` when set.
- Completing a repeating task also creates the next occurrence: a new task (next id) with the same
  title, priority, tags, project, parent and repeat, status "todo", and `due` moved 1 or 7 days later.
  `complete` still returns the completed task. The new task gets a "created" history event.
- One `undo` of that `complete` reverts both the completion and the new occurrence.

All existing behaviour stays as is.
