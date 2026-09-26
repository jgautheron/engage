import type { Product, Category } from "./types";
import type { Line } from "./cart";

export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const BASE_SHIPPING_CENTS = 499;
const PER_EXTRA_KG_CENTS = 100;

function isPhysical(category: Category): boolean {
  return category === "food" || category === "general";
}

export function computePhysicalNet(
  lines: Line[],
  bogoBySku: Map<string, number>,
  orderLevelActual: number
): { hasPhysical: boolean; physicalNet: number } {
  const physicalLines = lines.filter((l) => isPhysical(l.category));
  const physicalLineCents = physicalLines.reduce((sum, l) => sum + l.lineCents, 0);
  const physicalBogo = physicalLines.reduce((sum, l) => sum + (bogoBySku.get(l.sku) ?? 0), 0);
  return {
    hasPhysical: physicalLines.length > 0,
    physicalNet: physicalLineCents - physicalBogo - orderLevelActual,
  };
}

export function computeShippingCents(
  catalog: Product[],
  lines: Line[],
  hasPhysical: boolean,
  physicalNet: number
): number {
  if (!hasPhysical || physicalNet >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;

  const weightBySku = new Map(catalog.map((p) => [p.sku, p.weightGrams] as const));
  const grams = lines
    .filter((l) => isPhysical(l.category))
    .reduce((sum, l) => sum + (weightBySku.get(l.sku) ?? 0) * l.qty, 0);
  const kg = grams / 1000;

  return BASE_SHIPPING_CENTS + PER_EXTRA_KG_CENTS * Math.max(0, Math.ceil(kg) - 1);
}
