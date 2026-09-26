import type { CartLine, CategoryTotals, CheckoutOptions, Product, Receipt } from "./types";
export type { Category, Product, CartLine, Promo, Region, CheckoutOptions, ReceiptLine, Receipt } from "./types";

import { lineCentsByCategory, resolveCartItems, toReceiptLines } from "./cart";
import {
  bogoCentsByCategory,
  bogoDiscountsBySku,
  capDiscount,
  orderLevelDiscount,
  physicalBase,
  resolvePromos,
} from "./promotions";
import { FREE_SHIPPING_THRESHOLD_CENTS, hasPhysicalItems, physicalNetCents, shippingCents } from "./shipping";
import { taxCents } from "./tax";

interface Breakdown {
  receipt: Receipt;
  physicalNet: number;
  hasPhysical: boolean;
}

function buildBreakdown(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Breakdown {
  const items = resolveCartItems(catalog, cart);
  const lines = toReceiptLines(items);
  const subtotalCents = lines.reduce((sum, line) => sum + line.lineCents, 0);

  const { orderLevel, bogos } = resolvePromos(options.promos, options.promoCodes);
  const bogoBySku = bogoDiscountsBySku(items, bogos);
  const bogoTotal = [...bogoBySku.values()].reduce((sum, cents) => sum + cents, 0);

  const totals: CategoryTotals = {
    lineCents: lineCentsByCategory(items),
    bogoCents: bogoCentsByCategory(items, bogoBySku),
  };
  const order = orderLevelDiscount(orderLevel, physicalBase(totals));
  const { discountCents, cappedOrderLevel } = capDiscount(bogoTotal, order, subtotalCents);

  const hasPhysical = hasPhysicalItems(items);
  const physicalNet = physicalNetCents(totals, cappedOrderLevel);
  const shipping = shippingCents(items, physicalNet);
  const tax = taxCents(totals, cappedOrderLevel, shipping, options.region.taxBasisPoints);
  const totalCents = subtotalCents - discountCents + shipping + tax;

  return {
    receipt: { lines, subtotalCents, discountCents, shippingCents: shipping, taxCents: tax, totalCents },
    physicalNet,
    hasPhysical,
  };
}

/** Prices, discounts, shipping, and tax for a cart. Throws on an invalid cart or promo code. */
export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  return buildBreakdown(catalog, cart, options).receipt;
}

/** Cents of physical-item spend still needed for free shipping; 0 if none needed or no physical items. */
export function amountToFreeShippingCents(catalog: Product[], cart: CartLine[], options: CheckoutOptions): number {
  const { receipt, physicalNet, hasPhysical } = buildBreakdown(catalog, cart, options);
  if (!hasPhysical || receipt.shippingCents === 0) return 0;
  return FREE_SHIPPING_THRESHOLD_CENTS - physicalNet;
}
