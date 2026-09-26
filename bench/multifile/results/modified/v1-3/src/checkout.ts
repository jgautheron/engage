import type { CartLine, CheckoutOptions, Product, Receipt } from "./types";
import { buildLines } from "./cart";
import { resolvePromos } from "./promos";
import { computeDiscount } from "./discount";
import { physicalStats, computeShipping, amountToFreeShipping } from "./shipping";
import { computeTax } from "./tax";

function computeCore(catalog: Product[], cart: CartLine[], options: CheckoutOptions) {
  const lines = buildLines(catalog, cart);
  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);
  const promos = resolvePromos(options.promos, options.promoCodes);
  const discount = computeDiscount(lines, promos, subtotalCents);
  const stats = physicalStats(lines, discount.bogoByCategory);
  return { lines, subtotalCents, discount, stats, promos };
}

export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  const { lines, subtotalCents, discount, stats, promos } = computeCore(catalog, cart, options);
  const shippingCents = computeShipping(stats);
  const taxCents = computeTax(lines, discount.byCategory, shippingCents, options.region);
  const totalCents = subtotalCents - discount.discountCents + shippingCents + taxCents;

  return {
    lines: lines.map(({ sku, qty, unitCents, lineCents }) => ({ sku, qty, unitCents, lineCents })),
    subtotalCents,
    discountCents: discount.discountCents,
    shippingCents,
    taxCents,
    totalCents,
    appliedPromoCodes: promos.appliedCodes,
  };
}

export function amountToFreeShippingCents(catalog: Product[], cart: CartLine[], options: CheckoutOptions): number {
  const { stats } = computeCore(catalog, cart, options);
  return amountToFreeShipping(stats);
}
