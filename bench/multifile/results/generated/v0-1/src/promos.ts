// Rules 2 & 3: promo code resolution and bogo discount calculation.

import type { Promo, ReceiptLine } from "./types";

export type OrderLevelPromo = Extract<Promo, { kind: "percent" | "fixed" }>;
export type BogoPromo = Extract<Promo, { kind: "bogo" }>;

function isOrderLevelPromo(promo: Promo): promo is OrderLevelPromo {
  return promo.kind === "percent" || promo.kind === "fixed";
}

function isBogoPromo(promo: Promo): promo is BogoPromo {
  return promo.kind === "bogo";
}

export interface ActivePromos {
  orderPromo: OrderLevelPromo | undefined;
  bogoPromos: BogoPromo[];
}

/**
 * Resolves `promoCodes` against the available `promos` catalog.
 * - Matching is case-insensitive.
 * - The same code given twice (any case) counts once.
 * - At most one order-level promo (percent/fixed) may be active; two throws
 *   "promo conflict". Any number of bogo promos may apply.
 */
export function resolveActivePromos(promos: Promo[], promoCodes: string[] | undefined): ActivePromos {
  const active: Promo[] = [];
  const seen = new Set<string>();

  for (const rawCode of promoCodes ?? []) {
    const key = rawCode.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const match = promos.find((p) => p.code.toLowerCase() === key);
    if (!match) {
      throw new Error("unknown promo");
    }
    active.push(match);
  }

  const orderPromos = active.filter(isOrderLevelPromo);
  if (orderPromos.length > 1) {
    throw new Error("promo conflict");
  }

  return { orderPromo: orderPromos[0], bogoPromos: active.filter(isBogoPromo) };
}

export interface BogoDiscounts {
  totalCents: number;
  bySku: Map<string, number>;
}

/**
 * A bogo promo makes floor(qty / 2) units of its sku free (discount = that
 * many units x unit price). If the sku isn't in the cart, it applies and
 * contributes 0. Multiple bogo promos are summed independently, including
 * more than one targeting the same sku.
 */
export function computeBogoDiscounts(bogoPromos: BogoPromo[], lines: ReceiptLine[]): BogoDiscounts {
  const bySku = new Map<string, number>();
  let totalCents = 0;

  for (const promo of bogoPromos) {
    const line = lines.find((l) => l.sku === promo.sku);
    if (!line) continue;

    const freeUnits = Math.floor(line.qty / 2);
    const discount = freeUnits * line.unitCents;
    bySku.set(promo.sku, (bySku.get(promo.sku) ?? 0) + discount);
    totalCents += discount;
  }

  return { totalCents, bySku };
}
