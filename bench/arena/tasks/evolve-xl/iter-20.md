# Change request — archive

- `archive(id): Task` archives a done task that has no parent. A task that is not done throws
  "not done"; a subtask throws "is a subtask". `unarchive(id): Task` reverses it. Archiving an
  archived task, or unarchiving one that isn't, changes nothing.
- Archived tasks carry `archived: true`. An archived task and its subtasks are hidden from `list`
  (even with `all: true`), `search`, `overdue`, `stats` and `remaining`. `get` and `history` still work.
- Events "archived" and "unarchived". Undoable. Archiving survives export/import.

All existing behaviour stays as is.
