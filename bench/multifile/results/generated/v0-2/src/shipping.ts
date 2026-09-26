// Rule 6: shipping.
import type { NormalizedLine } from "./cart";

export interface ShippingResult {
  hasPhysical: boolean;
  /** physical (food + general) lineCents minus discount attributed to them; 0 when no physical items. */
  physicalNet: number;
  shippingCents: number;
}

/**
 * physicalDiscount is all discount attributed to physical (food + general)
 * lines after the cap: bogo discount on food/general lines plus the whole
 * order-level discount (which, per rule 4, only ever touches non-digital
 * lines, i.e. exactly the physical lines).
 */
export function computeShipping(lines: NormalizedLine[], physicalDiscount: number): ShippingResult {
  let physicalLineCents = 0;
  let weightGramsTotal = 0;
  let hasPhysical = false;

  for (const line of lines) {
    if (line.category === "food" || line.category === "general") {
      hasPhysical = true;
      physicalLineCents += line.lineCents;
      weightGramsTotal += line.weightGrams * line.qty;
    }
  }

  if (!hasPhysical) {
    return { hasPhysical, physicalNet: 0, shippingCents: 0 };
  }

  const physicalNet = physicalLineCents - physicalDiscount;

  if (physicalNet >= 5000) {
    return { hasPhysical, physicalNet, shippingCents: 0 };
  }

  const kg = weightGramsTotal / 1000;
  const shippingCents = 499 + 100 * Math.max(0, Math.ceil(kg) - 1);

  return { hasPhysical, physicalNet, shippingCents };
}
