import type { Category, Promo } from "./types";
import type { Line } from "./cart";
import { roundHalfUp } from "./money";

export interface ResolvedPromos {
  orderLevel?: Extract<Promo, { kind: "percent" } | { kind: "fixed" } | { kind: "category" }>;
  bogos: Extract<Promo, { kind: "bogo" }>[];
  appliedPromoCodes: string[];
}

/**
 * Matches promoCodes against promos case-insensitively; repeats of the same code count once.
 * Unknown codes are silently ignored. Throws "promo conflict" for two order-level
 * (percent/fixed/category) codes. Any number of bogo codes may apply.
 */
export function resolvePromos(promos: Promo[], promoCodes: string[] = []): ResolvedPromos {
  const byCode = new Map(promos.map((p) => [p.code.toLowerCase(), p]));
  const seen = new Set<string>();
  const matched: Promo[] = [];
  const appliedCodes: string[] = [];
  for (const code of promoCodes) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const promo = byCode.get(key);
    if (!promo) continue; // Silently ignore unknown codes
    matched.push(promo);
    appliedCodes.push(promo.code);
  }

  const orderLevel = matched.filter(
    (p): p is Extract<Promo, { kind: "percent" } | { kind: "fixed" } | { kind: "category" }> =>
      p.kind === "percent" || p.kind === "fixed" || p.kind === "category"
  );
  if (orderLevel.length > 1) throw new Error("promo conflict");

  const bogos = matched.filter((p): p is Extract<Promo, { kind: "bogo" }> => p.kind === "bogo");
  return { orderLevel: orderLevel[0], bogos, appliedPromoCodes: appliedCodes };
}

export interface Discounts {
  discountCents: number;
  /** Bogo discount on physical (food+general) lines only — shipping's input (order-level not included). */
  physicalDiscountCents: number;
  /** Discount attributed to each category, after the cap — tax's input. */
  categoryDiscountCents: Record<Category, number>;
}

/**
 * Applies every bogo promo (floor(qty/2) free units of its sku), then at most one order-level
 * percent/fixed/category promo, capped so total discount never exceeds half the subtotal
 * (the order-level part absorbs the cap; bogo alone never exceeds it). Splits the post-cap
 * order-level amount between food and general by their pre-cap share of that base (or attributes
 * category discount entirely to its category). physicalNet for shipping is physical lineCents
 * minus only bogo discounts on physical lines (order-level discounts don't count against it).
 */
export function computeDiscounts(lines: Line[], subtotalCents: number, promos: ResolvedPromos): Discounts {
  const bogoByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  let bogoTotal = 0;
  for (const bogo of promos.bogos) {
    const line = lines.find((l) => l.sku === bogo.sku);
    if (!line) continue;
    const amount = Math.floor(line.qty / 2) * line.unitCents;
    bogoByCategory[line.category] += amount;
    bogoTotal += amount;
  }

  const nonDigitalLineCents = lines.filter((l) => l.category !== "digital").reduce((sum, l) => sum + l.lineCents, 0);
  const nonDigitalBogo = bogoByCategory.food + bogoByCategory.general;
  const base = nonDigitalLineCents - nonDigitalBogo;

  let orderLevelRaw = 0;
  let categoryLevel = 0;
  const promo = promos.orderLevel;
  if (promo?.kind === "percent") {
    const meetsMin = promo.minSubtotalCents === undefined || base >= promo.minSubtotalCents;
    orderLevelRaw = meetsMin ? roundHalfUp((base * promo.percent) / 100) : 0;
  } else if (promo?.kind === "fixed") {
    orderLevelRaw = Math.min(promo.amountCents, base);
  } else if (promo?.kind === "category") {
    const categoryBogo = bogoByCategory[promo.category];
    const categoryLineCents = lines
      .filter((l) => l.category === promo.category)
      .reduce((sum, l) => sum + l.lineCents, 0);
    const categoryBase = categoryLineCents - categoryBogo;
    categoryLevel = roundHalfUp((categoryBase * promo.percent) / 100);
  }

  const totalOrderLevelRaw = orderLevelRaw + categoryLevel;
  const cap = Math.floor(subtotalCents / 2);
  const cappedOrderLevel = bogoTotal + totalOrderLevelRaw > cap ? cap - bogoTotal : totalOrderLevelRaw;

  // Split capped order level between percent/fixed and category
  let cappedOrderLevelRaw = orderLevelRaw;
  let cappedCategoryLevel = categoryLevel;
  if (totalOrderLevelRaw > cappedOrderLevel) {
    // Cap was applied; reduce both proportionally
    if (totalOrderLevelRaw > 0) {
      const ratio = cappedOrderLevel / totalOrderLevelRaw;
      cappedOrderLevelRaw = Math.floor(orderLevelRaw * ratio);
      cappedCategoryLevel = cappedOrderLevel - cappedOrderLevelRaw;
    }
  }

  const discountCents = bogoTotal + cappedOrderLevel;

  // Split the capped percent/fixed discount between food and general by their pre-cap share
  const foodLineCents = lines.filter((l) => l.category === "food").reduce((sum, l) => sum + l.lineCents, 0);
  const foodBase = foodLineCents - bogoByCategory.food;
  const foodShare = base > 0 ? roundHalfUp((cappedOrderLevelRaw * foodBase) / base) : 0;
  const generalShare = cappedOrderLevelRaw - foodShare;

  return {
    discountCents,
    physicalDiscountCents: nonDigitalBogo,
    categoryDiscountCents: {
      food: bogoByCategory.food + (promo?.kind === "category" && promo.category === "food" ? cappedCategoryLevel : foodShare),
      general: bogoByCategory.general + (promo?.kind === "category" && promo.category === "general" ? cappedCategoryLevel : generalShare),
      digital: bogoByCategory.digital + (promo?.kind === "category" && promo.category === "digital" ? cappedCategoryLevel : 0),
    },
  };
}
