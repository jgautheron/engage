# Change request — escalate

- `escalate(today: string): number` raises the priority by one step (5 → 4 … 2 → 1) of every
  task that is not done, not archived, has a due date before `today` and a priority above 1. It
  returns how many tasks changed. An invalid date throws "invalid date".
- Each changed task records an "escalated" event. One `undo` reverts the whole call.

All existing behaviour stays as is.
