import { categoryBySku } from "./categories";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "./money";
import type { Product, ReceiptLine } from "./types";

const BASE_SHIPPING_CENTS = 499;
const PER_KG_CENTS = 100;

export interface PhysicalTotals {
  hasPhysical: boolean;
  physicalNet: number;
  weightGrams: number;
}

/** Physical (food + general) lineCents and weight, net of only the bogo discount attributed to physical lines. */
export function computePhysicalTotals(
  catalog: Product[],
  lines: ReceiptLine[],
  bogoPhysicalDiscountCents: number
): PhysicalTotals {
  const categories = categoryBySku(catalog);
  const weightBySku = new Map(catalog.map((p) => [p.sku, p.weightGrams]));

  let physicalLineCents = 0;
  let weightGrams = 0;
  let hasPhysical = false;
  for (const line of lines) {
    if (categories.get(line.sku) === "digital") continue;
    hasPhysical = true;
    physicalLineCents += line.lineCents;
    weightGrams += weightBySku.get(line.sku)! * line.qty;
  }

  return { hasPhysical, physicalNet: physicalLineCents - bogoPhysicalDiscountCents, weightGrams };
}

/** Free with no physical items or physicalNet >= threshold; else 499 + 100/kg beyond the first. */
export function computeShippingCents(hasPhysical: boolean, physicalNet: number, weightGrams: number): number {
  if (!hasPhysical || physicalNet >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;
  const kg = weightGrams / 1000;
  return BASE_SHIPPING_CENTS + PER_KG_CENTS * Math.max(0, Math.ceil(kg) - 1);
}
