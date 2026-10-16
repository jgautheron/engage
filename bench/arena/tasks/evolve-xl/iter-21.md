# Change request — comments

- `comment(id, text): void` adds a comment to a task. The text is trimmed; empty throws "empty comment".
- `comments(id): { text: string; actor: string }[]` lists a task's comments, oldest first, with the
  actor set when each was written.
- Commenting records a "commented" history event. Undoable. Comments survive export/import.

All existing behaviour stays as is.
