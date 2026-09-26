import type { Category, Promo } from "./types";
import type { Line } from "./cart";
import { roundHalfUp } from "./money";

export interface ResolvedPromos {
  orderLevel?: Extract<Promo, { kind: "percent" } | { kind: "fixed" }>;
  bogos: Extract<Promo, { kind: "bogo" }>[];
}

/**
 * Matches promoCodes against promos case-insensitively; repeats of the same code count once.
 * Throws "unknown promo" for an unmatched code, or "promo conflict" for two order-level
 * (percent/fixed) codes. Any number of bogo codes may apply.
 */
export function resolvePromos(promos: Promo[], promoCodes: string[] = []): ResolvedPromos {
  const byCode = new Map(promos.map((p) => [p.code.toLowerCase(), p]));
  const seen = new Set<string>();
  const matched: Promo[] = [];
  for (const code of promoCodes) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const promo = byCode.get(key);
    if (!promo) throw new Error("unknown promo");
    matched.push(promo);
  }

  const orderLevel = matched.filter(
    (p): p is Extract<Promo, { kind: "percent" } | { kind: "fixed" }> => p.kind === "percent" || p.kind === "fixed"
  );
  if (orderLevel.length > 1) throw new Error("promo conflict");

  const bogos = matched.filter((p): p is Extract<Promo, { kind: "bogo" }> => p.kind === "bogo");
  return { orderLevel: orderLevel[0], bogos };
}

export interface Discounts {
  discountCents: number;
  /** Discount attributed to physical (food+general) lines, after the cap — shipping's input. */
  physicalDiscountCents: number;
  /** Discount attributed to each category, after the cap — tax's input. */
  categoryDiscountCents: Record<Category, number>;
}

/**
 * Applies every bogo promo (floor(qty/2) free units of its sku), then at most one order-level
 * percent/fixed promo on the non-digital base, capped so total discount never exceeds half the
 * subtotal (the order-level part absorbs the cap; bogo alone never exceeds it). Splits the
 * post-cap order-level amount between food and general by their pre-cap share of that base.
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
  const promo = promos.orderLevel;
  if (promo?.kind === "percent") {
    const meetsMin = promo.minSubtotalCents === undefined || base >= promo.minSubtotalCents;
    orderLevelRaw = meetsMin ? roundHalfUp((base * promo.percent) / 100) : 0;
  } else if (promo?.kind === "fixed") {
    orderLevelRaw = Math.min(promo.amountCents, base);
  }

  const cap = Math.floor(subtotalCents / 2);
  const orderLevel = bogoTotal + orderLevelRaw > cap ? cap - bogoTotal : orderLevelRaw;
  const discountCents = bogoTotal + orderLevel;

  const foodLineCents = lines.filter((l) => l.category === "food").reduce((sum, l) => sum + l.lineCents, 0);
  const foodBase = foodLineCents - bogoByCategory.food;
  const foodShare = base > 0 ? roundHalfUp((orderLevel * foodBase) / base) : 0;
  const generalShare = orderLevel - foodShare;

  return {
    discountCents,
    physicalDiscountCents: nonDigitalBogo + orderLevel,
    categoryDiscountCents: {
      food: bogoByCategory.food + foodShare,
      general: bogoByCategory.general + generalShare,
      digital: bogoByCategory.digital,
    },
  };
}
