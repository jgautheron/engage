// Promo resolution, BOGO discounts, and order-level (percent/fixed) discount
// (spec rules 2, 3, 4).

import type { Category, Product, Promo } from "./types";
import { roundDivide } from "./rounding";

/**
 * Resolves `promoCodes` against the promo catalog: case-insensitive
 * matching, de-duplication of repeated codes, and enforcement of "at most
 * one order-level promo (percent or fixed) may apply".
 *
 * Throws "unknown promo" if a code has no match, and "promo conflict" if
 * more than one order-level promo is matched. Any number of bogo promos may
 * match.
 */
export function resolvePromos(promos: Promo[], promoCodes?: string[]): Promo[] {
  if (!promoCodes || promoCodes.length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const matched: Promo[] = [];

  for (const rawCode of promoCodes) {
    const normalized = rawCode.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);

    const promo = promos.find((candidate) => candidate.code.toLowerCase() === normalized);
    if (!promo) {
      throw new Error(`unknown promo: ${rawCode}`);
    }
    matched.push(promo);
  }

  const orderLevelCount = matched.filter(
    (promo) => promo.kind === "percent" || promo.kind === "fixed"
  ).length;
  if (orderLevelCount > 1) {
    throw new Error("promo conflict");
  }

  return matched;
}

export interface BogoDiscount {
  discountCents: number;
  category?: Category;
}

/**
 * Computes the free-units discount for every matched bogo promo (rule 3).
 * A bogo promo whose sku is not present in the cart applies and gives 0.
 */
export function computeBogoDiscounts(
  matchedPromos: Promo[],
  catalogMap: Map<string, Product>,
  cartQtyBySku: Map<string, number>
): BogoDiscount[] {
  const results: BogoDiscount[] = [];

  for (const promo of matchedPromos) {
    if (promo.kind !== "bogo") {
      continue;
    }

    const product = catalogMap.get(promo.sku);
    const qty = cartQtyBySku.get(promo.sku) ?? 0;

    if (qty === 0 || !product) {
      results.push({ discountCents: 0, category: product?.category });
      continue;
    }

    const freeUnits = Math.floor(qty / 2);
    results.push({ discountCents: freeUnits * product.priceCents, category: product.category });
  }

  return results;
}

/**
 * Computes the order-level (percent/fixed) discount before the overall cap
 * (rule 4). `base` is non-digital lineCents minus the bogo discount on those
 * lines.
 */
export function computeOrderLevelDiscount(matchedPromos: Promo[], base: number): number {
  const promo = matchedPromos.find(
    (candidate): candidate is Extract<Promo, { kind: "percent" | "fixed" }> =>
      candidate.kind === "percent" || candidate.kind === "fixed"
  );

  if (!promo) {
    return 0;
  }

  if (promo.kind === "percent") {
    const meetsMin = promo.minSubtotalCents === undefined || base >= promo.minSubtotalCents;
    if (!meetsMin) {
      return 0;
    }
    return roundDivide(base * promo.percent, 100);
  }

  return Math.min(promo.amountCents, base);
}
