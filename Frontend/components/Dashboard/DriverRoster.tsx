"use client";

import React from "react";
import { drivers as mockDrivers } from "./mockData";

interface DriverRosterProps {
  data?: any[];
  onSelect?: (vehicle: any) => void;
  selectedId?: number | string;
}

export default function DriverRoster({ data, onSelect, selectedId }: DriverRosterProps) {
  const displayData = data || mockDrivers;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Available": 
        return "bg-blue-apple/10 text-blue-apple border-blue-apple/20";
      case "Idle":
      case "In Prep": 
        return "bg-orange-apple/10 text-orange-apple border-orange-apple/20";
      case "Alert":
      case "Maintenance": 
        return "bg-red-apple/10 text-red-apple border-red-apple/20";
      default: return "bg-bg-base text-text-secondary border-border-subtle";
    }
  };

  return (
    <div className="bg-bg-surface rounded-card border border-border-subtle p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-black text-text-primary uppercase tracking-tight">Fleet Roster</h2>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Operational Overview</p>
        </div>
        <div className="px-3 py-1 bg-bg-base text-[10px] font-black rounded-full text-text-secondary border border-border-subtle uppercase tracking-widest">
          {displayData.length} total units
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-text-secondary border-b border-border-subtle uppercase text-[9px] font-black tracking-widest">
            <tr>
              <th className="pb-4 px-2">Unit Identity</th>
              <th className="pb-4 px-2">Specifications</th>
              <th className="pb-4 px-2">Utilization</th>
              <th className="pb-4 px-2 text-right">Operational Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/30">
            {displayData.map((item, i) => (
              <tr 
                key={item.id || i} 
                onClick={() => onSelect?.(item)}
                className={`
                  group cursor-pointer transition-all duration-200
                  ${selectedId === item.id ? 'bg-blue-apple/5' : 'hover:bg-bg-base/50'}
                `}
              >
                <td className="py-4 px-2">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 transition-transform group-hover:scale-110
                      ${selectedId === item.id ? 'bg-blue-apple' : 'bg-gradient-to-tr from-[#2c2c2e] to-[#1c1c1e] border border-white/5'}
                    `}>
                      {(item.make?.[0] || item.name?.[0])}{(item.model?.[0] || item.name?.[1] || '')}
                    </div>
                    <div>
                      <span className="block font-black text-text-primary uppercase tracking-tight">{item.make} {item.model}</span>
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{item.license_plate || item.licensePlate || 'NO PLATE'}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex flex-col">
                    <span className="text-text-primary font-bold text-xs uppercase">{item.year || '2024'} Edition</span>
                    <span className="text-text-secondary text-[10px] font-medium uppercase tracking-tighter">{item.id ? `ID: ${item.id}` : item.location}</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-text-primary font-black tabular-nums">
                    {item.mileage || ((item.id || 0) % 100)} <span className="text-text-secondary text-[9px] font-bold uppercase tracking-tighter">Usage pts</span>
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${getStatusColor(item.status)}`}>
                    <div className={`w-1 h-1 rounded-full mr-2 ${item.status === 'Active' || item.status === 'Available' ? 'bg-blue-apple' : 'bg-current'}`} />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
