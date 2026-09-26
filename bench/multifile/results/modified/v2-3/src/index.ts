export type { Category, Product, CartLine, Promo, Region, CheckoutOptions, ReceiptLine, Receipt } from "./types";

import type { CartLine, CheckoutOptions, Product, Receipt } from "./types";
import { buildLines } from "./cart";
import { resolvePromos, computeDiscounts } from "./promotions";
import { computeShipping } from "./shipping";
import { computeTax } from "./tax";

/**
 * Prices a cart end to end: validate, apply bogo/order-level promos under the half-subtotal cap,
 * then shipping and tax. Throws "empty cart", "unknown sku", "invalid qty", or "promo conflict".
 * Unknown promo codes are silently ignored.
 */
export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  const { lines, subtotalCents, discountCents, shippingCents, taxCents, totalCents, appliedPromoCodes } = compute(
    catalog,
    cart,
    options
  );
  return { lines, subtotalCents, discountCents, shippingCents, taxCents, totalCents, appliedPromoCodes };
}

/**
 * Cents of physical-item spend still needed for free shipping; 0 once shipping is already free
 * or the cart has no physical items. Shares checkout()'s pipeline, so the two always agree.
 */
export function amountToFreeShippingCents(catalog: Product[], cart: CartLine[], options: CheckoutOptions): number {
  const { shippingCents, physicalNet } = compute(catalog, cart, options);
  return shippingCents === 0 ? 0 : 4000 - physicalNet;
}

interface Computed {
  lines: Receipt["lines"];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  physicalNet: number;
  appliedPromoCodes: string[];
}

/** Single pipeline (cart -> promos -> discounts -> shipping -> tax) shared by both exports above. */
function compute(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Computed {
  const { lines, subtotalCents } = buildLines(catalog, cart);
  const promos = resolvePromos(options.promos, options.promoCodes);
  const discounts = computeDiscounts(lines, subtotalCents, promos);
  const shipping = computeShipping(lines, discounts.physicalDiscountCents);
  const taxCents = computeTax(lines, discounts.categoryDiscountCents, shipping.shippingCents, options.region);
  const totalCents = subtotalCents - discounts.discountCents + shipping.shippingCents + taxCents;

  return {
    lines: lines.map(({ sku, qty, unitCents, lineCents }) => ({ sku, qty, unitCents, lineCents })),
    subtotalCents,
    discountCents: discounts.discountCents,
    shippingCents: shipping.shippingCents,
    taxCents,
    totalCents,
    physicalNet: shipping.physicalNet,
    appliedPromoCodes: promos.appliedPromoCodes,
  };
}
