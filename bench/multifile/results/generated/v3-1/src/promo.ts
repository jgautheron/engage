import type { Promo } from "./types";

type OrderLevelPromo = Extract<Promo, { kind: "percent" | "fixed" }>;
type BogoPromo = Extract<Promo, { kind: "bogo" }>;

export interface ResolvedPromos {
  orderLevel?: OrderLevelPromo;
  bogos: BogoPromo[];
}

/** Matches promoCodes case-insensitively against promos[].code (dupes count once). Throws "unknown promo" on no match, "promo conflict" on >1 order-level (percent/fixed) promo. */
export function resolvePromos(promos: Promo[], promoCodes: string[] | undefined): ResolvedPromos {
  const seen = new Set<string>();
  const selected: Promo[] = [];

  for (const code of promoCodes ?? []) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const promo = promos.find((p) => p.code.toLowerCase() === key);
    if (!promo) throw new Error("unknown promo");
    selected.push(promo);
  }

  const orderLevel = selected.filter((p): p is OrderLevelPromo => p.kind === "percent" || p.kind === "fixed");
  if (orderLevel.length > 1) throw new Error("promo conflict");

  const bogos = selected.filter((p): p is BogoPromo => p.kind === "bogo");

  return { orderLevel: orderLevel[0], bogos };
}
