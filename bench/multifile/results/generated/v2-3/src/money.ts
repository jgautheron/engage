/** Rounds half up to a whole cent (x.5 -> x+1). Input must be non-negative. */
export function roundHalfUp(cents: number): number {
  return Math.floor(cents + 0.5);
}
