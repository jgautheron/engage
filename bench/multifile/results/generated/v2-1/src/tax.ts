import type { Line } from "./cart";
import type { Category, Region } from "./types";
import { roundHalfUp } from "./money";

const CATEGORIES: Category[] = ["food", "general", "digital"];
const BASIS_POINTS_DIVISOR = 10000;

export interface TaxInputs {
  region: Region;
  bogoBySku: Map<string, number>;
  orderLevelAfterCap: number;
  orderLevelBase: number;
  foodBase: number;
  shippingCents: number;
}

/**
 * Per-category tax = round((category lineCents − attributed discount) × basisPoints / 10000), summed,
 * plus shipping taxed at the general rate. The order-level discount splits food/general by their
 * share of the order-level base and never reduces digital's taxable amount.
 */
export function computeTax(lines: Line[], inputs: TaxInputs): number {
  const { region, bogoBySku, orderLevelAfterCap, orderLevelBase, foodBase, shippingCents } = inputs;

  const foodShare = orderLevelBase === 0 ? 0 : roundHalfUp((orderLevelAfterCap * foodBase) / orderLevelBase);
  const generalShare = orderLevelAfterCap - foodShare;
  const orderLevelByCategory: Record<Category, number> = { food: foodShare, general: generalShare, digital: 0 };

  const lineCentsByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  const bogoByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  for (const line of lines) {
    const category = line.product.category;
    lineCentsByCategory[category] += line.lineCents;
    bogoByCategory[category] += bogoBySku.get(line.sku) ?? 0;
  }

  const categoryTax = CATEGORIES.reduce((sum, category) => {
    const taxable = lineCentsByCategory[category] - bogoByCategory[category] - orderLevelByCategory[category];
    return sum + roundHalfUp((taxable * region.taxBasisPoints[category]) / BASIS_POINTS_DIVISOR);
  }, 0);

  const shippingTax = roundHalfUp((shippingCents * region.taxBasisPoints.general) / BASIS_POINTS_DIVISOR);

  return categoryTax + shippingTax;
}
