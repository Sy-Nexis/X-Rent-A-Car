// Frontend Fast Data Fetching & Memory Caching Utility

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // In browser: relative URL when hosted together via Vercel rewrites, or env / localhost
    return process.env.NEXT_PUBLIC_BACKEND_API_URL 
      ? process.env.NEXT_PUBLIC_BACKEND_API_URL.replace(/\/api$/, "")
      : (process.env.NODE_ENV === "production" ? "" : "http://localhost:8801");
  }
  // Server-side: Vercel Service Binding (BACKEND_URL) or env var or localhost
  return process.env.BACKEND_URL || (process.env.NEXT_PUBLIC_BACKEND_API_URL ? process.env.NEXT_PUBLIC_BACKEND_API_URL.replace(/\/api$/, "") : "http://localhost:8801");
}

const API_BASE = ""; // Handled dynamically via getApiBaseUrl()

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
    const res = await fetch(`${getApiBaseUrl()}/api/vehicles/view`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return cached?.data || [];
    }
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : [];
    memoryCache.set(cacheKey, { data: list, timestamp: now });
    return list;
  } catch (err) {
    return cached?.data || [];
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
    const res = await fetch(`${getApiBaseUrl()}/api/clients/view`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return cached?.data || [];
    }
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : [];
    memoryCache.set(cacheKey, { data: list, timestamp: now });
    return list;
  } catch (err) {
    return cached?.data || [];
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
    const res = await fetch(`${getApiBaseUrl()}/api/assignments`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return cached?.data || [];
    }
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : [];
    memoryCache.set(cacheKey, { data: list, timestamp: now });
    return list;
  } catch (err) {
    return cached?.data || [];
  }
}


export function getLoggedInUser(): { name: string; role: string; email: string } {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const name = u.name || u.fullName || u.userName || u.user_name || u.email;
        const role = u.role || u.user_role || "Staff";
        const email = u.email || "";
        return {
          name: name || "Staff User",
          role: role || "Staff",
          email: email || "",
        };
      } catch {}
    }
  }
  return { name: "Staff User", role: "Staff", email: "" };
}

export function getAuthHeaders(extraHeaders?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };
  if (typeof window !== "undefined") {
    const user = getLoggedInUser();
    if (user.name) headers["x-user-name"] = user.name;
    if (user.role) headers["x-user-role"] = user.role;
    if (user.email) headers["x-user-email"] = user.email;

    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function assignVehiclesToClients(payload: {
  client_ids: (number | string)[];
  vehicle_ids: (number | string)[];
  start_date?: string;
  end_date?: string;
  daily_rate?: number;
  notes?: string;
  status?: string;
}): Promise<any> {
  const headers = getAuthHeaders();
  const res = await fetch(`${getApiBaseUrl()}/api/assignments/assign`, {
    method: "POST",
    headers,
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
  id: number | string;
  status?: string;
  end_date?: string;
  daily_rate?: number;
  notes?: string;
}): Promise<any> {
  const headers = getAuthHeaders();
  const res = await fetch(`${getApiBaseUrl()}/api/assignments/update`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update assignment");
  }
  invalidateClientDataCache();
  return res.json();
}

export async function deleteAssignment(id: number | string): Promise<any> {
  const headers = getAuthHeaders();
  delete headers["Content-Type"];
  const res = await fetch(`${getApiBaseUrl()}/api/assignments/del?id=${id}`, {
    method: "DELETE",
    headers,
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
    const res = await fetch(`${getApiBaseUrl()}/api/logs`, {
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
  const loggedIn = getLoggedInUser();
  const userName = payload.userName || loggedIn.name;
  const userRole = payload.userRole || loggedIn.role;

  const res = await fetch(`${getApiBaseUrl()}/api/logs/record`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      user_name: userName,
      user_role: userRole,
      user_email: loggedIn.email,
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
  const res = await fetch(`${getApiBaseUrl()}/api/logs/clear`, {
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
