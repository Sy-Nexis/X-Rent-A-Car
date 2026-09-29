"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { fetchVehicles } from "@/lib/api";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year?: number;
  vin?: string;
  license_plate?: string;
  licensePlate?: string;
  status: string;
  mileage?: number;
  daily_rate?: number;
  dailyRate?: number;
  branch?: string;
  fuel_type?: string;
  fuelType?: string;
  transmission?: string;
}

function AnimatedNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let animationFrameId: number;
    let startTime: number | null = null;

    const updateCount = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutQuad)
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = Math.floor(easeOutQuad(progress) * value);

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

  return <>{count.toLocaleString()}</>;
}

export default function DashboardView() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadVehicleData() {
      try {
        const data = await fetchVehicles();
        if (isMounted && Array.isArray(data)) {
          setVehicles(data);
        }
      } catch (err) {
        console.error("Failed to load vehicle data for dashboard:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadVehicleData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Compute live real metrics from Supabase data
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(
    (v) => (v.status || "").toLowerCase() === "active" || (v.status || "").toLowerCase() === "available"
  );
  const maintenanceVehicles = vehicles.filter(
    (v) => (v.status || "").toLowerCase() === "maintenance" || (v.status || "").toLowerCase() === "alert"
  );
  const inPrepVehicles = vehicles.filter(
    (v) => (v.status || "").toLowerCase() === "in prep" || (v.status || "").toLowerCase() === "inprep"
  );

  const totalMileage = vehicles.reduce((sum, v) => sum + (Number(v.mileage) || 0), 0);
  const activePercentage = totalVehicles > 0 ? Math.round((activeVehicles.length / totalVehicles) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative flex flex-col gap-6 bg-[#0e0e11] min-h-screen">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Fleet Dashboard</h1>
          <p className="text-sm text-gray-400 font-medium">
            Real-time oversight for global logistics operations.
          </p>
        </div>

        <Link
          href="/vehicles/new"
          className="bg-brand-gradient hover:opacity-90 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+</span> Add Vehicle
        </Link>
      </div>

      {/* Top 3 Metric Cards with Real Live Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Active Vehicles */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
              Active Vehicles
            </span>
            <span className="text-3xl font-black text-white leading-none">
              <AnimatedNumber value={activeVehicles.length} />
            </span>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-brand-green">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{activePercentage}% active ({activeVehicles.length}/{totalVehicles} total)</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 text-brand-cyan flex items-center justify-center shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h10" />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Mileage / Kms Driven */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
              Kms Driven Total
            </span>
            <span className="text-3xl font-black text-white leading-none">
              <AnimatedNumber value={totalMileage} />
            </span>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-gray-400">
              <svg className="w-3.5 h-3.5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Live odometer tally</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 text-brand-cyan flex items-center justify-center shadow-xs">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>

        {/* Card 3: Active Alerts & Maintenance */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 flex items-center justify-between shadow-md">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
              Active Alerts
            </span>
            <span className={`text-3xl font-black leading-none ${maintenanceVehicles.length > 0 ? "text-brand-red" : "text-brand-green"}`}>
              <AnimatedNumber value={maintenanceVehicles.length} />
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold">
              {maintenanceVehicles.length > 0 ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                  <span className="text-brand-red">{maintenanceVehicles.length} Critical / Maintenance</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  <span className="text-brand-green">All vehicles operational</span>
                </>
              )}
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
            maintenanceVehicles.length > 0 ? "bg-brand-red/10 text-brand-red" : "bg-brand-green/10 text-brand-green"
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Fleet Overview Status Breakdown */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h2 className="text-sm font-extrabold uppercase text-white tracking-wider">
              Fleet Status Overview
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Current vehicle operational status in Supabase database.
            </p>
          </div>
          <Link
            href="/fleet"
            className="text-brand-cyan hover:underline font-bold text-xs"
          >
            View All Fleet →
          </Link>
        </div>

        {/* Real Vehicle Inventory Table */}
        <div className="rounded-xl border border-white/5 overflow-x-auto bg-[#121214]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                <th className="p-3 pl-4">Vehicle Model</th>
                <th className="p-3">License Plate</th>
                <th className="p-3">VIN</th>
                <th className="p-3">Status</th>
                <th className="p-3">Mileage</th>
                <th className="p-3">Daily Rate</th>
                <th className="p-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                    {isLoading ? "Loading vehicles from Supabase..." : "No vehicles registered."}
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => {
                  const isActive = (v.status || "").toLowerCase() === "active" || (v.status || "").toLowerCase() === "available";
                  const isMaint = (v.status || "").toLowerCase() === "maintenance" || (v.status || "").toLowerCase() === "alert";

                  return (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-4 font-bold text-white">
                        {v.make} {v.model} <span className="text-gray-500 font-normal">({v.year || 2024})</span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-gray-300 font-semibold uppercase">
                        {v.license_plate || v.licensePlate || "N/A"}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-gray-500">
                        {v.vin || "N/A"}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : isMaint
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {v.status || "Active"}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-200">
                        {v.mileage ? `${Number(v.mileage).toLocaleString()} km` : "0 km"}
                      </td>
                      <td className="p-3 font-semibold text-emerald-400">
                        LKR {Number(v.daily_rate || v.dailyRate || 0).toLocaleString()} / day
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <Link
                          href="/fleet"
                          className="text-brand-cyan hover:underline font-bold text-[11px]"
                        >
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
