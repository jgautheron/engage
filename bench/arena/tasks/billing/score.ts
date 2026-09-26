// bun score.ts <genDir> [modDir] → JSON { spec, preserve?, seats? } as [pass, total]
const [genDir, modDir] = process.argv.slice(2);
const G = await import(`${genDir}/src/index.ts`);
const M = modDir ? await import(`${modDir}/src/index.ts`) : null;

const plans = [
  { id: "free", monthlyCents: 0 }, { id: "basic", monthlyCents: 1000 }, { id: "pro", monthlyCents: 3100 },
  { id: "team", monthlyCents: 9900 }, { id: "x1", monthlyCents: 700 }, { id: "x3", monthlyCents: 2100 },
];
const sub = (planId = "basic", startDate = "2026-01-01", extra = {}) => ({ customerId: "c1", planId, startDate, ...extra });
const total = (m: any, s: any, ch: any[], month: string) => m.invoiceForMonth(plans, s, ch, month).totalCents;
const throwsUnknown = (f: () => unknown) => { try { f(); return false; } catch (e) { return /unknown plan/.test(String((e as Error).message)); } };
const tally = (checks: [string, () => boolean][]) => {
  const failed: string[] = [];
  for (const [name, f] of checks) { let ok = false; try { ok = f(); } catch { ok = false; } if (!ok) failed.push(name); }
  return { pass: checks.length - failed.length, total: checks.length, failed };
};

// Scenarios without seats — used for spec checks and for preservation.
const scenarios: [any, any[], string][] = [
  [sub(), [], "2026-03"],
  [sub(), [{ date: "2026-03-15", newPlanId: "pro" }], "2026-03"],
  [sub("pro"), [{ date: "2026-03-10", newPlanId: "basic" }], "2026-03"],
  [sub("basic", "2026-03-20"), [], "2026-03"],
  [sub("basic", "2026-02-11"), [], "2026-02"],
  [sub(), [{ date: "2026-04-30", newPlanId: "team" }], "2026-04"],
  [sub(), [{ date: "2026-03-01", newPlanId: "team" }], "2026-03"],
  [sub(), [{ date: "2026-03-05", newPlanId: "pro" }, { date: "2026-03-25", newPlanId: "basic" }], "2026-03"],
  [sub("team"), [{ date: "2026-02-14", newPlanId: "free" }], "2026-02"],
  [sub(), [{ date: "2026-03-15", newPlanId: "pro" }], "2026-04"],
  [sub("basic", "2026-03-31"), [], "2026-03"],
  [sub(), [{ date: "2026-12-31", newPlanId: "pro" }], "2026-12"],
];

const spec = (m: any) => tally([
  ["full month = monthly", () => total(m, sub(), [], "2026-03") === 1000 && total(m, sub(), [], "2026-04") === 1000],
  ["before start = empty", () => { const i = m.invoiceForMonth(plans, sub("basic", "2026-05-10"), [], "2026-03"); return i.totalCents === 0 && i.lines.length === 0; }],
  ["unknown sub plan throws", () => throwsUnknown(() => m.invoiceForMonth(plans, sub("nope"), [], "2026-03"))],
  ["unknown change plan throws", () => throwsUnknown(() => m.invoiceForMonth(plans, sub(), [{ date: "2026-03-09", newPlanId: "nope" }], "2026-03"))],
  ["later change ignored", () => total(m, sub(), [{ date: "2026-04-09", newPlanId: "pro" }], "2026-03") === 1000],
  ["change persists next month", () => total(m, sub(), [{ date: "2026-03-15", newPlanId: "pro" }], "2026-04") === 3100],
  ["same-day last wins", () => total(m, sub(), [{ date: "2026-03-15", newPlanId: "pro" }, { date: "2026-03-15", newPlanId: "team" }], "2026-03") === total(m, sub(), [{ date: "2026-03-15", newPlanId: "team" }], "2026-03")],
  ["upgrade between prices", () => { const t = total(m, sub(), [{ date: "2026-03-15", newPlanId: "pro" }], "2026-03"); return t > 1000 && t < 3100; }],
  ["downgrade within prices", () => { const t = total(m, sub("pro"), [{ date: "2026-03-15", newPlanId: "basic" }], "2026-03"); return t >= 1000 && t <= 3100; }],
  ["mid-month start prorated", () => { const t = total(m, sub("basic", "2026-03-20"), [], "2026-03"); return t > 0 && t < 1000; }],
  ["change on the 1st = full new price", () => total(m, sub(), [{ date: "2026-03-01", newPlanId: "pro" }], "2026-03") === 3100],
  ["total = sum of lines", () => scenarios.every(([s, ch, mo]) => { const i = m.invoiceForMonth(plans, s, ch, mo); return i.totalCents === i.lines.reduce((a: number, l: any) => a + l.amountCents, 0); })],
  ["previewChange agrees", () => [["2026-03-15", "pro"], ["2026-03-10", "free"], ["2026-03-01", "team"]].every(([d, p]) => {
    const c = { date: d, newPlanId: p };
    return m.previewChange(plans, sub(), [], c) === total(m, sub(), [c], "2026-03") - total(m, sub(), [], "2026-03");
  })],
]);

const out: Record<string, unknown> = { spec: spec(G) };
if (M) {
  out.specAfterChange = spec(M);
  out.preserve = tally(scenarios.map(([s, ch, mo], i) => [`scenario ${i}`, () => total(M, s, ch, mo) === total(G, s, ch, mo)]));
  const seats = (count: number, changes: { date: string; count: number }[] = [], start = "2026-01-01") => sub("free", start, { seats: { count, unitMonthlyCents: 700, changes } });
  out.seats = tally([
    ["full month = count × unit", () => total(M, seats(3), [], "2026-03") === 2100],
    ["zero seats cost 0", () => total(M, seats(0), [], "2026-03") === 0],
    ["increase prorated like upgrade", () => total(M, seats(1, [{ date: "2026-03-11", count: 3 }]), [], "2026-03") === total(G, sub("x1"), [{ date: "2026-03-11", newPlanId: "x3" }], "2026-03")],
    ["decrease prorated like downgrade", () => total(M, seats(3, [{ date: "2026-03-11", count: 1 }]), [], "2026-03") === total(G, sub("x3"), [{ date: "2026-03-11", newPlanId: "x1" }], "2026-03")],
    ["mid-month start like plan", () => total(M, seats(1, [], "2026-03-20"), [], "2026-03") === total(G, sub("x1", "2026-03-20"), [], "2026-03")],
    ["Feb increase like upgrade", () => total(M, seats(1, [{ date: "2026-02-20", count: 3 }]), [], "2026-02") === total(G, sub("x1"), [{ date: "2026-02-20", newPlanId: "x3" }], "2026-02")],
    ["seat change persists", () => total(M, seats(1, [{ date: "2026-03-11", count: 3 }]), [], "2026-04") === 2100],
    ["seat lines separate", () => M.invoiceForMonth(plans, sub("basic", "2026-01-01", { seats: { count: 2, unitMonthlyCents: 700 } }), [], "2026-03").lines.length >= 2],
    ["preview ignores seats", () => M.previewChange(plans, sub("basic", "2026-01-01", { seats: { count: 2, unitMonthlyCents: 700 } }), [], { date: "2026-03-15", newPlanId: "pro" }) === G.previewChange(plans, sub(), [], { date: "2026-03-15", newPlanId: "pro" })],
  ]);
}
console.log(JSON.stringify(out));
