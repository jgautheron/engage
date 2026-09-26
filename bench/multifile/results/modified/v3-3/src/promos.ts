import type { CheckoutOptions, Promo } from "./types";

export interface ResolvedPromos {
  orderLevel?: Extract<Promo, { kind: "percent" | "fixed" }>;
  categoryPromo?: Extract<Promo, { kind: "category" }>;
  bogos: Extract<Promo, { kind: "bogo" }>[];
  appliedPromoCodes: string[];
}

/**
 * Matches promoCodes (case-insensitive, deduped) against options.promos.
 * Ignores unknown codes. Throws "promo conflict" on multiple order-level (percent/fixed/category) matches.
 */
export function resolvePromos(options: CheckoutOptions): ResolvedPromos {
  const codes = options.promoCodes ?? [];
  const byCode = new Map(options.promos.map((p) => [p.code.toLowerCase(), p]));
  const seen = new Set<string>();
  const matched: Promo[] = [];
  const appliedPromoCodes: string[] = [];

  for (const code of codes) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const promo = byCode.get(key);
    if (!promo) continue; // ignore unknown codes
    matched.push(promo);
    appliedPromoCodes.push(promo.code);
  }

  const orderLevelPromos = matched.filter(
    (p): p is Extract<Promo, { kind: "percent" | "fixed" }> => p.kind === "percent" || p.kind === "fixed",
  );
  const categoryPromos = matched.filter(
    (p): p is Extract<Promo, { kind: "category" }> => p.kind === "category",
  );

  if (orderLevelPromos.length > 1) throw new Error("promo conflict");
  if (orderLevelPromos.length > 0 && categoryPromos.length > 0) throw new Error("promo conflict");
  if (categoryPromos.length > 1) throw new Error("promo conflict");

  const bogos = matched.filter((p): p is Extract<Promo, { kind: "bogo" }> => p.kind === "bogo");

  return {
    orderLevel: orderLevelPromos[0],
    categoryPromo: categoryPromos[0],
    bogos,
    appliedPromoCodes
  };
}
