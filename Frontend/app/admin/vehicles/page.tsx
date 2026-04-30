import React from 'react';
import { getVehicles } from '@/actions/vehicleActions';
import VehicleManager from '@/components/Vehicles/VehicleManager';

export const metadata = {
  title: 'Vehicle Fleet Management | XNRENT CAR',
  description: 'Manage your active fleet vehicles and registration.',
};

export default async function VehiclesPage() {
  // Fetch initial data on the server
  const response = await getVehicles();
  const initialVehicles = response.success ? response.data : [];

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Header Shell (Server Component) */}
      <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vehicle Fleet Management</h1>
            <p className="text-xs font-medium text-[#6e6e73] uppercase tracking-widest mt-1">
              Active Fleet Registry · Operations
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">System Online</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-10">
        {/* Pass server data to the client-side manager */}
        <VehicleManager initialData={initialVehicles || []} />
      </main>
    </div>
  );
}
