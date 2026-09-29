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

// ==========================================
// 4. ACTIVITY / AUDIT LOGS API
// ==========================================
export async function fetchLogs(forceFresh = false): Promise<any[]> {
  const cacheKey = "logs:all";
  const cached = memoryCache.get(cacheKey);
  if (!forceFresh && cached && Date.now() - cached.timestamp < 10000) {
    return cached.data;
  }

  try {
    const res = await fetch(`${API_BASE}/api/logs`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch activity logs");
    const json = await res.json();
    const data = json.data || [];
    memoryCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    if (cached) return cached.data;
    return [];
  }
}

export async function recordLog(payload: {
  action: string;
  details: string;
  entityType?: string;
  entityId?: string | number;
  userName?: string;
  userRole?: string;
}): Promise<any> {
  let userName = payload.userName;
  let userRole = payload.userRole;

  if (typeof window !== "undefined" && (!userName || !userRole)) {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.name) userName = parsed.name;
        if (parsed.role) userRole = parsed.role;
      } catch {}
    }
  }

  const res = await fetch(`${API_BASE}/api/logs/record`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_name: userName || "Alex Rivera",
      user_role: userRole || "Fleet Manager",
      action: payload.action,
      entity_type: payload.entityType || "General",
      entity_id: payload.entityId,
      details: payload.details,
    }),
  });

  invalidateClientDataCache("logs");
  return res.json();
}

export async function clearAllLogs(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/logs/clear`, {
    method: "DELETE",
  });
  invalidateClientDataCache("logs");
  return res.json();
}

export function invalidateClientDataCache(pattern?: "vehicles" | "clients" | "assignments" | "logs") {
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
