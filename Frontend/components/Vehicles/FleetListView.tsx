"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import VehicleDetailsModal from "../Modals/VehicleDetailsModal";
import { AlertCircle } from "lucide-react";

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

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  dailyRate: number;
  status: string;
  fuelType: string;
  transmission: string;
}

interface FleetListViewProps {
  vehicles?: Vehicle[];
}

const statusStyles: Record<string, { badge: string; dot: string }> = {
  active: { badge: "bg-emerald-500/10 text-emerald-450 border-emerald-500/20", dot: "bg-brand-green" },
  maintenance: { badge: "bg-rose-500/10 text-rose-400 border-rose-500/20", dot: "bg-brand-red" },
  "in prep": { badge: "bg-blue-500/10 text-blue-500 border-blue-500/20", dot: "bg-blue-500" },
  inprep: { badge: "bg-blue-500/10 text-blue-500 border-blue-500/20", dot: "bg-blue-500" },
};

const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 1,
    make: "Freightliner",
    model: "Cascadia",
    year: 2024,
    vin: "ID: FC-992-K",
    licensePlate: "TX-78-PXQ",
    dailyRate: 245.00,
    status: "ACTIVE",
    fuelType: "Heavy Duty",
    transmission: "EV-100",
  },
  {
    id: 2,
    make: "Volvo",
    model: "VNL 860",
    year: 2023,
    vin: "ID: FC-441-S",
    licensePlate: "CA-12-LMN",
    dailyRate: 210.50,
    status: "MAINTENANCE",
    fuelType: "Sleeper",
    transmission: "Diesel-V6",
  },
  {
    id: 3,
    make: "Kenworth",
    model: "T680",
    year: 2024,
    vin: "ID: FC-209-X",
    licensePlate: "WA-88-RTB",
    dailyRate: 230.00,
    status: "IN PREP",
    fuelType: "Logistics",
    transmission: "Hy-Brid",
  },
  {
    id: 4,
    make: "Peterbilt",
    model: "579",
    year: 2022,
    vin: "ID: FC-112-P",
    licensePlate: "FL-45-QWE",
    dailyRate: 275.00,
    status: "ACTIVE",
    fuelType: "Long Haul",
    transmission: "Clean-Diesel",
  },
];

export default function FleetListView({ vehicles = [] }: FleetListViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Maintenance" | "InPrep">("All");
  const [showDropdownRow, setShowDropdownRow] = useState<number | null>(null);

  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicleId, setViewingVehicleId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingVehicle) return;

    setIsDeleting(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        vin: deletingVehicle.vin,
        plate: deletingVehicle.licensePlate
      }).toString();

      const url = `http://localhost:8801/api/vehicles/del?${queryParams}`;
      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete vehicle");

      setDeletingVehicle(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  const displayVehicles = vehicles.length > 0 ? vehicles : MOCK_VEHICLES;

  const filteredVehicles = displayVehicles.filter((v) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return v.status?.toLowerCase() === "active";
    if (activeTab === "Maintenance") return v.status?.toLowerCase() === "maintenance";
    if (activeTab === "InPrep") return v.status?.toLowerCase() === "in prep" || v.status?.toLowerCase() === "inprep";
    return true;
  });

  const activeCount = displayVehicles.filter((v) => v.status?.toLowerCase() === "active").length;
  const maintenanceCount = displayVehicles.filter((v) => v.status?.toLowerCase() === "maintenance").length;
  const inPrepCount = displayVehicles.filter((v) => v.status?.toLowerCase() === "in prep" || v.status?.toLowerCase() === "inprep").length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar flex flex-col gap-6 bg-[#0e0e11] relative">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[110] bg-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal
        isOpen={!!deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        vehicleLabel={`${deletingVehicle?.make} ${deletingVehicle?.model}`}
        vehiclePlate={deletingVehicle?.licensePlate || ""}
      />

      <VehicleDetailsModal
        isOpen={!!viewingVehicleId}
        onClose={() => setViewingVehicleId(null)}
        vehicleId={viewingVehicleId}
      />

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Fleet",    value: displayVehicles.length, sub: "Registered", linePercent: 100, lineColor: "bg-brand-gradient" },
          { label: "Active Numbers", value: activeCount, sub: "UTILIZED", linePercent: displayVehicles.length ? (activeCount/displayVehicles.length)*100 : 0,  lineColor: "bg-brand-cyan" },
          { label: "Maintenances",   value: maintenanceCount, sub: "In Shop", linePercent: displayVehicles.length ? (maintenanceCount/displayVehicles.length)*100 : 0,  lineColor: "bg-brand-red" },
          { label: "In_Prep",        value: inPrepCount,  sub: "QUEUED", linePercent: displayVehicles.length ? (inPrepCount/displayVehicles.length)*100 : 0,  lineColor: "bg-brand-cyan" },
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
              <span className={`text-[10px] font-bold ${card.sub === "UTILIZED" ? "text-brand-green" : card.sub === "In Shop" ? "text-brand-red" : "text-gray-500"}`}>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/5 gap-4">
          <h2 className="text-base font-black text-white tracking-tight">
            Fleet Registry
          </h2>
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
              {filteredVehicles.map((v) => {
                const style = statusStyles[v.status?.toLowerCase()] || { badge: "bg-white/5 text-gray-400 border-white/10", dot: "bg-gray-500" };
                return (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors text-xs font-semibold text-gray-300 relative overflow-visible">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400">
                          🚚
                        </div>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-white">{v.make} {v.model}</span>
                          <span className="text-[10px] text-gray-500 font-bold">{v.vin}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-bold uppercase tracking-wider">{v.licensePlate}</td>
                    <td className="px-6 py-4 text-gray-400">{v.fuelType} / {v.transmission}</td>
                    <td className="px-6 py-4 text-white font-bold">Rs. {v.dailyRate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${style.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {v.status || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative overflow-visible">
                      <button
                        onClick={() => setShowDropdownRow(showDropdownRow === v.id ? null : v.id)}
                        className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      >
                        •••
                      </button>
                      {showDropdownRow === v.id && (
                        <div className="absolute right-6 top-12 bg-[#1e1e1e] rounded-xl border border-white/5 shadow-lg p-2.5 z-30 w-44 text-left flex flex-col gap-1.5 animate-fadeIn">
                          <button onClick={() => { setViewingVehicleId(v.id); setShowDropdownRow(null); }} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-all w-full text-left cursor-pointer">
                            <span>👁</span> View Details
                          </button>
                          <button onClick={() => router.push("/vehicles/edit/" + v.id)} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-all w-full text-left cursor-pointer">
                            <span>⚙</span> Edit Specifications
                          </button>
                          <hr className="border-white/5 my-0.5" />
                          <button onClick={() => { setDeletingVehicle(v); setShowDropdownRow(null); }} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-red hover:bg-rose-950/20 rounded-md transition-all w-full text-left cursor-pointer">
                            <span>🗑</span> Delete Vehicle
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-white/5">
          {filteredVehicles.map((v) => {
            const style = statusStyles[v.status?.toLowerCase()] || { badge: "bg-white/5 text-gray-400 border-white/10", dot: "bg-gray-500" };
            return (
              <div key={v.id} className="p-4 flex items-start gap-3 relative">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 flex-shrink-0 text-lg">
                  🚚
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-white truncate">{v.make} {v.model}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border flex-shrink-0 ${style.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {v.status || "UNKNOWN"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-500 font-bold">{v.vin}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{v.licensePlate}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-gray-400">{v.fuelType}</span>
                    <span className="text-xs font-black text-white">Rs. {v.dailyRate}<span className="text-[9px] font-bold text-gray-500">/day</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
