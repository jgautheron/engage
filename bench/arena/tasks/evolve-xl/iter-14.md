# Change request — bulk complete

- `completeMany(ids: number[]): Task[]` completes the tasks in order, with exactly the rules of
  `complete` (including recurring tasks and open-subtask checks), returning the completed tasks.
- All or nothing: if any id fails, nothing changes and the same error is thrown.
- One `undo` reverts the whole call.

All existing behaviour stays as is.
