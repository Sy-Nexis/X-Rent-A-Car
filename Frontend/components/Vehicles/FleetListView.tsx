import React, { useState } from "react";

interface FleetListViewProps {
  onAddVehicle: () => void;
}

export default function FleetListView({ onAddVehicle }: FleetListViewProps) {
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Maintenance" | "InPrep">("All");
  const [showDropdownRow, setShowDropdownRow] = useState<number | null>(2); // Default Kenworth row selected/dropdown open matching screenshot

  const vehiclesData = [
    {
      id: 0,
      name: "Freightliner Cascadia",
      vin: "ID: FC-992-K",
      plate: "TX-78-PXQ",
      spec: "Heavy Duty / EV-100",
      rate: "$245.00",
      status: "ACTIVE",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotColor: "bg-emerald-500",
    },
    {
      id: 1,
      name: "Volvo VNL 860",
      vin: "ID: FC-441-S",
      plate: "CA-12-LMN",
      spec: "Sleeper / Diesel-V6",
      rate: "$210.50",
      status: "MAINTENANCE",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      dotColor: "bg-rose-500",
    },
    {
      id: 2,
      name: "Kenworth T680",
      vin: "ID: FC-209-X",
      plate: "WA-88-RTB",
      spec: "Logistics / Hy-Brid",
      rate: "$230.00",
      status: "INPREP",
      badgeColor: "bg-slate-100 text-slate-700 border-gray-200",
      dotColor: "bg-slate-450",
    },
    {
      id: 3,
      name: "Peterbilt 579",
      vin: "ID: FC-112-P",
      plate: "FL-45-QWE",
      spec: "Long Haul / Clean-Diesel",
      rate: "$275.00",
      status: "ACTIVE",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotColor: "bg-emerald-500",
    },
  ];

  // Filtering based on tab selection
  const filteredVehicles = vehiclesData.filter((v) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return v.status === "ACTIVE";
    if (activeTab === "Maintenance") return v.status === "MAINTENANCE";
    if (activeTab === "InPrep") return v.status === "INPREP";
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar flex flex-col gap-6">
      
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Fleet", value: "1,284", sub: "+12%", line: "bg-slate-900 w-full" },
          { label: "Active Numbers", value: "1,102", sub: "86% UTILIZED", line: "bg-cyan-500 w-[86%]" },
          { label: "Maintenances", value: "42", sub: "-3%", line: "bg-rose-500 w-[12%]" },
          { label: "In_Prep", value: "140", sub: "QUEUED", line: "bg-blue-650 w-[24%]" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-150 p-4 flex flex-col justify-between shadow-2xs h-28 relative overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider mb-1">
                {card.label}
              </span>
              <span className="text-2xl font-black text-slate-800 leading-none">{card.value}</span>
            </div>
            <div className="flex justify-between items-baseline mt-2">
              <span className={`text-[10px] font-bold ${card.sub.startsWith("+") || card.sub.includes("UTILIZED") ? "text-emerald-500" : card.sub.startsWith("-") ? "text-rose-500" : "text-gray-400"}`}>
                {card.sub}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
              <div className={`h-full ${card.line}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm flex flex-col overflow-visible">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-100 gap-4">
          <h2 className="text-base font-black text-slate-850 tracking-tight">
            Fleet Registry
          </h2>

          {/* Filtering Tabs */}
          <div className="flex bg-[#f1f5f9] p-0.5 rounded-lg border border-gray-200/50">
            {(["All", "Active", "Maintenance", "InPrep"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setShowDropdownRow(null);
                }}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === tab ? "bg-white text-slate-850 shadow-2xs" : "text-gray-500 hover:text-slate-850"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop table — hidden on mobile */}
        <div className="hidden md:block overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[9px] font-black text-gray-450 uppercase tracking-widest bg-gray-50/50">
                <th className="px-6 py-4">Vehicle Identity</th>
                <th className="px-6 py-4">License Plate</th>
                <th className="px-6 py-4">Spec</th>
                <th className="px-6 py-4">Daily Rate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 overflow-visible">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors text-xs font-semibold text-slate-700 relative overflow-visible">
                  {/* Vehicle Identity */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-gray-150 flex items-center justify-center text-slate-500">
                        🚚
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-850">{v.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{v.vin}</span>
                      </div>
                    </div>
                  </td>

                  {/* License Plate */}
                  <td className="px-6 py-4 text-slate-900 font-bold uppercase tracking-wider">{v.plate}</td>

                  {/* Spec */}
                  <td className="px-6 py-4 text-gray-500">{v.spec}</td>

                  {/* Daily Rate */}
                  <td className="px-6 py-4 text-slate-900 font-bold">{v.rate}</td>

                  {/* Status badge */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${v.badgeColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${v.dotColor}`} />
                      {v.status}
                    </span>
                  </td>

                  {/* Dropdown Action Menu */}
                  <td className="px-6 py-4 text-right relative overflow-visible">
                    <button
                      onClick={() => setShowDropdownRow(showDropdownRow === v.id ? null : v.id)}
                      className="text-gray-400 hover:text-slate-800 p-1.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                      •••
                    </button>

                    {/* Action dropdown card overlay */}
                    {showDropdownRow === v.id && (
                      <div className="absolute right-6 top-12 bg-white rounded-xl border border-gray-150 shadow-lg p-2.5 z-30 w-44 text-left flex flex-col gap-1.5 animate-fadeIn">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-700 hover:bg-slate-50 rounded-md transition-all w-full text-left">
                          <span>👁</span> View Details
                        </button>
                        <button
                          onClick={onAddVehicle}
                          className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-700 hover:bg-slate-50 rounded-md transition-all w-full text-left"
                        >
                          <span>⚙</span> Edit Specifications
                        </button>
                        <hr className="border-gray-100 my-0.5" />
                        <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-rose-600 hover:bg-rose-50 rounded-md transition-all w-full text-left">
                          <span>🗑</span> Delete Vehicle
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list — shown only on small screens */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredVehicles.map((v) => (
            <div key={v.id} className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-gray-150 flex items-center justify-center text-slate-500 flex-shrink-0 text-lg">
                🚚
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-slate-850 truncate">{v.name}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border flex-shrink-0 ${v.badgeColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${v.dotColor}`} />
                    {v.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-400 font-bold">{v.vin}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">{v.plate}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-gray-500">{v.spec}</span>
                  <span className="text-xs font-black text-slate-800">{v.rate}<span className="text-[9px] font-bold text-gray-400">/day</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 text-xs font-bold text-gray-400">
          <span>Showing 4 of 1,284 units</span>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-all shadow-2xs">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-all shadow-2xs">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Operational Insights vs Sync Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-2">
        {/* Left Operational Insights card (span 2) */}
        <div className="lg:col-span-2 bg-[#111827] text-white rounded-2xl border border-white/5 p-6 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          <div className="relative z-10 flex flex-col justify-between h-full gap-6">
            <div>
              <h3 className="text-cyan-400 text-[10px] uppercase font-black tracking-wider mb-2">
                Operational Insights
              </h3>
              <p className="text-sm font-semibold text-gray-200 leading-relaxed max-w-xl">
                Your fleet efficiency has increased by 4.2% this quarter. Real-time telemetry suggests optimizing routes for the Kenworth series in the West region.
              </p>
            </div>
            
            <button className="flex items-center gap-2 bg-[#06b6d4] hover:bg-cyan-400 active:scale-95 text-[#0b1220] text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm self-start transition-all cursor-pointer">
              View AI Analysis
            </button>
          </div>
        </div>

        {/* Right Sync Status card (span 1) */}
        <div className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-650 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-slate-850 text-xs font-black uppercase tracking-wider mb-1">
              Fleet Sync 2.4
            </h3>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
              All hardware modules report status OK. Next global diagnostic scheduled in 4 days.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-teal-500 h-full w-[70%]" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
