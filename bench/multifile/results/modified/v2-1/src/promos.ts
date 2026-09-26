import type { Promo } from "./types";

type OrderPromo = Extract<Promo, { kind: "percent" | "fixed" }>;
export type CategoryPromo = Extract<Promo, { kind: "category" }>;
type BogoPromo = Extract<Promo, { kind: "bogo" }>;

export interface ActivePromos {
  order?: OrderPromo;
  categoryPromo?: CategoryPromo;
  bogos: BogoPromo[];
  appliedPromoCodes: string[];
}

/**
 * Resolves promoCodes against promos, case-insensitively; the same code repeated (any case) counts once.
 * Unknown codes are ignored. At most one percent/fixed/category promo may be active. Throws "promo conflict".
 */
export function resolveActivePromos(promos: Promo[], promoCodes: string[] | undefined): ActivePromos {
  const seenCodes = new Set<string>();
  const active: Promo[] = [];
  const appliedCodes: string[] = [];

  for (const code of promoCodes ?? []) {
    const key = code.toLowerCase();
    if (seenCodes.has(key)) continue;
    seenCodes.add(key);

    const promo = promos.find((p) => p.code.toLowerCase() === key);
    if (!promo) continue; // Ignore unknown codes instead of throwing
    active.push(promo);
    appliedCodes.push(promo.code);
  }

  const isOrderPromo = (p: Promo): p is OrderPromo => p.kind === "percent" || p.kind === "fixed";
  const orders = active.filter(isOrderPromo);

  const isCategoryPromo = (p: Promo): p is CategoryPromo => p.kind === "category";
  const categoryPromos = active.filter(isCategoryPromo);

  if (orders.length + categoryPromos.length > 1) throw new Error("promo conflict");

  const isBogoPromo = (p: Promo): p is BogoPromo => p.kind === "bogo";
  return {
    order: orders[0],
    categoryPromo: categoryPromos[0],
    bogos: active.filter(isBogoPromo),
    appliedPromoCodes: appliedCodes,
  };
}
