export type Category = "food" | "general" | "digital";

export interface Product {
  sku: string;
  name: string;
  priceCents: number;
  category: Category;
  weightGrams: number;
}

export interface CartLine {
  sku: string;
  qty: number;
}

/** Discriminated by kind. percent/fixed/category are order-level (at most one may apply); bogo is per-sku (any number may apply). */
export type Promo =
  | { kind: "percent"; code: string; percent: number; minSubtotalCents?: number }
  | { kind: "fixed"; code: string; amountCents: number }
  | { kind: "category"; code: string; category: Category; percent: number }
  | { kind: "bogo"; code: string; sku: string };

/** taxBasisPoints is in basis points: 825 means 8.25%. */
export interface Region {
  code: string;
  taxBasisPoints: Record<Category, number>;
}

/** promoCodes selects which entries of promos actually apply; promos not referenced there are inert. */
export interface CheckoutOptions {
  region: Region;
  promos: Promo[];
  promoCodes?: string[];
}

export interface ReceiptLine {
  sku: string;
  qty: number;
  unitCents: number;
  lineCents: number;
}

/** All money fields are integer cents. */
export interface Receipt {
  lines: ReceiptLine[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  appliedPromoCodes: string[];
}
