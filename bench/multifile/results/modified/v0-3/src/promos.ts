// Promo resolution, BOGO discounts, and order-level (percent/fixed) discount
// (spec rules 2, 3, 4).

import type { Category, Product, Promo } from "./types";
import { roundDivide } from "./rounding";

export interface ResolvedPromos {
  promos: Promo[];
  appliedCodes: string[];
}

/**
 * Resolves `promoCodes` against the promo catalog: case-insensitive
 * matching, de-duplication of repeated codes, and enforcement of "at most
 * one order-level promo (percent or fixed or category) may apply".
 *
 * Unknown promo codes are silently ignored. Throws "promo conflict" if
 * more than one order-level promo is matched. Any number of bogo promos may
 * match.
 *
 * Returns both the matched promos and the canonical codes (as written in
 * promos) of every applied promo, in the order the codes were given, without
 * duplicates.
 */
export function resolvePromos(promos: Promo[], promoCodes?: string[]): ResolvedPromos {
  if (!promoCodes || promoCodes.length === 0) {
    return { promos: [], appliedCodes: [] };
  }

  const seen = new Set<string>();
  const matched: Promo[] = [];
  const appliedCodes: string[] = [];

  for (const rawCode of promoCodes) {
    const normalized = rawCode.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);

    const promo = promos.find((candidate) => candidate.code.toLowerCase() === normalized);
    if (!promo) {
      // Unknown promo codes are silently ignored
      continue;
    }
    matched.push(promo);
    appliedCodes.push(promo.code);
  }

  const orderLevelCount = matched.filter(
    (promo) => promo.kind === "percent" || promo.kind === "fixed" || promo.kind === "category"
  ).length;
  if (orderLevelCount > 1) {
    throw new Error("promo conflict");
  }

  return { promos: matched, appliedCodes };
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

/**
 * Computes the category promo discount for a specific category (rule 4b).
 * `categoryLineCents` is that category's lineCents minus its bogo discount.
 * Returns 0 if no category promo matches, or if it doesn't match this category.
 */
export function computeCategoryPromoDiscount(
  matchedPromos: Promo[],
  category: Category,
  categoryLineCents: number
): number {
  const promo = matchedPromos.find(
    (candidate): candidate is Extract<Promo, { kind: "category" }> =>
      candidate.kind === "category" && candidate.category === category
  );

  if (!promo) {
    return 0;
  }

  return roundDivide(categoryLineCents * promo.percent, 100);
}
