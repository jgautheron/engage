import { buildCart, productMap } from "./cart";
import { computeDiscounts } from "./discount";
import { attachProductInfo } from "./line";
import { resolvePromos } from "./promos";
import { computeAmountToFreeShipping, computePhysicalNet, computeShippingCents } from "./shipping";
import { computeTax } from "./tax";
import type { CartLine, CheckoutOptions, Product, Receipt } from "./types";

export type { Category, CheckoutOptions, Product, CartLine, Promo, Region, ReceiptLine, Receipt } from "./types";

/** Shared pipeline: cart -> priced lines -> promos -> discounts -> shipping. Used by both exports so they agree. */
function run(catalog: Product[], cart: CartLine[], options: CheckoutOptions) {
  const products = productMap(catalog);
  const { lines, subtotalCents } = buildCart(catalog, cart);
  const detailedLines = attachProductInfo(lines, products);

  const { orderLevel, bogos } = resolvePromos(options);
  const discounts = computeDiscounts(
    detailedLines,
    subtotalCents,
    orderLevel,
    bogos.map((b) => b.sku),
  );

  const { hasPhysical, physicalNet, physicalLines } = computePhysicalNet(
    detailedLines,
    discounts.bogoByCategory,
    discounts.orderLevelCapped,
  );
  const shippingCents = computeShippingCents(hasPhysical, physicalNet, physicalLines);

  return { lines, subtotalCents, discounts, shippingCents, hasPhysical, physicalNet };
}

/** Prices a cart against a catalog, applies promo codes, and returns the full receipt. Throws per spec rules 1-2. */
export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  const { lines, subtotalCents, discounts, shippingCents } = run(catalog, cart, options);
  const taxCents = computeTax(
    options.region,
    discounts.categoryLineCents,
    discounts.bogoByCategory,
    discounts.orderLevelCapped,
    discounts.base,
    shippingCents,
  );
  const totalCents = subtotalCents - discounts.discountCents + shippingCents + taxCents;

  return {
    lines,
    subtotalCents,
    discountCents: discounts.discountCents,
    shippingCents,
    taxCents,
    totalCents,
  };
}

/** Cents of physical spend still needed to unlock free shipping; 0 if no physical items or already free. */
export function amountToFreeShippingCents(catalog: Product[], cart: CartLine[], options: CheckoutOptions): number {
  const { hasPhysical, physicalNet, shippingCents } = run(catalog, cart, options);
  return computeAmountToFreeShipping(hasPhysical, physicalNet, shippingCents);
}
