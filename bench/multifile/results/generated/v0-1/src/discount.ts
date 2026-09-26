// Rules 4, 5 & part of 7: order-level discount, the overall cap, and the
// food/general split of the surviving order-level discount used for tax
// attribution.

import type { Category, ReceiptLine } from "./types";
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
}

/**
 * Computes the order-level discount (percent/fixed) against the non-digital
 * base, applies the overall cap (never more than half the subtotal — only
 * the order-level part gets reduced if the cap bites), then splits the
 * surviving order-level discount between food and general by their share of
 * the order-level base, for later tax attribution.
 */
export function computeDiscountBreakdown(
  bogoTotalCents: number,
  orderPromo: OrderLevelPromo | undefined,
  totals: CategoryTotals,
  subtotalCents: number
): DiscountBreakdown {
  // Rule 4: base excludes digital lines and their bogo discounts.
  const base =
    totals.lineCents.food + totals.lineCents.general - totals.bogoCents.food - totals.bogoCents.general;

  let rawOrderLevelDiscount = 0;
  if (orderPromo) {
    if (orderPromo.kind === "fixed") {
      rawOrderLevelDiscount = Math.min(orderPromo.amountCents, base);
    } else if (orderPromo.minSubtotalCents === undefined || base >= orderPromo.minSubtotalCents) {
      rawOrderLevelDiscount = roundHalfUp((base * orderPromo.percent) / 100);
    }
  }

  // Rule 5: cap the combined discount at half the subtotal.
  const cap = Math.floor(subtotalCents / 2);
  const rawTotal = bogoTotalCents + rawOrderLevelDiscount;
  const discountCents = Math.min(rawTotal, cap);
  const adjustedOrderLevelDiscount =
    rawTotal <= cap ? rawOrderLevelDiscount : Math.max(0, cap - bogoTotalCents);

  // Rule 7: split the surviving order-level discount between food/general
  // by their share of the order-level base.
  const foodBase = totals.lineCents.food - totals.bogoCents.food;
  const foodOrderShare = base > 0 ? roundHalfUp((adjustedOrderLevelDiscount * foodBase) / base) : 0;
  const generalOrderShare = adjustedOrderLevelDiscount - foodOrderShare;

  return { discountCents, adjustedOrderLevelDiscount, foodOrderShare, generalOrderShare };
}
