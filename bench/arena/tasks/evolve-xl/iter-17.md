# Change request — search

- `search(query: string): Task[]` returns every task (subtasks included) whose title contains the
  trimmed query, ignoring case, in the usual `list` order (priority, then id).
- An empty query (after trimming) throws "empty query".

All existing behaviour stays as is.
