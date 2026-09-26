import { categoryBySku, lineCentsByCategory, type CategoryTotals } from "./categories";
import { roundHalfUp } from "./money";
import type { Product, Promo, ReceiptLine } from "./types";

type OrderPromo = Extract<Promo, { kind: "percent" | "fixed" | "category" }>;
type BogoPromo = Extract<Promo, { kind: "bogo" }>;

export interface ResolvedPromos {
  orderPromo: OrderPromo | undefined;
  bogoPromos: BogoPromo[];
  appliedPromoCodes: string[];
}

/**
 * Match promoCodes against promos case-insensitively; same code twice counts once.
 * Unknown codes are ignored. Throws "promo conflict" on two order-level (percent/fixed/category) promos.
 */
export function resolvePromos(promos: Promo[], promoCodes: string[] = []): ResolvedPromos {
  const byCode = new Map(promos.map((p) => [p.code.toLowerCase(), p]));
  const seen = new Set<string>();
  const orderPromos: OrderPromo[] = [];
  const bogoPromos: BogoPromo[] = [];
  const appliedPromoCodes: string[] = [];

  for (const code of promoCodes) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const promo = byCode.get(key);
    if (!promo) continue; // ignore unknown promo codes
    appliedPromoCodes.push(promo.code);
    if (promo.kind === "bogo") bogoPromos.push(promo);
    else orderPromos.push(promo);
  }

  if (orderPromos.length > 1) throw new Error("promo conflict");
  return { orderPromo: orderPromos[0], bogoPromos, appliedPromoCodes };
}

export interface DiscountBreakdown {
  discountCents: number;
  bogoByCategory: CategoryTotals;
  orderLevelDiscount: number; // order-level part, after the cap
  orderBase: number; // non-digital lineCents minus non-digital bogo, before the cap
  foodBase: number; // food lineCents minus food bogo
  categoryDiscountByCategory: CategoryTotals; // category promo discount per category
}

/**
 * Bogo (floor(qty/2) free units) plus one order-level percent/fixed/category discount,
 * capped at floor(subtotalCents / 2) by shrinking the order-level part.
 */
export function computeDiscounts(
  catalog: Product[],
  lines: ReceiptLine[],
  subtotalCents: number,
  orderPromo: OrderPromo | undefined,
  bogoPromos: BogoPromo[]
): DiscountBreakdown {
  const categories = categoryBySku(catalog);
  const lineBySku = new Map(lines.map((l) => [l.sku, l]));

  const bogoByCategory: CategoryTotals = { food: 0, general: 0, digital: 0 };
  for (const bogo of bogoPromos) {
    const line = lineBySku.get(bogo.sku);
    if (!line) continue; // sku not in cart -> 0
    const freeUnits = Math.floor(line.qty / 2);
    bogoByCategory[categories.get(bogo.sku)!] += freeUnits * line.unitCents;
  }

  const lineCents = lineCentsByCategory(lines, categories);
  const orderBase = lineCents.food + lineCents.general - bogoByCategory.food - bogoByCategory.general;
  const foodBase = lineCents.food - bogoByCategory.food;

  const categoryDiscountByCategory: CategoryTotals = { food: 0, general: 0, digital: 0 };
  const rawOrderLevel = orderLevelBeforeCap(orderPromo, orderBase, lineCents, bogoByCategory, categoryDiscountByCategory);
  const bogoTotal = bogoByCategory.food + bogoByCategory.general + bogoByCategory.digital;
  const categoryTotal = categoryDiscountByCategory.food + categoryDiscountByCategory.general + categoryDiscountByCategory.digital;
  const cap = Math.floor(subtotalCents / 2);
  const discountCents = Math.min(bogoTotal + categoryTotal + rawOrderLevel, cap);

  return { discountCents, bogoByCategory, orderLevelDiscount: discountCents - bogoTotal - categoryTotal, orderBase, foodBase, categoryDiscountByCategory };
}

function orderLevelBeforeCap(
  promo: OrderPromo | undefined,
  base: number,
  lineCents: CategoryTotals,
  bogoByCategory: CategoryTotals,
  categoryDiscountByCategory: CategoryTotals
): number {
  if (!promo) return 0;
  if (promo.kind === "fixed") return Math.min(promo.amountCents, base);
  if (promo.kind === "category") {
    const categoryBase = lineCents[promo.category] - bogoByCategory[promo.category];
    const discount = roundHalfUp((categoryBase * promo.percent) / 100);
    categoryDiscountByCategory[promo.category] = discount;
    return 0; // category discount is not part of the order-level discount for cap calculation
  }
  if (promo.minSubtotalCents !== undefined && base < promo.minSubtotalCents) return 0;
  return roundHalfUp((base * promo.percent) / 100);
}
