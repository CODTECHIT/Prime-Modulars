const CACHE_PREFIX = "prime_modulars_cache_";
const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function setCache<T>(key: string, data: T, ttl = DEFAULT_TTL_MS): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable
  }
}

export function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const expired = Date.now() - entry.timestamp > entry.ttl;

    if (expired) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

export function clearCache(key?: string): void {
  try {
    if (key) {
      localStorage.removeItem(CACHE_PREFIX + key);
    } else {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(CACHE_PREFIX),
      );
      keys.forEach((k) => localStorage.removeItem(k));
    }
  } catch {
    // silently fail
  }
}

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = DEFAULT_TTL_MS,
): Promise<T> {
  const cached = getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  try {
    const data = await fetcher();
    setCache(key, data, ttl);
    return data;
  } catch (err) {
    const stale = getStale<T>(key);
    if (stale !== null) return stale;
    throw err;
  }
}

function getStale<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    return entry.data;
  } catch {
    return null;
  }
}
