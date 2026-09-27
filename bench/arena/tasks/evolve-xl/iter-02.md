# Change request — priorities

- `addTask(title, opts?)` takes an optional `{ priority?: "low" | "normal" | "high" }`, default
  "normal". Any other value throws "invalid priority". Tasks carry `priority`.
- `list(filter?)` takes an optional `{ status?, priority? }` filter and returns tasks sorted
  high → normal → low, then by id.

All existing behaviour stays as is.
