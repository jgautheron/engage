import { expect, test } from "bun:test";
import { catalog, region, region2, promos, modPromos } from "./fixtures";
import { gen, mod } from "./cases";
import expected from "./expected.json";

const TARGET = process.env.TARGET!;
const KIND = process.env.KIND as "gen" | "mod";
const m = await import(`${TARGET}/src/index.ts`);
const cases = KIND === "gen" ? gen : mod;
const ps = KIND === "gen" ? promos : modPromos;

cases.forEach((c, i) => {
  test(`${KIND}: ${c.name}`, () => {
    const exp = expected[KIND][i] as { value?: unknown; error?: string };
    const o = { region: c.eu ? region2 : region, promos: structuredClone(ps), promoCodes: c.codes };
    const call = () => (c.free ? m.amountToFreeShippingCents(catalog, c.cart, o) : m.checkout(catalog, c.cart, o));
    if (exp.error) expect(call).toThrow(exp.error);
    else expect(call()).toEqual(exp.value);
  });
});
