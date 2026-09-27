export interface Line { priceCents: number; qty: number }

export function invoiceTotal(lines: Line[], discountPercent: number): number {
  const subtotal = lines.reduce((s, l) => s + l.priceCents * l.qty, 0);
  const discount = (subtotal * discountPercent) / 100;
  return Math.floor(subtotal - discount);
}
