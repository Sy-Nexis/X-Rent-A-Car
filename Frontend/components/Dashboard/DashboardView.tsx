"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [viewType, setViewType] = useState<"map" | "list">("map");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFleetData() {
      try {
        const res = await fetch("http://localhost:8801/api/vehicles/view", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && isMounted) {
            setVehicles(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load live fleet data for dashboard:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFleetData();

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
  const inPrepOrOtherVehicles = vehicles.filter(
    (v) =>
      (v.status || "").toLowerCase() !== "active" &&
      (v.status || "").toLowerCase() !== "available" &&
      (v.status || "").toLowerCase() !== "maintenance" &&
      (v.status || "").toLowerCase() !== "alert"
  );

  const totalMileage = vehicles.reduce((sum, v) => sum + (Number(v.mileage) || 0), 0);
  const activePercentage = totalVehicles > 0 ? Math.round((activeVehicles.length / totalVehicles) * 100) : 0;

  // Map coordinates positions preset for live markers
  const pinCoordinates = [
    { top: 160, left: 380 },
    { top: 275, left: 475 },
    { top: 205, left: 560 },
    { top: 290, left: 240 },
    { top: 110, left: 590 },
    { top: 230, left: 160 },
    { top: 130, left: 310 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative flex flex-col gap-6 bg-[#0e0e11] min-h-screen">
      {/* Title section */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Fleet Dashboard</h1>
        <p className="text-sm text-gray-400 font-medium">
          Real-time oversight for global logistics operations.
        </p>
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
              <span>{activePercentage}% fleet active ({activeVehicles.length}/{totalVehicles})</span>
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

      {/* LIVE FLEET MAP / LIST SECTION */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col">
        {/* Title Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3 bg-brand-cyan rounded-full" />
            Live Fleet
          </h2>

          {/* View Toggle */}
          <div className="flex bg-[#0e0e11] p-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => setViewType("map")}
              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-md transition-all ${
                viewType === "map" ? "bg-[#1e1e1e] text-white shadow-xs" : "text-gray-400 hover:text-white"
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-md transition-all ${
                viewType === "list" ? "bg-[#1e1e1e] text-white shadow-xs" : "text-gray-400 hover:text-white"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Map view display */}
        {viewType === "map" ? (
          <div className="relative h-[440px] rounded-xl border border-white/5 overflow-hidden bg-[#121214]">
            {/* SVG Map of Berlin Grid - Night Mode */}
            <svg className="w-full h-full object-cover" viewBox="0 0 800 400" fill="none">
              <rect width="800" height="400" fill="#121214" />
              
              {/* Rivers / Lakes */}
              <path d="M-50 250 C 150 230, 250 240, 350 210 C 450 180, 520 180, 850 130" stroke="#1d2d44" strokeWidth="24" strokeLinecap="round" fill="none" />
              <path d="M120 238 L 110 320" stroke="#1d2d44" strokeWidth="12" strokeLinecap="round" />
              
              {/* Forest / Parks */}
              <rect x="250" y="40" width="120" height="70" rx="15" fill="#1b2a22" />
              <rect x="620" y="60" width="140" height="80" rx="20" fill="#1b2a22" />
              <circle cx="500" cy="320" r="45" fill="#1b2a22" />
              <path d="M 330 180 C 310 220, 280 230, 290 280 Z" fill="#1b2a22" />

              {/* Major Roads Grid */}
              <g stroke="#1a1a22" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="-20" y1="100" x2="820" y2="100" />
                <line x1="-20" y1="300" x2="820" y2="300" />
                <line x1="200" y1="-20" x2="200" y2="420" />
                <line x1="600" y1="-20" x2="600" y2="420" />
                <line x1="50" y1="50" x2="750" y2="350" />
                <line x1="750" y1="50" x2="50" y2="350" />
                <line x1="400" y1="-20" x2="400" y2="420" strokeWidth="8" stroke="#1c1c24" />
              </g>

              {/* Street Details */}
              <g stroke="#262630" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <line x1="-20" y1="100" x2="820" y2="100" />
                <line x1="-20" y1="300" x2="820" y2="300" />
                <line x1="200" y1="-20" x2="200" y2="420" />
                <line x1="600" y1="-20" x2="600" y2="420" />
                <line x1="50" y1="50" x2="750" y2="350" />
                <line x1="750" y1="50" x2="50" y2="350" />
              </g>

              {/* Landmarks */}
              <text x="310" y="105" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Schillerpark</text>
              <text x="630" y="105" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="sans-serif">WEISSENSEE</text>
              <text x="660" y="115" fill="#4a5568" fontSize="7" fontFamily="sans-serif">Zeiss-Großplanetarium</text>
              <text x="590" y="250" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="sans-serif">East Side Gallery</text>
              <text x="440" y="325" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Viktoriapark</text>
              <text x="290" y="285" fill="#4a5568" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Brandenburger Tor</text>
              <text x="510" y="170" fill="#ffffff" fontSize="20" fontWeight="black" opacity="0.05" fontFamily="sans-serif">Berlin</text>
            </svg>

            {/* STATUS LEGEND OVERLAY (Top-Left) */}
            <div className="absolute top-4 left-4 bg-[#1e1e1e]/90 backdrop-blur-md rounded-xl border border-white/5 p-4 shadow-md z-10 w-44">
              <span className="text-[8px] font-black uppercase text-gray-500 tracking-wider block mb-3">
                Live Status Legend
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-green" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Active</span>
                  </div>
                  <span className="text-[10px] font-black text-white">{activeVehicles.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-orange" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Alert / Maint.</span>
                  </div>
                  <span className="text-[10px] font-black text-white">{maintenanceVehicles.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">In Prep / Other</span>
                  </div>
                  <span className="text-[10px] font-black text-white">{inPrepOrOtherVehicles.length}</span>
                </div>
              </div>
            </div>

            {/* DYNAMIC REAL VEHICLE MAP PINS */}
            {vehicles.map((v, index) => {
              const coords = pinCoordinates[index % pinCoordinates.length];
              const isMaintenance = (v.status || "").toLowerCase() === "maintenance" || (v.status || "").toLowerCase() === "alert";
              const isActive = (v.status || "").toLowerCase() === "active" || (v.status || "").toLowerCase() === "available";
              const tagLabel = v.license_plate || v.licensePlate || `${v.make} ${v.model}`;

              return (
                <div
                  key={v.id || index}
                  style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
                  className="absolute z-10 flex flex-col items-center cursor-pointer group transform transition-transform hover:scale-110"
                  onClick={() => setSelectedVehicle(v)}
                >
                  {isMaintenance ? (
                    <>
                      <div className="bg-brand-orange text-white text-[8px] font-black px-2 py-0.5 rounded-t-md shadow-md border-t border-x border-brand-orange leading-none">
                        ⚠ ALERT: MAINT
                      </div>
                      <div className="bg-[#1e1e1e] text-brand-orange text-[8px] font-extrabold uppercase px-2.5 py-1 rounded-b-md shadow-md border-b border-x border-white/5 leading-none tracking-wider -mt-[1px]">
                        {tagLabel}
                      </div>
                      <div className="w-2 h-2 bg-[#1e1e1e] rotate-45 -mt-1 shadow-sm border-r border-b border-white/5" />
                    </>
                  ) : isActive ? (
                    <>
                      <div className="flex items-center gap-1.5 bg-brand-green text-white text-[9px] font-black px-2.5 py-1 rounded-md shadow-md border border-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        {tagLabel}
                      </div>
                      <div className="w-2 h-2 bg-brand-green rotate-45 -mt-1 shadow-sm" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-md shadow-md border border-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                        {tagLabel}
                      </div>
                      <div className="w-2 h-2 bg-blue-600 rotate-45 -mt-1 shadow-sm" />
                    </>
                  )}

                  {/* Pin Hover Tooltip Card */}
                  <div className="hidden group-hover:block absolute bottom-full mb-2 bg-[#18181b] text-white p-2.5 rounded-lg shadow-xl border border-white/10 w-44 z-30 pointer-events-none text-left">
                    <p className="text-xs font-bold text-white">{v.make} {v.model}</p>
                    <p className="text-[10px] text-gray-400">Status: <span className={isActive ? "text-emerald-400 font-bold" : isMaintenance ? "text-amber-400 font-bold" : "text-blue-400 font-bold"}>{v.status}</span></p>
                    {v.mileage !== undefined && <p className="text-[10px] text-gray-400">Mileage: {Number(v.mileage).toLocaleString()} km</p>}
                    {v.branch && <p className="text-[10px] text-gray-400">Hub: {v.branch}</p>}
                  </div>
                </div>
              );
            })}

            {/* Selected Vehicle Info Card Floating Bottom Left (if clicked) */}
            {selectedVehicle && (
              <div className="absolute bottom-4 left-4 bg-[#18181b]/95 backdrop-blur-md border border-brand-cyan/30 rounded-xl p-3.5 shadow-2xl z-20 max-w-xs flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">{selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year || 2024})</h4>
                  <p className="text-[10px] text-gray-400 font-mono">VIN: {selectedVehicle.vin || "N/A"} • {selectedVehicle.license_plate || selectedVehicle.licensePlate || "No plate"}</p>
                  <p className="text-[10px] text-brand-cyan font-semibold mt-0.5">Status: {selectedVehicle.status} • {selectedVehicle.branch || "Central Hub"}</p>
                </div>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="text-gray-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/5"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Zoom & Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <div className="flex flex-col bg-[#1e1e1e] rounded-lg border border-white/5 overflow-hidden shadow-xs">
                <button
                  title="Zoom In"
                  className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-white/5 text-base font-bold border-b border-white/5"
                >
                  +
                </button>
                <button
                  title="Zoom Out"
                  className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-white/5 text-base font-bold"
                >
                  −
                </button>
              </div>

              <button
                onClick={() => router.push("/fleet")}
                title="View Full Fleet"
                className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center text-white shadow-md active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* Live List View Format Table */
          <div className="rounded-xl border border-white/5 overflow-x-auto bg-[#121214]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="p-3 pl-4">Vehicle</th>
                  <th className="p-3">Plate & VIN</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Mileage</th>
                  <th className="p-3">Rate</th>
                  <th className="p-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                      {isLoading ? "Fetching live fleet from database..." : "No vehicles found in database."}
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
                        <td className="p-3 font-mono text-[11px] text-gray-400">
                          {v.license_plate || v.licensePlate || "—"} • {v.vin || "—"}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                          ${Number(v.daily_rate || v.dailyRate || 0).toFixed(2)}/day
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
        )}
      </div>

      {/* Floating Action Button "+" pointing to Add Vehicle */}
      <Link
        href="/vehicles/new"
        title="Add New Vehicle"
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-brand-gradient hover:opacity-90 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all z-40 cursor-pointer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}
