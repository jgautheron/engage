import type { Category, Region } from "./types";
import type { Line } from "./cart";
import { roundHalfUp } from "./money";

const CATEGORIES: Category[] = ["food", "general", "digital"];

/**
 * Per-category tax on (line total − attributed discount) at that category's basis-point rate,
 * plus shipping taxed at the general rate. Returns the summed total.
 */
export function computeTax(
  lines: Line[],
  categoryDiscountCents: Record<Category, number>,
  shippingCents: number,
  region: Region
): number {
  let taxCents = 0;
  for (const category of CATEGORIES) {
    const lineCents = lines.filter((l) => l.category === category).reduce((sum, l) => sum + l.lineCents, 0);
    const taxable = lineCents - categoryDiscountCents[category];
    taxCents += roundHalfUp((taxable * region.taxBasisPoints[category]) / 10000);
  }
  taxCents += roundHalfUp((shippingCents * region.taxBasisPoints.general) / 10000);
  return taxCents;
}
