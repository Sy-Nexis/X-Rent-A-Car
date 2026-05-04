import Link from "next/link";
import FleetManager from "@/components/Vehicles/FleetManager";
import { VehicleErrorState, VehicleEmptyState } from "@/components/Vehicles/VehicleStatusStates";
import { ChevronRight, LayoutGrid, ShieldCheck, MapPin, Plus } from "lucide-react";

export const metadata = {
  title: 'Fleet Management | xrent CAR',
  description: 'Manage and monitor your entire vehicle fleet in real-time.',
};

async function getVehicles() {
  try {
    const response = await fetch('http://localhost:5000/api/vehicles/view', {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null; // Triggers VehicleErrorState
    }

    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return null; // Triggers VehicleErrorState
  }
}

export default async function VehiclesPage() {
  const vehicleData = await getVehicles();

  // 1. ERROR STATE (Offline or API Failure)
  if (vehicleData === null) {
    return <VehicleErrorState />;
  }

  // 2. EMPTY STATE (No units in database)
  if (vehicleData.length === 0) {
    return <VehicleEmptyState />;
  }

  // 3. SUCCESS STATE
  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-[1400px] mx-auto">

        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs font-bold text-[#6e6e73] uppercase tracking-widest mb-8">
          <span>Admin</span>
          <ChevronRight size={12} />
          <span>Vehicles</span>
          <ChevronRight size={12} />
          <span className="text-[#1d1d1f] dark:text-white">Fleet Inventory</span>
        </nav>

        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3 text-blue-500 font-bold text-xs uppercase tracking-widest">
              <LayoutGrid size={16} />
              <span>System Management</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white mb-3">
              Fleet Inventory
            </h1>
            <p className="text-[#6e6e73] font-medium leading-relaxed max-w-xl text-sm md:text-base">
              Real-time synchronization with the xrent fleet database. Monitor registration, specs, and status across all branches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/Admin/Vehicle/Data"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95 group"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              Add Unit to Fleet
            </Link>

            <div className="flex items-center gap-4 bg-white/50 dark:bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-gray-200/50 dark:border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Database Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-bold text-green-500">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE FLEET MANAGER */}
        <FleetManager initialData={vehicleData} />

        {/* FOOTER SYSTEM INFO */}
        <div className="mt-16 pt-8 border-t border-gray-200/50 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-[10px] font-bold text-[#6e6e73] uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-blue-500" />
              <span>Verified Cloud Registry</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500" />
              <span>Active Branch Sync</span>
            </div>
          </div>
          <p className="text-[10px] text-[#86868b] font-medium tracking-widest">
            xrent ENTERPRISE ASSET MANAGEMENT · V3.1
          </p>
        </div>

      </div>
    </div>
  );
}
