# Change request — save and load

- `tracker.export(): string` returns a JSON string with everything needed to restore the tracker
  (tasks, projects, and which ids come next). Undo history is not saved.
- Export a function `importTracker(json: string): Tracker` from `src/index.ts`. It returns a tracker
  that behaves exactly like the exported one (same `list`, `get`, `projects`, next ids), with an empty
  undo history. Input that is not valid exported data throws "invalid data".

All existing behaviour stays as is.
