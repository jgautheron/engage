import type { Category } from "./types";
import type { ResolvedLine } from "./cart";
import type { ResolvedPromos } from "./promos";
import { roundHalfUp } from "./round";

export interface DiscountResult {
  discountCents: number;
  // Final, post-cap discount attributed to each category (bogo + order-level share).
  byCategory: Record<Category, number>;
}

const zeroByCategory = (): Record<Category, number> => ({ food: 0, general: 0, digital: 0 });

function sumLineCents(lines: ResolvedLine[], predicate: (l: ResolvedLine) => boolean): number {
  return lines.filter(predicate).reduce((sum, l) => sum + l.lineCents, 0);
}

export function computeDiscount(
  lines: ResolvedLine[],
  promos: ResolvedPromos,
  subtotalCents: number,
): DiscountResult {
  const bogoByCategory = zeroByCategory();
  let bogoTotal = 0;
  for (const bogo of promos.bogos) {
    const line = lines.find((l) => l.sku === bogo.sku);
    if (!line) continue; // sku not in cart: applies, gives 0
    const amount = Math.floor(line.qty / 2) * line.unitCents;
    bogoByCategory[line.category] += amount;
    bogoTotal += amount;
  }

  const nonDigitalLineCents = sumLineCents(lines, (l) => l.category !== "digital");
  const bogoNonDigitalTotal = bogoByCategory.food + bogoByCategory.general;
  const base = nonDigitalLineCents - bogoNonDigitalTotal;

  const foodLineCents = sumLineCents(lines, (l) => l.category === "food");
  const foodBase = foodLineCents - bogoByCategory.food;

  let orderLevelDiscount = 0;
  const promo = promos.orderLevel;
  if (promo?.kind === "percent") {
    const meetsMin = promo.minSubtotalCents === undefined || base >= promo.minSubtotalCents;
    orderLevelDiscount = meetsMin ? roundHalfUp((base * promo.percent) / 100) : 0;
  } else if (promo?.kind === "fixed") {
    orderLevelDiscount = Math.min(promo.amountCents, base);
  }

  const cap = Math.floor(subtotalCents / 2);
  const rawTotal = bogoTotal + orderLevelDiscount;
  const orderLevelFinal = rawTotal > cap ? cap - bogoTotal : orderLevelDiscount;
  const discountCents = bogoTotal + orderLevelFinal;

  const foodPart = base > 0 ? roundHalfUp((orderLevelFinal * foodBase) / base) : 0;
  const generalPart = orderLevelFinal - foodPart;

  const byCategory = zeroByCategory();
  byCategory.food = bogoByCategory.food + foodPart;
  byCategory.general = bogoByCategory.general + generalPart;
  byCategory.digital = bogoByCategory.digital;

  return { discountCents, byCategory };
}
