// Tax computation (spec rule 7).

import type { Region } from "./types";
import { roundDivide } from "./rounding";

export interface CategoryTaxable {
  foodTaxableCents: number;
  generalTaxableCents: number;
  digitalTaxableCents: number;
}

/**
 * Computes total tax: per-category tax on taxable line amounts (category
 * lineCents minus discount attributed to that category), plus shipping
 * taxed at the general rate.
 */
export function computeTax(region: Region, taxable: CategoryTaxable, shippingCents: number): number {
  const foodTax = roundDivide(taxable.foodTaxableCents * region.taxBasisPoints.food, 10000);
  const generalTax = roundDivide(taxable.generalTaxableCents * region.taxBasisPoints.general, 10000);
  const digitalTax = roundDivide(taxable.digitalTaxableCents * region.taxBasisPoints.digital, 10000);
  const shippingTax = roundDivide(shippingCents * region.taxBasisPoints.general, 10000);

  return foodTax + generalTax + digitalTax + shippingTax;
}
