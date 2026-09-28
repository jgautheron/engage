import { createServer } from "node:http";
import { allProducts, categoryById, userById } from "./db";

function priceWithTax(cents: number): number {
  let x = cents;
  for (let i = 0; i < 200_000; i++) x = (x * 1.0000001) % 1e9; // stand-in for an expensive pricing rule
  return Math.round(cents * 1.2);
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const user = await userById(req.headers["x-user"] as string ?? "anon");
  if (url.pathname === "/products") {
    const items = [];
    for (const p of await allProducts()) {
      const category = await categoryById(p.categoryId);
      items.push({ ...p, category: category?.name, price: priceWithTax(p.priceCents) });
    }
    res.end(JSON.stringify({ user: user.name, items }));
    return;
  }
  res.statusCode = 404;
  res.end();
}).listen(3000);
