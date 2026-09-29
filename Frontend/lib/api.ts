// Frontend Fast Data Fetching & Memory Caching Utility

const API_BASE = "http://localhost:8801";

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheItem<any>>();
const CACHE_TTL_MS = 15000; // 15 seconds fast memory cache

export async function fetchVehicles(forceRefresh = false): Promise<any[]> {
  const cacheKey = "vehicles:all";
  const now = Date.now();
  const cached = memoryCache.get(cacheKey);

  if (!forceRefresh && cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const res = await fetch(`${API_BASE}/api/vehicles/view`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : [];
    memoryCache.set(cacheKey, { data: list, timestamp: now });
    return list;
  } catch (err) {
    if (cached) return cached.data; // fallback to stale cache on network failure
    throw err;
  }
}

export async function fetchClients(forceRefresh = false): Promise<any[]> {
  const cacheKey = "clients:all";
  const now = Date.now();
  const cached = memoryCache.get(cacheKey);

  if (!forceRefresh && cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const res = await fetch(`${API_BASE}/api/clients/view`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : [];
    memoryCache.set(cacheKey, { data: list, timestamp: now });
    return list;
  } catch (err) {
    if (cached) return cached.data; // fallback to stale cache on network failure
    throw err;
  }
}

export function invalidateClientDataCache(pattern?: "vehicles" | "clients") {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
}
