"use client";

import React, { useState } from "react";
import { Search, Filter, Edit3, Trash2, MoreVertical, ChevronDown, User } from "lucide-react";

const drivers = [
  { name: "Amal Kumar", id: "EMP-1042", phone: "+94 77 123 4567", vehicle: "XNR-1042", status: "On Duty" },
  { name: "Ravi Seneviratne", id: "EMP-8831", phone: "+94 71 987 6543", vehicle: "XNR-8831", status: "Off Shift" },
  { name: "Sunil Perera", id: "EMP-5521", phone: "+94 72 445 1234", vehicle: "None", status: "Off Shift" },
  { name: "Pradeep M.", id: "EMP-9902", phone: "+94 76 112 3344", vehicle: "XNR-9902", status: "Suspended" },
  { name: "Nuwan J.", id: "EMP-1120", phone: "+94 77 555 6677", vehicle: "XNR-1120", status: "On Duty" },
];

export default function DriverTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "On Duty": return "bg-green-apple/10 text-green-apple border-green-apple/20";
      case "Off Shift": return "bg-blue-apple/10 text-blue-apple border-blue-apple/20";
      case "Suspended": return "bg-red-apple/10 text-red-apple border-red-apple/20";
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
            placeholder="Search drivers, IDs or phone numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-base rounded-lg border border-transparent focus:border-blue-apple focus:ring-4 focus:ring-blue-apple/10 transition-all outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-base rounded-lg text-sm font-medium text-text-primary border border-border-subtle hover:bg-gray-100 transition-colors">
            <Filter size={16} />
            <span>Role: All</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-text-secondary border-b border-border-subtle bg-bg-base/30">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Driver Info</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Employee ID</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Contact</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Assigned Vehicle</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50">
            {drivers.map((driver, i) => (
              <tr key={i} className="group hover:bg-bg-base/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-apple/20 to-purple-apple/20 flex items-center justify-center text-blue-apple border border-blue-apple/10">
                      <User size={18} />
                    </div>
                    <span className="font-bold text-text-primary">{driver.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-text-secondary">{driver.id}</td>
                <td className="px-6 py-4 text-text-primary">{driver.phone}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold ${driver.vehicle === 'None' ? 'text-text-secondary' : 'text-blue-apple underline cursor-pointer'}`}>
                    {driver.vehicle}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusStyle(driver.status)}`}>
                    {driver.status}
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
    </div>
  );
}
