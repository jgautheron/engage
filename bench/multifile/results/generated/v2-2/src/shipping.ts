import type { CartItem, CategoryTotals } from "./types";
import { physicalBase } from "./promotions";

export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
const BASE_SHIPPING_CENTS = 499;
const PER_KG_CENTS = 100;
const GRAMS_PER_KG = 1000;

function isPhysical(item: CartItem): boolean {
  return item.product.category === "food" || item.product.category === "general";
}

export function hasPhysicalItems(items: CartItem[]): boolean {
  return items.some(isPhysical);
}

/** Physical (food + general) lineCents minus all discount attributed to physical lines. */
export function physicalNetCents(totals: CategoryTotals, cappedOrderLevel: number): number {
  return physicalBase(totals) - cappedOrderLevel;
}

/** 0 if no physical items or physicalNet clears the free-shipping threshold; else a per-kg rate. */
export function shippingCents(items: CartItem[], physicalNet: number): number {
  const physicalItems = items.filter(isPhysical);
  if (physicalItems.length === 0) return 0;
  if (physicalNet >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;

  const grams = physicalItems.reduce((sum, item) => sum + item.product.weightGrams * item.qty, 0);
  const kg = grams / GRAMS_PER_KG;
  return BASE_SHIPPING_CENTS + PER_KG_CENTS * Math.max(0, Math.ceil(kg) - 1);
}
