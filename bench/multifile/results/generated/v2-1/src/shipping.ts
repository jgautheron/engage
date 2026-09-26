import type { Line } from "./cart";

export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const BASE_SHIPPING_CENTS = 499;
const PER_KG_CENTS = 100;
const GRAMS_PER_KG = 1000;

/** Physical = food + general (everything but digital). */
export function isPhysical(line: Line): boolean {
  return line.product.category !== "digital";
}

export interface Shipping {
  hasPhysical: boolean;
  physicalNet: number;
  shippingCents: number;
}

/**
 * Shipping on physical lines, net of the discount attributed to them (physicalDiscountCents).
 * 0 if the cart has no physical items or physicalNet is already at/above the free-shipping threshold.
 */
export function computeShipping(lines: Line[], physicalDiscountCents: number): Shipping {
  const physical = lines.filter(isPhysical);
  const hasPhysical = physical.length > 0;
  if (!hasPhysical) return { hasPhysical, physicalNet: 0, shippingCents: 0 };

  const physicalLineCents = physical.reduce((sum, line) => sum + line.lineCents, 0);
  const physicalNet = physicalLineCents - physicalDiscountCents;
  if (physicalNet >= FREE_SHIPPING_THRESHOLD_CENTS) return { hasPhysical, physicalNet, shippingCents: 0 };

  const grams = physical.reduce((sum, line) => sum + line.product.weightGrams * line.qty, 0);
  const kg = grams / GRAMS_PER_KG;
  const shippingCents = BASE_SHIPPING_CENTS + PER_KG_CENTS * Math.max(0, Math.ceil(kg) - 1);

  return { hasPhysical, physicalNet, shippingCents };
}
