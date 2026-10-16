# Change request — redo

- `redo(): boolean` re-applies the most recently undone call, restoring the tracker exactly as it was
  after that call. Returns `false` when there is nothing to redo.
- Several undos can be redone in turn. Any new successful mutating call clears what can be redone.
- An imported tracker has nothing to redo.

All existing behaviour stays as is.
