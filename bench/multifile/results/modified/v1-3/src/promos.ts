import type { Promo } from "./types";

type OrderLevelPromo = Extract<Promo, { kind: "percent" | "fixed" | "category" }>;
type BogoPromo = Extract<Promo, { kind: "bogo" }>;

export interface ResolvedPromos {
  orderLevel?: OrderLevelPromo;
  bogos: BogoPromo[];
  appliedCodes: string[];
}

export function resolvePromos(promos: Promo[], promoCodes: string[] = []): ResolvedPromos {
  const seen = new Set<string>();
  const applied: Promo[] = [];
  const appliedCodes: string[] = [];

  for (const code of promoCodes) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const match = promos.find((p) => p.code.toLowerCase() === key);
    if (!match) continue; // Lenient: ignore unknown codes instead of throwing
    applied.push(match);
    appliedCodes.push(match.code); // Use canonical code from promos array
  }

  const orderLevel = applied.filter((p): p is OrderLevelPromo => p.kind !== "bogo");
  const bogos = applied.filter((p): p is BogoPromo => p.kind === "bogo");
  if (orderLevel.length > 1) throw new Error("promo conflict");

  return { orderLevel: orderLevel[0], bogos, appliedCodes };
}
