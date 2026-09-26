export type Category = "food" | "general" | "digital";
export interface Product { sku: string; name: string; priceCents: number; category: Category; weightGrams: number }
export interface CartLine { sku: string; qty: number }
export type Promo =
  | { kind: "percent"; code: string; percent: number; minSubtotalCents?: number }
  | { kind: "fixed"; code: string; amountCents: number }
  | { kind: "bogo"; code: string; sku: string };
export interface Region { code: string; taxBasisPoints: Record<Category, number> }
export interface CheckoutOptions { region: Region; promos: Promo[]; promoCodes?: string[] }
export interface ReceiptLine { sku: string; qty: number; unitCents: number; lineCents: number }
export interface Receipt { lines: ReceiptLine[]; subtotalCents: number; discountCents: number; shippingCents: number; taxCents: number; totalCents: number }

const round = (x: number) => Math.floor(x + 0.5);
const FREE = 5000;

function compute(catalog: Product[], cart: CartLine[], o: CheckoutOptions) {
  if (cart.length === 0) throw new Error("empty cart");
  const bySku = new Map(catalog.map((p) => [p.sku, p]));
  const merged = new Map<string, number>();
  for (const l of cart) {
    if (!bySku.has(l.sku)) throw new Error("unknown sku");
    merged.set(l.sku, (merged.get(l.sku) ?? 0) + l.qty);
  }
  const lines: (ReceiptLine & { cat: Category; w: number })[] = [];
  for (const [sku, qty] of merged) {
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) throw new Error("invalid qty");
    const p = bySku.get(sku)!;
    lines.push({ sku, qty, unitCents: p.priceCents, lineCents: p.priceCents * qty, cat: p.category, w: p.weightGrams * qty });
  }
  const subtotal = lines.reduce((s, l) => s + l.lineCents, 0);

  const seen = new Set<string>();
  const applied: Promo[] = [];
  for (const c of o.promoCodes ?? []) {
    const k = c.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    const p = o.promos.find((x) => x.code.toLowerCase() === k);
    if (!p) throw new Error("unknown promo");
    applied.push(p);
  }
  const orderPromos = applied.filter((p) => p.kind !== "bogo");
  if (orderPromos.length > 1) throw new Error("promo conflict");

  const bogoByCat: Record<Category, number> = { food: 0, general: 0, digital: 0 };
  for (const p of applied) {
    if (p.kind !== "bogo") continue;
    const l = lines.find((x) => x.sku === p.sku);
    if (l) bogoByCat[l.cat] += Math.floor(l.qty / 2) * l.unitCents;
  }
  const bogo = bogoByCat.food + bogoByCat.general + bogoByCat.digital;
  const catSum = (c: Category) => lines.filter((l) => l.cat === c).reduce((s, l) => s + l.lineCents, 0);
  const foodBase = catSum("food") - bogoByCat.food;
  const base = foodBase + catSum("general") - bogoByCat.general;

  let order = 0;
  const op = orderPromos[0];
  if (op?.kind === "percent") order = base >= (op.minSubtotalCents ?? 0) ? round((base * op.percent) / 100) : 0;
  if (op?.kind === "fixed") order = Math.min(op.amountCents, base);
  order = Math.min(order, Math.floor(subtotal / 2) - bogo);
  const discount = bogo + order;

  const foodOrder = base === 0 ? 0 : round((order * foodBase) / base);
  const attr: Record<Category, number> = {
    food: bogoByCat.food + foodOrder,
    general: bogoByCat.general + (order - foodOrder),
    digital: bogoByCat.digital,
  };
  const physical = lines.filter((l) => l.cat !== "digital");
  const physicalNet = catSum("food") + catSum("general") - attr.food - attr.general;
  let shipping = 0;
  if (physical.length > 0 && physicalNet < FREE) {
    const kg = physical.reduce((s, l) => s + l.w, 0) / 1000;
    shipping = 499 + 100 * Math.max(0, Math.ceil(kg) - 1);
  }
  const bp = o.region.taxBasisPoints;
  const tax =
    (["food", "general", "digital"] as Category[]).reduce((s, c) => s + round(((catSum(c) - attr[c]) * bp[c]) / 10000), 0) +
    round((shipping * bp.general) / 10000);
  const receipt: Receipt = {
    lines: lines.map(({ sku, qty, unitCents, lineCents }) => ({ sku, qty, unitCents, lineCents })),
    subtotalCents: subtotal,
    discountCents: discount,
    shippingCents: shipping,
    taxCents: tax,
    totalCents: subtotal - discount + shipping + tax,
  };
  return { receipt, physical: physical.length > 0, physicalNet, shipping };
}

export function checkout(catalog: Product[], cart: CartLine[], o: CheckoutOptions): Receipt {
  return compute(catalog, cart, o).receipt;
}
export function amountToFreeShippingCents(catalog: Product[], cart: CartLine[], o: CheckoutOptions): number {
  const r = compute(catalog, cart, o);
  return !r.physical || r.shipping === 0 ? 0 : FREE - r.physicalNet;
}
