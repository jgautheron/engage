# Change request — dashboard bulk actions

The dashboard needs two bulk actions for a team page:

- `renameAll(viewerId, teamId, prefix): Project[]` — the bulk version of `renameProject`: puts
  `prefix` in front of the name of every project of the team (not deleted) and returns them in id order.
- `clearPasswords(viewerId, teamId): void` — the bulk version of `removePasswordProtection` for
  every project of the team.

All other behaviour stays as is.
