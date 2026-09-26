// Round half up to a whole cent. Callers only ever pass non-negative values.
export function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5);
}
