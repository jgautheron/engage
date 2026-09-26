// Rules 4, 5 & part of 7: order-level discount, the overall cap, and the
// food/general split of the surviving order-level discount used for tax
// attribution.

import type { Category, ReceiptLine, Promo } from "./types";
import type { OrderLevelPromo } from "./promos";
import { roundHalfUp } from "./rounding";

export interface CategoryTotals {
  lineCents: Record<Category, number>;
  bogoCents: Record<Category, number>;
}

/** Aggregates receipt lineCents and bogo discounts per product category. */
export function computeCategoryTotals(
  lines: ReceiptLine[],
  categoryBySku: Map<string, Category>,
  bogoBySku: Map<string, number>
): CategoryTotals {
  const lineCents: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  const bogoCents: Record<Category, number> = { food: 0, general: 0, digital: 0 };

  for (const line of lines) {
    const category = categoryBySku.get(line.sku);
    if (!category) continue; // unreachable: cart validation guarantees a catalog match

    lineCents[category] += line.lineCents;
    bogoCents[category] += bogoBySku.get(line.sku) ?? 0;
  }

  return { lineCents, bogoCents };
}

export interface DiscountBreakdown {
  discountCents: number;
  adjustedOrderLevelDiscount: number;
  foodOrderShare: number;
  generalOrderShare: number;
  categoryOrderShare: Record<Category, number>;
}

/**
 * Computes the order-level discount (percent/fixed/category) against the appropriate
 * base, applies the overall cap (never more than half the subtotal — only
 * the order-level part gets reduced if the cap bites), then splits the
 * surviving order-level discount by category for later tax attribution.
 */
export function computeDiscountBreakdown(
  bogoTotalCents: number,
  orderPromo: OrderLevelPromo | undefined,
  totals: CategoryTotals,
  subtotalCents: number
): DiscountBreakdown {
  const categoryOrderShare: Record<Category, number> = { food: 0, general: 0, digital: 0 };

  // Rule 4: for percent/fixed, base excludes digital lines and their bogo discounts.
  // For category promo, base is that category's lineCents minus its bogo discount.
  let rawOrderLevelDiscount = 0;
  let isCategory = false;
  let categoryPromoTarget: Category | undefined;

  if (orderPromo) {
    if (orderPromo.kind === "category") {
      isCategory = true;
      categoryPromoTarget = orderPromo.category;
      const categoryBase = totals.lineCents[orderPromo.category] - totals.bogoCents[orderPromo.category];
      rawOrderLevelDiscount = roundHalfUp((categoryBase * orderPromo.percent) / 100);
    } else {
      const base =
        totals.lineCents.food + totals.lineCents.general - totals.bogoCents.food - totals.bogoCents.general;
      if (orderPromo.kind === "fixed") {
        rawOrderLevelDiscount = Math.min(orderPromo.amountCents, base);
      } else if (orderPromo.minSubtotalCents === undefined || base >= orderPromo.minSubtotalCents) {
        rawOrderLevelDiscount = roundHalfUp((base * orderPromo.percent) / 100);
      }
    }
  }

  // Rule 5: cap the combined discount at half the subtotal.
  const cap = Math.floor(subtotalCents / 2);
  const rawTotal = bogoTotalCents + rawOrderLevelDiscount;
  const discountCents = Math.min(rawTotal, cap);
  const adjustedOrderLevelDiscount =
    rawTotal <= cap ? rawOrderLevelDiscount : Math.max(0, cap - bogoTotalCents);

  // Rule 7: split the surviving order-level discount by category
  if (isCategory && categoryPromoTarget) {
    // For category promo, the discount is attributed entirely to that category
    categoryOrderShare[categoryPromoTarget] = adjustedOrderLevelDiscount;
  } else {
    // For percent/fixed promo, split between food/general by their share of the order-level base.
    const base =
      totals.lineCents.food + totals.lineCents.general - totals.bogoCents.food - totals.bogoCents.general;
    const foodBase = totals.lineCents.food - totals.bogoCents.food;
    categoryOrderShare.food = base > 0 ? roundHalfUp((adjustedOrderLevelDiscount * foodBase) / base) : 0;
    categoryOrderShare.general = adjustedOrderLevelDiscount - categoryOrderShare.food;
  }

  return {
    discountCents,
    adjustedOrderLevelDiscount,
    foodOrderShare: categoryOrderShare.food,
    generalOrderShare: categoryOrderShare.general,
    categoryOrderShare,
  };
}
