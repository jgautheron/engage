# Change request — project limits

- `setProjectLimit(projectId, limit: number | null): void` caps how many **todo** tasks a project
  may hold; `null` removes the cap. Unknown project throws "unknown project"; a limit that is not a
  positive integer throws "invalid limit". Setting a cap below the current count is allowed.
- From then on, any call that would raise a capped project's todo count above its cap throws
  "project full" and changes nothing — whatever the call is (adding, editing, reopening, and every
  future call).
- Undoable. Limits survive export/import.

All existing behaviour stays as is.
