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
  | { kind: "bogo"; code: string; sku: string }
  | { kind: "category"; code: string; category: Category; percent: number };

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
  appliedPromoCodes: string[];
}
