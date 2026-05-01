import AdminHubClient from "@/components/Admin/AdminHubClient";

// --- SERVER-SIDE DATA FETCHING ---

async function getAdminHubData() {
  try {
    const [vehiclesRes, clientsRes] = await Promise.all([
      fetch("http://localhost:5000/api/vehicles/view", { cache: "no-store" }),
      fetch("http://localhost:5000/api/clients/view", { cache: "no-store" })
    ]);

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
