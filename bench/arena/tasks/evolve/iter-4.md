# Change request

1. **Denies.** `Context` gains an optional `denies?` list with the same shape as `grants`. A deny on a
   resource or on any of its ancestors blocks those actions for that user, overriding ownership,
   grants and roles. Only admins ignore denies.
2. **`explain`.** Export
   `explain(ctx, userId, action, resourceId): { allowed: boolean; reason: Reason }` with
   `type Reason = "admin" | "denied" | "owner" | "grant" | "inherited-grant" | "role" | "no-rule"`.
   The reason is the first rule that decides, in exactly this order: admin → denied → owner →
   grant (on the resource itself) → inherited-grant (on an ancestor) → role → no-rule
   (`allowed: false`). `explain(...).allowed` must always equal `can(...)`, and `explain` throws
   exactly like `can`.

All existing behaviour stays as is.
