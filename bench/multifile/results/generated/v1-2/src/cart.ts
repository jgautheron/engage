import type { Product, CartLine, ReceiptLine, Category } from "./types";

export interface Line extends ReceiptLine {
  category: Category;
}

export function resolveCart(catalog: Product[], cart: CartLine[]): { lines: Line[]; subtotalCents: number } {
  if (cart.length === 0) throw new Error("empty cart");

  const bySku = new Map<string, Line>();
  const order: string[] = [];
  for (const { sku, qty } of cart) {
    const existing = bySku.get(sku);
    if (existing) {
      existing.qty += qty;
      continue;
    }
    const product = catalog.find((p) => p.sku === sku);
    if (!product) throw new Error(`unknown sku: ${sku}`);
    order.push(sku);
    bySku.set(sku, { sku, qty, unitCents: product.priceCents, lineCents: 0, category: product.category });
  }

  const lines = order.map((sku) => bySku.get(sku)!);
  for (const line of lines) {
    if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > 99) {
      throw new Error(`invalid qty: ${line.sku}`);
    }
    line.lineCents = line.unitCents * line.qty;
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);
  return { lines, subtotalCents };
}
