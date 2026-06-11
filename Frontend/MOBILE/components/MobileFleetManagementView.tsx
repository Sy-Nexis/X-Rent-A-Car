"use client";

import React, { useState } from "react";
import { Search, FolderSync, Radio, Wrench, Clock, FileText } from "lucide-react";

export default function MobileFleetManagementView() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const statCards = [
    {
      title: "Total Fleet",
      value: "124",
      subtext: "+12% from last month",
      icon: FolderSync,
      color: "text-slate-600",
      bg: "bg-[#f8fafc]",
    },
    {
      title: "Active Numbers",
      value: "98",
      subtext: "79% UTILIZATION RATE",
      progressBar: 79,
      icon: Radio,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
    },
    {
      title: "Maintenances",
      value: "14",
      subtext: "4 Critical Alerts",
      isWarning: true,
      icon: Wrench,
      color: "text-amber-600",
      bg: "bg-amber-50/50",
    },
    {
      title: "In-Prep",
      value: "12",
      subtext: "Awaiting technical check",
      icon: Clock,
      color: "text-slate-500",
      bg: "bg-slate-50",
    },
  ];

  const vehicles = [
    {
      id: "UNIT-48290-A",
      brand: "Mercedes-Benz",
      model: "Sprinter",
      plate: "FL-239-XK",
      specs: "2.0L Diesel • L3H2",
      status: "Active",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=120&h=80",
    },
    {
      id: "UNIT-55012-C",
      brand: "Ford",
      model: "Transit Custom",
      plate: "TX-984-LL",
      specs: "2.0L EcoBlue • Sport",
      status: "Active",
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=120&h=80",
    },
    {
      id: "UNIT-11092-B",
      brand: "Renault",
      model: "Kangoo Z.E.",
      plate: "EL-443-RR",
      specs: "Electric • 33kWh",
      status: "Maintenance",
      image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=120&h=80",
    },
    {
      id: "UNIT-99210-S",
      brand: "Volkswagen",
      model: "Crafter",
      plate: "VW-001-FF",
      specs: "2.0L TDI • High Roof",
      status: "In-Prep",
      image: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=120&h=80",
    },
  ];

  const filteredVehicles = vehicles.filter((v) => {
    if (activeFilter === "All") return true;
    return v.status.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-[#fcf9f9] p-4 space-y-4 pb-20">
      
      {/* Top stacked stats summary cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`bg-white rounded-xl p-3.5 border border-[#e2e8f0] shadow-sm flex flex-col justify-between h-28 relative overflow-hidden`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[18px] font-black text-[#0f172a] tracking-tight">
                  {card.value}
                </span>
                <div className={`w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-[#94a3b8] uppercase tracking-wider">
                  {card.title}
                </p>
                {card.progressBar ? (
                  <div className="space-y-1">
                    <div className="w-full bg-[#f1f5f9] h-1 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${card.progressBar}%` }} />
                    </div>
                    <p className="text-[7px] font-black text-blue-500 tracking-wider">
                      {card.subtext}
                    </p>
                  </div>
                ) : (
                  <p
                    className={`text-[7px] font-black tracking-wider uppercase ${
                      card.isWarning ? "text-amber-500" : "text-[#10b981]"
                    }`}
                  >
                    {card.subtext}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main vehicle directory table/list card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-[#f1f5f9]">
          <div className="relative w-full rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
            <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by vehicle ID, plate, or driver..."
              className="w-full pl-9 pr-4 py-2 text-[10px] text-[#0f172a] placeholder-[#94a3b8] bg-transparent outline-none font-bold"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="px-3 py-2 border-b border-[#f1f5f9] flex gap-1.5 overflow-x-auto custom-scrollbar">
          {["All", "Active", "Maintenance", "In-Prep"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`text-[9px] font-extrabold px-3 py-1.5 rounded-full transition-all shrink-0 uppercase tracking-wider ${
                activeFilter === tab
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List Header */}
        <div className="bg-[#f8fafc] px-3 py-2 border-b border-[#f1f5f9] grid grid-cols-12 text-[8px] font-black text-[#64748b] tracking-wider uppercase">
          <div className="col-span-6">Vehicle Identity</div>
          <div className="col-span-3 text-center">License Plate</div>
          <div className="col-span-3 text-right">Specs</div>
        </div>

        {/* Vehicle list items */}
        <div className="divide-y divide-[#f1f5f9]">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="px-3 py-3 grid grid-cols-12 items-center gap-2 hover:bg-slate-50 transition-colors"
            >
              {/* Image & Identity */}
              <div className="col-span-6 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#e2e8f0] bg-slate-100 shrink-0">
                  <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black text-[#0f172a] truncate leading-tight">
                    {vehicle.brand} {vehicle.model}
                  </span>
                  <span className="text-[8px] font-extrabold text-[#94a3b8] tracking-wider uppercase mt-0.5">
                    {vehicle.id}
                  </span>
                </div>
              </div>

              {/* License Plate */}
              <div className="col-span-3 text-center flex flex-col justify-center items-center">
                <span className="text-[9px] font-extrabold text-[#334155] border border-[#cbd5e1] rounded px-1 py-0.5 font-mono bg-white tracking-tight uppercase leading-none">
                  {vehicle.plate}
                </span>
              </div>

              {/* Specs */}
              <div className="col-span-3 text-right flex flex-col min-w-0 justify-center">
                <span className="text-[8px] font-bold text-[#64748b] truncate leading-normal">
                  {vehicle.specs.split(" • ")[0]}
                </span>
                <span className="text-[7px] font-black text-[#94a3b8] uppercase tracking-wider truncate leading-none mt-0.5">
                  {vehicle.specs.split(" • ")[1] || ""}
                </span>
              </div>
            </div>
          ))}
          {filteredVehicles.length === 0 && (
            <div className="p-8 text-center text-[10px] font-bold text-[#94a3b8]">
              No units found in this category
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
