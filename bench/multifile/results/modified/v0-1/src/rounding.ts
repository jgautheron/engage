// Shared numeric helpers. All money values in this engine are integer cents.

/**
 * Round half up to a whole cent: x.5 rounds to x + 1.
 * Every value rounded in this engine is non-negative (per spec.md).
 * A tiny epsilon guards against floating point representation error,
 * e.g. an intended 12.5 arriving as 12.499999999999998 after a division.
 */
export function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5 + 1e-9);
}

/**
 * Ceiling division for non-negative integers, avoiding the floating point
 * drift that Math.ceil(a / b) can introduce.
 */
export function ceilDiv(numerator: number, denominator: number): number {
  return Math.floor((numerator + denominator - 1) / denominator);
}
