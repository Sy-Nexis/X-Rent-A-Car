import React from "react";
import RootSummaryClient from "@/components/Dashboard/RootSummaryClient";

// --- SERVER-SIDE DATA FETCHING ---

async function getSummaryData() {
  try {
    const [vehiclesRes, clientsRes] = await Promise.all([
      fetch("http://localhost:5000/api/vehicles/view", { cache: "no-store" }),
      fetch("http://localhost:5000/api/clients/view", { cache: "no-store" })
    ]);

    const vehiclesResult = await vehiclesRes.json().catch(() => ({ data: [] }));
    const clientsResult = await clientsRes.json().catch(() => ({ data: [] }));

    const vehicles = vehiclesResult.data || [];
    const clients = clientsResult.data || [];

    return {
      stats: {
        totalFleet: vehicles.length,
        availableFleet: vehicles.filter((v: any) => v.status === 'Active' || v.status === 'Available').length,
        totalClients: clients.length,
      }
    };
  } catch (error) {
    console.error("Summary Dashboard Fetch Error:", error);
    return {
      stats: { totalFleet: 0, availableFleet: 0, totalClients: 0 }
    };
  }
}

// --- MAIN SERVER PAGE ---

export default async function RootPage() {
  const { stats } = await getSummaryData();

  return (
    <main>
      <RootSummaryClient stats={stats} />
    </main>
  );
}
