// Rule 7: per-category tax plus tax on shipping.

import type { Region } from "./types";
import type { CategoryTotals } from "./discount";
import { roundHalfUp } from "./rounding";

/**
 * Per category: taxable = category lineCents - discount attributed to that
 * category (bogo on that category's skus, plus - for food/general only -
 * their share of the surviving order-level discount). Shipping is taxed at
 * the general rate. taxCents is the sum of all of these.
 */
export function computeTaxCents(
  region: Region,
  totals: CategoryTotals,
  foodOrderShare: number,
  generalOrderShare: number,
  shippingCents: number
): number {
  const foodTaxable = totals.lineCents.food - totals.bogoCents.food - foodOrderShare;
  const generalTaxable = totals.lineCents.general - totals.bogoCents.general - generalOrderShare;
  const digitalTaxable = totals.lineCents.digital - totals.bogoCents.digital;

  const foodTax = roundHalfUp((foodTaxable * region.taxBasisPoints.food) / 10000);
  const generalTax = roundHalfUp((generalTaxable * region.taxBasisPoints.general) / 10000);
  const digitalTax = roundHalfUp((digitalTaxable * region.taxBasisPoints.digital) / 10000);
  const shippingTax = roundHalfUp((shippingCents * region.taxBasisPoints.general) / 10000);

  return foodTax + generalTax + digitalTax + shippingTax;
}
