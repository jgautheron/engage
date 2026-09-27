# Change request — numeric priorities

Priority is now a number from 1 (most urgent) to 5.

- `addTask` accepts a number 1–5 or, for compatibility, the old names: "high" → 1, "normal" → 3,
  "low" → 5. Tasks now carry the number. Default 3. Anything else throws "invalid priority".
- Sorting that used priority now sorts by number ascending (1 first). The `list` priority filter
  accepts a number or an old name.
- `importTracker` must still load data exported by the previous version of this library (old
  priority names), converting them.

All other behaviour stays as is.
