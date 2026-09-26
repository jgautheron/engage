/** Rounds numerator/denominator to the nearest cent, half up. Inputs must be non-negative integers. */
export function roundHalfUp(numerator: number, denominator: number): number {
  return Math.floor((2 * numerator + denominator) / (2 * denominator));
}
