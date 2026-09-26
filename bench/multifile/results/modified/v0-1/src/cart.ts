// Rule 1: cart merging, validation, and receipt line construction.

import type { CartLine, Product, ReceiptLine } from "./types";

/**
 * Merges cart lines with the same sku (quantities summed), keeping
 * first-appearance order. Throws "empty cart" if given no lines at all.
 */
export function mergeCartLines(cart: CartLine[]): CartLine[] {
  if (cart.length === 0) {
    throw new Error("empty cart");
  }

  const order: string[] = [];
  const quantities = new Map<string, number>();

  for (const line of cart) {
    if (!quantities.has(line.sku)) {
      order.push(line.sku);
      quantities.set(line.sku, 0);
    }
    quantities.set(line.sku, quantities.get(line.sku)! + line.qty);
  }

  return order.map((sku) => ({ sku, qty: quantities.get(sku)! }));
}

export interface BuiltCart {
  lines: ReceiptLine[];
  productBySku: Map<string, Product>;
  subtotalCents: number;
}

/**
 * Merges the cart, validates every sku exists in the catalog and every
 * merged quantity is an integer in [1, 99], then builds receipt lines.
 */
export function buildCart(catalog: Product[], cart: CartLine[]): BuiltCart {
  const merged = mergeCartLines(cart);

  const productBySku = new Map<string, Product>();
  for (const product of catalog) {
    productBySku.set(product.sku, product);
  }

  const lines: ReceiptLine[] = [];
  let subtotalCents = 0;

  for (const { sku, qty } of merged) {
    const product = productBySku.get(sku);
    if (!product) {
      throw new Error("unknown sku");
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      throw new Error("invalid qty");
    }

    const unitCents = product.priceCents;
    const lineCents = unitCents * qty;
    lines.push({ sku, qty, unitCents, lineCents });
    subtotalCents += lineCents;
  }

  return { lines, productBySku, subtotalCents };
}
