# Change request — suspended users

- Add `suspendUser(viewerId, userId): void` — allowed for the owner of any team the target user
  belongs to (as owner or member). A user can't suspend themselves ("forbidden").
- A suspended user is "forbidden" from every service method, including `suspendUser`. "not found"
  checks still come first.

All other behaviour stays as is.
