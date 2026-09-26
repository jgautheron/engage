// Rounding helper shared by every module that needs "round half up".
//
// Spec: "round" always means round half up to a whole cent (x.5 -> x+1);
// every rounded value in this domain is non-negative.
//
// All call sites express the value to round as an exact integer fraction
// (numerator / denominator), e.g. base * percent / 100, so we accept both
// parts directly rather than a single pre-divided float. This keeps every
// intermediate value an exact JS number (products of integers well within
// Number.MAX_SAFE_INTEGER for realistic cent amounts) and avoids compounding
// floating point error before the +0.5 threshold is applied.
export function roundHalfUp(numerator: number, denominator = 1): number {
  if (denominator === 0) return 0;
  return Math.floor(numerator / denominator + 0.5);
}
