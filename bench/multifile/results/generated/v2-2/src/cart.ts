import type { Category, CartItem, CartLine, Product, ReceiptLine } from "./types";

const MIN_QTY = 1;
const MAX_QTY = 99;

/**
 * Merges same-sku lines (summed qty, first-appearance order), resolves each against the
 * catalog, and validates qty range. Throws "empty cart", "unknown sku", or "invalid qty".
 */
export function resolveCartItems(catalog: Product[], cart: CartLine[]): CartItem[] {
  if (cart.length === 0) throw new Error("empty cart");

  const order: string[] = [];
  const qtyBySku = new Map<string, number>();
  for (const line of cart) {
    if (!qtyBySku.has(line.sku)) order.push(line.sku);
    qtyBySku.set(line.sku, (qtyBySku.get(line.sku) ?? 0) + line.qty);
  }

  const productBySku = new Map(catalog.map((product) => [product.sku, product]));
  return order.map((sku) => {
    const product = productBySku.get(sku);
    if (!product) throw new Error("unknown sku");
    const qty = qtyBySku.get(sku)!;
    if (!Number.isInteger(qty) || qty < MIN_QTY || qty > MAX_QTY) throw new Error("invalid qty");
    return { product, qty };
  });
}

/** Receipt lines: unitCents = catalog price, lineCents = unitCents × qty. */
export function toReceiptLines(items: CartItem[]): ReceiptLine[] {
  return items.map(({ product, qty }) => ({
    sku: product.sku,
    qty,
    unitCents: product.priceCents,
    lineCents: product.priceCents * qty,
  }));
}

/** Gross lineCents per category, before any discount. */
export function lineCentsByCategory(items: CartItem[]): Record<Category, number> {
  const totals: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  for (const { product, qty } of items) {
    totals[product.category] += product.priceCents * qty;
  }
  return totals;
}
