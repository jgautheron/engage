import type { LineDetail } from "./line";
import type { Category } from "./types";

const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const BASE_SHIPPING_CENTS = 499;
const PER_KG_CENTS = 100;

function isPhysical(category: Category): boolean {
  return category === "food" || category === "general";
}

interface PhysicalInfo {
  hasPhysical: boolean;
  physicalNet: number;
  physicalLines: LineDetail[];
}

/** Net physical (food+general) lineCents after their attributed discount (bogo + capped order-level). */
export function computePhysicalNet(
  lines: LineDetail[],
  bogoByCategory: Record<Category, number>,
  orderLevelCapped: number,
): PhysicalInfo {
  const physicalLines = lines.filter((l) => isPhysical(l.category));
  const physicalLineCents = physicalLines.reduce((sum, l) => sum + l.lineCents, 0);
  const physicalDiscount = bogoByCategory.food + bogoByCategory.general + orderLevelCapped;
  return {
    hasPhysical: physicalLines.length > 0,
    physicalNet: physicalLineCents - physicalDiscount,
    physicalLines,
  };
}

/** 0 with no physical items; else 0 if physicalNet clears the free-shipping threshold, else a weight-tiered flat rate. */
export function computeShippingCents(hasPhysical: boolean, physicalNet: number, physicalLines: LineDetail[]): number {
  if (!hasPhysical) return 0;
  if (physicalNet >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;

  const gramsTotal = physicalLines.reduce((sum, l) => sum + l.weightGrams * l.qty, 0);
  const kg = gramsTotal / 1000;
  return BASE_SHIPPING_CENTS + PER_KG_CENTS * Math.max(0, Math.ceil(kg) - 1);
}

/** Cents of physical spend still needed to reach free shipping; 0 if none needed. */
export function computeAmountToFreeShipping(hasPhysical: boolean, physicalNet: number, shippingCents: number): number {
  if (!hasPhysical || shippingCents === 0) return 0;
  return FREE_SHIPPING_THRESHOLD_CENTS - physicalNet;
}
