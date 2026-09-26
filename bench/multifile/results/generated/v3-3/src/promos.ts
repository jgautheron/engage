import type { CheckoutOptions, Promo } from "./types";

export interface ResolvedPromos {
  orderLevel?: Extract<Promo, { kind: "percent" | "fixed" }>;
  bogos: Extract<Promo, { kind: "bogo" }>[];
}

/**
 * Matches promoCodes (case-insensitive, deduped) against options.promos.
 * Throws "unknown promo" on no match, "promo conflict" on two order-level (percent/fixed) matches.
 */
export function resolvePromos(options: CheckoutOptions): ResolvedPromos {
  const codes = options.promoCodes ?? [];
  const byCode = new Map(options.promos.map((p) => [p.code.toLowerCase(), p]));
  const seen = new Set<string>();
  const matched: Promo[] = [];

  for (const code of codes) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const promo = byCode.get(key);
    if (!promo) throw new Error("unknown promo");
    matched.push(promo);
  }

  const orderLevel = matched.filter(
    (p): p is Extract<Promo, { kind: "percent" | "fixed" }> => p.kind === "percent" || p.kind === "fixed",
  );
  if (orderLevel.length > 1) throw new Error("promo conflict");

  const bogos = matched.filter((p): p is Extract<Promo, { kind: "bogo" }> => p.kind === "bogo");

  return { orderLevel: orderLevel[0], bogos };
}
