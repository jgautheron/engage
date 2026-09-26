// Rule 6: shipping cost calculation.

import type { Product, ReceiptLine } from "./types";
import { ceilDiv } from "./rounding";

export interface ShippingResult {
  shippingCents: number;
  physicalNet: number;
  hasPhysicalItems: boolean;
}

/**
 * Physical items are food + general. No physical items -> shipping is 0.
 * Otherwise physicalNet = physical lineCents - only bogo discount on physical
 * lines (order-level discounts no longer count). physicalNet >= 4000 -> free shipping.
 * Else 499 + 100 * max(0, ceil(kg) - 1), where kg is the total weight of
 * physical items in the cart.
 */
export function computeShipping(
  lines: ReceiptLine[],
  productBySku: Map<string, Product>,
  physicalBogoDiscountCents: number
): ShippingResult {
  let physicalLineCents = 0;
  let physicalWeightGrams = 0;
  let hasPhysicalItems = false;

  for (const line of lines) {
    const product = productBySku.get(line.sku)!;
    if (product.category === "digital") continue;

    hasPhysicalItems = true;
    physicalLineCents += line.lineCents;
    physicalWeightGrams += product.weightGrams * line.qty;
  }

  if (!hasPhysicalItems) {
    return { shippingCents: 0, physicalNet: 0, hasPhysicalItems: false };
  }

  const physicalNet = physicalLineCents - physicalBogoDiscountCents;

  if (physicalNet >= 4000) {
    return { shippingCents: 0, physicalNet, hasPhysicalItems: true };
  }

  const kgCeil = ceilDiv(physicalWeightGrams, 1000);
  const shippingCents = 499 + 100 * Math.max(0, kgCeil - 1);

  return { shippingCents, physicalNet, hasPhysicalItems: true };
}
