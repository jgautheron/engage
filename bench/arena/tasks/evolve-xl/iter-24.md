# Change request — rename a tag

- `renameTag(from: string, to: string): number` replaces tag `from` with `to` on every task that has
  it, and returns how many tasks changed. Both are normalised like other tags; either one empty
  after normalisation throws "empty tag". Tags stay de-duplicated and sorted.
- Each changed task records an "edited" event. One `undo` reverts the whole call.

All existing behaviour stays as is.
