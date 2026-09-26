// Orchestrates rules 1-8 and exposes the extra bit of state (physicalNet)
// that amountToFreeShippingCents needs, so both public functions share one
// code path and can never disagree (rule 9).
import type { Category, CartLine, CheckoutOptions, Product, ReceiptLine } from "./types";
import { normalizeCart } from "./cart";
import { resolvePromos } from "./promos";
import { computeDiscounts } from "./discount";
import { computeShipping } from "./shipping";
import { computeTax } from "./tax";

export interface CoreResult {
  lines: ReceiptLine[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  /** physical (food + general) lineCents minus discount attributed to them; 0 when no physical items. */
  physicalNet: number;
}

export function computeCheckout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): CoreResult {
  const normalized = normalizeCart(catalog, cart);

  const subtotalCents = normalized.reduce((sum, line) => sum + line.lineCents, 0);

  const { orderLevelPromo, bogoPromos } = resolvePromos(options.promos, options.promoCodes);

  const discounts = computeDiscounts(normalized, subtotalCents, orderLevelPromo, bogoPromos);

  const lineCentsByCategory: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  for (const line of normalized) {
    lineCentsByCategory[line.category] += line.lineCents;
  }

  // Rule 6: all discount attributed to physical lines = bogo on food/general
  // + the order-level discount (which per rule 4 only ever hits non-digital
  // lines, i.e. exactly the physical ones).
  const physicalDiscount =
    discounts.bogoByCategory.food + discounts.bogoByCategory.general + discounts.orderLevelDiscount;
  const shipping = computeShipping(normalized, physicalDiscount);

  const discountByCategory: Record<Category, number> = {
    food: discounts.bogoByCategory.food + discounts.orderLevelFood,
    general: discounts.bogoByCategory.general + discounts.orderLevelGeneral,
    digital: discounts.bogoByCategory.digital,
  };

  const taxCents = computeTax({
    lineCentsByCategory,
    discountByCategory,
    shippingCents: shipping.shippingCents,
    region: options.region,
  });

  const totalCents = subtotalCents - discounts.discountCents + shipping.shippingCents + taxCents;

  const lines: ReceiptLine[] = normalized.map((line) => ({
    sku: line.sku,
    qty: line.qty,
    unitCents: line.unitCents,
    lineCents: line.lineCents,
  }));

  return {
    lines,
    subtotalCents,
    discountCents: discounts.discountCents,
    shippingCents: shipping.shippingCents,
    taxCents,
    totalCents,
    physicalNet: shipping.physicalNet,
  };
}
