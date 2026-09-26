import type { CartItem, CategoryTotals, Promo } from "./types";
import { roundHalfUp } from "./money";

type OrderPromo = Extract<Promo, { kind: "percent" } | { kind: "fixed" }>;
type BogoPromo = Extract<Promo, { kind: "bogo" }>;

const BOGO_GROUP_SIZE = 2;

interface ResolvedPromos {
  orderLevel?: OrderPromo;
  bogos: BogoPromo[];
}

/**
 * Matches promoCodes against promos[].code case-insensitively (same code twice counts once).
 * Throws "unknown promo" on no match, "promo conflict" if more than one order-level promo matches.
 */
export function resolvePromos(promos: Promo[], promoCodes: string[] | undefined): ResolvedPromos {
  const seen = new Set<string>();
  const matched: Promo[] = [];
  for (const code of promoCodes ?? []) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const found = promos.filter((promo) => promo.code.toLowerCase() === key);
    if (found.length === 0) throw new Error("unknown promo");
    matched.push(...found);
  }

  const orderLevel = matched.filter((promo): promo is OrderPromo => promo.kind !== "bogo");
  if (orderLevel.length > 1) throw new Error("promo conflict");
  const bogos = matched.filter((promo): promo is BogoPromo => promo.kind === "bogo");
  return { orderLevel: orderLevel[0], bogos };
}

/** floor(qty/2) units free per bogo promo, keyed by sku; 0 if a promo's sku isn't in the cart. */
export function bogoDiscountsBySku(items: CartItem[], bogos: BogoPromo[]): Map<string, number> {
  const itemBySku = new Map(items.map((item) => [item.product.sku, item]));
  const discounts = new Map<string, number>();
  for (const bogo of bogos) {
    const item = itemBySku.get(bogo.sku);
    const discount = item ? Math.floor(item.qty / BOGO_GROUP_SIZE) * item.product.priceCents : 0;
    discounts.set(bogo.sku, (discounts.get(bogo.sku) ?? 0) + discount);
  }
  return discounts;
}

/** Bogo discount total per category (a bogo's discount belongs to its sku's category). */
export function bogoCentsByCategory(
  items: CartItem[],
  bogoBySku: Map<string, number>
): CategoryTotals["bogoCents"] {
  const totals: CategoryTotals["bogoCents"] = { food: 0, general: 0, digital: 0 };
  for (const { product } of items) {
    totals[product.category] += bogoBySku.get(product.sku) ?? 0;
  }
  return totals;
}

/** food lineCents minus food bogo discount. */
export function foodBase(totals: CategoryTotals): number {
  return totals.lineCents.food - totals.bogoCents.food;
}

/** general lineCents minus general bogo discount. */
export function generalBase(totals: CategoryTotals): number {
  return totals.lineCents.general - totals.bogoCents.general;
}

/** Order-level promo base: non-digital (food + general) lineCents minus non-digital bogo discount. */
export function physicalBase(totals: CategoryTotals): number {
  return foodBase(totals) + generalBase(totals);
}

/** percent/fixed discount against `base`; percent is 0 if minSubtotalCents isn't met. */
export function orderLevelDiscount(promo: OrderPromo | undefined, base: number): number {
  if (!promo) return 0;
  if (promo.kind === "fixed") return Math.min(promo.amountCents, base);
  if (promo.minSubtotalCents !== undefined && base < promo.minSubtotalCents) return 0;
  return roundHalfUp((base * promo.percent) / 100);
}

/** Total discount capped at floor(subtotal/2); only the order-level part is reduced by the cap. */
export function capDiscount(
  bogoTotal: number,
  orderLevel: number,
  subtotalCents: number
): { discountCents: number; cappedOrderLevel: number } {
  const cap = Math.floor(subtotalCents / 2);
  const discountCents = Math.min(bogoTotal + orderLevel, cap);
  return { discountCents, cappedOrderLevel: discountCents - bogoTotal };
}
