# Change request

1. **Ownership.** The owner of a resource (`resource.ownerId === userId`) may `read`, `write`,
   `delete` and `share` it, whatever their role.
2. **New action `share`.** Add `"share"` to `Action`. Only the resource's owner and admins may share.
   Roles alone never grant `share`.

All existing behaviour stays as is.
