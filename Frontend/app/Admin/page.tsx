import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminHubClient from "@/components/Admin/AdminHubClient";

// --- SERVER-SIDE DATA FETCHING ---

async function getAdminHubData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("xrent_token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const [vehiclesRes, clientsRes] = await Promise.all([
      fetch("http://localhost:5000/api/vehicles/view", {
        cache: "no-store",
        headers: { "Authorization": `Bearer ${token}` }
      }),
      fetch("http://localhost:5000/api/clients/view", {
        cache: "no-store",
        headers: { "Authorization": `Bearer ${token}` }
      })
    ]);

    // Handle session expiration (401 Unauthorized)
    if (vehiclesRes.status === 401 || clientsRes.status === 401) {
      redirect("/login");
    }

    const vehiclesResult = await vehiclesRes.json().catch(() => ({ data: [] }));
    const clientsResult = await clientsRes.json().catch(() => ({ data: [] }));

    return {
      vehicles: vehiclesResult.data || [],
      clients: clientsResult.data || []
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
