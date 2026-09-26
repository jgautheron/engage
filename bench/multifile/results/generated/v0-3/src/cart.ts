// Cart merging, validation, and receipt-line construction (spec rule 1).

import type { CartLine, Product, ReceiptLine } from "./types";

export function buildCatalogMap(catalog: Product[]): Map<string, Product> {
  const map = new Map<string, Product>();
  for (const product of catalog) {
    map.set(product.sku, product);
  }
  return map;
}

/** Merges cart lines with the same sku, summing quantities and keeping first-appearance order. */
export function mergeCartLines(cart: CartLine[]): CartLine[] {
  const order: string[] = [];
  const totals = new Map<string, number>();

  for (const line of cart) {
    if (!totals.has(line.sku)) {
      order.push(line.sku);
      totals.set(line.sku, 0);
    }
    totals.set(line.sku, totals.get(line.sku)! + line.qty);
  }

  return order.map((sku) => ({ sku, qty: totals.get(sku)! }));
}

export interface CartBuildResult {
  lines: ReceiptLine[];
  catalogMap: Map<string, Product>;
  subtotalCents: number;
}

/**
 * Validates the cart against the catalog and produces receipt lines.
 *
 * Throws on:
 * - an empty cart ("empty cart")
 * - a sku missing from the catalog ("unknown sku")
 * - a merged quantity outside the 1-99 integer range ("invalid qty")
 */
export function buildCart(catalog: Product[], cart: CartLine[]): CartBuildResult {
  if (cart.length === 0) {
    throw new Error("empty cart");
  }

  const catalogMap = buildCatalogMap(catalog);
  const merged = mergeCartLines(cart);

  const lines: ReceiptLine[] = [];
  let subtotalCents = 0;

  for (const line of merged) {
    const product = catalogMap.get(line.sku);
    if (!product) {
      throw new Error(`unknown sku: ${line.sku}`);
    }

    if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > 99) {
      throw new Error(`invalid qty: ${line.sku}`);
    }

    const unitCents = product.priceCents;
    const lineCents = unitCents * line.qty;

    lines.push({ sku: line.sku, qty: line.qty, unitCents, lineCents });
    subtotalCents += lineCents;
  }

  return { lines, catalogMap, subtotalCents };
}
