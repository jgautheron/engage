// Orchestrates cart, promos, shipping, and tax into a Receipt.
// This is the only place that combines all spec rules, so both public
// functions share one computation to guarantee they always agree (rule 9).

import type { CartLine, CheckoutOptions, Product, Receipt } from "./types";
import { buildCart } from "./cart";
import { computeBogoDiscounts, computeOrderLevelDiscount, resolvePromos } from "./promos";
import { computeShipping } from "./shipping";
import { computeTax } from "./tax";
import { roundDivide } from "./rounding";

interface CheckoutDetails {
  receipt: Receipt;
  hasPhysicalItems: boolean;
  physicalNetCents: number;
}

function computeCheckoutDetails(
  catalog: Product[],
  cart: CartLine[],
  options: CheckoutOptions
): CheckoutDetails {
  const { lines, catalogMap, subtotalCents } = buildCart(catalog, cart);
  const cartQtyBySku = new Map(lines.map((line) => [line.sku, line.qty]));

  const matchedPromos = resolvePromos(options.promos, options.promoCodes);

  // Rule 3: BOGO discounts, per matched bogo promo.
  const bogoResults = computeBogoDiscounts(matchedPromos, catalogMap, cartQtyBySku);
  const bogoTotalCents = bogoResults.reduce((sum, result) => sum + result.discountCents, 0);

  // Split lineCents and bogo discounts by category, and gather physical weight.
  let foodLineCents = 0;
  let generalLineCents = 0;
  let digitalLineCents = 0;
  let hasPhysicalItems = false;
  let physicalWeightGrams = 0;

  for (const line of lines) {
    const product = catalogMap.get(line.sku)!;

    if (product.category === "digital") {
      digitalLineCents += line.lineCents;
      continue;
    }

    hasPhysicalItems = true;
    physicalWeightGrams += product.weightGrams * line.qty;

    if (product.category === "food") {
      foodLineCents += line.lineCents;
    } else {
      generalLineCents += line.lineCents;
    }
  }

  let bogoFoodCents = 0;
  let bogoGeneralCents = 0;
  let bogoDigitalCents = 0;
  for (const result of bogoResults) {
    if (result.category === "food") {
      bogoFoodCents += result.discountCents;
    } else if (result.category === "general") {
      bogoGeneralCents += result.discountCents;
    } else if (result.category === "digital") {
      bogoDigitalCents += result.discountCents;
    }
  }

  // Rule 4: order-level discount base and raw (pre-cap) amount.
  const foodBase = foodLineCents - bogoFoodCents;
  const generalBase = generalLineCents - bogoGeneralCents;
  const base = foodBase + generalBase;

  const orderLevelDiscountRaw = computeOrderLevelDiscount(matchedPromos, base);

  // Rule 5: cap the total discount, reducing the order-level part if needed.
  const capCents = Math.floor(subtotalCents / 2);
  const uncappedTotalCents = bogoTotalCents + orderLevelDiscountRaw;
  const orderLevelDiscountCents =
    uncappedTotalCents > capCents ? Math.max(0, capCents - bogoTotalCents) : orderLevelDiscountRaw;

  const discountCents = bogoTotalCents + orderLevelDiscountCents;

  // Rule 6: shipping, based on physical lines' net after the capped discount.
  const physicalLineCents = foodLineCents + generalLineCents;
  const physicalDiscountCents = bogoFoodCents + bogoGeneralCents + orderLevelDiscountCents;
  const { shippingCents, physicalNetCents } = computeShipping(
    hasPhysicalItems,
    physicalLineCents,
    physicalDiscountCents,
    physicalWeightGrams
  );

  // Rule 7: split the capped order-level discount between food and general
  // by their share of the order-level base, then compute tax per category
  // plus shipping tax at the general rate.
  const foodShareCents = base > 0 ? roundDivide(orderLevelDiscountCents * foodBase, base) : 0;
  const generalShareCents = orderLevelDiscountCents - foodShareCents;

  const taxCents = computeTax(
    options.region,
    {
      foodTaxableCents: foodLineCents - bogoFoodCents - foodShareCents,
      generalTaxableCents: generalLineCents - bogoGeneralCents - generalShareCents,
      digitalTaxableCents: digitalLineCents - bogoDigitalCents,
    },
    shippingCents
  );

  // Rule 8: total.
  const totalCents = subtotalCents - discountCents + shippingCents + taxCents;

  return {
    receipt: {
      lines,
      subtotalCents,
      discountCents,
      shippingCents,
      taxCents,
      totalCents,
    },
    hasPhysicalItems,
    physicalNetCents,
  };
}

export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  return computeCheckoutDetails(catalog, cart, options).receipt;
}

/**
 * Rule 9: 0 if the cart has no physical items or shipping is already free;
 * otherwise 5000 - physicalNet. Always agrees with `checkout` because both
 * are derived from the same internal computation.
 */
export function amountToFreeShippingCents(
  catalog: Product[],
  cart: CartLine[],
  options: CheckoutOptions
): number {
  const details = computeCheckoutDetails(catalog, cart, options);

  if (!details.hasPhysicalItems || details.receipt.shippingCents === 0) {
    return 0;
  }

  return 5000 - details.physicalNetCents;
}
