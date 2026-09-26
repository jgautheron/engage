import type { Promo } from "./types.js";

export interface ResolvedPromos {
  promos: Promo[];
  appliedCodes: string[];
}

export function resolvePromos(promos: Promo[], promoCodes: string[] | undefined): ResolvedPromos {
  const seen = new Set<string>();
  const resolved: Promo[] = [];
  const appliedCodes: string[] = [];
  for (const code of promoCodes ?? []) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const match = promos.find((p) => p.code.toLowerCase() === key);
    if (!match) continue; // lenient: ignore unknown codes
    resolved.push(match);
    appliedCodes.push(match.code);
  }
  const orderLevelCount = resolved.filter((p) => p.kind !== "bogo").length;
  if (orderLevelCount > 1) throw new Error("promo conflict");
  return { promos: resolved, appliedCodes };
}
