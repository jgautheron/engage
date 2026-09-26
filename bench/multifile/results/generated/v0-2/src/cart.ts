// Rule 1: cart normalization.
import type { Category, CartLine, Product, ReceiptLine } from "./types";

/** A merged, priced, catalog-resolved cart line, ready for discount/tax attribution. */
export interface NormalizedLine extends ReceiptLine {
  category: Category;
  weightGrams: number;
}

/**
 * Merges cart lines with the same sku (quantities summed, first-appearance
 * order preserved), resolves each against the catalog, and validates
 * quantities. Throws on: empty cart, unknown sku, invalid qty.
 */
export function normalizeCart(catalog: Product[], cart: CartLine[]): NormalizedLine[] {
  if (cart.length === 0) {
    throw new Error("checkout: empty cart");
  }

  const order: string[] = [];
  const qtyBySku = new Map<string, number>();
  for (const line of cart) {
    if (!qtyBySku.has(line.sku)) {
      order.push(line.sku);
      qtyBySku.set(line.sku, 0);
    }
    qtyBySku.set(line.sku, (qtyBySku.get(line.sku) as number) + line.qty);
  }

  const productBySku = new Map<string, Product>();
  for (const product of catalog) {
    productBySku.set(product.sku, product);
  }

  const lines: NormalizedLine[] = [];
  for (const sku of order) {
    const product = productBySku.get(sku);
    if (!product) {
      throw new Error(`checkout: unknown sku: ${sku}`);
    }

    const qty = qtyBySku.get(sku) as number;
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      throw new Error(`checkout: invalid qty for sku ${sku}: ${qty}`);
    }

    const unitCents = product.priceCents;
    const lineCents = unitCents * qty;
    lines.push({
      sku,
      qty,
      unitCents,
      lineCents,
      category: product.category,
      weightGrams: product.weightGrams,
    });
  }

  return lines;
}
