export interface User { id: string; name: string }

let cached: User | null = null;
let expires = 0;

export async function getUser(fetchUser: () => Promise<User>, now = Date.now()): Promise<User> {
  if (cached && now < expires) return cached;
  cached = await fetchUser();
  expires = now + 60_000;
  return cached;
}
