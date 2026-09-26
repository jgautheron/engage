// Shipping computation (spec rule 6). Physical categories are food + general;
// digital items never contribute weight, net, or the free-shipping threshold.

export interface ShippingResult {
  shippingCents: number;
  physicalNetCents: number;
}

/**
 * Computes shipping cost.
 *
 * - No physical items in the cart -> shipping 0.
 * - Otherwise physicalNet = physical lineCents minus all discount
 *   attributed to physical lines (after the cap). physicalNet >= 5000 ->
 *   shipping 0. Else 499 + 100 * max(0, ceil(kg) - 1), where kg is the
 *   total weight of physical items in kilograms.
 */
export function computeShipping(
  hasPhysicalItems: boolean,
  physicalLineCents: number,
  physicalDiscountCents: number,
  physicalWeightGrams: number
): ShippingResult {
  const physicalNetCents = physicalLineCents - physicalDiscountCents;

  if (!hasPhysicalItems || physicalNetCents >= 5000) {
    return { shippingCents: 0, physicalNetCents };
  }

  const kg = physicalWeightGrams / 1000;
  const shippingCents = 499 + 100 * Math.max(0, Math.ceil(kg) - 1);

  return { shippingCents, physicalNetCents };
}
