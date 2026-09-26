/** Round half up to a whole cent (x.5 -> x+1). Assumes a non-negative input. */
export function roundHalfUp(cents: number): number {
  return Math.floor(cents + 0.5 + 1e-9); // epsilon guards float error at exact .5
}

export const FREE_SHIPPING_THRESHOLD_CENTS = 4000;
