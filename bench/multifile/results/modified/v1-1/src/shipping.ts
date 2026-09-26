import type { Line } from "./cart.js";

const FREE_SHIPPING_THRESHOLD_CENTS = 4000;
const BASE_SHIPPING_CENTS = 499;
const PER_KG_CENTS = 100;

function physicalLines(lines: Line[]): Line[] {
  return lines.filter((l) => l.category !== "digital"); // physical = food + general
}

export function physicalNetCents(lines: Line[], bogoBySku: Map<string, number>): number {
  const physical = physicalLines(lines);
  const physicalLineCents = physical.reduce((sum, l) => sum + l.lineCents, 0);
  const physicalBogo = physical.reduce((sum, l) => sum + (bogoBySku.get(l.sku) ?? 0), 0);
  return physicalLineCents - physicalBogo;
}

export function computeShipping(lines: Line[], bogoBySku: Map<string, number>): number {
  const physical = physicalLines(lines);
  if (physical.length === 0) return 0;

  const net = physicalNetCents(lines, bogoBySku);
  if (net >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;

  const kg = physical.reduce((sum, l) => sum + l.weightGrams * l.qty, 0) / 1000;
  return BASE_SHIPPING_CENTS + PER_KG_CENTS * Math.max(0, Math.ceil(kg) - 1);
}

export function amountToFreeShipping(lines: Line[], bogoBySku: Map<string, number>): number {
  const physical = physicalLines(lines);
  if (physical.length === 0) return 0;

  const net = physicalNetCents(lines, bogoBySku);
  if (net >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;

  return FREE_SHIPPING_THRESHOLD_CENTS - net;
}
