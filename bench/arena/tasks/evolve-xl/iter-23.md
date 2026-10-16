# Change request — more list filters

The `list` filter gains:

- `dueBefore?: string` — only tasks with a due date strictly before it. Not a valid date throws "invalid date".
- `text?: string` — only tasks whose title contains it, ignoring case (the same match as `search`).

They combine with every other filter.

All existing behaviour stays as is.
