import type { CartLine, Category, Product, ReceiptLine } from "./types.js";

// Internal line: a receipt line plus catalog fields needed by discount/shipping/tax.
export interface Line extends ReceiptLine {
  category: Category;
  weightGrams: number;
}

export function buildLines(catalog: Product[], cart: CartLine[]): Line[] {
  if (cart.length === 0) throw new Error("empty cart");

  const order: string[] = [];
  const qtyBySku = new Map<string, number>();
  for (const { sku, qty } of cart) {
    if (!qtyBySku.has(sku)) order.push(sku);
    qtyBySku.set(sku, (qtyBySku.get(sku) ?? 0) + qty);
  }

  const bySku = new Map(catalog.map((p) => [p.sku, p]));
  return order.map((sku) => {
    const product = bySku.get(sku);
    if (!product) throw new Error(`unknown sku: ${sku}`);
    const qty = qtyBySku.get(sku)!;
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) throw new Error(`invalid qty: ${sku}`);
    const unitCents = product.priceCents;
    return {
      sku,
      qty,
      unitCents,
      lineCents: unitCents * qty,
      category: product.category,
      weightGrams: product.weightGrams,
    };
  });
}
