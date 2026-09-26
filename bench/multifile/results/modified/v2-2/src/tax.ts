import type { Category, CategoryTotals, Promo } from "./types";
import { roundHalfUp } from "./money";
import { foodBase, generalBase, physicalBase } from "./promotions";

type OrderPromo = Extract<Promo, { kind: "percent" } | { kind: "fixed" } | { kind: "category" }>;

const BASIS_POINTS_DIVISOR = 10000;

/**
 * Per-category tax on (lineCents − attributed discount), plus tax on shipping at the general
 * rate. For percent/fixed order-level discounts, the discount splits between food/general by their
 * share of `physicalBase`. For category-level discounts, the discount is attributed entirely to
 * that category.
 */
export function taxCents(
  totals: CategoryTotals,
  cappedOrderLevel: number,
  shippingCents: number,
  taxBasisPoints: Record<Category, number>,
  orderLevel?: OrderPromo
): number {
  let foodShare = 0;
  let generalShare = 0;
  let digitalShare = 0;

  // Attribute the capped order-level discount based on promo type
  if (orderLevel && orderLevel.kind === "category") {
    // Category promo discount is attributed entirely to its category
    if (orderLevel.category === "food") {
      foodShare = cappedOrderLevel;
    } else if (orderLevel.category === "general") {
      generalShare = cappedOrderLevel;
    } else if (orderLevel.category === "digital") {
      digitalShare = cappedOrderLevel;
    }
  } else if (cappedOrderLevel > 0) {
    // Physical-only (percent/fixed) discount splits between food/general
    const base = physicalBase(totals);
    foodShare = base > 0 ? roundHalfUp((cappedOrderLevel * foodBase(totals)) / base) : 0;
    generalShare = cappedOrderLevel - foodShare;
  }

  const foodTaxable = foodBase(totals) - foodShare;
  const generalTaxable = generalBase(totals) - generalShare;
  const digitalTaxable = totals.lineCents.digital - totals.bogoCents.digital - digitalShare;

  const foodTax = roundHalfUp((foodTaxable * taxBasisPoints.food) / BASIS_POINTS_DIVISOR);
  const generalTax = roundHalfUp((generalTaxable * taxBasisPoints.general) / BASIS_POINTS_DIVISOR);
  const digitalTax = roundHalfUp((digitalTaxable * taxBasisPoints.digital) / BASIS_POINTS_DIVISOR);
  const shippingTax = roundHalfUp((shippingCents * taxBasisPoints.general) / BASIS_POINTS_DIVISOR);

  return foodTax + generalTax + digitalTax + shippingTax;
}
