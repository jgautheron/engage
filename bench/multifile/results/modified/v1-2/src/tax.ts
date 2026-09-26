import type { Region, Category } from "./types";
import type { Line } from "./cart";
import { roundHalfUp } from "./money";

export function computeTaxCents(
  lines: Line[],
  bogoBySku: Map<string, number>,
  orderLevelActual: number,
  base: number,
  foodBase: number,
  region: Region,
  shippingCents: number,
  discountByCategory?: Map<string, number>
): number {
  const lineCentsByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  const bogoByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  for (const line of lines) {
    lineCentsByCategory[line.category] += line.lineCents;
    bogoByCategory[line.category] += bogoBySku.get(line.sku) ?? 0;
  }

  // For category promos, discount is attributed entirely to that category
  // For other promos, distribute proportionally
  let foodShare = 0;
  let generalShare = 0;
  let digitalShare = 0;

  if (discountByCategory && discountByCategory.size > 0) {
    foodShare = discountByCategory.get("food") ?? 0;
    generalShare = discountByCategory.get("general") ?? 0;
    digitalShare = discountByCategory.get("digital") ?? 0;
  } else {
    foodShare = base > 0 ? roundHalfUp((orderLevelActual * foodBase) / base) : 0;
    generalShare = orderLevelActual - foodShare;
  }

  const foodTaxable = lineCentsByCategory.food - bogoByCategory.food - foodShare;
  const generalTaxable = lineCentsByCategory.general - bogoByCategory.general - generalShare;
  const digitalTaxable = lineCentsByCategory.digital - bogoByCategory.digital - digitalShare;

  const foodTax = roundHalfUp((foodTaxable * region.taxBasisPoints.food) / 10000);
  const generalTax = roundHalfUp((generalTaxable * region.taxBasisPoints.general) / 10000);
  const digitalTax = roundHalfUp((digitalTaxable * region.taxBasisPoints.digital) / 10000);
  const shippingTax = roundHalfUp((shippingCents * region.taxBasisPoints.general) / 10000);

  return foodTax + generalTax + digitalTax + shippingTax;
}
