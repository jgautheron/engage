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
  appliedPromoCodes: string[];
  discountByCategory: Map<string, number>;
}

function matchPromos(options: CheckoutOptions): { matched: Promo[]; appliedCodes: string[] } {
  const seen = new Set<string>();
  const matched: Promo[] = [];
  const appliedCodes: string[] = [];
  for (const code of options.promoCodes ?? []) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const promo = options.promos.find((p) => p.code.toLowerCase() === key);
    if (!promo) continue; // lenient: ignore unknown codes
    matched.push(promo);
    appliedCodes.push(promo.code); // use canonical code from promo definition
  }
  return { matched, appliedCodes };
}

export function computeDiscounts(lines: Line[], subtotalCents: number, options: CheckoutOptions): DiscountResult {
  const { matched, appliedCodes } = matchPromos(options);

  // Collect order-level promos (percent, fixed, category)
  const orderLevelPromos = matched.filter((p) => p.kind === "percent" || p.kind === "fixed" || p.kind === "category");
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

  // Calculate bases for each category and overall
  const lineCentsByCategory: Record<string, number> = { food: 0, general: 0, digital: 0 };
  const bogoByCategory: Record<string, number> = { food: 0, general: 0, digital: 0 };
  for (const line of lines) {
    lineCentsByCategory[line.category] = (lineCentsByCategory[line.category] ?? 0) + line.lineCents;
    bogoByCategory[line.category] = (bogoByCategory[line.category] ?? 0) + (bogoBySku.get(line.sku) ?? 0);
  }

  let base = 0;
  let foodBase = 0;
  for (const line of lines) {
    if (line.category === "digital") continue;
    const net = line.lineCents - (bogoBySku.get(line.sku) ?? 0);
    base += net;
    if (line.category === "food") foodBase += net;
  }

  const discountByCategory = new Map<string, number>();

  let rawOrderLevel = 0;
  if (orderLevelPromo) {
    if (orderLevelPromo.kind === "percent") {
      const meetsMin = orderLevelPromo.minSubtotalCents === undefined || base >= orderLevelPromo.minSubtotalCents;
      rawOrderLevel = meetsMin ? roundHalfUp((base * orderLevelPromo.percent) / 100) : 0;
    } else if (orderLevelPromo.kind === "fixed") {
      rawOrderLevel = Math.min(orderLevelPromo.amountCents, base);
    } else if (orderLevelPromo.kind === "category") {
      const categoryBase = (lineCentsByCategory[orderLevelPromo.category] ?? 0) - (bogoByCategory[orderLevelPromo.category] ?? 0);
      rawOrderLevel = roundHalfUp((categoryBase * orderLevelPromo.percent) / 100);
    }
  }

  const cap = Math.floor(subtotalCents / 2);
  const orderLevelActual = bogoTotal + rawOrderLevel > cap ? Math.max(0, cap - bogoTotal) : rawOrderLevel;

  // For category promos, attribute the (capped) discount to its category
  if (orderLevelPromo?.kind === "category") {
    discountByCategory.set(orderLevelPromo.category, orderLevelActual);
  }

  const discountCents = bogoTotal + orderLevelActual;

  return {
    bogoBySku,
    bogoTotal,
    orderLevelActual,
    discountCents,
    base,
    foodBase,
    appliedPromoCodes: appliedCodes,
    discountByCategory
  };
}
