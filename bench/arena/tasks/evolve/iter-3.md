# Change request

1. **Folders.** `Resource` gains an optional `parentId?: string` (another resource id). A missing
   parent id throws "unknown resource". A parent chain that loops back on itself throws an Error
   whose message contains "cycle" whenever a resource in or under the loop is checked.
2. **Grants.** `Context` gains an optional `grants?: { userId: string; resourceId: string; actions: Action[] }[]`.
   A grant allows its actions for that user on that resource **and on every resource beneath it**
   (any depth).

All existing behaviour stays as is.
