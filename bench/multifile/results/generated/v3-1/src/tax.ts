import type { Line } from "./cart";
import type { Category, Region } from "./types";
import type { DiscountResult } from "./discount";
import { roundHalfUp } from "./money";

const CATEGORIES: Category[] = ["food", "general", "digital"];

/** Per-category tax on (lineCents − attributed discount) plus shipping taxed at the general rate; order-level discount splits food/general by foodBase/base share (rule 7). */
export function computeTax(lines: Line[], region: Region, discount: DiscountResult, shippingCents: number): number {
  const lineCentsByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  const discountByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };

  for (const line of lines) {
    lineCentsByCategory[line.category] += line.lineCents;
    discountByCategory[line.category] += discount.bogoBySku.get(line.sku) ?? 0;
  }

  const orderLevelFood = discount.base > 0 ? roundHalfUp(discount.orderLevelCents * discount.foodBase, discount.base) : 0;
  discountByCategory.food += orderLevelFood;
  discountByCategory.general += discount.orderLevelCents - orderLevelFood;

  let taxCents = 0;
  for (const category of CATEGORIES) {
    const taxable = lineCentsByCategory[category] - discountByCategory[category];
    taxCents += roundHalfUp(taxable * region.taxBasisPoints[category], 10000);
  }

  taxCents += roundHalfUp(shippingCents * region.taxBasisPoints.general, 10000);

  return taxCents;
}
