# Change request — locking

- `lock(id): Task` and `unlock(id): Task` lock and unlock a task (no change if already in that state).
  Events "locked" and "unlocked". Undoable.
- Any call that would change a locked task throws "locked" and changes nothing. That covers
  everything that changes a task today (complete, reopen, tagging, edit, move, delete — including as
  a subtask of the deleted task —, snooze, comment, archiving, adding its dependencies) and every
  future one. "unknown task" is still checked first.
- Exceptions: `escalate` and `renameTag` skip locked tasks instead of throwing.

All existing behaviour stays as is.
