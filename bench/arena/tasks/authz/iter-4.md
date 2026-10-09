# Change request — members and listing

- `listProjects(viewerId, teamId): Project[]` — the team's projects (not deleted), in id order;
  allowed for the team owner and any team member.
- `addMember(viewerId, teamId, userId, role): void` — team owner or team admins; only the owner
  may add an "admin"; adding someone already in the team throws "already a member".

All existing behaviour stays as is.
