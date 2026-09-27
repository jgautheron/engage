# Change request — due dates

- `addTask` opts gain `due?: string` in `YYYY-MM-DD` form; anything that is not a real calendar date
  in that form throws "invalid date". Tasks carry `due` when set.
- `overdue(today: string): Task[]` — tasks not done whose `due` is before `today`, sorted by due date
  then id.
- `list` filter gains `sort?: "due"`: due date ascending (tasks without a due date last), then the
  usual priority order, then id. Without `sort`, ordering is unchanged.

All existing behaviour stays as is.
