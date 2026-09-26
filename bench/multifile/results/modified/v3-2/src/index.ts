import { buildCart } from "./cart";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "./money";
import { computeDiscounts, resolvePromos } from "./promotions";
import { computePhysicalTotals, computeShippingCents } from "./shipping";
import { computeTaxCents } from "./tax";
import type {
  CartLine,
  Category,
  CheckoutOptions,
  Product,
  Promo,
  Receipt,
  ReceiptLine,
  Region,
} from "./types";

export type { CartLine, Category, CheckoutOptions, Product, Promo, Receipt, ReceiptLine, Region };

/**
 * Price a cart: validated/merged lines, bogo + one order-level promo (capped at half the
 * subtotal), shipping, and per-category tax. Throws on empty cart, unknown sku,
 * invalid qty, or a promo conflict (two order-level promos). Unknown promo codes are ignored.
 */
export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  const { lines, subtotalCents } = buildCart(catalog, cart);
  const { orderPromo, bogoPromos, appliedPromoCodes } = resolvePromos(options.promos, options.promoCodes);
  const discounts = computeDiscounts(catalog, lines, subtotalCents, orderPromo, bogoPromos);

  const bogoPhysicalDiscountCents = discounts.bogoByCategory.food + discounts.bogoByCategory.general;
  const { hasPhysical, physicalNet, weightGrams } = computePhysicalTotals(catalog, lines, bogoPhysicalDiscountCents);
  const shippingCents = computeShippingCents(hasPhysical, physicalNet, weightGrams);

  const taxCents = computeTaxCents(catalog, lines, options.region, {
    bogoByCategory: discounts.bogoByCategory,
    orderLevelDiscount: discounts.orderLevelDiscount,
    orderBase: discounts.orderBase,
    foodBase: discounts.foodBase,
    shippingCents,
    categoryDiscountByCategory: discounts.categoryDiscountByCategory,
  });

  const totalCents = subtotalCents - discounts.discountCents + shippingCents + taxCents;

  return { lines, subtotalCents, discountCents: discounts.discountCents, shippingCents, taxCents, totalCents, appliedPromoCodes };
}

/**
 * Cents of additional physical merchandise needed to reach free shipping; 0 if there are no
 * physical items or shipping is already free. Always agrees with checkout for the same inputs.
 */
export function amountToFreeShippingCents(catalog: Product[], cart: CartLine[], options: CheckoutOptions): number {
  const { lines, subtotalCents } = buildCart(catalog, cart);
  const { orderPromo, bogoPromos } = resolvePromos(options.promos, options.promoCodes);
  const discounts = computeDiscounts(catalog, lines, subtotalCents, orderPromo, bogoPromos);

  const bogoPhysicalDiscountCents = discounts.bogoByCategory.food + discounts.bogoByCategory.general;
  const { hasPhysical, physicalNet } = computePhysicalTotals(catalog, lines, bogoPhysicalDiscountCents);

  if (!hasPhysical || physicalNet >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;
  return FREE_SHIPPING_THRESHOLD_CENTS - physicalNet;
}
