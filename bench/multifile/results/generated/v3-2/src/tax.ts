import { categoryBySku, lineCentsByCategory, type CategoryTotals } from "./categories";
import { roundHalfUp } from "./money";
import type { Product, Region, ReceiptLine } from "./types";

export interface TaxInputs {
  bogoByCategory: CategoryTotals;
  orderLevelDiscount: number; // after the cap
  orderBase: number;
  foodBase: number;
  shippingCents: number;
}

/**
 * Per category: tax on lineCents net of its attributed discount (bogo by sku's category,
 * order-level split food/general by foodBase/orderBase share). Shipping taxed at the general rate.
 */
export function computeTaxCents(catalog: Product[], lines: ReceiptLine[], region: Region, inputs: TaxInputs): number {
  const categories = categoryBySku(catalog);
  const lineCents = lineCentsByCategory(lines, categories);

  const foodOrderShare =
    inputs.orderBase === 0 ? 0 : roundHalfUp((inputs.orderLevelDiscount * inputs.foodBase) / inputs.orderBase);
  const generalOrderShare = inputs.orderLevelDiscount - foodOrderShare;

  const foodTaxable = lineCents.food - inputs.bogoByCategory.food - foodOrderShare;
  const generalTaxable = lineCents.general - inputs.bogoByCategory.general - generalOrderShare;
  const digitalTaxable = lineCents.digital - inputs.bogoByCategory.digital;

  const categoryTax =
    roundHalfUp((foodTaxable * region.taxBasisPoints.food) / 10000) +
    roundHalfUp((generalTaxable * region.taxBasisPoints.general) / 10000) +
    roundHalfUp((digitalTaxable * region.taxBasisPoints.digital) / 10000);

  const shippingTax = roundHalfUp((inputs.shippingCents * region.taxBasisPoints.general) / 10000);

  return categoryTax + shippingTax;
}
