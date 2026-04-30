"use client";

import React, { useState } from "react";
import { Search, Filter, Edit3, Trash2, MoreVertical, ChevronDown } from "lucide-react";

const vehicles = [
  { id: "XNR-1042", make: "Toyota", model: "Prius", plate: "WP CAD-5521", status: "Active" },
  { id: "XNR-8831", make: "Honda", model: "Civic", plate: "WP KY-1120", status: "Maintenance" },
  { id: "XNR-5521", make: "Nissan", model: "Leaf", plate: "WP BC-9902", status: "Idle" },
  { id: "XNR-9902", make: "Tesla", model: "Model 3", plate: "WP AB-1234", status: "Active" },
  { id: "XNR-1120", make: "BMW", model: "520d", plate: "WP XY-8831", status: "Active" },
];

interface VehicleTableProps {
  initialData?: any[];
}

export default function VehicleTable({ initialData = vehicles }: VehicleTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const displayVehicles = initialData;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-apple/10 text-green-apple border-green-apple/20";
      case "Maintenance": return "bg-orange-apple/10 text-orange-apple border-orange-apple/20";
      case "Idle": return "bg-blue-apple/10 text-blue-apple border-blue-apple/20";
      default: return "bg-bg-base text-text-secondary border-border-subtle";
    }
  };

  return (
    <div className="bg-bg-surface rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
      {/* Table Header / Filters */}
      <div className="p-5 border-b border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-surface/50 backdrop-blur-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search vehicles, models, or license plates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-base rounded-lg text-sm font-medium text-text-primary border border-border-subtle hover:bg-gray-100 transition-colors">
            <Filter size={16} />
            <span>Status: All</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-text-secondary border-b border-border-subtle bg-bg-base/30">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Vehicle ID</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Make & Model</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">License Plate</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Current Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {displayVehicles.map((vehicle, i) => (
              <tr key={i} className="group hover:bg-bg-base/50 transition-colors">
                <td className="px-6 py-4 font-bold text-text-primary">{vehicle.id}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">{vehicle.make}</span>
                    <span className="text-xs text-text-secondary">{vehicle.model}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-text-secondary font-mono">{vehicle.plate}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusStyle(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg text-text-secondary hover:text-blue-apple hover:bg-blue-apple/5 transition-all">
                      <Edit3 size={16} />
                    </button>
                    <button className="p-1.5 rounded-lg text-text-secondary hover:text-red-apple hover:bg-red-apple/5 transition-all">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-1.5 rounded-lg text-text-secondary hover:bg-bg-base transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Mockup */}
      <div className="p-4 border-t border-border-subtle bg-bg-base/20 flex items-center justify-between">
        <span className="text-xs text-text-secondary">Showing 5 of 48 vehicles</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-bg-surface border border-border-subtle rounded text-xs font-medium text-text-secondary cursor-not-allowed">Previous</button>
          <button className="px-3 py-1 bg-bg-surface border border-border-subtle rounded text-xs font-medium text-text-primary hover:bg-gray-50 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
