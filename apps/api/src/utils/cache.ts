import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const cache = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimitInstance = new Ratelimit({
  redis: cache,
  limiter: Ratelimit.slidingWindow(10, "30s"),
});

/**
 *
 * @param key your-key-to-rate-limit
 * @returns false: has exceeded the limit, true: has not exceeded the limit
 */
export async function ratelimit(key: string) {
  const rl = await ratelimitInstance.limit(key);

  return !rl.success;
}

export async function setCacheKey<T>(key: string, value: T) {
  await cache.set(key, JSON.stringify(value));
}

export async function getCacheKey<T>(key: string) {
  const value = (await cache.get(key)) as unknown as string;

  return value as T;
}

export async function deleteCacheKey(key: string) {
  await cache.del(key);
}
