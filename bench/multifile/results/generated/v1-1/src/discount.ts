import type { Line } from "./cart.js";
import type { Promo } from "./types.js";
import { roundHalfUp } from "./round.js";

export interface Discount {
  discountCents: number;
  bogoBySku: Map<string, number>;
  orderLevelCents: number;
  base: number; // rule 4's base: non-digital lineCents minus bogo on those lines
}

export function computeDiscount(lines: Line[], promos: Promo[], subtotalCents: number): Discount {
  const bySku = new Map(lines.map((l) => [l.sku, l]));

  const bogoBySku = new Map<string, number>();
  for (const promo of promos) {
    if (promo.kind !== "bogo") continue;
    const line = bySku.get(promo.sku);
    const cents = line ? Math.floor(line.qty / 2) * line.unitCents : 0;
    bogoBySku.set(promo.sku, (bogoBySku.get(promo.sku) ?? 0) + cents);
  }
  const bogoTotal = [...bogoBySku.values()].reduce((sum, c) => sum + c, 0);

  const nonDigital = lines.filter((l) => l.category !== "digital");
  const nonDigitalBogo = nonDigital.reduce((sum, l) => sum + (bogoBySku.get(l.sku) ?? 0), 0);
  const base = nonDigital.reduce((sum, l) => sum + l.lineCents, 0) - nonDigitalBogo;

  const orderLevel = promos.find((p) => p.kind === "percent" || p.kind === "fixed");
  let orderLevelRaw = 0;
  if (orderLevel?.kind === "percent") {
    const meetsMin = orderLevel.minSubtotalCents === undefined || base >= orderLevel.minSubtotalCents;
    orderLevelRaw = meetsMin ? roundHalfUp((base * orderLevel.percent) / 100) : 0;
  } else if (orderLevel?.kind === "fixed") {
    orderLevelRaw = Math.min(orderLevel.amountCents, base);
  }

  // Cap total discount at half the subtotal; bogo alone never exceeds it, so
  // any reduction lands on the order-level part.
  const cap = Math.floor(subtotalCents / 2);
  const orderLevelCents = Math.max(0, Math.min(orderLevelRaw, cap - bogoTotal));

  return { discountCents: bogoTotal + orderLevelCents, bogoBySku, orderLevelCents, base };
}
