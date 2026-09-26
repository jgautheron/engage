import type { Line } from "./cart";
import type { ResolvedPromos } from "./promo";
import { roundHalfUp } from "./money";

export interface DiscountResult {
  bogoBySku: Map<string, number>;
  bogoTotalCents: number;
  orderLevelCents: number; // after the cap
  discountCents: number; // bogoTotalCents + orderLevelCents
  base: number; // rule 4 base, pre-cap
  foodBase: number; // food lineCents minus food bogo, pre-cap
}

/** Bogo (floor(qty/2) free units per promo) + order-level percent/fixed discount on non-digital base, capped at floor(subtotalCents/2) by shrinking the order-level part first. */
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

  const cap = Math.floor(subtotalCents / 2);
  const orderLevelCents = Math.max(0, Math.min(orderLevelRaw, cap - bogoTotalCents));

  return { bogoBySku, bogoTotalCents, orderLevelCents, discountCents: bogoTotalCents + orderLevelCents, base, foodBase };
}

/** Discount attributed to physical (food+general) lines: their bogo share plus the whole order-level part (rule 6). */
export function physicalDiscountCents(lines: Line[], discount: DiscountResult): number {
  let total = discount.orderLevelCents;
  for (const line of lines) {
    if (line.category === "digital") continue;
    total += discount.bogoBySku.get(line.sku) ?? 0;
  }
  return total;
}
