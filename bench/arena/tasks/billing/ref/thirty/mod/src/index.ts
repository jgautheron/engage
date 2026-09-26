export interface Plan { id: string; monthlyCents: number }
export interface Subscription { customerId: string; planId: string; startDate: string; seats?: { count: number; unitMonthlyCents: number; changes?: { date: string; count: number }[] } }
export interface PlanChange { date: string; newPlanId: string }
export interface InvoiceLine { description: string; amountCents: number }
export interface Invoice { customerId: string; month: string; lines: InvoiceLine[]; totalCents: number }

const daysIn = (m: string) => new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0)).getUTCDate();
type Seg = { from: number; to: number; cents: number; label: string }; // days [from, to] inclusive

// Price segments for a month from a start date and dated price changes (last same-day wins).
function segments(month: string, start: string, base: { cents: number; label: string }, dated: { date: string; cents: number; label: string }[]): Seg[] {
  const D = daysIn(month);
  if (start.slice(0, 7) > month) return [];
  let cur = base;
  const inMonth: Map<number, { cents: number; label: string }> = new Map();
  for (const c of dated) {
    if (c.date.slice(0, 7) < month) cur = c; // effective before this month (array order = chronological assumption for earlier months)
    else if (c.date.slice(0, 7) === month) inMonth.set(+c.date.slice(8), c);
  }
  // earlier-month changes: last by date wins
  const earlier = dated.filter((c) => c.date.slice(0, 7) < month).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  if (earlier.length) cur = earlier[earlier.length - 1];
  const first = start.slice(0, 7) === month ? +start.slice(8) : 1;
  const segs: Seg[] = [];
  let from = first;
  for (const day of [...inMonth.keys()].sort((a, b) => a - b)) {
    if (day <= first) { cur = inMonth.get(day)!; continue; }
    segs.push({ from, to: day - 1, cents: cur.cents, label: cur.label });
    cur = inMonth.get(day)!;
    from = day;
  }
  segs.push({ from, to: D, cents: cur.cents, label: cur.label });
  return segs;
}
function prorate(monthlyCents: number, from: number, to: number, D: number): number {
  const days = to === D ? 30 - Math.min(from, 31) + 1 : to - from + 1;
  return Math.floor((monthlyCents * Math.max(0, Math.min(30, days))) / 30);
}
function priceSegs(segs: Seg[], D: number) {
  let peak = -1;
  return segs.map((s) => {
    const cents = Math.max(s.cents, peak); // no credit on decrease within the month
    peak = cents;
    return { description: s.label, amountCents: prorate(cents, s.from, s.to, D) };
  });
}
function planFor(plans: Plan[], id: string): Plan {
  const p = plans.find((x) => x.id === id);
  if (!p) throw new Error("unknown plan");
  return p;
}
export function invoiceForMonth(plans: Plan[], sub: Subscription, changes: PlanChange[], month: string): Invoice {
  const D = daysIn(month);
  const base = planFor(plans, sub.planId);
  const relevant = changes.filter((c) => c.date.slice(0, 7) <= month);
  const dated = relevant.map((c) => { const p = planFor(plans, c.newPlanId); return { date: c.date, cents: p.monthlyCents, label: p.id }; });
  const lines = priceSegs(segments(month, sub.startDate, { cents: base.monthlyCents, label: base.id }, dated), D);
  if (sub.seats) { const st = sub.seats; lines.push(...priceSegs(segments(month, sub.startDate, { cents: st.count * st.unitMonthlyCents, label: "seats" }, (st.changes ?? []).filter((c) => c.date.slice(0, 7) <= month).map((c) => ({ date: c.date, cents: c.count * st.unitMonthlyCents, label: "seats" }))), D).map((l) => ({ ...l, description: "seats" }))); }
  return { customerId: sub.customerId, month, lines, totalCents: lines.reduce((s, l) => s + l.amountCents, 0) };
}
export function previewChange(plans: Plan[], sub: Subscription, changes: PlanChange[], change: PlanChange): number {
  const m = change.date.slice(0, 7);
  return invoiceForMonth(plans, sub, [...changes, change], m).totalCents - invoiceForMonth(plans, sub, changes, m).totalCents;
}
