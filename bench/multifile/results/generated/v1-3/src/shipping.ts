import type { Category } from "./types";
import type { ResolvedLine } from "./cart";

const PHYSICAL: Category[] = ["food", "general"];
const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const BASE_SHIPPING_CENTS = 499;
const PER_KG_CENTS = 100;

export interface PhysicalStats {
  hasPhysical: boolean;
  physicalNet: number;
  kg: number;
}

export function physicalStats(lines: ResolvedLine[], discountByCategory: Record<Category, number>): PhysicalStats {
  const physicalLines = lines.filter((l) => PHYSICAL.includes(l.category));
  const physicalLineCents = physicalLines.reduce((sum, l) => sum + l.lineCents, 0);
  const physicalDiscount = discountByCategory.food + discountByCategory.general;
  const kg = physicalLines.reduce((sum, l) => sum + l.weightGrams * l.qty, 0) / 1000;

  return {
    hasPhysical: physicalLines.length > 0,
    physicalNet: physicalLineCents - physicalDiscount,
    kg,
  };
}

export function computeShipping(stats: PhysicalStats): number {
  if (!stats.hasPhysical || stats.physicalNet >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;
  return BASE_SHIPPING_CENTS + PER_KG_CENTS * Math.max(0, Math.ceil(stats.kg) - 1);
}

export function amountToFreeShipping(stats: PhysicalStats): number {
  if (!stats.hasPhysical || stats.physicalNet >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;
  return FREE_SHIPPING_THRESHOLD_CENTS - stats.physicalNet;
}
