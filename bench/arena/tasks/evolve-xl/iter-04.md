# Change request — tags

- `addTask` opts gain `tags?: string[]`. Tags are stored trimmed, lowercased, de-duplicated and
  sorted alphabetically; empty tags are dropped. Every task carries `tags` (possibly empty).
- `tag(id, tag): Task` adds a tag (same normalisation); `untag(id, tag): Task` removes it (no change
  if absent). Unknown id throws "unknown task".
- `list` filter gains `tag?: string` (case-insensitive match).

All existing behaviour stays as is.
