import React from "react";
import VehicleInventoryManager from "@/components/Vehicles/Inventory/VehicleInventoryManager";
import { ChevronRight, LayoutGrid, Car, ShieldCheck, MapPin } from "lucide-react";

export const metadata = {
  title: 'Fleet Inventory | XNRENT CAR',
  description: 'Comprehensive overview of the XNRENT active vehicle fleet.',
};

// --- MOCK DATA ---
const MOCK_VEHICLES = [
  {
    id: "1",
    make: "Toyota",
    model: "Prius",
    year: 2023,
    vin: "TYT-PRI-770021-X",
    licensePlate: "WP-CAS-9981",
    dailyRate: 85.00,
    branch: "Colombo HQ",
    status: "Active",
    fuelType: "Hybrid",
    transmission: "Automatic"
  },
  {
    id: "2",
    make: "Mercedes-Benz",
    model: "E-Class",
    year: 2024,
    vin: "MBZ-E35-882190-Z",
    licensePlate: "WP-CBB-1120",
    dailyRate: 250.00,
    branch: "Colombo HQ",
    status: "Active",
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    id: "3",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    vin: "TSL-M3L-110293-E",
    licensePlate: "WP-DAA-5521",
    dailyRate: 180.00,
    branch: "Negombo Airport",
    status: "In Prep",
    fuelType: "Electric",
    transmission: "Automatic"
  },
  {
    id: "4",
    make: "Honda",
    model: "Civic",
    year: 2022,
    vin: "HND-CIV-665121-R",
    licensePlate: "WP-CAD-8802",
    dailyRate: 75.00,
    branch: "Kandy Branch",
    status: "Maintenance",
    fuelType: "Petrol",
    transmission: "Manual"
  },
  {
    id: "5",
    make: "Mitsubishi",
    model: "Montero Sport",
    year: 2024,
    vin: "MIT-MON-990112-S",
    licensePlate: "WP-CBD-2234",
    dailyRate: 195.00,
    branch: "Galle Coastal",
    status: "Active",
    fuelType: "Diesel",
    transmission: "Automatic"
  },
  {
    id: "6",
    make: "BMW",
    model: "X5 xDrive",
    year: 2024,
    vin: "BMW-X5D-441029-P",
    licensePlate: "WP-CBC-7731",
    dailyRate: 320.00,
    branch: "Colombo HQ",
    status: "Active",
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    id: "7",
    make: "Nissan",
    model: "Leaf",
    year: 2022,
    vin: "NSN-LEF-221098-N",
    licensePlate: "WP-CBE-4410",
    dailyRate: 90.00,
    branch: "Negombo Airport",
    status: "Active",
    fuelType: "Electric",
    transmission: "Automatic"
  },
  {
    id: "8",
    make: "Toyota",
    model: "Corolla",
    year: 2023,
    vin: "TYT-COR-119283-K",
    licensePlate: "WP-CAS-3342",
    dailyRate: 65.00,
    branch: "Kandy Branch",
    status: "In Prep",
    fuelType: "Petrol",
    transmission: "CVT"
  },
  {
    id: "9",
    make: "Range Rover",
    model: "Velar",
    year: 2024,
    vin: "RRV-VEL-550192-M",
    licensePlate: "WP-CBB-5520",
    dailyRate: 450.00,
    branch: "Colombo HQ",
    status: "Active",
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    id: "10",
    make: "Hyundai",
    model: "Ioniq 5",
    year: 2023,
    vin: "HYU-ION-662102-Q",
    licensePlate: "WP-DAA-1120",
    dailyRate: 160.00,
    branch: "Galle Coastal",
    status: "Maintenance",
    fuelType: "Electric",
    transmission: "Automatic"
  }
];

export default function FleetInventoryPage() {
  const stats = {
    total: MOCK_VEHICLES.length,
    active: MOCK_VEHICLES.filter(v => v.status === 'Active').length,
    locations: new Set(MOCK_VEHICLES.map(v => v.branch)).size
  };

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
            <h1 className="text-4xl font-black tracking-tight text-[#1d1d1f] dark:text-white mb-3">
              Fleet Inventory
            </h1>
            <p className="text-[#6e6e73] font-medium leading-relaxed max-w-xl text-sm md:text-base">
              Comprehensive overview of the XNRENT active vehicle fleet. Monitor registration status, specifications, and daily rates across all branches.
            </p>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-3 gap-6">
             <div className="flex flex-col items-center gap-1 p-4 bg-white dark:bg-[#2c2c2e] rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm min-w-[120px]">
                <span className="text-2xl font-black text-blue-500">{stats.total}</span>
                <span className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Total Fleet</span>
             </div>
             <div className="flex flex-col items-center gap-1 p-4 bg-white dark:bg-[#2c2c2e] rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm min-w-[120px]">
                <span className="text-2xl font-black text-green-500">{stats.active}</span>
                <span className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Active Now</span>
             </div>
             <div className="flex flex-col items-center gap-1 p-4 bg-white dark:bg-[#2c2c2e] rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm min-w-[120px]">
                <span className="text-2xl font-black text-purple-500">{stats.locations}</span>
                <span className="text-[10px] font-bold text-[#6e6e73] uppercase tracking-widest">Branches</span>
             </div>
          </div>
        </div>

        {/* INTERACTIVE INVENTORY MANAGER */}
        <VehicleInventoryManager initialVehicles={MOCK_VEHICLES} />

        {/* FOOTER SYSTEM INFO */}
        <div className="mt-16 pt-8 border-t border-gray-200/50 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-6 text-[10px] font-bold text-[#6e6e73] uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-500" />
                <span>Verified Records</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-500" />
                <span>Global Registry</span>
              </div>
           </div>
           <p className="text-[10px] text-[#86868b] font-medium tracking-widest">
             XNRENT ENTERPRISE ASSET MANAGEMENT · V3.0
           </p>
        </div>

      </div>
    </div>
  );
}
