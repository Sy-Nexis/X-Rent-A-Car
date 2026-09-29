import { cookies } from "next/headers";
import FleetListView from "@/components/Vehicles/FleetListView";

async function getVehiclesData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || cookieStore.get("xrent_token")?.value;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch("http://localhost:8801/api/vehicles/view", {
      cache: "no-store",
      headers,
    });
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    return [];
  }
}

export default async function VehiclesPage() {
  const vehicles = await getVehiclesData();

  return <FleetListView vehicles={vehicles} />;
}
