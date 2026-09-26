import type { Category, Product, ReceiptLine } from "./types";

export interface LineDetail extends ReceiptLine {
  category: Category;
  weightGrams: number;
}

/** Joins priced receipt lines with their product's category/weight for downstream calc. */
export function attachProductInfo(lines: ReceiptLine[], products: Map<string, Product>): LineDetail[] {
  return lines.map((line) => {
    const product = products.get(line.sku)!;
    return { ...line, category: product.category, weightGrams: product.weightGrams };
  });
}
