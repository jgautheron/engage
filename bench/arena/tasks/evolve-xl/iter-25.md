# Change request — snooze

- `snooze(id, days: number): Task` moves the task's due date `days` later.
- `days` must be a positive integer, else "invalid days". A task without a due date throws "no due date".
- Records a "snoozed" event. Undoable.

All existing behaviour stays as is.
