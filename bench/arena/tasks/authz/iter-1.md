# Project hosting service — build it

Build a small in-memory library in TypeScript under `src/`, entry `src/index.ts`. No dependencies.
This codebase will be extended by other developers later; today's scope is only what is below.

```ts
type Role = "admin" | "member";
interface User { id: string; name: string }
interface Team { id: string; ownerId: string; plan: "hobby" | "pro"; members: { userId: string; role: Role }[] }
interface Project { id: string; teamId: string; name: string; password?: string }
interface Seed { users: User[]; teams: Team[]; projects: Project[] }

createService(seed: Seed): Service
```

`Service` methods — the first argument is always the id of the user making the call:

- `getProject(viewerId, projectId): Project` — allowed for the team owner and any team member.
- `renameProject(viewerId, projectId, name): Project` — team owner or team admins.
- `deleteProject(viewerId, projectId): void` — team owner only.
- `setPasswordProtection(viewerId, projectId, password): void` — team owner or team admins, and
  only when the team's plan is "pro".

Errors (throw an `Error` whose message contains): unknown user, team or project → "not found";
caller not allowed → "forbidden"; plan does not include the feature → "upgrade required". Check
"not found" first, then "forbidden", then "upgrade required". A deleted project is "not found".
Returned projects are copies. Export `createService` and the types from `src/index.ts`.
