import { catalog, region, region2, promos, modPromos } from "./fixtures";
import { gen, mod } from "./cases";
const run = async (dir: string, cases: typeof gen, ps: unknown[]) => {
  const m = await import(dir);
  return cases.map((c) => {
    const o = { region: c.eu ? region2 : region, promos: ps, promoCodes: c.codes };
    try {
      const v = c.free ? m.amountToFreeShippingCents(catalog, c.cart, o) : m.checkout(catalog, c.cart, o);
      return { name: c.name, value: v };
    } catch (e) {
      return { name: c.name, error: (e as Error).message };
    }
  });
};
const out = {
  gen: await run("../ref/orig/src/index.ts", gen, promos),
  mod: await run("../ref/mod/src/index.ts", mod, modPromos),
};
await Bun.write("expected.json", JSON.stringify(out, null, 1));
console.log(out.gen.length, out.mod.length);
