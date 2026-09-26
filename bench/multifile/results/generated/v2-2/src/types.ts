// Shared domain types. Money is always integer cents.

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

export type Promo =
  | { kind: "percent"; code: string; percent: number; minSubtotalCents?: number }
  | { kind: "fixed"; code: string; amountCents: number }
  | { kind: "bogo"; code: string; sku: string };

export interface Region {
  code: string;
  taxBasisPoints: Record<Category, number>; // 825 = 8.25%
}

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

export interface Receipt {
  lines: ReceiptLine[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
}

/** Catalog-resolved, quantity-merged cart entry (post cart validation). */
export interface CartItem {
  product: Product;
  qty: number;
}

/** Gross lineCents and attributed bogo discount, per category. Feeds promo/shipping/tax math. */
export interface CategoryTotals {
  lineCents: Record<Category, number>;
  bogoCents: Record<Category, number>;
}
