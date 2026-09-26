import type { CartLine, Product, ReceiptLine } from "./types";

export function productMap(catalog: Product[]): Map<string, Product> {
  return new Map(catalog.map((p) => [p.sku, p]));
}

interface CartResult {
  lines: ReceiptLine[];
  subtotalCents: number;
}

/**
 * Merges duplicate skus (summed qty, first-appearance order) and prices each line.
 * Throws "empty cart", "unknown sku", or "invalid qty" (checked post-merge, range 1-99).
 */
export function buildCart(catalog: Product[], cart: CartLine[]): CartResult {
  if (cart.length === 0) throw new Error("empty cart");

  const products = productMap(catalog);
  const order: string[] = [];
  const qtyBySku = new Map<string, number>();

  for (const { sku, qty } of cart) {
    if (!products.has(sku)) throw new Error("unknown sku");
    if (!qtyBySku.has(sku)) order.push(sku);
    qtyBySku.set(sku, (qtyBySku.get(sku) ?? 0) + qty);
  }

  const lines: ReceiptLine[] = order.map((sku) => {
    const qty = qtyBySku.get(sku)!;
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) throw new Error("invalid qty");
    const unitCents = products.get(sku)!.priceCents;
    return { sku, qty, unitCents, lineCents: unitCents * qty };
  });

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineCents, 0);
  return { lines, subtotalCents };
}
