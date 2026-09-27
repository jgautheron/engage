# Change request — projects

- `createProject(name: string): Project` returns `{ id, name }` with ids "p1", "p2", … . A name that
  matches an existing project case-insensitively (after trimming) throws "duplicate project".
- `projects(): Project[]` in creation order.
- `addTask` opts gain `project?: string` (a project id; unknown throws "unknown project"). Tasks carry
  `project` when set.
- `deleteProject(id)` removes the project; its tasks keep existing with no project. Unknown id throws
  "unknown project".
- `list` filter gains `project?: string`.
- `createProject` and `deleteProject` are undoable like every other mutation.

All existing behaviour stays as is.
