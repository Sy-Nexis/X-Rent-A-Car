import React from "react";
import MainDashboardClient from "@/components/Dashboard/MainDashboardClient";

// --- SERVER-SIDE DATA FETCHING ---

async function getDashboardData() {
  try {
    // Concurrent fetching for optimal speed
    const [vehiclesRes, clientsRes] = await Promise.all([
      fetch("http://localhost:5000/api/vehicles/view", { cache: "no-store" }),
      fetch("http://localhost:5000/api/clients/view", { cache: "no-store" })
    ]);

    if (!vehiclesRes.ok || !clientsRes.ok) {
      console.warn("One or more API endpoints failed. Rendering with partial data.");
    }

    const vehiclesResult = await vehiclesRes.json().catch(() => ({ data: [] }));
    const clientsResult = await clientsRes.json().catch(() => ({ data: [] }));

    const vehicles = vehiclesResult.data || [];
    const clients = clientsResult.data || [];

    // Calculate Summary Statistics
    const stats = {
      totalFleet: vehicles.length,
      availableFleet: vehicles.filter((v: any) => v.status === 'Active' || v.status === 'Available').length,
      totalClients: clients.length,
      activeClients: clients.filter((c: any) => c.status === 'Active').length,
    };

    return {
      stats,
      recentVehicles: vehicles.slice(0, 5),
      recentClients: clients.slice(0, 5)
    };
  } catch (error) {
    console.error("Critical Dashboard Fetch Error:", error);
    // Return safe fallback values to prevent UI crash
    return {
      stats: { totalFleet: 0, availableFleet: 0, totalClients: 0, activeClients: 0 },
      recentVehicles: [],
      recentClients: []
    };
  }
}

// --- MAIN SERVER PAGE ---

export default async function RootDashboardPage() {
  const { stats, recentVehicles, recentClients } = await getDashboardData();

  return (
    <main className="min-h-screen bg-[#1c1c1e] selection:bg-blue-500/30">
      {/* 
          Because the root dashboard is a high-level overview, 
          we render the MainDashboardClient which handles 
          the staggered Framer Motion animations and interactive states.
      */}
      <MainDashboardClient 
        stats={stats} 
        recentVehicles={recentVehicles} 
        recentClients={recentClients} 
      />
    </main>
  );
}
