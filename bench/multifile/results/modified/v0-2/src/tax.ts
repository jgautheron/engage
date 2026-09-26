// Rule 7: tax.
import type { Category, Region } from "./types";
import { roundHalfUp } from "./round";

export interface TaxInput {
  lineCentsByCategory: Record<Category, number>;
  discountByCategory: Record<Category, number>;
  shippingCents: number;
  region: Region;
}

const CATEGORIES: Category[] = ["food", "general", "digital"];

/**
 * taxable per category = category lineCents - discount attributed to that
 * category; category tax = round(taxable * basisPoints / 10000). Shipping
 * is taxed at the general rate. taxCents is the sum of all of these.
 */
export function computeTax(input: TaxInput): number {
  const { lineCentsByCategory, discountByCategory, shippingCents, region } = input;

  let taxCents = 0;
  for (const category of CATEGORIES) {
    const taxable = lineCentsByCategory[category] - discountByCategory[category];
    const basisPoints = region.taxBasisPoints[category];
    taxCents += roundHalfUp(taxable * basisPoints, 10000);
  }

  taxCents += roundHalfUp(shippingCents * region.taxBasisPoints.general, 10000);

  return taxCents;
}
