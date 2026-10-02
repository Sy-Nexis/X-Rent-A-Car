import { cookies } from "next/headers";
import AdminHubClient from "@/components/Admin/AdminHubClient";
import { getApiBaseUrl } from "@/lib/api";

async function getAdminHubData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || cookieStore.get("xrent_token")?.value;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const [vehiclesRes, clientsRes] = await Promise.all([
      fetch(`${getApiBaseUrl()}/api/vehicles/view`, {
        cache: "no-store",
        headers,
      }),
      fetch(`${getApiBaseUrl()}/api/clients/view`, {
        cache: "no-store",
        headers,
      }),
    ]);

    const vehiclesResult = await vehiclesRes.json().catch(() => ({ data: [] }));
    const clientsResult = await clientsRes.json().catch(() => ({ data: [] }));

    return {
      vehicles: vehiclesResult.data || [],
      clients: clientsResult.data || [],
    };
  } catch (error) {
    console.error("Admin Hub Fetch Error:", error);
    return { vehicles: [], clients: [] };
  }
}

export default async function AdminDashboardPage() {
  const { vehicles, clients } = await getAdminHubData();

  return (
    <div className="min-h-screen bg-[#1c1c1e]">
      <AdminHubClient vehicles={vehicles} clients={clients} />
    </div>
  );
}
