import React from "react";
import AdminFleetClient from "@/components/Dashboard/AdminFleetClient";

// --- SERVER-SIDE DATA FETCHING ---

async function getAdminData() {
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
      vehicles,
      clients
    };
  } catch (error) {
    console.error("Admin Dashboard Fetch Error:", error);
    return {
      vehicles: [],
      clients: []
    };
  }
}

// --- MAIN SERVER PAGE ---

export default async function AdminDashboardPage() {
  const { vehicles, clients } = await getAdminData();

  return (
    <div className="min-h-screen bg-[#1c1c1e]">
      <AdminFleetClient initialVehicles={vehicles} initialClients={clients} />
    </div>
  );
}
