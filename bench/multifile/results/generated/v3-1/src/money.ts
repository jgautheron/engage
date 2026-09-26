/** Round a/b half up to an integer (a, b ≥ 0, b > 0); does the +0.5 on the exact fraction, not on a pre-divided float. */
export function roundHalfUp(a: number, b: number): number {
  return Math.floor((2 * a + b) / (2 * b));
}
