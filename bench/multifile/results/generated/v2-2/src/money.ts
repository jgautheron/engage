/** Round half up to a whole cent (x.5 → x+1). Only ever called on non-negative values. */
export function roundHalfUp(cents: number): number {
  return Math.floor(cents + 0.5);
}
