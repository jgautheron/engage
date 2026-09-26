// Rules 3, 4, 5: BOGO, order-level discount, and the overall cap.
import type { Category, Promo } from "./types";
import type { NormalizedLine } from "./cart";
import { roundHalfUp } from "./round";

export interface DiscountBreakdown {
  /** Total bogo discount across all matched bogo promos. */
  bogoTotal: number;
  /** Bogo discount attributed to each category (sku's own category). */
  bogoByCategory: Record<Category, number>;
  /** Order-level discount actually granted, after the overall cap. */
  orderLevelDiscount: number;
  /** orderLevelDiscount split onto food, by share of the order-level base. */
  orderLevelFood: number;
  /** orderLevelDiscount split onto general (the rest). */
  orderLevelGeneral: number;
  /** Category promo discount by category, after the cap. */
  categoryPromoByCategory: Record<Category, number>;
  /** bogoTotal + orderLevelDiscount + sum(categoryPromoByCategory), i.e. the final discountCents. */
  discountCents: number;
}

/**
 * Computes bogo + order-level discounts and applies the overall cap
 * (never more than floor(subtotalCents / 2), reducing the order-level
 * part first — bogo alone is assumed to never exceed the cap).
 */
export function computeDiscounts(
  lines: NormalizedLine[],
  subtotalCents: number,
  orderLevelPromo: Promo | undefined,
  bogoPromos: Promo[],
  categoryPromo: Promo | undefined = undefined
): DiscountBreakdown {
  const lineBySku = new Map(lines.map((line) => [line.sku, line]));

  const bogoByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  let bogoTotal = 0;

  for (const promo of bogoPromos) {
    if (promo.kind !== "bogo") continue;
    const line = lineBySku.get(promo.sku);
    if (!line) continue; // sku not in cart -> 0, but still "applies"

    const freeUnits = Math.floor(line.qty / 2);
    const amount = freeUnits * line.unitCents;
    bogoTotal += amount;
    bogoByCategory[line.category] += amount;
  }

  // Compute lineCents by category for later use
  const lineCentsByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  for (const line of lines) {
    lineCentsByCategory[line.category] += line.lineCents;
  }

  // Rule 4: base = non-digital (food + general) lineCents minus the bogo
  // discount already attributed to those lines.
  let nonDigitalLineCents = 0;
  let foodLineCents = 0;
  for (const line of lines) {
    if (line.category !== "digital") {
      nonDigitalLineCents += line.lineCents;
    }
    if (line.category === "food") {
      foodLineCents += line.lineCents;
    }
  }
  const nonDigitalBogo = bogoByCategory.food + bogoByCategory.general;
  const base = nonDigitalLineCents - nonDigitalBogo;
  const foodBase = foodLineCents - bogoByCategory.food;

  let orderLevelRaw = 0;
  if (orderLevelPromo) {
    if (orderLevelPromo.kind === "percent") {
      const meetsMin =
        orderLevelPromo.minSubtotalCents === undefined || base >= orderLevelPromo.minSubtotalCents;
      orderLevelRaw = meetsMin ? roundHalfUp(base * orderLevelPromo.percent, 100) : 0;
    } else if (orderLevelPromo.kind === "fixed") {
      orderLevelRaw = Math.min(orderLevelPromo.amountCents, base);
    }
  }

  // Category promo discount
  const categoryPromoByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  let categoryPromoRaw = 0;
  if (categoryPromo && categoryPromo.kind === "category") {
    // Calculate categoryBase for the target category
    const categoryLineCents = lineCentsByCategory[categoryPromo.category];
    const categoryBogo = bogoByCategory[categoryPromo.category];
    const categoryBase = categoryLineCents - categoryBogo;

    if (categoryBase > 0) {
      categoryPromoRaw = roundHalfUp(categoryBase * categoryPromo.percent, 100);
    }
  }

  // Rule 5: cap.
  const cap = Math.floor(subtotalCents / 2);
  const rawTotal = bogoTotal + orderLevelRaw + categoryPromoRaw;
  const orderLevelDiscount = rawTotal > cap ? Math.max(0, cap - bogoTotal - categoryPromoRaw) : orderLevelRaw;
  const categoryPromoDiscount = categoryPromoRaw;

  if (categoryPromo && categoryPromo.kind === "category") {
    categoryPromoByCategory[categoryPromo.category] = categoryPromoDiscount;
  }

  const discountCents = bogoTotal + orderLevelDiscount + categoryPromoDiscount;

  // Rule 7: split the (post-cap) order-level discount between food/general.
  let orderLevelFood = 0;
  if (base > 0 && orderLevelDiscount > 0) {
    orderLevelFood = roundHalfUp(orderLevelDiscount * foodBase, base);
  }
  const orderLevelGeneral = orderLevelDiscount - orderLevelFood;

  return {
    bogoTotal,
    bogoByCategory,
    orderLevelDiscount,
    orderLevelFood,
    orderLevelGeneral,
    categoryPromoByCategory,
    discountCents,
  };
}
