import type { Promo, CheckoutOptions } from "./types";
import type { Line } from "./cart";
import { roundHalfUp } from "./money";

export interface DiscountResult {
  bogoBySku: Map<string, number>;
  bogoTotal: number;
  orderLevelActual: number;
  discountCents: number;
  base: number;
  foodBase: number;
}

function matchPromos(options: CheckoutOptions): Promo[] {
  const seen = new Set<string>();
  const matched: Promo[] = [];
  for (const code of options.promoCodes ?? []) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const promo = options.promos.find((p) => p.code.toLowerCase() === key);
    if (!promo) throw new Error(`unknown promo: ${code}`);
    matched.push(promo);
  }
  return matched;
}

export function computeDiscounts(lines: Line[], subtotalCents: number, options: CheckoutOptions): DiscountResult {
  const matched = matchPromos(options);

  const orderLevelPromos = matched.filter((p) => p.kind === "percent" || p.kind === "fixed");
  if (orderLevelPromos.length > 1) throw new Error("promo conflict");
  const orderLevelPromo = orderLevelPromos[0];

  const bogoPromos = matched.filter((p): p is Extract<Promo, { kind: "bogo" }> => p.kind === "bogo");
  const bogoBySku = new Map<string, number>();
  for (const promo of bogoPromos) {
    const line = lines.find((l) => l.sku === promo.sku);
    const discount = line ? Math.floor(line.qty / 2) * line.unitCents : 0;
    bogoBySku.set(promo.sku, (bogoBySku.get(promo.sku) ?? 0) + discount);
  }
  const bogoTotal = [...bogoBySku.values()].reduce((sum, c) => sum + c, 0);

  let base = 0;
  let foodBase = 0;
  for (const line of lines) {
    if (line.category === "digital") continue;
    const net = line.lineCents - (bogoBySku.get(line.sku) ?? 0);
    base += net;
    if (line.category === "food") foodBase += net;
  }

  let rawOrderLevel = 0;
  if (orderLevelPromo) {
    if (orderLevelPromo.kind === "percent") {
      const meetsMin = orderLevelPromo.minSubtotalCents === undefined || base >= orderLevelPromo.minSubtotalCents;
      rawOrderLevel = meetsMin ? roundHalfUp((base * orderLevelPromo.percent) / 100) : 0;
    } else if (orderLevelPromo.kind === "fixed") {
      rawOrderLevel = Math.min(orderLevelPromo.amountCents, base);
    }
  }

  const cap = Math.floor(subtotalCents / 2);
  const orderLevelActual = bogoTotal + rawOrderLevel > cap ? Math.max(0, cap - bogoTotal) : rawOrderLevel;
  const discountCents = bogoTotal + orderLevelActual;

  return { bogoBySku, bogoTotal, orderLevelActual, discountCents, base, foodBase };
}
