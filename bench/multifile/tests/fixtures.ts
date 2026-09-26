export const catalog = [
  { sku: "apple", name: "Apple", priceCents: 125, category: "food", weightGrams: 200 },
  { sku: "coffee", name: "Coffee", priceCents: 1299, category: "food", weightGrams: 500 },
  { sku: "mug", name: "Mug", priceCents: 1850, category: "general", weightGrams: 450 },
  { sku: "lamp", name: "Lamp", priceCents: 4999, category: "general", weightGrams: 2600 },
  { sku: "ebook", name: "Ebook", priceCents: 899, category: "digital", weightGrams: 0 },
  { sku: "song", name: "Song", priceCents: 129, category: "digital", weightGrams: 0 },
] as const;
export const region = { code: "US-TX", taxBasisPoints: { food: 0, general: 825, digital: 625 } };
export const region2 = { code: "EU-X", taxBasisPoints: { food: 550, general: 2000, digital: 2000 } };
export const promos = [
  { kind: "percent", code: "SAVE10", percent: 10 },
  { kind: "percent", code: "BIG15", percent: 15, minSubtotalCents: 6000 },
  { kind: "fixed", code: "FIVEOFF", amountCents: 500 },
  { kind: "fixed", code: "HUGE", amountCents: 100000 },
  { kind: "bogo", code: "APPLEBOGO", sku: "apple" },
  { kind: "bogo", code: "EBOGO", sku: "ebook" },
  { kind: "bogo", code: "MUGBOGO", sku: "mug" },
];
export const modPromos = [
  ...promos,
  { kind: "category", code: "FOOD20", category: "food", percent: 20 },
  { kind: "category", code: "DIGI50", category: "digital", percent: 50 },
  { kind: "category", code: "GEN33", category: "general", percent: 33 },
];
