import { cookies } from "next/headers";
import MainDashboardClient from "@/components/Dashboard/MainDashboardClient";
import LandingView from "@/components/Landing/LandingView";

// --- SERVER-SIDE DATA FETCHING ---

async function getFleetData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("xrent_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch("http://localhost:8801/api/vehicles/view", {
      cache: "no-store",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.status === 401) {
      return null;
    }

    const result = await response.json().catch(() => ({ data: [] }));
    return result.data || [];
  } catch (error) {
    console.error("Fleet Data Fetch Error:", error);
    return [];
  }
}

export default async function RootPage() {
  const vehicles = await getFleetData();

  if (vehicles === null) {
    return <LandingView />;
  }

  return (
    <main>
      <MainDashboardClient vehicles={vehicles} />
    </main>
  );
}

