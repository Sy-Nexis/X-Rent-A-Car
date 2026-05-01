import React from "react";
import ClientDashboardClient from "@/components/Clients/ClientDashboardClient";
import { ShieldCheck, Plus, Users, Activity } from "lucide-react";
import Link from "next/link";

// --- SERVER-SIDE DATA FETCHING ---
async function getClients() {
  try {
    const response = await fetch("http://localhost:5000/api/clients/view", {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return []; 
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Client Fetch Exception:", error);
    return [];
  }
}

// --- MAIN SERVER COMPONENT ---
export default async function ClientPage() {
  const clients = await getClients();

  return (
    <main className="min-h-screen bg-[#1c1c1e] text-white p-8 md:p-12 lg:p-16 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto space-y-12 relative z-10">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <ShieldCheck size={16} />
              XNRENT ADMINISTRATIVE CONSOLE
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-tight">
              Client <span className="text-[#6e6e73]">Registry</span>
            </h1>
            <p className="text-[#86868b] text-lg font-medium max-w-xl">
              Centralized hub for monitoring fleet members, security credentials, and global rental status.
            </p>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex gap-4">
                <StatSimple label="Total Registry" value={clients.length} />
                <StatSimple label="Active Passports" value={clients.filter((c: any) => c.status === 'Active').length} />
             </div>
             <Link 
                href="/Admin/Client/Data"
                className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
              >
                <Plus size={18} />
                Add New Client
              </Link>
          </div>
        </header>

        {/* CLIENT-SIDE INTERACTIVE DASHBOARD */}
        <ClientDashboardClient initialClients={clients} />

      </div>

      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="fixed top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/5 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-blue-900/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </main>
  );
}

function StatSimple({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
       <p className="text-[9px] font-black text-[#6e6e73] uppercase tracking-widest">{label}</p>
       <p className="text-xl font-black text-white">{value}</p>
    </div>
  );
}
