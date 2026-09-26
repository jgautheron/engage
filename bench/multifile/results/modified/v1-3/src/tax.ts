import type { Category, Region } from "./types";
import type { ResolvedLine } from "./cart";
import { roundHalfUp } from "./round";

const CATEGORIES: Category[] = ["food", "general", "digital"];

export function computeTax(
  lines: ResolvedLine[],
  discountByCategory: Record<Category, number>,
  shippingCents: number,
  region: Region,
): number {
  const categoryTax = CATEGORIES.reduce((sum, category) => {
    const lineCents = lines.filter((l) => l.category === category).reduce((s, l) => s + l.lineCents, 0);
    const taxable = lineCents - discountByCategory[category];
    return sum + roundHalfUp((taxable * region.taxBasisPoints[category]) / 10000);
  }, 0);

  const shippingTax = roundHalfUp((shippingCents * region.taxBasisPoints.general) / 10000);
  return categoryTax + shippingTax;
}
