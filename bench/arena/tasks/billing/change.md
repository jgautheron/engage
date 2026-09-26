# Change request — implement all of it

A. **Seats.** `Subscription` gains an optional field
   `seats?: { count: number; unitMonthlyCents: number; changes?: { date: string; count: number }[] }`.
   A month fully covered by one seat count costs `count × unitMonthlyCents`. Seat-count changes,
   and seats on a subscription that starts mid-month, are prorated with **exactly the same
   proration rules the engine already uses for plan changes** — same day counting, same rounding,
   same handling of decreases as for downgrades. Seat charges appear as their own invoice lines.

B. `previewChange` keeps its meaning for plan changes (seats stay as they are).

C. Everything else is unchanged: invoices for subscriptions without seats must come out exactly as
   they do today.
