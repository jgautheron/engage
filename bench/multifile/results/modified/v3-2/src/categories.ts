import type { Category, Product, ReceiptLine } from "./types";

export type CategoryTotals = Record<Category, number>;

/** sku -> category lookup built from the catalog. */
export function categoryBySku(catalog: Product[]): Map<string, Category> {
  return new Map(catalog.map((p) => [p.sku, p.category]));
}

/** Sum receipt-line lineCents per category. */
export function lineCentsByCategory(lines: ReceiptLine[], categories: Map<string, Category>): CategoryTotals {
  const totals: CategoryTotals = { food: 0, general: 0, digital: 0 };
  for (const line of lines) totals[categories.get(line.sku)!] += line.lineCents;
  return totals;
}
