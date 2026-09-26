import type { Line } from "./cart";

export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const BASE_SHIPPING_CENTS = 499;
const PER_KG_CENTS = 100;

export interface ShippingResult {
  shippingCents: number;
  physicalNetCents: number;
  hasPhysical: boolean;
}

/** Shipping on physical (food+general) lines net of their attributed discount: free at/above $50 net, else $4.99 + $1/kg over the first kg. No physical items → 0. */
export function computeShipping(lines: Line[], physicalDiscountCents: number): ShippingResult {
  const physical = lines.filter((l) => l.category !== "digital");
  if (physical.length === 0) return { shippingCents: 0, physicalNetCents: 0, hasPhysical: false };

  const physicalLineCents = physical.reduce((sum, l) => sum + l.lineCents, 0);
  const physicalNetCents = physicalLineCents - physicalDiscountCents;

  if (physicalNetCents >= FREE_SHIPPING_THRESHOLD_CENTS) {
    return { shippingCents: 0, physicalNetCents, hasPhysical: true };
  }

  const grams = physical.reduce((sum, l) => sum + l.weightGrams * l.qty, 0);
  const kg = grams / 1000;
  const shippingCents = BASE_SHIPPING_CENTS + PER_KG_CENTS * Math.max(0, Math.ceil(kg) - 1);

  return { shippingCents, physicalNetCents, hasPhysical: true };
}
