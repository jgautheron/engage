// Public API of the checkout engine. See spec.md for the full rule set.

export type {
  Category,
  Product,
  CartLine,
  Promo,
  Region,
  CheckoutOptions,
  ReceiptLine,
  Receipt,
} from "./types";

export { checkout, amountToFreeShippingCents } from "./checkout";
