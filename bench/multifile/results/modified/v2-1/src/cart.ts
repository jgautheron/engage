import type { CartLine, Product, ReceiptLine } from "./types";

const MIN_QTY = 1;
const MAX_QTY = 99;

/** A merged cart line priced against the catalog; the shared unit every downstream calc reads from. */
export interface Line {
  sku: string;
  qty: number;
  product: Product;
  lineCents: number;
}

/**
 * Merges duplicate skus (summed qty, first-appearance order) and prices them against the catalog.
 * Throws "empty cart", "unknown sku", or "invalid qty" (merged qty must be an integer 1-99).
 */
export function buildLines(catalog: Product[], cart: CartLine[]): Line[] {
  if (cart.length === 0) throw new Error("empty cart");

  const catalogBySku = new Map(catalog.map((product) => [product.sku, product]));
  const order: string[] = [];
  const qtyBySku = new Map<string, number>();

  for (const { sku, qty } of cart) {
    if (!catalogBySku.has(sku)) throw new Error("unknown sku");
    if (!qtyBySku.has(sku)) {
      order.push(sku);
      qtyBySku.set(sku, 0);
    }
    qtyBySku.set(sku, qtyBySku.get(sku)! + qty);
  }

  return order.map((sku) => {
    const qty = qtyBySku.get(sku)!;
    if (!Number.isInteger(qty) || qty < MIN_QTY || qty > MAX_QTY) throw new Error("invalid qty");
    const product = catalogBySku.get(sku)!;
    return { sku, qty, product, lineCents: product.priceCents * qty };
  });
}

/** Projects priced lines to the public receipt shape (drops the catalog product). */
export function toReceiptLines(lines: Line[]): ReceiptLine[] {
  return lines.map(({ sku, qty, product, lineCents }) => ({
    sku,
    qty,
    unitCents: product.priceCents,
    lineCents,
  }));
}
