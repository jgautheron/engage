// epsilon guards against float noise so an exact x.5 always rounds up
export function roundHalfUp(x: number): number {
  return Math.floor(x + 0.5 + 1e-9);
}
