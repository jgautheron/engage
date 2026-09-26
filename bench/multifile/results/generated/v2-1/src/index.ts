export type { Category, Product, CartLine, Promo, Region, CheckoutOptions, ReceiptLine, Receipt } from "./types";

import type { CartLine, CheckoutOptions, Product, Receipt } from "./types";
import { buildLines, toReceiptLines } from "./cart";
import { resolveActivePromos } from "./promos";
import { applyCap, computeBogoBySku, computeOrderLevelDiscount } from "./discounts";
import { computeShipping, isPhysical, FREE_SHIPPING_THRESHOLD_CENTS } from "./shipping";
import { computeTax } from "./tax";

interface Core {
  receipt: Receipt;
  hasPhysical: boolean;
  physicalNet: number;
}

/** Shared pricing pipeline behind both exports, so shipping numbers can never disagree between them. */
function price(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Core {
  const lines = buildLines(catalog, cart);
  const receiptLines = toReceiptLines(lines);
  const subtotalCents = receiptLines.reduce((sum, line) => sum + line.lineCents, 0);

  const active = resolveActivePromos(options.promos, options.promoCodes);
  const bogoBySku = computeBogoBySku(lines, active.bogos);
  const orderLevel = computeOrderLevelDiscount(lines, bogoBySku, active.order);
  const { discountCents, orderLevelAfterCap } = applyCap(bogoBySku, orderLevel.beforeCap, subtotalCents);

  const physicalBogo = lines.filter(isPhysical).reduce((sum, line) => sum + (bogoBySku.get(line.sku) ?? 0), 0);
  const { hasPhysical, physicalNet, shippingCents } = computeShipping(lines, physicalBogo + orderLevelAfterCap);

  const taxCents = computeTax(lines, {
    region: options.region,
    bogoBySku,
    orderLevelAfterCap,
    orderLevelBase: orderLevel.base,
    foodBase: orderLevel.foodBase,
    shippingCents,
  });

  const totalCents = subtotalCents - discountCents + shippingCents + taxCents;

  return {
    receipt: { lines: receiptLines, subtotalCents, discountCents, shippingCents, taxCents, totalCents },
    hasPhysical,
    physicalNet,
  };
}

/**
 * Prices a cart against a catalog: merges lines, applies at most one order-level promo plus any
 * bogos (capped at half the subtotal), then shipping and per-category tax.
 * Throws "empty cart", "unknown sku", "invalid qty", "unknown promo", or "promo conflict".
 */
export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  return price(catalog, cart, options).receipt;
}

/**
 * Cents of physical-line net spend still needed to reach free shipping.
 * 0 if the cart has no physical items or already ships free. Agrees with checkout() by construction.
 */
export function amountToFreeShippingCents(catalog: Product[], cart: CartLine[], options: CheckoutOptions): number {
  const { receipt, hasPhysical, physicalNet } = price(catalog, cart, options);
  if (!hasPhysical || receipt.shippingCents === 0) return 0;
  return FREE_SHIPPING_THRESHOLD_CENTS - physicalNet;
}
