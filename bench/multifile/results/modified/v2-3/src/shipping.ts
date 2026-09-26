import type { Line } from "./cart";

export interface ShippingResult {
  shippingCents: number;
  /** Physical (food+general) line total minus only bogo discounts (order-level discounts excluded). */
  physicalNet: number;
}

/**
 * Flat-rate shipping on physical (food+general) items: free with no physical items or once
 * physicalNet reaches $40; otherwise $4.99 plus $1 per whole kg above the first.
 * physicalNet is physical lineCents minus only bogo discounts (order-level discounts don't count).
 */
export function computeShipping(lines: Line[], physicalDiscountCents: number): ShippingResult {
  const physical = lines.filter((l) => l.category !== "digital");
  if (physical.length === 0) return { shippingCents: 0, physicalNet: 0 };

  const physicalLineCents = physical.reduce((sum, l) => sum + l.lineCents, 0);
  const physicalNet = physicalLineCents - physicalDiscountCents;
  if (physicalNet >= 4000) return { shippingCents: 0, physicalNet };

  const grams = physical.reduce((sum, l) => sum + l.weightGrams * l.qty, 0);
  const kg = grams / 1000;
  const shippingCents = 499 + 100 * Math.max(0, Math.ceil(kg) - 1);
  return { shippingCents, physicalNet };
}
