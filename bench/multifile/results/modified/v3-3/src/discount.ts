import type { LineDetail } from "./line";
import { roundHalfUp } from "./money";
import type { Category } from "./types";

type OrderLevelPromo =
  | { kind: "percent"; percent: number; minSubtotalCents?: number }
  | { kind: "fixed"; amountCents: number }
  | { kind: "category"; category: string; percent: number };

export interface DiscountResult {
  bogoByCategory: Record<Category, number>;
  categoryLineCents: Record<Category, number>;
  base: number; // rule 4: non-digital lineCents minus bogo on those lines
  orderLevelCapped: number;
  categoryDiscountCapped: number;
  categoryPromoCategory?: string;
  discountCents: number;
}

function emptyByCategory(): Record<Category, number> {
  return { food: 0, general: 0, digital: 0 };
}

/**
 * Computes bogo + order-level (percent/fixed/category) discounts and applies the
 * floor(subtotal/2) cap by shrinking the order-level part (bogo is never reduced).
 */
export function computeDiscounts(
  lines: LineDetail[],
  subtotalCents: number,
  orderLevel: OrderLevelPromo | undefined,
  bogoSkus: string[],
): DiscountResult {
  const categoryLineCents = emptyByCategory();
  for (const line of lines) categoryLineCents[line.category] += line.lineCents;

  const bogoByCategory = emptyByCategory();
  for (const sku of bogoSkus) {
    const line = lines.find((l) => l.sku === sku);
    if (!line) continue; // sku not in cart: 0 discount
    const freeUnits = Math.floor(line.qty / 2);
    bogoByCategory[line.category] += freeUnits * line.unitCents;
  }
  const bogoTotal = bogoByCategory.food + bogoByCategory.general + bogoByCategory.digital;

  const base = categoryLineCents.food + categoryLineCents.general - bogoByCategory.food - bogoByCategory.general;

  let orderLevelRaw = 0;
  if (orderLevel?.kind === "percent") {
    const meetsMin = orderLevel.minSubtotalCents === undefined || base >= orderLevel.minSubtotalCents;
    orderLevelRaw = meetsMin ? roundHalfUp(base * orderLevel.percent, 100) : 0;
  } else if (orderLevel?.kind === "fixed") {
    orderLevelRaw = Math.min(orderLevel.amountCents, base);
  }

  let categoryDiscountRaw = 0;
  let categoryPromoCategory: string | undefined = undefined;
  if (orderLevel?.kind === "category") {
    categoryPromoCategory = orderLevel.category;
    const categoryBase = categoryLineCents[orderLevel.category as Category] - bogoByCategory[orderLevel.category as Category];
    categoryDiscountRaw = roundHalfUp(categoryBase * orderLevel.percent, 100);
  }

  const cap = Math.floor(subtotalCents / 2);
  const rawTotal = bogoTotal + orderLevelRaw + categoryDiscountRaw;
  let orderLevelCapped = 0;
  let categoryDiscountCapped = 0;

  if (rawTotal > cap) {
    const available = cap - bogoTotal;
    if (categoryDiscountRaw > 0) {
      categoryDiscountCapped = Math.min(categoryDiscountRaw, available);
    } else {
      orderLevelCapped = Math.max(0, available);
    }
  } else {
    orderLevelCapped = orderLevelRaw;
    categoryDiscountCapped = categoryDiscountRaw;
  }

  const discountCents = Math.min(rawTotal, cap);

  return {
    bogoByCategory,
    categoryLineCents,
    base,
    orderLevelCapped,
    categoryDiscountCapped,
    categoryPromoCategory,
    discountCents,
  };
}
