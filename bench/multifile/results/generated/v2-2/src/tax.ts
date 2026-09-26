import type { Category, CategoryTotals } from "./types";
import { roundHalfUp } from "./money";
import { foodBase, generalBase, physicalBase } from "./promotions";

const BASIS_POINTS_DIVISOR = 10000;

/**
 * Per-category tax on (lineCents − attributed discount), plus tax on shipping at the general
 * rate. The order-level discount (physical-only) splits between food/general by their share of
 * `physicalBase` (rule 4's base).
 */
export function taxCents(
  totals: CategoryTotals,
  cappedOrderLevel: number,
  shippingCents: number,
  taxBasisPoints: Record<Category, number>
): number {
  const base = physicalBase(totals);
  const foodShare = base > 0 ? roundHalfUp((cappedOrderLevel * foodBase(totals)) / base) : 0;
  const generalShare = cappedOrderLevel - foodShare;

  const foodTaxable = foodBase(totals) - foodShare;
  const generalTaxable = generalBase(totals) - generalShare;
  const digitalTaxable = totals.lineCents.digital - totals.bogoCents.digital;

  const foodTax = roundHalfUp((foodTaxable * taxBasisPoints.food) / BASIS_POINTS_DIVISOR);
  const generalTax = roundHalfUp((generalTaxable * taxBasisPoints.general) / BASIS_POINTS_DIVISOR);
  const digitalTax = roundHalfUp((digitalTaxable * taxBasisPoints.digital) / BASIS_POINTS_DIVISOR);
  const shippingTax = roundHalfUp((shippingCents * taxBasisPoints.general) / BASIS_POINTS_DIVISOR);

  return foodTax + generalTax + digitalTax + shippingTax;
}
