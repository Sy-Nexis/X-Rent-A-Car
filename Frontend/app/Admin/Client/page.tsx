import React from "react";
import ClientListActionable from "@/components/Clients/ClientListActionable";
import { ErrorStateUI, EmptyRegistryUI } from "@/components/Clients/RegistryStatusStates";
import { ShieldCheck, Users, Activity, UserPlus } from "lucide-react";

// --- SERVER-SIDE DATA FETCHING ---
async function getClients() {
  try {
    // Attempt to fetch the client registry
    const response = await fetch("http://localhost:8801/api/clients/view", {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null; // Triggers ErrorStateUI
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Client Fetch Exception:", error);
    return null; // Triggers ErrorStateUI
  }
}

// --- MAIN SERVER COMPONENT ---
export default async function ClientDetailsPage() {
  const clients = await getClients();

  // 1. ERROR STATE (Handled via Client Component for interactivity)
  if (clients === null) {
    return <ErrorStateUI />;
  }

  // 2. EMPTY STATE (Handled via Client Component for onboarding)
  if (clients.length === 0) {
    return <EmptyRegistryUI />;
  }

  // 3. SUCCESS STATE
  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white p-8 md:p-12 lg:p-16">
      <div className="max-w-[1600px] mx-auto space-y-12">

        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <ShieldCheck size={16} />
              xrent SECURE ASSETS
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-tight">
              Client <span className="text-[#6e6e73]">Registry</span>
            </h1>
            <p className="text-[#86868b] text-lg font-medium max-w-xl">
              Manage and monitor all registered customers, rental histories, and security clearances in one central fleet console.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <StatCard icon={<Users size={20} />} label="Total Clients" value={clients.length.toString()} color="blue" />
            <StatCard
              icon={<Activity size={20} />}
              label="Active Clients"
              value={clients.filter((c: any) => c.status === "Active").length.toString()}
              color="green"
            />
          </div>
        </header>

        {/* INTERACTIVE TABLE */}
        <ClientListActionable initialClients={clients} />

      </div>

      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}

// --- STAT CARD HELPER ---
function StatCard({ icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  };

  return (
    <div className={`px-8 py-6 rounded-3xl border ${colors[color]} backdrop-blur-xl flex flex-col gap-4 min-w-[220px]`}>
      <div className="flex items-center justify-between">
        <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
        <span className="text-3xl font-black tracking-tighter">{value}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
    </div>
  );
}
