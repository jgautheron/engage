# Change request — estimates

- `addTask` and `edit` accept `estimate?: number` — minutes, a positive integer; anything else throws
  "invalid estimate". `edit(id, { estimate: null })` removes it. Tasks carry `estimate` when set.
- `remaining(): number` is the sum of the estimates of every task not done (subtasks included).

All existing behaviour stays as is.
