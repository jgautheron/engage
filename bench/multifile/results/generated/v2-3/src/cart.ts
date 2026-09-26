import type { CartLine, Product, ReceiptLine } from "./types";

/** A priced cart line plus the catalog fields other modules need (category for tax/shipping, weight for shipping). */
export interface Line extends ReceiptLine {
  category: Product["category"];
  weightGrams: number;
}

/**
 * Merges duplicate skus (summing qty, keeping first-appearance order), prices each against the
 * catalog, and sums the subtotal. Throws "empty cart", "unknown sku", or "invalid qty" (qty must
 * be an integer from 1 to 99 after merging).
 */
export function buildLines(catalog: Product[], cart: CartLine[]): { lines: Line[]; subtotalCents: number } {
  if (cart.length === 0) throw new Error("empty cart");

  const order: string[] = [];
  const qtyBySku = new Map<string, number>();
  for (const { sku, qty } of cart) {
    if (!qtyBySku.has(sku)) order.push(sku);
    qtyBySku.set(sku, (qtyBySku.get(sku) ?? 0) + qty);
  }

  const productBySku = new Map(catalog.map((p) => [p.sku, p]));
  const lines: Line[] = [];
  let subtotalCents = 0;
  for (const sku of order) {
    const product = productBySku.get(sku);
    if (!product) throw new Error("unknown sku");
    const qty = qtyBySku.get(sku)!;
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) throw new Error("invalid qty");
    const lineCents = product.priceCents * qty;
    lines.push({
      sku,
      qty,
      unitCents: product.priceCents,
      lineCents,
      category: product.category,
      weightGrams: product.weightGrams,
    });
    subtotalCents += lineCents;
  }
  return { lines, subtotalCents };
}
