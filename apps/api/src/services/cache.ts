import { Redis } from "@upstash/redis";

const cache = new Redis({
  url: process.env.REDIS_URL ?? "",
  token: process.env.REDIS_TOKEN ?? "",
});

export async function setCacheKey<T>(key: string, value: T) {
  await cache.set(key, value);
}

export async function getCacheKey<T>(key: string) {
  const value = await cache.get<T>(key);

  return value;
}
