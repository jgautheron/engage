// Rounding helper shared by promo, tax, and split calculations.

/**
 * Rounds `numerator / denominator` half up to the nearest integer
 * (x.5 -> x + 1), using integer arithmetic to avoid floating point drift on
 * the exact .5 boundary. Every value rounded in this domain is guaranteed
 * non-negative.
 */
export function roundDivide(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }

  const quotient = Math.floor(numerator / denominator);
  const remainder = numerator - quotient * denominator;

  return remainder * 2 >= denominator ? quotient + 1 : quotient;
}
