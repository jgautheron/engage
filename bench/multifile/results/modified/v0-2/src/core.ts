// Orchestrates rules 1-8 and exposes the extra bit of state (physicalNet)
// that amountToFreeShippingCents needs, so both public functions share one
// code path and can never disagree (rule 9).
import type { Category, CartLine, CheckoutOptions, Product, ReceiptLine } from "./types";
import { normalizeCart } from "./cart";
import { resolvePromos } from "./promos";
import { computeDiscounts } from "./discount";
import { computeShipping } from "./shipping";
import { computeTax } from "./tax";

export interface CoreResult {
  lines: ReceiptLine[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  /** physical (food + general) lineCents minus discount attributed to them; 0 when no physical items. */
  physicalNet: number;
  /** Canonical codes of applied promos, in order, without duplicates. */
  appliedPromoCodes: string[];
}

export function computeCheckout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): CoreResult {
  const normalized = normalizeCart(catalog, cart);

  const subtotalCents = normalized.reduce((sum, line) => sum + line.lineCents, 0);

  const { orderLevelPromo, bogoPromos, appliedPromoCodes } = resolvePromos(options.promos, options.promoCodes);

  // Extract category promo from order-level promo if it exists
  const categoryPromo = orderLevelPromo?.kind === "category" ? orderLevelPromo : undefined;
  const nonCategoryOrderLevelPromo = orderLevelPromo?.kind !== "category" ? orderLevelPromo : undefined;

  const discounts = computeDiscounts(normalized, subtotalCents, nonCategoryOrderLevelPromo, bogoPromos, categoryPromo);

  const lineCentsByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  for (const line of normalized) {
    lineCentsByCategory[line.category] += line.lineCents;
  }

  // Rule 6: physical discount = bogo discount on physical lines only
  // (order-level discounts no longer count against free shipping).
  const physicalDiscount = discounts.bogoByCategory.food + discounts.bogoByCategory.general;
  const shipping = computeShipping(normalized, physicalDiscount);

  const discountByCategory: Record<Category, number> = {
    food: discounts.bogoByCategory.food + discounts.orderLevelFood + discounts.categoryPromoByCategory.food,
    general: discounts.bogoByCategory.general + discounts.orderLevelGeneral + discounts.categoryPromoByCategory.general,
    digital: discounts.bogoByCategory.digital + discounts.categoryPromoByCategory.digital,
  };

  const taxCents = computeTax({
    lineCentsByCategory,
    discountByCategory,
    shippingCents: shipping.shippingCents,
    region: options.region,
  });

  const totalCents = subtotalCents - discounts.discountCents + shipping.shippingCents + taxCents;

  const lines: ReceiptLine[] = normalized.map((line) => ({
    sku: line.sku,
    qty: line.qty,
    unitCents: line.unitCents,
    lineCents: line.lineCents,
  }));

  return {
    lines,
    subtotalCents,
    discountCents: discounts.discountCents,
    shippingCents: shipping.shippingCents,
    taxCents,
    totalCents,
    physicalNet: shipping.physicalNet,
    appliedPromoCodes,
  };
}
