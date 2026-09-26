// Rule 7: per-category tax plus tax on shipping.

import type { Region } from "./types";
import type { CategoryTotals } from "./discount";
import { roundHalfUp } from "./rounding";

/**
 * Per category: taxable = category lineCents - discount attributed to that
 * category (bogo on that category's skus, plus their share of the surviving
 * order-level discount). Shipping is taxed at the general rate. taxCents is
 * the sum of all of these.
 */
export function computeTaxCents(
  region: Region,
  totals: CategoryTotals,
  foodOrderShare: number,
  generalOrderShare: number,
  shippingCents: number,
  categoryOrderShare?: Record<string, number>
): number {
  // Use the more detailed categoryOrderShare if provided, otherwise fall back to the individual shares
  const foodDiscount = categoryOrderShare?.food ?? foodOrderShare;
  const generalDiscount = categoryOrderShare?.general ?? generalOrderShare;
  const digitalDiscount = categoryOrderShare?.digital ?? 0;

  const foodTaxable = totals.lineCents.food - totals.bogoCents.food - foodDiscount;
  const generalTaxable = totals.lineCents.general - totals.bogoCents.general - generalDiscount;
  const digitalTaxable = totals.lineCents.digital - totals.bogoCents.digital - digitalDiscount;

  const foodTax = roundHalfUp((foodTaxable * region.taxBasisPoints.food) / 10000);
  const generalTax = roundHalfUp((generalTaxable * region.taxBasisPoints.general) / 10000);
  const digitalTax = roundHalfUp((digitalTaxable * region.taxBasisPoints.digital) / 10000);
  const shippingTax = roundHalfUp((shippingCents * region.taxBasisPoints.general) / 10000);

  return foodTax + generalTax + digitalTax + shippingTax;
}
