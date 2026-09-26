import type { Line } from "./cart.js";
import type { Category, Region } from "./types.js";
import { roundHalfUp } from "./round.js";

function categorySum(lines: Line[], category: Category): number {
  return lines.filter((l) => l.category === category).reduce((sum, l) => sum + l.lineCents, 0);
}

function categoryBogo(lines: Line[], bogoBySku: Map<string, number>, category: Category): number {
  return lines
    .filter((l) => l.category === category)
    .reduce((sum, l) => sum + (bogoBySku.get(l.sku) ?? 0), 0);
}

export function computeTax(
  lines: Line[],
  bogoBySku: Map<string, number>,
  orderLevelCents: number,
  base: number,
  shippingCents: number,
  region: Region,
): number {
  const foodLine = categorySum(lines, "food");
  const generalLine = categorySum(lines, "general");
  const digitalLine = categorySum(lines, "digital");
  const foodBogo = categoryBogo(lines, bogoBySku, "food");
  const generalBogo = categoryBogo(lines, bogoBySku, "general");
  const digitalBogo = categoryBogo(lines, bogoBySku, "digital");

  // Split the order-level discount between food and general by their share of the base.
  const foodBase = foodLine - foodBogo;
  const foodOrderLevel = base > 0 ? roundHalfUp((orderLevelCents * foodBase) / base) : 0;
  const generalOrderLevel = orderLevelCents - foodOrderLevel;

  const foodTaxable = foodLine - foodBogo - foodOrderLevel;
  const generalTaxable = generalLine - generalBogo - generalOrderLevel;
  const digitalTaxable = digitalLine - digitalBogo;

  const foodTax = roundHalfUp((foodTaxable * region.taxBasisPoints.food) / 10000);
  const generalTax = roundHalfUp((generalTaxable * region.taxBasisPoints.general) / 10000);
  const digitalTax = roundHalfUp((digitalTaxable * region.taxBasisPoints.digital) / 10000);
  const shippingTax = roundHalfUp((shippingCents * region.taxBasisPoints.general) / 10000);

  return foodTax + generalTax + digitalTax + shippingTax;
}
