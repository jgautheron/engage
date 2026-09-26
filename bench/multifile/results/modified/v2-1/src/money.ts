/** Rounds cents half up (x.5 → x+1). Callers only ever pass non-negative values. */
export function roundHalfUp(cents: number): number {
  return Math.floor(cents + 0.5);
}
