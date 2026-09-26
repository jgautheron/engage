export type { Category, Product, CartLine, Promo, Region, CheckoutOptions, ReceiptLine, Receipt } from "./types";

import type { CartLine, CheckoutOptions, Product, Receipt, ReceiptLine } from "./types";
import { resolveCart } from "./cart";
import { resolvePromos } from "./promo";
import { computeDiscounts, physicalDiscountCents } from "./discount";
import { computeShipping, FREE_SHIPPING_THRESHOLD_CENTS } from "./shipping";
import { computeTax } from "./tax";

function price(catalog: Product[], cart: CartLine[], options: CheckoutOptions) {
  const { lines, subtotalCents } = resolveCart(catalog, cart);
  const promos = resolvePromos(options.promos, options.promoCodes);
  const discount = computeDiscounts(lines, subtotalCents, promos);
  const shipping = computeShipping(lines, physicalDiscountCents(lines, discount));
  return { lines, subtotalCents, discount, shipping };
}

/** Prices a cart against a catalog, promo codes, and region tax rules. Throws "empty cart", "unknown sku", "invalid qty", "unknown promo", or "promo conflict". */
export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  const { lines, subtotalCents, discount, shipping } = price(catalog, cart, options);
  const taxCents = computeTax(lines, options.region, discount, shipping.shippingCents);

  const receiptLines: ReceiptLine[] = lines.map(({ sku, qty, unitCents, lineCents }) => ({ sku, qty, unitCents, lineCents }));

  return {
    lines: receiptLines,
    subtotalCents,
    discountCents: discount.discountCents,
    shippingCents: shipping.shippingCents,
    taxCents,
    totalCents: subtotalCents - discount.discountCents + shipping.shippingCents + taxCents,
  };
}

/** Extra physical-goods cents needed to reach free shipping; 0 if the cart has no physical items or shipping is already free. Agrees with checkout by construction (shares price()). */
export function amountToFreeShippingCents(catalog: Product[], cart: CartLine[], options: CheckoutOptions): number {
  const { shipping } = price(catalog, cart, options);
  if (!shipping.hasPhysical || shipping.shippingCents === 0) return 0;
  return FREE_SHIPPING_THRESHOLD_CENTS - shipping.physicalNetCents;
}
