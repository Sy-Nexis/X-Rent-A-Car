import MainDashboardClient from "@/components/Dashboard/MainDashboardClient";

// --- SERVER-SIDE DATA FETCHING ---

async function getFleetData() {
  try {
    const response = await fetch("http://localhost:5000/api/vehicles/view", { cache: "no-store" });
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
