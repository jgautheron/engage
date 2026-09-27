# Permissions engine — build it

Build a small permissions library in TypeScript under `src/`, entry `src/index.ts`. No dependencies.
This project will keep growing in later requests; today's scope is only what is below.

```ts
type Role = "viewer" | "editor" | "admin";
type Action = "read" | "write" | "delete";
interface User { id: string; role: Role }
interface Resource { id: string; ownerId: string }
interface Context { users: User[]; resources: Resource[] }

can(ctx: Context, userId: string, action: Action, resourceId: string): boolean
```

Rules:
- viewer may `read`; editor may `read` and `write`; admin may do everything.
- An unknown `userId` throws an Error whose message contains "unknown user"; an unknown
  `resourceId` throws "unknown resource".

Export the types and `can` from `src/index.ts`.
