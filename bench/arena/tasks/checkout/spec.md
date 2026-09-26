# Checkout engine

Implement a small checkout engine in TypeScript under `src/`. Split it into modules as you see fit
(the domain has cart validation, promotions, shipping, tax). `src/index.ts` must export exactly the
API below. Money is always integer cents. "round" always means round half up to a whole cent
(x.5 → x+1; every rounded value here is non-negative). No dependencies; Node/Bun built-ins only.

## Types (export these from src/index.ts)

```ts
type Category = "food" | "general" | "digital";
interface Product { sku: string; name: string; priceCents: number; category: Category; weightGrams: number }
interface CartLine { sku: string; qty: number }
type Promo =
  | { kind: "percent"; code: string; percent: number; minSubtotalCents?: number }
  | { kind: "fixed"; code: string; amountCents: number }
  | { kind: "bogo"; code: string; sku: string };
interface Region { code: string; taxBasisPoints: Record<Category, number> } // 825 = 8.25%
interface CheckoutOptions { region: Region; promos: Promo[]; promoCodes?: string[] }
interface ReceiptLine { sku: string; qty: number; unitCents: number; lineCents: number }
interface Receipt {
  lines: ReceiptLine[];
  subtotalCents: number; discountCents: number; shippingCents: number; taxCents: number; totalCents: number;
}
```

## Functions (export these from src/index.ts)

```ts
checkout(catalog: Product[], cart: CartLine[], options: CheckoutOptions): Receipt
amountToFreeShippingCents(catalog: Product[], cart: CartLine[], options: CheckoutOptions): number
```

## Rules

1. **Cart.** Lines with the same sku merge into one (quantities summed), keeping first-appearance order.
   An empty cart throws an Error whose message contains "empty cart". A sku missing from the catalog
   throws "unknown sku". After merging, each qty must be an integer from 1 to 99, else throw
   "invalid qty". Receipt lines: unitCents = product price, lineCents = unitCents × qty.
   subtotalCents = sum of lineCents.
2. **Promo codes.** Each entry of `promoCodes` is matched case-insensitively against `promos[].code`;
   no match → throw "unknown promo". The same code given twice (any case) counts once. At most one
   order-level promo (`percent` or `fixed`) may apply; two → throw "promo conflict". Any number of
   `bogo` promos may apply.
3. **BOGO.** A bogo promo makes floor(qty / 2) units of its sku free (discount = that many × unit
   price). If its sku is not in the cart, it applies and gives 0.
4. **Order-level discount.** Base = lineCents of non-digital lines minus the bogo discount on those
   lines. Order-level discounts never touch digital items.
   - percent: round(base × percent / 100), only if base ≥ minSubtotalCents (when given), else 0.
   - fixed: min(amountCents, base).
5. **Cap.** discountCents = bogo total + order-level discount, but never more than
   floor(subtotalCents / 2). If the cap bites, reduce the order-level part (bogo alone never exceeds it).
6. **Shipping.** Physical = food + general. No physical items in the cart → shipping 0. Otherwise
   physicalNet = physical lineCents − all discount attributed to physical lines (after the cap).
   physicalNet ≥ 5000 → shipping 0. Else 499 + 100 × max(0, ceil(kg) − 1), where kg = sum of
   weightGrams × qty over physical items, / 1000.
7. **Tax.** Per category: taxable = category lineCents − discount attributed to that category;
   category tax = round(taxable × basisPoints / 10000). Attribution: a bogo discount goes to its sku's
   category; the order-level discount (after the cap) is split between food and general by their share
   of the order-level base: food gets round(orderLevel × foodBase / base), general gets the rest
   (foodBase = food lineCents − food bogo; base as in rule 4). Shipping is taxed at the general rate:
   round(shippingCents × generalBasisPoints / 10000). taxCents = sum of all of these.
8. totalCents = subtotalCents − discountCents + shippingCents + taxCents.
9. **amountToFreeShippingCents** returns 0 if the cart has no physical items or shipping is already
   free; otherwise 5000 − physicalNet. It must always agree with `checkout` for the same inputs.
