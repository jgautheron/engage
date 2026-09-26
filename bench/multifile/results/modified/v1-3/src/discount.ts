import type { Category } from "./types";
import type { ResolvedLine } from "./cart";
import type { ResolvedPromos } from "./promos";
import { roundHalfUp } from "./round";

export interface DiscountResult {
  discountCents: number;
  // Final, post-cap discount attributed to each category (bogo + order-level share).
  byCategory: Record<Category, number>;
  // Bogo discount by category (used for shipping calculation).
  bogoByCategory: Record<Category, number>;
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
  } else if (promo?.kind === "category") {
    const categoryLineCents = sumLineCents(lines, (l) => l.category === promo.category);
    const categoryBogo = bogoByCategory[promo.category];
    const categoryBase = categoryLineCents - categoryBogo;
    orderLevelDiscount = roundHalfUp((categoryBase * promo.percent) / 100);
  }

  const cap = Math.floor(subtotalCents / 2);
  const rawTotal = bogoTotal + orderLevelDiscount;
  const orderLevelFinal = rawTotal > cap ? cap - bogoTotal : orderLevelDiscount;
  const discountCents = bogoTotal + orderLevelFinal;

  const byCategory = zeroByCategory();
  if (promos.orderLevel?.kind === "category") {
    // Category promo discount is attributed entirely to its own category
    const cat = promos.orderLevel.category;
    byCategory.food = cat === "food" ? bogoByCategory.food + orderLevelFinal : bogoByCategory.food;
    byCategory.general = cat === "general" ? bogoByCategory.general + orderLevelFinal : bogoByCategory.general;
    byCategory.digital = cat === "digital" ? bogoByCategory.digital + orderLevelFinal : bogoByCategory.digital;
  } else {
    // Percent and fixed promos distribute across non-digital categories
    const foodPart = base > 0 ? roundHalfUp((orderLevelFinal * foodBase) / base) : 0;
    const generalPart = orderLevelFinal - foodPart;
    byCategory.food = bogoByCategory.food + foodPart;
    byCategory.general = bogoByCategory.general + generalPart;
    byCategory.digital = bogoByCategory.digital;
  }

  return { discountCents, byCategory, bogoByCategory };
}
