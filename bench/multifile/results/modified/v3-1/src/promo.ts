import type { Promo } from "./types";

type OrderLevelPromo = Extract<Promo, { kind: "percent" | "fixed" | "category" }>;
type BogoPromo = Extract<Promo, { kind: "bogo" }>;

export interface ResolvedPromos {
  orderLevel?: Exclude<OrderLevelPromo, { kind: "category" }>;
  categoryPromo?: Extract<Promo, { kind: "category" }>;
  bogos: BogoPromo[];
  appliedPromoCodes: string[];
}

/** Matches promoCodes case-insensitively against promos[].code (dupes count once). Ignores unknown codes. Throws "promo conflict" on >1 order-level (percent/fixed/category) promo. Returns applied codes in input order without duplicates. */
export function resolvePromos(promos: Promo[], promoCodes: string[] | undefined): ResolvedPromos {
  const seen = new Set<string>();
  const selected: Promo[] = [];
  const appliedCodes: string[] = [];

  for (const code of promoCodes ?? []) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const promo = promos.find((p) => p.code.toLowerCase() === key);
    if (promo) {
      selected.push(promo);
      appliedCodes.push(promo.code);
    }
  }

  const percentFixed = selected.filter((p): p is Extract<Promo, { kind: "percent" | "fixed" }> => p.kind === "percent" || p.kind === "fixed");
  const categoryPromos = selected.filter((p): p is Extract<Promo, { kind: "category" }> => p.kind === "category");

  if (percentFixed.length > 0 && categoryPromos.length > 0) throw new Error("promo conflict");
  if (percentFixed.length > 1) throw new Error("promo conflict");

  const bogos = selected.filter((p): p is BogoPromo => p.kind === "bogo");

  return {
    orderLevel: percentFixed[0],
    categoryPromo: categoryPromos[0],
    bogos,
    appliedPromoCodes: appliedCodes,
  };
}
