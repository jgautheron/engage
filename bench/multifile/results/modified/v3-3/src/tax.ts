import { roundHalfUp } from "./money";
import type { Category, Region } from "./types";

const CATEGORIES: Category[] = ["food", "general", "digital"];

/**
 * Per-category tax on (lineCents - attributed discount), plus shipping taxed at the general rate.
 * The order-level discount splits food/general by each side's share of rule-4 base.
 * Category discount is attributed entirely to its own category.
 */
export function computeTax(
  region: Region,
  categoryLineCents: Record<Category, number>,
  bogoByCategory: Record<Category, number>,
  orderLevelCapped: number,
  base: number,
  shippingCents: number,
  categoryDiscountCapped: number = 0,
  categoryPromoCategory?: string,
): number {
  const foodBase = categoryLineCents.food - bogoByCategory.food;
  const foodShare = base > 0 ? roundHalfUp(orderLevelCapped * foodBase, base) : 0;
  const generalShare = orderLevelCapped - foodShare;

  const discountByCategory: Record<Category, number> = {
    food: bogoByCategory.food + foodShare,
    general: bogoByCategory.general + generalShare,
    digital: bogoByCategory.digital,
  };

  // Add category promo discount to its category
  if (categoryDiscountCapped > 0 && categoryPromoCategory) {
    discountByCategory[categoryPromoCategory as Category] += categoryDiscountCapped;
  }

  const categoryTax = CATEGORIES.reduce((sum, cat) => {
    const taxable = categoryLineCents[cat] - discountByCategory[cat];
    return sum + roundHalfUp(taxable * region.taxBasisPoints[cat], 10000);
  }, 0);

  const shippingTax = roundHalfUp(shippingCents * region.taxBasisPoints.general, 10000);
  return categoryTax + shippingTax;
}
