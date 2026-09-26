import type { Category, Product, CartLine } from "./types";

export interface Line {
  sku: string;
  qty: number;
  unitCents: number;
  lineCents: number;
  category: Category;
  weightGrams: number;
}

/** Merge duplicate skus (sums qty, keeps first-appearance order), prices against the catalog. Throws "empty cart", "unknown sku", or "invalid qty" (merged qty must be an integer 1-99). */
export function resolveCart(catalog: Product[], cart: CartLine[]): { lines: Line[]; subtotalCents: number } {
  if (cart.length === 0) throw new Error("empty cart");

  const bySku = new Map(catalog.map((p) => [p.sku, p]));
  const order: string[] = [];
  const qtyBySku = new Map<string, number>();

  for (const { sku, qty } of cart) {
    if (!qtyBySku.has(sku)) order.push(sku);
    qtyBySku.set(sku, (qtyBySku.get(sku) ?? 0) + qty);
  }

  const lines: Line[] = [];
  let subtotalCents = 0;

  for (const sku of order) {
    const product = bySku.get(sku);
    if (!product) throw new Error("unknown sku");

    const qty = qtyBySku.get(sku) as number;
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) throw new Error("invalid qty");

    const lineCents = product.priceCents * qty;
    lines.push({ sku, qty, unitCents: product.priceCents, lineCents, category: product.category, weightGrams: product.weightGrams });
    subtotalCents += lineCents;
  }

  return { lines, subtotalCents };
}
