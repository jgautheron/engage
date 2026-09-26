import type { Product, CartLine, CheckoutOptions, Receipt, ReceiptLine } from "./types";
import { resolveCart } from "./cart";
import { computeDiscounts } from "./promotions";
import { computePhysicalNet, computeShippingCents, FREE_SHIPPING_THRESHOLD_CENTS } from "./shipping";
import { computeTaxCents } from "./tax";

export type { Category, Product, CartLine, Promo, Region, CheckoutOptions, ReceiptLine, Receipt } from "./types";

export function checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt {
  const { lines, subtotalCents } = resolveCart(catalog, cart);
  const { bogoBySku, orderLevelActual, discountCents, base, foodBase } = computeDiscounts(lines, subtotalCents, options);
  const { hasPhysical, physicalNet } = computePhysicalNet(lines, bogoBySku, orderLevelActual);
  const shippingCents = computeShippingCents(catalog, lines, hasPhysical, physicalNet);
  const taxCents = computeTaxCents(lines, bogoBySku, orderLevelActual, base, foodBase, options.region, shippingCents);
  const totalCents = subtotalCents - discountCents + shippingCents + taxCents;

  const receiptLines: ReceiptLine[] = lines.map(({ sku, qty, unitCents, lineCents }) => ({ sku, qty, unitCents, lineCents }));

  return { lines: receiptLines, subtotalCents, discountCents, shippingCents, taxCents, totalCents };
}

export function amountToFreeShippingCents(catalog: Product[], cart: CartLine[], options: CheckoutOptions): number {
  const { lines, subtotalCents } = resolveCart(catalog, cart);
  const { bogoBySku, orderLevelActual } = computeDiscounts(lines, subtotalCents, options);
  const { hasPhysical, physicalNet } = computePhysicalNet(lines, bogoBySku, orderLevelActual);
  if (!hasPhysical || physicalNet >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;
  return FREE_SHIPPING_THRESHOLD_CENTS - physicalNet;
}
