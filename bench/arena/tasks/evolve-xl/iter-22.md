# Change request — dependencies

- `dependsOn(id, otherId): void` makes task `id` depend on task `otherId`. Unknown ids throw
  "unknown task". A task depending on itself, directly or through a chain, throws "cycle". Adding a
  dependency that already exists changes nothing.
- `dependencies(id): number[]` returns the ids it depends on, ascending.
- Completing a task with a dependency that is not done throws "blocked" (checked after "open
  subtasks"). This applies to `completeMany` too, all or nothing as before.
- Deleting a task removes it from every dependency list.
- New dependencies record a "linked" event on task `id`. Undoable. Dependencies survive export/import.

All existing behaviour stays as is.
