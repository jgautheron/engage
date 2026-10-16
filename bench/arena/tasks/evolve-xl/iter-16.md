# Change request — delete

- `delete(id): void` removes the task and all its subtasks (any depth). Unknown id throws "unknown task".
- Deleted ids are never reused. `get`, `history` and every other call on a deleted id throw "unknown task".
- Undoable like every other mutation.

All existing behaviour stays as is.
