# Change request — history

- `reopen(id): Task` sets a done task back to "todo" (no change if already todo). Undoable.
- `history(id): { type: string; seq: number }[]` lists what happened to a task, oldest first.
  Types: "created" (addTask), "completed", "reopened", "tagged", "untagged", "unprojected" (its project
  was deleted). `seq` is a tracker-wide counter starting at 1 that increases with every event.
  Calls that change nothing (completing a done task, re-adding an existing tag, removing an absent
  tag, reopening a todo task) record no event.
- Undo also removes the undone call's events and rolls the counter back.
- History and the counter survive export/import. Unknown id throws "unknown task".

All existing behaviour stays as is.
