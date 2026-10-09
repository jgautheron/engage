# Change request — transfer

Add `transferProject(viewerId, projectId, targetTeamId): Project`. Allowed only when the caller
owns the project's current team AND is the owner or an admin of the target team. The project's
`teamId` becomes the target team. Same error rules as the rest of the service.

All existing behaviour stays as is.
