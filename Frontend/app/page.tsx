import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MainDashboardClient from "@/components/Dashboard/MainDashboardClient";

// --- SERVER-SIDE DATA FETCHING ---

async function getFleetData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("xrent_token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await fetch("http://localhost:8801/api/vehicles/view", {
      cache: "no-store",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.status === 401) {
      redirect("/login");
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

  return (
    <main>
      <MainDashboardClient vehicles={vehicles} />
    </main>
  );
}
