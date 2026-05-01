import React from "react";
import ClientListActionable from "@/components/Clients/ClientListActionable";
import { Users, ShieldCheck, Activity, UserPlus, AlertCircle, RefreshCcw, Database } from "lucide-react";
import Link from "next/link";

// --- SERVER-SIDE DATA FETCHING ---
async function getClients() {
  try {
    const response = await fetch("http://localhost:5000/api/clients/view", {
      cache: "no-store", 
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      // Return null to trigger the "Connection Error" UI instead of crashing
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Client Fetch Exception:", error);
    return null; // Return null for connection failures
  }
}

// --- MAIN SERVER COMPONENT ---
export default async function ClientDetailsPage() {
  const clients = await getClients();

  // 1. ERROR STATE UI (Database Offline or Route Missing)
  if (clients === null) {
    return <ErrorStateUI />;
  }

  // 2. EMPTY STATE UI (Table exists but no records)
  if (clients.length === 0) {
    return <EmptyRegistryUI />;
  }

  // 3. SUCCESS STATE UI (Main Dashboard)
  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white p-8 md:p-12 lg:p-16">
      <div className="max-w-[1600px] mx-auto space-y-12">
        
        {/* PAGE HEADER & STATS */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <ShieldCheck size={16} />
              XNRENT SECURE ASSETS
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
            <StatCard icon={<Activity size={20} />} label="Active Rentals" value="12" color="green" />
            <StatCard icon={<UserPlus size={20} />} label="New This Month" value="8" color="orange" />
          </div>
        </header>

        {/* INTERACTIVE CLIENT LIST */}
        <ClientListActionable initialClients={clients} />

      </div>

      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ErrorStateUI() {
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[32px] flex items-center justify-center text-red-500 mx-auto shadow-2xl shadow-red-500/10">
          <AlertCircle size={48} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white">Registry Offline</h2>
          <p className="text-[#6e6e73] font-medium leading-relaxed">
            The XNRENT Fleet API is unreachable or the client database table has not been initialized. Please verify backend connectivity.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-3">
            <RefreshCcw size={16} />
            Retry Connection
          </button>
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-[10px] font-mono text-[#424245] uppercase">
            ERR_CONNECTION_REFUSED: http://localhost:5000/api/clients/view
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyRegistryUI() {
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="relative">
          <div className="w-32 h-32 bg-blue-600/10 border border-blue-600/20 rounded-[40px] flex items-center justify-center text-blue-500 mx-auto animate-pulse">
            <Database size={56} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#1c1c1e] rounded-full flex items-center justify-center">
            <UserPlus size={24} className="text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tight text-white">Empty Registry</h2>
          <p className="text-[#86868b] font-medium leading-relaxed">
            There are currently no clients registered in the XNRENT system. Start by onboarding your first customer.
          </p>
        </div>
        <Link href="/Admin/Client/Register" className="inline-flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-500 hover:-translate-y-1 transition-all">
          <UserPlus size={18} />
          Onboard First Client
        </Link>
      </div>
    </div>
  );
}

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
