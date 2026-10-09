# Change request — tighten password protection

- `setPasswordProtection` is now allowed for the **team owner only** (admins no longer), still
  only on the "pro" plan.
- Add `removePasswordProtection(viewerId, projectId): void` with exactly the same rules.

All other behaviour stays as is.
