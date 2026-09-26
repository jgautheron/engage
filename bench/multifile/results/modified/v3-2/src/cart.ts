import type { CartLine, Product, ReceiptLine } from "./types";

export interface CartResult {
  lines: ReceiptLine[];
  subtotalCents: number;
}

/**
 * Merge duplicate skus (summed qty, first-appearance order) into receipt lines.
 * Throws "empty cart", "unknown sku", or "invalid qty" (merged qty must be an integer 1-99).
 */
export function buildCart(catalog: Product[], cart: CartLine[]): CartResult {
  if (cart.length === 0) throw new Error("empty cart");

  const catalogBySku = new Map(catalog.map((p) => [p.sku, p]));
  const qtyBySku = new Map<string, number>();
  const order: string[] = [];

  for (const line of cart) {
    if (!catalogBySku.has(line.sku)) throw new Error("unknown sku");
    if (!qtyBySku.has(line.sku)) order.push(line.sku);
    qtyBySku.set(line.sku, (qtyBySku.get(line.sku) ?? 0) + line.qty);
  }

  const lines = order.map((sku): ReceiptLine => {
    const qty = qtyBySku.get(sku)!;
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) throw new Error("invalid qty");
    const unitCents = catalogBySku.get(sku)!.priceCents;
    return { sku, qty, unitCents, lineCents: unitCents * qty };
  });

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);
  return { lines, subtotalCents };
}
