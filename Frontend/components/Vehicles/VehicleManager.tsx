"use client";

import React, { useState, useTransition } from "react";
import { Plus, Search, Filter } from "lucide-react";
import VehicleTable from "./VehicleTable";
import AddVehicleModal from "./AddVehicleModal";

interface VehicleManagerProps {
  initialData: any[];
}

export default function VehicleManager({ initialData }: VehicleManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isPending, startTransition] = useTransition();

  // Filter logic (Client-side for instant response)
  const filteredVehicles = initialData.filter((v) => {
    const matchesSearch = 
      v.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.license_plate?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === "All" || v.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-1 items-center gap-4 max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e6e73] group-focus-within:text-[#0071e3] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by make, model, or plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200/50 dark:border-white/5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0071e3] transition-all text-sm shadow-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e6e73]" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-11 pr-8 py-3 bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200/50 dark:border-white/5 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm appearance-none cursor-pointer shadow-sm"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Idle">Idle</option>
              <option value="Repair">In Repair</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 shrink-0"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Main Data Table */}
      <div className={isPending ? "opacity-50 grayscale transition-opacity duration-500" : ""}>
        <VehicleTable data={filteredVehicles} />
      </div>

      {/* Add Modal Component */}
      <AddVehicleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
