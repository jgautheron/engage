# Change request — tag many

- `tagMany(ids: number[], tag: string): Task[]` tags each task in order, with exactly the rules of
  `tag`, returning the tasks.
- All or nothing: if any id fails, nothing changes and the same error is thrown. One `undo` reverts
  the whole call.

All existing behaviour stays as is.
