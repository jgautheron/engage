// Fake DB with realistic latency.
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export interface Product { id: number; name: string; priceCents: number; categoryId: number }
export interface Category { id: number; name: string }
const products: Product[] = Array.from({ length: 200 }, (_, i) => ({ id: i + 1, name: `P${i + 1}`, priceCents: 500 + i, categoryId: (i % 12) + 1 }));
const categories: Category[] = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `C${i + 1}` }));
export async function allProducts(): Promise<Product[]> { await sleep(40); return products; }
export async function categoryById(id: number): Promise<Category | undefined> { await sleep(15); return categories.find((c) => c.id === id); }
export async function userById(id: string) { await sleep(25); return { id, name: `user-${id}`, plan: "pro" }; }
