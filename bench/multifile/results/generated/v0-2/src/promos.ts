// Rule 2: promo code resolution.
import type { Promo } from "./types";

export interface ResolvedPromos {
  /** At most one; kind is guaranteed to be "percent" or "fixed" when present. */
  orderLevelPromo: Promo | undefined;
  /** Any number; each has kind "bogo". */
  bogoPromos: Promo[];
}

/**
 * Matches `promoCodes` (case-insensitive, deduped) against `promos[].code`.
 * Throws on: unknown promo, promo conflict (more than one order-level promo).
 */
export function resolvePromos(promos: Promo[], promoCodes: string[] | undefined): ResolvedPromos {
  const codes = promoCodes ?? [];
  const seenCodes = new Set<string>();
  const matched: Promo[] = [];

  for (const rawCode of codes) {
    const key = rawCode.toLowerCase();
    if (seenCodes.has(key)) continue;
    seenCodes.add(key);

    const promo = promos.find((p) => p.code.toLowerCase() === key);
    if (!promo) {
      throw new Error(`checkout: unknown promo code: ${rawCode}`);
    }
    matched.push(promo);
  }

  const orderLevelPromos = matched.filter((p) => p.kind === "percent" || p.kind === "fixed");
  if (orderLevelPromos.length > 1) {
    throw new Error("checkout: promo conflict: only one order-level promo (percent or fixed) may apply");
  }

  const bogoPromos = matched.filter((p) => p.kind === "bogo");

  return {
    orderLevelPromo: orderLevelPromos[0],
    bogoPromos,
  };
}
