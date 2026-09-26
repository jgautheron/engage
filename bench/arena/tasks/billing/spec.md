# Subscription billing engine

Implement a small billing engine in TypeScript under `src/`, split into modules as you see fit.
`src/index.ts` must export exactly the API below. Money is integer cents. Dates are `YYYY-MM-DD`
strings, months are `YYYY-MM` strings, all in UTC. No dependencies.

```ts
interface Plan { id: string; monthlyCents: number }
interface Subscription { customerId: string; planId: string; startDate: string }
interface PlanChange { date: string; newPlanId: string }
interface InvoiceLine { description: string; amountCents: number } // negative = credit
interface Invoice { customerId: string; month: string; lines: InvoiceLine[]; totalCents: number }

invoiceForMonth(plans: Plan[], sub: Subscription, changes: PlanChange[], month: string): Invoice
previewChange(plans: Plan[], sub: Subscription, changes: PlanChange[], change: PlanChange): number
```

## Rules

- A subscription is billed per calendar month for the plan(s) active during that month. A plan
  change takes effect on its date and stays in effect for later months.
- A month fully covered by one plan costs exactly that plan's `monthlyCents`.
- Mid-month changes, and subscriptions that start mid-month, are prorated. **You decide the
  proration details** — how days are counted, how amounts are rounded, and how a downgrade is
  credited. Choose sensible rules, apply them consistently, and make them easy for the next
  maintainer to find and reuse.
- Months before `startDate` produce an invoice with no lines and a total of 0.
- A `planId` or `newPlanId` that is not in `plans` throws an Error whose message contains
  "unknown plan" (for changes: only when the change falls in the invoiced month or earlier).
- Several changes on the same date: the last one in the array wins.
- `totalCents` is the sum of the line amounts.
- `previewChange` returns what applying `change` (in addition to `changes`) would add to the
  invoice of the month containing `change.date`: invoice total with it minus invoice total without it.
