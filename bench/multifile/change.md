# Change request — implement all three, keep everything else as specified

A. **Free shipping.** The threshold becomes 4000 cents, and physicalNet is now measured as physical
   lineCents minus only the bogo discount on physical lines (order-level discounts no longer count
   against it). `amountToFreeShippingCents` must follow the same rule (4000 − that amount).

B. **New promo kind** `{ kind: "category"; code: string; category: Category; percent: number }`.
   Export it as part of `Promo`. It is order-level (it conflicts with percent/fixed exactly like they
   conflict with each other). Its discount = round(categoryBase × percent / 100), where categoryBase =
   that category's lineCents minus the bogo discount on that category. Unlike other order-level
   promos it CAN apply to digital. The cap (rule 5) still applies and still reduces the order-level
   part. For tax, its (capped) discount is attributed entirely to its own category.

C. **Lenient codes.** Unknown promo codes are ignored instead of throwing. `Receipt` gains
   `appliedPromoCodes: string[]` — the canonical `code` (as written in `promos`) of every applied
   promo, in the order the codes were given, without duplicates.
