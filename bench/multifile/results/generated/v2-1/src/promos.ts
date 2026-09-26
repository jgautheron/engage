import type { Promo } from "./types";

type OrderPromo = Extract<Promo, { kind: "percent" | "fixed" }>;
type BogoPromo = Extract<Promo, { kind: "bogo" }>;

export interface ActivePromos {
  order?: OrderPromo;
  bogos: BogoPromo[];
}

/**
 * Resolves promoCodes against promos, case-insensitively; the same code repeated (any case) counts once.
 * At most one percent/fixed promo may be active. Throws "unknown promo" or "promo conflict".
 */
export function resolveActivePromos(promos: Promo[], promoCodes: string[] | undefined): ActivePromos {
  const seenCodes = new Set<string>();
  const active: Promo[] = [];

  for (const code of promoCodes ?? []) {
    const key = code.toLowerCase();
    if (seenCodes.has(key)) continue;
    seenCodes.add(key);

    const promo = promos.find((p) => p.code.toLowerCase() === key);
    if (!promo) throw new Error("unknown promo");
    active.push(promo);
  }

  const isOrderPromo = (p: Promo): p is OrderPromo => p.kind === "percent" || p.kind === "fixed";
  const orders = active.filter(isOrderPromo);
  if (orders.length > 1) throw new Error("promo conflict");

  const isBogoPromo = (p: Promo): p is BogoPromo => p.kind === "bogo";
  return { order: orders[0], bogos: active.filter(isBogoPromo) };
}
