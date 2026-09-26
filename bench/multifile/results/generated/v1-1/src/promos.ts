import type { Promo } from "./types.js";

export function resolvePromos(promos: Promo[], promoCodes: string[] | undefined): Promo[] {
  const seen = new Set<string>();
  const resolved: Promo[] = [];
  for (const code of promoCodes ?? []) {
    const key = code.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const match = promos.find((p) => p.code.toLowerCase() === key);
    if (!match) throw new Error(`unknown promo: ${code}`);
    resolved.push(match);
  }
  const orderLevelCount = resolved.filter((p) => p.kind !== "bogo").length;
  if (orderLevelCount > 1) throw new Error("promo conflict");
  return resolved;
}
