// Rule 2: promo code resolution.
import type { Promo } from "./types";

export interface ResolvedPromos {
  /** At most one; kind is guaranteed to be "percent", "fixed", or "category" when present. */
  orderLevelPromo: Promo | undefined;
  /** Any number; each has kind "bogo". */
  bogoPromos: Promo[];
  /** Canonical codes of applied promos, in order, without duplicates. */
  appliedPromoCodes: string[];
}

/**
 * Matches `promoCodes` (case-insensitive, deduped) against `promos[].code`.
 * Unknown codes are silently ignored (lenient).
 * Throws on: promo conflict (more than one order-level promo).
 */
export function resolvePromos(promos: Promo[], promoCodes: string[] | undefined): ResolvedPromos {
  const codes = promoCodes ?? [];
  const seenCodes = new Set<string>();
  const matched: Promo[] = [];
  const appliedPromoCodes: string[] = [];

  for (const rawCode of codes) {
    const key = rawCode.toLowerCase();
    if (seenCodes.has(key)) continue;
    seenCodes.add(key);

    const promo = promos.find((p) => p.code.toLowerCase() === key);
    if (!promo) {
      // Lenient: unknown codes are ignored
      continue;
    }
    matched.push(promo);
    appliedPromoCodes.push(promo.code);
  }

  const orderLevelPromos = matched.filter((p) => p.kind === "percent" || p.kind === "fixed" || p.kind === "category");
  if (orderLevelPromos.length > 1) {
    throw new Error("checkout: promo conflict: only one order-level promo (percent, fixed, or category) may apply");
  }

  const bogoPromos = matched.filter((p) => p.kind === "bogo");

  return {
    orderLevelPromo: orderLevelPromos[0],
    bogoPromos,
    appliedPromoCodes,
  };
}
