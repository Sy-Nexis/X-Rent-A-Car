import React, { useState, useEffect } from "react";

function AnimatedNumber({
  value,
  duration = 2000,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let animationFrameId: number;
    let startTime: number | null = null;

    const updateCount = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = easeOutQuad(progress) * value;

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return <>{formattedCount}{suffix}</>;
}

function AnimatedBar({
  targetPercent,
  colorClass,
  duration = 2000,
}: {
  targetPercent: number;
  colorClass: string;
  duration?: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(0);
    let animationFrameId: number;
    let startTime: number | null = null;

    const update = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuad = (t: number) => t * (2 - t);
      setWidth(easeOutQuad(progress) * targetPercent);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setWidth(targetPercent);
      }
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPercent, duration]);

  return (
    <div className={`h-full ${colorClass}`} style={{ width: `${width}%` }} />
  );
}

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
      badgeColor: "bg-emerald-500/10 text-emerald-450 border-emerald-500/20",
      dotColor: "bg-brand-green",
    },
    {
      id: 1,
      name: "Volvo VNL 860",
      vin: "ID: FC-441-S",
      plate: "CA-12-LMN",
      spec: "Sleeper / Diesel-V6",
      rate: "$210.50",
      status: "MAINTENANCE",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      dotColor: "bg-brand-red",
    },
    {
      id: 2,
      name: "Kenworth T680",
      vin: "ID: FC-209-X",
      plate: "WA-88-RTB",
      spec: "Logistics / Hy-Brid",
      rate: "$230.00",
      status: "INPREP",
      badgeColor: "bg-white/5 text-gray-400 border-white/10",
      dotColor: "bg-gray-500",
    },
    {
      id: 3,
      name: "Peterbilt 579",
      vin: "ID: FC-112-P",
      plate: "FL-45-QWE",
      spec: "Long Haul / Clean-Diesel",
      rate: "$275.00",
      status: "ACTIVE",
      badgeColor: "bg-emerald-500/10 text-emerald-450 border-emerald-500/20",
      dotColor: "bg-brand-green",
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
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar flex flex-col gap-6 bg-[#0e0e11]">
      
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Fleet",    value: 1284, sub: "+12%",        linePercent: 100, lineColor: "bg-brand-gradient" },
          { label: "Active Numbers", value: 1102, sub: "86% UTILIZED", linePercent: 86,  lineColor: "bg-brand-cyan" },
          { label: "Maintenances",   value: 42,   sub: "-3%",          linePercent: 12,  lineColor: "bg-brand-red" },
          { label: "In_Prep",        value: 140,  sub: "QUEUED",       linePercent: 24,  lineColor: "bg-brand-cyan" },
        ].map((card) => (
          <div key={card.label} className="bg-[#1e1e1e] rounded-xl border border-white/5 p-4 flex flex-col justify-between shadow-md h-28 relative overflow-hidden">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-black text-gray-500 tracking-wider mb-1">
                {card.label}
              </span>
              <span className="text-2xl font-black text-white leading-none">
                <AnimatedNumber value={card.value} />
              </span>
            </div>
            <div className="flex justify-between items-baseline mt-2">
              <span className={`text-[10px] font-bold ${card.sub.startsWith("+") || card.sub.includes("UTILIZED") ? "text-brand-green" : card.sub.startsWith("-") ? "text-brand-red" : "text-gray-500"}`}>
                {card.sub}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
              <AnimatedBar targetPercent={card.linePercent} colorClass={card.lineColor} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Panel */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 shadow-md flex flex-col overflow-visible">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/5 gap-4">
          <h2 className="text-base font-black text-white tracking-tight">
            Fleet Registry
          </h2>

          {/* Filtering Tabs */}
          <div className="flex bg-[#0e0e11] p-0.5 rounded-lg border border-white/5">
            {(["All", "Active", "Maintenance", "InPrep"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setShowDropdownRow(null);
                }}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === tab ? "bg-[#1e1e1e] text-white shadow-xs" : "text-gray-400 hover:text-white"
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
              <tr className="border-b border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5">
                <th className="px-6 py-4">Vehicle Identity</th>
                <th className="px-6 py-4">License Plate</th>
                <th className="px-6 py-4">Spec</th>
                <th className="px-6 py-4">Daily Rate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 overflow-visible">
              {filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-white/5 transition-colors text-xs font-semibold text-gray-300 relative overflow-visible">
                  {/* Vehicle Identity */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400">
                        🚚
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-white">{v.name}</span>
                        <span className="text-[10px] text-gray-500 font-bold">{v.vin}</span>
                      </div>
                    </div>
                  </td>

                  {/* License Plate */}
                  <td className="px-6 py-4 text-white font-bold uppercase tracking-wider">{v.plate}</td>

                  {/* Spec */}
                  <td className="px-6 py-4 text-gray-400">{v.spec}</td>

                  {/* Daily Rate */}
                  <td className="px-6 py-4 text-white font-bold">{v.rate}</td>

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
                      className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      •••
                    </button>

                    {/* Action dropdown card overlay */}
                    {showDropdownRow === v.id && (
                      <div className="absolute right-6 top-12 bg-[#1e1e1e] rounded-xl border border-white/5 shadow-lg p-2.5 z-30 w-44 text-left flex flex-col gap-1.5 animate-fadeIn">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-all w-full text-left cursor-pointer">
                          <span>👁</span> View Details
                        </button>
                        <button
                          onClick={onAddVehicle}
                          className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-all w-full text-left cursor-pointer"
                        >
                          <span>⚙</span> Edit Specifications
                        </button>
                        <hr className="border-white/5 my-0.5" />
                        <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-red hover:bg-rose-950/20 rounded-md transition-all w-full text-left cursor-pointer">
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
        <div className="md:hidden divide-y divide-white/5">
          {filteredVehicles.map((v) => (
            <div key={v.id} className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 flex-shrink-0 text-lg">
                🚚
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-white truncate">{v.name}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border flex-shrink-0 ${v.badgeColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${v.dotColor}`} />
                    {v.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500 font-bold">{v.vin}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{v.plate}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-gray-400">{v.spec}</span>
                  <span className="text-xs font-black text-white">{v.rate}<span className="text-[9px] font-bold text-gray-500">/day</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-white/5 text-xs font-bold text-gray-500">
          <span>Showing 4 of 1,284 units</span>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-white/5 bg-[#0e0e11] hover:bg-white/5 text-white rounded-lg transition-all shadow-xs cursor-pointer">
              Previous
            </button>
            <button className="px-4 py-2 border border-white/5 bg-[#0e0e11] hover:bg-white/5 text-white rounded-lg transition-all shadow-xs cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Operational Insights vs Sync Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-2">
        {/* Left Operational Insights card (span 2) */}
        <div className="lg:col-span-2 bg-[#1e1e1e] text-white rounded-2xl border border-white/5 p-6 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          <div className="relative z-10 flex flex-col justify-between h-full gap-6">
            <div>
              <h3 className="text-brand-cyan text-[10px] uppercase font-black tracking-wider mb-2">
                Operational Insights
              </h3>
              <p className="text-sm font-semibold text-gray-300 leading-relaxed max-w-xl">
                Your fleet efficiency has increased by 4.2% this quarter. Real-time telemetry suggests optimizing routes for the Kenworth series in the West region.
              </p>
            </div>
            
            <button className="flex items-center gap-2 bg-brand-gradient hover:opacity-90 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-md self-start transition-all cursor-pointer">
              View AI Analysis
            </button>
          </div>
        </div>

        {/* Right Sync Status card (span 1) */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 flex flex-col justify-between shadow-md">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-green mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white text-xs font-black uppercase tracking-wider mb-1">
              Fleet Sync 2.4
            </h3>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
              All hardware modules report status OK. Next global diagnostic scheduled in 4 days.
            </p>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-brand-gradient h-full w-[70%]" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
