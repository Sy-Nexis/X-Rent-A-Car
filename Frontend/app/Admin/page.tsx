import React from "react";
import DashboardStatCard from "@/components/Dashboard/DashboardStatCard";
import QuickNavCard from "@/components/Dashboard/QuickNavCard";
import RecentDataList from "@/components/Dashboard/RecentDataList";
import { 
  Activity, 
  Users, 
  Car, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

// --- DATA FETCHING ---

async function getSummaryData() {
  try {
    const [clientsRes, vehiclesRes] = await Promise.all([
      fetch("http://localhost:5000/api/clients/view", { cache: "no-store" }),
      fetch("http://localhost:5000/api/vehicles/view", { cache: "no-store" })
    ]);

    const clients = await clientsRes.json();
    const vehicles = await vehiclesRes.json();

    return {
      clients: clients.data || [],
      vehicles: vehicles.data || [],
      timestamp: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  } catch (error) {
    console.error("Dashboard Data Fetch Error:", error);
    return { clients: [], vehicles: [], timestamp: "" };
  }
}

// --- MAIN SERVER COMPONENT ---

export default async function AdminDashboardPage() {
  const { clients, vehicles, timestamp } = await getSummaryData();

  // Statistics Calculation
  const totalClients = clients.length;
  const activeClients = clients.filter((c: any) => c.status === 'Active').length;
  const totalFleet = vehicles.length;
  const availableFleet = vehicles.filter((v: any) => v.status === 'Active' || v.status === 'Available').length;
  const pendingVerifications = clients.filter((c: any) => c.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white p-8 md:p-12 lg:p-16">
      <div className="max-w-[1600px] mx-auto space-y-16">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.5em]">
              <LayoutDashboard size={18} />
              XNRENT FLEET CONTROL
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-none">
              Overview<span className="text-[#6e6e73]">.</span>
            </h1>
            <p className="text-[#86868b] text-xl font-medium tracking-tight">
               {timestamp || "Fleet Management System Status"}
            </p>
          </div>

          <div className="flex items-center gap-6 px-8 py-4 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
             <div className="text-right">
                <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">System Status</p>
                <div className="text-sm font-bold text-green-500 uppercase flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   All Systems Nominal
                </div>
             </div>
          </div>
        </header>

        {/* 1. TOP ROW: KEY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <DashboardStatCard 
            index={0}
            icon={<Activity size={24} />} 
            label="Total Active Clients" 
            value={activeClients.toString()} 
            trend="+12%" 
            trendType="up"
          />
          <DashboardStatCard 
            index={1}
            icon={<Car size={24} />} 
            label="Available Fleet" 
            value={availableFleet.toString()} 
            trend="+3 units" 
            trendType="up"
          />
          <DashboardStatCard 
            index={2}
            icon={<Users size={24} />} 
            label="Total Registry" 
            value={totalClients.toString()} 
            trend="+8.4%" 
            trendType="up"
          />
          <DashboardStatCard 
            index={3}
            icon={<ShieldCheck size={24} />} 
            label="Pending Verification" 
            value={pendingVerifications.toString()} 
            trend="-2" 
            trendType="down"
          />
        </div>

        {/* 2. MIDDLE ROW: QUICK NAVIGATION HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <QuickNavCard 
              index={0}
              title="Fleet Operations"
              subtitle="Manage vehicle specifications, maintenance logs, and asset availability."
              icon={<Car />}
              href="/Admin/Vehicle"
              color="blue"
           />
           <QuickNavCard 
              index={1}
              title="Client Registry"
              subtitle="Monitor customer identities, security clearances, and rental histories."
              icon={<Users />}
              href="/Admin/Client"
              color="purple"
           />
        </div>

        {/* 3. BOTTOM ROW: RECENT DATA STREAM */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           <RecentDataList 
              title="Recent Client Onboarding"
              items={clients.slice(0, 5).map((c: any) => ({
                id: c.id,
                title: `${c.first_name} ${c.last_name}`,
                subtitle: c.email,
                status: c.status,
                meta: c.government_id
              }))}
              viewAllHref="/Admin/Client"
              viewAllLabel="View All Clients"
              delay={0.4}
           />
           <RecentDataList 
              title="Fleet Status Stream"
              items={vehicles.slice(0, 5).map((v: any) => ({
                id: v.id,
                title: `${v.make} ${v.model}`,
                subtitle: v.license_plate || v.licensePlate,
                status: v.status,
                meta: `ID: ${v.id}`,
                icon: <Car size={16} />
              }))}
              viewAllHref="/Admin/Vehicle"
              viewAllLabel="View Full Fleet"
              delay={0.5}
           />
        </div>

      </div>

      {/* AMBIENT BACKGROUND DECORATION */}
      <div className="fixed top-0 right-0 w-[1200px] h-[1200px] bg-blue-600/5 blur-[160px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[1000px] h-[1000px] bg-purple-600/5 blur-[160px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}
