# Change request — undo

- `undo(): boolean` reverts the most recent successful mutating call that has not been undone yet,
  restoring the tracker exactly as it was before that call — including which id the next task will
  get. Returns `false` when there is nothing to undo. Calls that throw are not recorded.
- Mutating calls are `addTask`, `complete`, `tag`, `untag` — **and every mutating method added in
  the future**. Plan for that.
- Undo can be repeated to walk back several steps.

All existing behaviour stays as is.
