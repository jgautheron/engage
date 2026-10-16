# Change request — sharing a single project

- Add `shareProject(viewerId, projectId, userId): void` — team owner or team admins may give a user
  outside the team read access to one project. Sharing with a team member throws "already a member".
- A user a project is shared with may call `getProject` on that project only. They gain no other
  permission: not rename, delete, password changes, transfer, listing or adding members.
- Shared access ends when the project is transferred to another team.

All other behaviour stays as is.
