# Change request — rename a project

- `renameProject(id, name): Project` renames a project; the name is trimmed. Unknown id throws
  "unknown project". A name used by another project (same rule as `createProject`) throws
  "duplicate project".
- Undoable.

All existing behaviour stays as is.
