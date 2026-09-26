import type { CartLine, Product, ReceiptLine } from "./types";

export interface ResolvedLine extends ReceiptLine {
  category: Product["category"];
  weightGrams: number;
}

function mergeCartLines(cart: CartLine[]): CartLine[] {
  const order: string[] = [];
  const qtyBySku = new Map<string, number>();
  for (const line of cart) {
    if (!qtyBySku.has(line.sku)) order.push(line.sku);
    qtyBySku.set(line.sku, (qtyBySku.get(line.sku) ?? 0) + line.qty);
  }
  return order.map((sku) => ({ sku, qty: qtyBySku.get(sku) as number }));
}

export function buildLines(catalog: Product[], cart: CartLine[]): ResolvedLine[] {
  if (cart.length === 0) throw new Error("empty cart");
  const bySku = new Map(catalog.map((p) => [p.sku, p]));

  return mergeCartLines(cart).map(({ sku, qty }) => {
    const product = bySku.get(sku);
    if (!product) throw new Error(`unknown sku: ${sku}`);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      throw new Error(`invalid qty for ${sku}: ${qty}`);
    }
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
