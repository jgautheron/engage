# Change request — actors

- `setActor(name: string)` sets who is acting from now on (default "system"). It is not a mutation:
  it is not undoable and records no event.
- Every history event gains `actor: string` — the actor set when the event happened.
- Events restored by `importTracker` keep their actor.

All existing behaviour stays as is.
