# Change request — edit

- `edit(id, changes): Task` where `changes` may hold `title`, `priority`, `due`, `tags`, `project`.
  Each value is validated and normalised exactly as in `addTask` (same errors). `project: null`
  removes the task's project.
- All or nothing: if any value is invalid, nothing changes.
- If anything actually changed, record one "edited" history event; otherwise no event.
- One `undo` reverts the edit.

All existing behaviour stays as is.
