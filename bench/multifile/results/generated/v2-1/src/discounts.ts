import type { Line } from "./cart";
import type { ActivePromos } from "./promos";
import { roundHalfUp } from "./money";

/** Per-sku BOGO discount: floor(qty/2) free units at unit price; 0 if a promo's sku isn't in the cart. */
export function computeBogoBySku(lines: Line[], bogos: ActivePromos["bogos"]): Map<string, number> {
  const lineBySku = new Map(lines.map((line) => [line.sku, line]));
  const bySku = new Map<string, number>();

  for (const bogo of bogos) {
    const line = lineBySku.get(bogo.sku);
    if (!line) continue;
    const freeUnits = Math.floor(line.qty / 2);
    const discount = freeUnits * line.product.priceCents;
    bySku.set(bogo.sku, (bySku.get(bogo.sku) ?? 0) + discount);
  }

  return bySku;
}

export interface OrderLevelDiscount {
  beforeCap: number;
  base: number;
  foodBase: number;
}

/**
 * Order-level (percent/fixed) discount, computed on non-digital lines only.
 * base = non-digital lineCents minus their bogo discount; foodBase is the food-only share of that.
 */
export function computeOrderLevelDiscount(
  lines: Line[],
  bogoBySku: Map<string, number>,
  order: ActivePromos["order"],
): OrderLevelDiscount {
  const netOf = (line: Line) => line.lineCents - (bogoBySku.get(line.sku) ?? 0);
  const nonDigital = lines.filter((line) => line.product.category !== "digital");

  const base = nonDigital.reduce((sum, line) => sum + netOf(line), 0);
  const foodBase = nonDigital
    .filter((line) => line.product.category === "food")
    .reduce((sum, line) => sum + netOf(line), 0);

  if (!order) return { beforeCap: 0, base, foodBase };

  if (order.kind === "fixed") return { beforeCap: Math.min(order.amountCents, base), base, foodBase };

  const meetsMinimum = order.minSubtotalCents === undefined || base >= order.minSubtotalCents;
  const beforeCap = meetsMinimum ? roundHalfUp((base * order.percent) / 100) : 0;
  return { beforeCap, base, foodBase };
}

export interface CappedDiscount {
  discountCents: number;
  bogoTotal: number;
  orderLevelAfterCap: number;
}

/** Caps bogo + order-level discount at floor(subtotal/2), shrinking the order-level part first. */
export function applyCap(
  bogoBySku: Map<string, number>,
  orderLevelBeforeCap: number,
  subtotalCents: number,
): CappedDiscount {
  const bogoTotal = [...bogoBySku.values()].reduce((sum, cents) => sum + cents, 0);
  const cap = Math.floor(subtotalCents / 2);
  const raw = bogoTotal + orderLevelBeforeCap;

  const orderLevelAfterCap = raw > cap ? Math.max(0, cap - bogoTotal) : orderLevelBeforeCap;

  return { discountCents: bogoTotal + orderLevelAfterCap, bogoTotal, orderLevelAfterCap };
}
