import type { Line } from "./cart";
import type { ResolvedPromos } from "./promo";
import { roundHalfUp } from "./money";

export interface DiscountResult {
  bogoBySku: Map<string, number>;
  bogoTotalCents: number;
  orderLevelCents: number; // after the cap
  categoryPromoCents: number; // after the cap
  discountCents: number; // bogoTotalCents + orderLevelCents + categoryPromoCents
  base: number; // rule 4 base, pre-cap
  foodBase: number; // food lineCents minus food bogo, pre-cap
  categoryPromoByCategory: Map<string, number>; // discount by category for category promo
}

/** Bogo (floor(qty/2) free units per promo) + order-level percent/fixed discount on non-digital base + category promo discount on its category, capped at floor(subtotalCents/2) by shrinking the order-level + category parts first. */
export function computeDiscounts(lines: Line[], subtotalCents: number, promos: ResolvedPromos): DiscountResult {
  const bogoBySku = new Map<string, number>();
  for (const promo of promos.bogos) {
    const line = lines.find((l) => l.sku === promo.sku);
    const amount = line ? Math.floor(line.qty / 2) * line.unitCents : 0;
    bogoBySku.set(promo.sku, (bogoBySku.get(promo.sku) ?? 0) + amount);
  }
  const bogoTotalCents = [...bogoBySku.values()].reduce((sum, v) => sum + v, 0);

  let base = 0;
  let foodBase = 0;
  for (const line of lines) {
    if (line.category === "digital") continue;
    const net = line.lineCents - (bogoBySku.get(line.sku) ?? 0);
    base += net;
    if (line.category === "food") foodBase += net;
  }

  let orderLevelRaw = 0;
  const promo = promos.orderLevel;
  if (promo?.kind === "percent") {
    const meetsMin = promo.minSubtotalCents === undefined || base >= promo.minSubtotalCents;
    orderLevelRaw = meetsMin ? roundHalfUp(base * promo.percent, 100) : 0;
  } else if (promo?.kind === "fixed") {
    orderLevelRaw = Math.min(promo.amountCents, base);
  }

  let categoryPromoCents = 0;
  const categoryPromoByCategory = new Map<string, number>();
  if (promos.categoryPromo) {
    const category = promos.categoryPromo.category;
    let categoryBase = 0;
    for (const line of lines) {
      if (line.category === category) {
        categoryBase += line.lineCents - (bogoBySku.get(line.sku) ?? 0);
      }
    }
    categoryPromoCents = roundHalfUp(categoryBase * promos.categoryPromo.percent, 100);
    categoryPromoByCategory.set(category, categoryPromoCents);
  }

  const cap = Math.floor(subtotalCents / 2);
  const availableForOrderAndCategory = cap - bogoTotalCents;

  // Order-level gets priority in the cap
  const finalOrderLevel = Math.max(0, Math.min(orderLevelRaw, availableForOrderAndCategory));

  // Category promo gets what's left after order-level
  const remainingForCategory = availableForOrderAndCategory - finalOrderLevel;
  const finalCategoryPromo = Math.max(0, Math.min(categoryPromoCents, remainingForCategory));

  // Update the category map with final values
  if (finalCategoryPromo > 0 && promos.categoryPromo) {
    categoryPromoByCategory.set(promos.categoryPromo.category, finalCategoryPromo);
  } else {
    categoryPromoByCategory.clear();
  }

  return {
    bogoBySku,
    bogoTotalCents,
    orderLevelCents: finalOrderLevel,
    categoryPromoCents: finalCategoryPromo,
    discountCents: bogoTotalCents + finalOrderLevel + finalCategoryPromo,
    base,
    foodBase,
    categoryPromoByCategory,
  };
}

/** Discount attributed to physical (food+general) lines: only their bogo share (order-level and category promos do not count). */
export function physicalDiscountCents(lines: Line[], discount: DiscountResult): number {
  let total = 0;
  for (const line of lines) {
    if (line.category === "digital") continue;
    total += discount.bogoBySku.get(line.sku) ?? 0;
  }
  return total;
}
