// Public API of the checkout engine. See spec.md for the full rule set;
// the implementation is split across src/{cart,promos,discount,shipping,tax,round,core}.ts.
export type {
  Category,
  Product,
  CartLine,
  Promo,
  Region,
  CheckoutOptions,
  ReceiptLine,
  Receipt,
} from "./types";

import type { CartLine, CheckoutOptions, Product, Receipt } from "./types";
import { computeCheckout } from "./core";

/** Builds the full receipt for a cart (rules 1-8). */
export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  const result = computeCheckout(catalog, cart, options);
  return {
    lines: result.lines,
    subtotalCents: result.subtotalCents,
    discountCents: result.discountCents,
    shippingCents: result.shippingCents,
    taxCents: result.taxCents,
    totalCents: result.totalCents,
  };
}

/**
 * Rule 9: 0 if the cart has no physical items or shipping is already free
 * (both cases mean checkout() returned shippingCents === 0); otherwise
 * 5000 - physicalNet. Shares computeCheckout with checkout() so the two
 * functions can never disagree for the same inputs.
 */
export function amountToFreeShippingCents(
  catalog: Product[],
  cart: CartLine[],
  options: CheckoutOptions
): number {
  const result = computeCheckout(catalog, cart, options);
  if (result.shippingCents === 0) {
    return 0;
  }
  return 5000 - result.physicalNet;
}
