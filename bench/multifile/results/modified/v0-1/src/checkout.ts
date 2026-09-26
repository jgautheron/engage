// Orchestrates cart validation, promos, discounts, shipping, and tax into a
// Receipt (rule 8), and shares that pipeline with amountToFreeShippingCents
// (rule 9) so the two functions can never disagree.

import type { CartLine, CheckoutOptions, Category, Product, Receipt } from "./types";
import { buildCart } from "./cart";
import { resolveActivePromos, computeBogoDiscounts } from "./promos";
import { computeCategoryTotals, computeDiscountBreakdown } from "./discount";
import { computeShipping } from "./shipping";
import { computeTaxCents } from "./tax";

interface CheckoutResult {
  receipt: Receipt;
  physicalNet: number;
  hasPhysicalItems: boolean;
}

function runCheckout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): CheckoutResult {
  const { lines, productBySku, subtotalCents } = buildCart(catalog, cart);

  const { orderPromo, bogoPromos, appliedPromoCodes } = resolveActivePromos(options.promos, options.promoCodes);
  const bogo = computeBogoDiscounts(bogoPromos, lines);

  const categoryBySku = new Map<string, Category>();
  for (const product of catalog) {
    categoryBySku.set(product.sku, product.category);
  }

  const totals = computeCategoryTotals(lines, categoryBySku, bogo.bySku);
  const breakdown = computeDiscountBreakdown(bogo.totalCents, orderPromo, totals, subtotalCents);

  // For shipping, only use BOGO discounts on physical lines (food + general).
  // Order-level discounts no longer count against the free shipping threshold.
  const physicalBogoDiscountCents = totals.bogoCents.food + totals.bogoCents.general;

  const shipping = computeShipping(lines, productBySku, physicalBogoDiscountCents);

  const taxCents = computeTaxCents(
    options.region,
    totals,
    breakdown.foodOrderShare,
    breakdown.generalOrderShare,
    shipping.shippingCents,
    breakdown.categoryOrderShare
  );

  const totalCents = subtotalCents - breakdown.discountCents + shipping.shippingCents + taxCents;

  const receipt: Receipt = {
    lines,
    subtotalCents,
    discountCents: breakdown.discountCents,
    shippingCents: shipping.shippingCents,
    taxCents,
    totalCents,
    appliedPromoCodes,
  };

  return { receipt, physicalNet: shipping.physicalNet, hasPhysicalItems: shipping.hasPhysicalItems };
}

export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  return runCheckout(catalog, cart, options).receipt;
}

/**
 * Returns 0 if the cart has no physical items or shipping is already free;
 * otherwise 4000 - physicalNet. Shares runCheckout with `checkout` so the
 * two functions always agree for the same inputs.
 */
export function amountToFreeShippingCents(
  catalog: Product[],
  cart: CartLine[],
  options: CheckoutOptions
): number {
  const result = runCheckout(catalog, cart, options);
  if (!result.hasPhysicalItems || result.receipt.shippingCents === 0) {
    return 0;
  }
  return 4000 - result.physicalNet;
}
