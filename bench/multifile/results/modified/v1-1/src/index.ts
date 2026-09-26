import { buildLines } from "./cart.js";
import { computeDiscount } from "./discount.js";
import { resolvePromos } from "./promos.js";
import { amountToFreeShipping, computeShipping } from "./shipping.js";
import { computeTax } from "./tax.js";
import type { CartLine, CheckoutOptions, Product, Receipt } from "./types.js";

export * from "./types.js";

export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  const lines = buildLines(catalog, cart);
  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);

  const { promos, appliedCodes } = resolvePromos(options.promos, options.promoCodes);
  const { discountCents, bogoBySku, orderLevelCents, base, orderLevelKind, orderLevelCategory } = computeDiscount(
    lines,
    promos,
    subtotalCents,
  );

  const shippingCents = computeShipping(lines, bogoBySku);
  const taxCents = computeTax(lines, bogoBySku, orderLevelCents, base, shippingCents, options.region, orderLevelKind, orderLevelCategory);
  const totalCents = subtotalCents - discountCents + shippingCents + taxCents;

  return {
    lines: lines.map(({ sku, qty, unitCents, lineCents }) => ({ sku, qty, unitCents, lineCents })),
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents,
    appliedPromoCodes: appliedCodes,
  };
}

export function amountToFreeShippingCents(catalog: Product[], cart: CartLine[], options: CheckoutOptions): number {
  const lines = buildLines(catalog, cart);
  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);

  const { promos } = resolvePromos(options.promos, options.promoCodes);
  const { bogoBySku } = computeDiscount(lines, promos, subtotalCents);

  return amountToFreeShipping(lines, bogoBySku);
}
