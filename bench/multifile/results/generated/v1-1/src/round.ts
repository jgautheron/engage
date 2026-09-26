// Round half up to a whole cent. Inputs here are always non-negative.
export function roundHalfUp(x: number): number {
  return Math.floor(x + 0.5);
}
