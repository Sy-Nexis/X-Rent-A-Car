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

export async function fetchAssignments(forceRefresh = false): Promise<any[]> {
  const cacheKey = "assignments:all";
  const now = Date.now();
  const cached = memoryCache.get(cacheKey);

  if (!forceRefresh && cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const res = await fetch(`${API_BASE}/api/assignments`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : [];
    memoryCache.set(cacheKey, { data: list, timestamp: now });
    return list;
  } catch (err) {
    if (cached) return cached.data;
    throw err;
  }
}

export async function assignVehiclesToClients(payload: {
  client_ids: number[];
  vehicle_ids: number[];
  start_date?: string;
  end_date?: string;
  daily_rate?: number;
  notes?: string;
  status?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/api/assignments/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to assign vehicles to clients");
  }
  invalidateClientDataCache();
  return res.json();
}

export async function updateAssignment(payload: {
  id: number;
  status?: string;
  end_date?: string;
  daily_rate?: number;
  notes?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/api/assignments/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update assignment");
  }
  invalidateClientDataCache();
  return res.json();
}

export async function deleteAssignment(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/api/assignments/del?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete assignment");
  }
  invalidateClientDataCache();
  return res.json();
}

export function invalidateClientDataCache(pattern?: "vehicles" | "clients" | "assignments") {
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
