"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Car,
  Users,
  Layers,
  Activity,
  Search,
  RefreshCw,
  Calendar,
  Fuel,
  Gauge,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Info,
  ChevronRight,
  Shield,
  CreditCard,
  FileText,
  X
} from "lucide-react";
import { fetchVehicles, fetchClients, fetchAssignments } from "@/lib/api";
import VehicleDetailsModal from "../Modals/VehicleDetailsModal";
import ClientDetailsModal from "../Modals/ClientDetailsModal";

// --- TYPES ---
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

interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  government_id?: string;
  license_number?: string;
  status: string;
  created_at?: string;
}

interface Assignment {
  id: number | string;
  client_id?: number | string;
  vehicle_id?: number | string;
  client_name?: string;
  vehicle_name?: string;
  start_date?: string;
  end_date?: string;
  daily_rate?: number;
  status: string;
  notes?: string;
  client?: {
    id: number | string;
    name: string;
    email?: string;
    phone?: string;
    government_id?: string;
  };
  vehicle?: {
    id: number | string;
    make: string;
    model: string;
    licensePlate?: string;
    license_plate?: string;
    status?: string;
    dailyRate?: number;
  };
}

// --- ANIMATED NUMBER COMPONENT ---
function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
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
      const currentCount = Math.floor(easeOutQuad(progress) * value);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function DashboardView() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"overview" | "vehicles" | "clients" | "assignments">("overview");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Selected details for modals
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Load all live data
  const loadDashboardData = async (force = false) => {
    if (force) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const [vData, cData, aData] = await Promise.all([
        fetchVehicles(force),
        fetchClients(force),
        fetchAssignments(force),
      ]);

      if (Array.isArray(vData)) setVehicles(vData);
      if (Array.isArray(cData)) setClients(cData);
      if (Array.isArray(aData)) setAssignments(aData);
    } catch (err) {
      console.error("Dashboard live data error:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // --- VEHICLE METRICS ---
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(
    (v) => (v.status || "").toLowerCase() === "available" || (v.status || "").toLowerCase() === "active"
  );
  const maintenanceVehicles = vehicles.filter(
    (v) => (v.status || "").toLowerCase() === "maintenance" || (v.status || "").toLowerCase() === "alert"
  );
  const inPrepVehicles = vehicles.filter(
    (v) => (v.status || "").toLowerCase() === "in prep" || (v.status || "").toLowerCase() === "inprep"
  );
  const totalFleetMileage = vehicles.reduce((sum, v) => sum + (Number(v.mileage) || 0), 0);
  const fleetUtilizationRate = totalVehicles > 0 ? Math.round((availableVehicles.length / totalVehicles) * 100) : 0;

  // --- CLIENT METRICS ---
  const totalClients = clients.length;
  const activeClients = clients.filter(
    (c) => (c.status || "").toLowerCase() === "active"
  );
  const verifiedClients = clients.filter((c) => Boolean(c.government_id || c.license_number));
  const uniqueCitiesCount = new Set(clients.map((c) => c.city).filter(Boolean)).size;

  // --- ASSIGNMENT METRICS ---
  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(
    (a) => (a.status || "").toLowerCase() === "active"
  );
  const completedAssignments = assignments.filter(
    (a) => (a.status || "").toLowerCase() === "completed" || (a.status || "").toLowerCase() === "returned"
  );
  const totalDailyRevenue = activeAssignments.reduce((sum, a) => {
    const rate = Number(a.daily_rate || a.vehicle?.dailyRate || 0);
    return sum + rate;
  }, 0);

  // --- FILTERED DATA LISTS ---
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        v.make?.toLowerCase().includes(q) ||
        v.model?.toLowerCase().includes(q) ||
        v.license_plate?.toLowerCase().includes(q) ||
        v.licensePlate?.toLowerCase().includes(q) ||
        v.vin?.toLowerCase().includes(q) ||
        v.branch?.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "ALL" ||
        (v.status || "").toUpperCase() === statusFilter.toUpperCase();

      return matchSearch && matchStatus;
    });
  }, [vehicles, searchQuery, statusFilter]);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = searchQuery.toLowerCase();
      const fullName = `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase();
      const matchSearch =
        !q ||
        fullName.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.government_id?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "ALL" ||
        (c.status || "").toUpperCase() === statusFilter.toUpperCase();

      return matchSearch && matchStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const q = searchQuery.toLowerCase();
      const clientName = (a.client?.name || a.client_name || "").toLowerCase();
      const vehicleInfo = `${a.vehicle?.make || ""} ${a.vehicle?.model || ""} ${a.vehicle?.licensePlate || a.vehicle?.license_plate || a.vehicle_name || ""}`.toLowerCase();
      const matchSearch =
        !q ||
        clientName.includes(q) ||
        vehicleInfo.includes(q) ||
        String(a.id).includes(q) ||
        a.notes?.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "ALL" ||
        (a.status || "").toUpperCase() === statusFilter.toUpperCase();

      return matchSearch && matchStatus;
    });
  }, [assignments, searchQuery, statusFilter]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative flex flex-col gap-6 bg-[#0e0e11] min-h-screen text-white">
      {/* Title & Refresh Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-brand-cyan mb-1">
            <Activity size={14} />
            <span>Operational Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Overview & Summary Dashboard</h1>
          <p className="text-sm text-gray-400 font-medium mt-0.5">
            Real-time analytics and detailed summaries for Clients, Vehicles, and Active Assignments.
          </p>
        </div>

        <button
          onClick={() => loadDashboardData(true)}
          disabled={isLoading || isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-200 hover:text-white transition-all cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin text-brand-cyan" : ""} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      {/* TOP 3 MASTER SUMMARY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SUMMARY CARD 1: VEHICLES */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-brand-cyan uppercase tracking-wider block mb-1">
                Fleet Portfolio Summary
              </span>
              <h2 className="text-3xl font-black text-white leading-none">
                <AnimatedNumber value={totalVehicles} />
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">Total Registered Assets</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-brand-cyan flex items-center justify-center">
              <Car size={24} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/5 text-center">
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-xs font-bold text-emerald-400 block">{availableVehicles.length}</span>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tight">Available</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-xs font-bold text-amber-400 block">{inPrepVehicles.length}</span>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tight">In Prep</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-xs font-bold text-rose-400 block">{maintenanceVehicles.length}</span>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tight">Alerts</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mt-3">
            <span>Fleet Health: <strong className="text-emerald-400">{fleetUtilizationRate}%</strong></span>
            <span>Total Odo: <strong className="text-white">{totalFleetMileage.toLocaleString()} km</strong></span>
          </div>
        </div>

        {/* SUMMARY CARD 2: CLIENTS */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-brand-green uppercase tracking-wider block mb-1">
                Client Registry Summary
              </span>
              <h2 className="text-3xl font-black text-white leading-none">
                <AnimatedNumber value={totalClients} />
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">Total Registered Patrons</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-brand-green flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/5 text-center">
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-xs font-bold text-emerald-400 block">{activeClients.length}</span>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tight">Active</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-xs font-bold text-brand-cyan block">{verifiedClients.length}</span>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tight">ID Verified</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-xs font-bold text-purple-400 block">{uniqueCitiesCount}</span>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tight">Cities</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mt-3">
            <span>Verified Ratio: <strong className="text-brand-cyan">{totalClients > 0 ? Math.round((verifiedClients.length / totalClients) * 100) : 0}%</strong></span>
            <span>Status: <strong className="text-emerald-400">100% Synced</strong></span>
          </div>
        </div>

        {/* SUMMARY CARD 3: ASSIGNMENTS */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider block mb-1">
                Vehicle Assignments Summary
              </span>
              <h2 className="text-3xl font-black text-white leading-none">
                <AnimatedNumber value={totalAssignments} />
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">Total Contract Records</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Layers size={24} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/5 text-center">
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-xs font-bold text-emerald-400 block">{activeAssignments.length}</span>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tight">On Rental</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-xs font-bold text-gray-300 block">{completedAssignments.length}</span>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tight">Returned</span>
            </div>
            <div className="bg-white/5 rounded-xl p-2">
              <span className="text-xs font-bold text-emerald-400 block">LKR {(totalDailyRevenue / 1000).toFixed(0)}k</span>
              <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tight">Active Rev/Day</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 mt-3">
            <span>Active Deployments: <strong className="text-purple-400">{activeAssignments.length}</strong></span>
            <span>Est Daily Yield: <strong className="text-emerald-400">LKR {totalDailyRevenue.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS & FILTER BAR */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-4 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#121214] rounded-xl border border-white/5">
          <button
            onClick={() => { setActiveTab("overview"); setStatusFilter("ALL"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "overview" ? "bg-brand-gradient text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Activity size={14} />
            <span>Master Summary</span>
          </button>

          <button
            onClick={() => { setActiveTab("vehicles"); setStatusFilter("ALL"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "vehicles" ? "bg-brand-gradient text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Car size={14} />
            <span>Vehicles Details ({vehicles.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab("clients"); setStatusFilter("ALL"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "clients" ? "bg-brand-gradient text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Users size={14} />
            <span>Clients Details ({clients.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab("assignments"); setStatusFilter("ALL"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "assignments" ? "bg-brand-gradient text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Layers size={14} />
            <span>Assignments Details ({assignments.length})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === "overview" ? "all details" : activeTab}...`}
            className="w-full bg-[#121214] text-white text-xs rounded-xl pl-9 pr-3 py-2.5 border border-white/5 focus:border-brand-cyan outline-none placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW TAB: TRI-SECTION QUICK DETAILS                                */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6">
          {/* VEHICLES QUICK SUMMARY TABLE */}
          <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-brand-cyan">
                  <Car size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold uppercase text-white tracking-wider">
                    Fleet Vehicles Roster
                  </h2>
                  <p className="text-xs text-gray-400">Snapshot of active and registered vehicles in inventory.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("vehicles")}
                className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1"
              >
                <span>View Full Details</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="rounded-xl border border-white/5 overflow-x-auto bg-[#121214]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="p-3 pl-4">Vehicle Model</th>
                    <th className="p-3">Plate No.</th>
                    <th className="p-3">Transmission</th>
                    <th className="p-3">Fuel / Specs</th>
                    <th className="p-3">Mileage</th>
                    <th className="p-3">Daily Rate</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredVehicles.slice(0, 5).map((v) => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-4 font-bold text-white">
                        {v.make} {v.model} <span className="text-gray-500 font-normal">({v.year || 2024})</span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-brand-cyan font-semibold">
                        {v.license_plate || v.licensePlate || "N/A"}
                      </td>
                      <td className="p-3 text-gray-300">{v.transmission || "Automatic"}</td>
                      <td className="p-3 text-gray-400">{v.fuel_type || v.fuelType || "Petrol"}</td>
                      <td className="p-3 text-gray-200">{v.mileage ? `${Number(v.mileage).toLocaleString()} km` : "0 km"}</td>
                      <td className="p-3 font-semibold text-emerald-400">LKR {Number(v.daily_rate || v.dailyRate || 0).toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          (v.status || "").toLowerCase() === "available" || (v.status || "").toLowerCase() === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : (v.status || "").toLowerCase() === "maintenance"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {v.status || "Available"}
                        </span>
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <button
                          onClick={() => setSelectedVehicleId(v.id)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-gray-500">
                        {isLoading ? "Loading vehicle records..." : "No vehicles found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CLIENTS QUICK SUMMARY TABLE */}
          <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-green-500/10 text-brand-green">
                  <Users size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold uppercase text-white tracking-wider">
                    Client Registry Summary
                  </h2>
                  <p className="text-xs text-gray-400">Snapshot of registered clientele and verified driver profiles.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("clients")}
                className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
              >
                <span>View Full Details</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="rounded-xl border border-white/5 overflow-x-auto bg-[#121214]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="p-3 pl-4">Client Name</th>
                    <th className="p-3">Gov ID / NIC</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Location / City</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredClients.slice(0, 5).map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-4 font-bold text-white">
                        {c.first_name} {c.last_name}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-gray-300">{c.government_id || "N/A"}</td>
                      <td className="p-3 text-gray-300">{c.phone || "N/A"}</td>
                      <td className="p-3 text-gray-400">{c.email}</td>
                      <td className="p-3 text-gray-300">{c.city || "Colombo"}, {c.state || "LK"}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {c.status || "Active"}
                        </span>
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <button
                          onClick={() => setSelectedClientId(c.id)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-500">
                        {isLoading ? "Loading client records..." : "No clients found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ASSIGNMENTS QUICK SUMMARY TABLE */}
          <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Layers size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold uppercase text-white tracking-wider">
                    Recent Vehicle Assignments
                  </h2>
                  <p className="text-xs text-gray-400">Snapshot of recent vehicle allocations and rental contracts.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("assignments")}
                className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>View Full Details</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="rounded-xl border border-white/5 overflow-x-auto bg-[#121214]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="p-3 pl-4">Contract ID</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Allocated Vehicle</th>
                    <th className="p-3">Period</th>
                    <th className="p-3">Daily Rate</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredAssignments.slice(0, 5).map((a) => (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-4 font-mono text-[11px] font-bold text-gray-400">#{String(a.id).slice(-6)}</td>
                      <td className="p-3 font-bold text-white">{a.client?.name || a.client_name || "Client"}</td>
                      <td className="p-3 text-brand-cyan font-semibold">
                        {a.vehicle?.make} {a.vehicle?.model} {a.vehicle?.licensePlate && `(${a.vehicle.licensePlate})`}
                      </td>
                      <td className="p-3 text-gray-400">{a.start_date || "N/A"} → {a.end_date || "Ongoing"}</td>
                      <td className="p-3 font-semibold text-emerald-400">LKR {Number(a.daily_rate || a.vehicle?.dailyRate || 0).toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          (a.status || "").toLowerCase() === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        }`}>
                          {a.status || "Active"}
                        </span>
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <button
                          onClick={() => setSelectedAssignment(a)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredAssignments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-500">
                        {isLoading ? "Loading assignment records..." : "No active assignments found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VEHICLES DETAILS TAB                                                   */}
      {/* ========================================================================= */}
      {activeTab === "vehicles" && (
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                <Car className="text-brand-cyan" size={18} />
                <span>Complete Vehicle Inventory Details ({filteredVehicles.length})</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Comprehensive specs, telemetry, and status summary of every vehicle.</p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#121214] text-white text-xs font-semibold rounded-xl px-3 py-1.5 border border-white/5 focus:border-brand-cyan outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available / Active</option>
                <option value="IN PREP">In Prep</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 overflow-x-auto bg-[#121214]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="p-4 pl-6">Vehicle Asset</th>
                  <th className="p-4">License Plate</th>
                  <th className="p-4">VIN Number</th>
                  <th className="p-4">Transmission</th>
                  <th className="p-4">Fuel Type</th>
                  <th className="p-4">Odometer</th>
                  <th className="p-4">Daily Rate</th>
                  <th className="p-4">Branch Location</th>
                  <th className="p-4">Operational Status</th>
                  <th className="p-4 pr-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-brand-cyan flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {v.make?.slice(0, 2).toUpperCase() || "VH"}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-tight">{v.make} {v.model}</p>
                          <span className="text-[10px] text-gray-500">Year {v.year || 2024}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-brand-cyan text-[11px]">
                      {v.license_plate || v.licensePlate || "N/A"}
                    </td>
                    <td className="p-4 font-mono text-gray-500 text-[10px]">{v.vin || "N/A"}</td>
                    <td className="p-4 text-gray-300">{v.transmission || "Automatic"}</td>
                    <td className="p-4 text-gray-300">{v.fuel_type || v.fuelType || "Petrol"}</td>
                    <td className="p-4 font-semibold text-gray-200">{v.mileage ? `${Number(v.mileage).toLocaleString()} km` : "0 km"}</td>
                    <td className="p-4 font-bold text-emerald-400">LKR {Number(v.daily_rate || v.dailyRate || 0).toLocaleString()}</td>
                    <td className="p-4 text-gray-400">{v.branch || "Colombo Central"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        (v.status || "").toLowerCase() === "available" || (v.status || "").toLowerCase() === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : (v.status || "").toLowerCase() === "maintenance"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {v.status || "Available"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedVehicleId(v.id)}
                        className="px-3 py-1.5 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-gray-500 font-medium">
                      {isLoading ? "Retrieving vehicle inventory..." : "No vehicles match the query."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CLIENTS DETAILS TAB                                                    */}
      {/* ========================================================================= */}
      {activeTab === "clients" && (
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                <Users className="text-brand-green" size={18} />
                <span>Complete Client Registry Details ({filteredClients.length})</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Contact details, government IDs, driving licenses, and client account status.</p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#121214] text-white text-xs font-semibold rounded-xl px-3 py-1.5 border border-white/5 focus:border-brand-green outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 overflow-x-auto bg-[#121214]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="p-4 pl-6">Client Profile</th>
                  <th className="p-4">Government ID / NIC</th>
                  <th className="p-4">License Number</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Address / City</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 pr-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 text-brand-green flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {c.first_name?.[0] || "C"}{c.last_name?.[0] || ""}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-tight">{c.first_name} {c.last_name}</p>
                          <span className="text-[10px] text-gray-500">ID #{c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-brand-green text-[11px]">{c.government_id || "Unspecified"}</td>
                    <td className="p-4 font-mono text-gray-300 text-[11px]">{c.license_number || c.government_id || "Unspecified"}</td>
                    <td className="p-4 text-gray-200">{c.phone || "N/A"}</td>
                    <td className="p-4 text-gray-400">{c.email}</td>
                    <td className="p-4 text-gray-300">{c.address ? `${c.address}, ` : ""}{c.city || "Colombo"}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {c.status || "Active"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedClientId(c.id)}
                        className="px-3 py-1.5 bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/30 text-brand-green rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-gray-500 font-medium">
                      {isLoading ? "Retrieving client directory..." : "No clients match the query."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ASSIGNMENTS DETAILS TAB                                                */}
      {/* ========================================================================= */}
      {activeTab === "assignments" && (
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                <Layers className="text-purple-400" size={18} />
                <span>Complete Vehicle Assignment Details ({filteredAssignments.length})</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Allocated vehicles, assigned clients, contract periods, rates, and terms.</p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#121214] text-white text-xs font-semibold rounded-xl px-3 py-1.5 border border-white/5 focus:border-purple-400 outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active (On Rental)</option>
                <option value="COMPLETED">Completed / Returned</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 overflow-x-auto bg-[#121214]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="p-4 pl-6">Contract ID</th>
                  <th className="p-4">Assigned Client</th>
                  <th className="p-4">Allocated Vehicle</th>
                  <th className="p-4">License Plate</th>
                  <th className="p-4">Rental Duration</th>
                  <th className="p-4">Daily Rate</th>
                  <th className="p-4">Contract Status</th>
                  <th className="p-4 pr-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {filteredAssignments.map((a) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6 font-mono text-[11px] font-bold text-gray-400">
                      #{String(a.id).slice(-6)}
                    </td>
                    <td className="p-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Users size={13} className="text-brand-green" />
                        <span>{a.client?.name || a.client_name || "Client"}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-brand-cyan">
                      {a.vehicle?.make} {a.vehicle?.model}
                    </td>
                    <td className="p-4 font-mono font-bold text-gray-300 text-[11px]">
                      {a.vehicle?.licensePlate || a.vehicle?.license_plate || a.vehicle_name || "N/A"}
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-500" />
                        <span>{a.start_date || "N/A"} → {a.end_date || "Ongoing"}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      LKR {Number(a.daily_rate || a.vehicle?.dailyRate || 0).toLocaleString()} / day
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        (a.status || "").toLowerCase() === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}>
                        {a.status || "Active"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => setSelectedAssignment(a)}
                        className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAssignments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-gray-500 font-medium">
                      {isLoading ? "Retrieving vehicle assignments..." : "No assignments match the query."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- INTEGRATED DETAIL INSPECTION MODALS --- */}
      {/* 1. Vehicle Details Modal */}
      {selectedVehicleId && (
        <VehicleDetailsModal
          isOpen={Boolean(selectedVehicleId)}
          onClose={() => setSelectedVehicleId(null)}
          vehicleId={selectedVehicleId}
        />
      )}

      {/* 2. Client Details Modal */}
      {selectedClientId && (
        <ClientDetailsModal
          isOpen={Boolean(selectedClientId)}
          onClose={() => setSelectedClientId(null)}
          clientId={selectedClientId}
        />
      )}

      {/* 3. Assignment Details Quick Drawer/Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Assignment Contract Details</h3>
                  <p className="text-xs text-gray-400 font-mono">Contract ID: #{String(selectedAssignment.id)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#121214] p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">Client Profile</span>
                <p className="font-bold text-white text-sm">{selectedAssignment.client?.name || selectedAssignment.client_name || "N/A"}</p>
                <p className="text-xs text-gray-400 mt-1">{selectedAssignment.client?.phone || "No phone listed"}</p>
                <p className="text-xs text-gray-500">{selectedAssignment.client?.email || ""}</p>
              </div>

              <div className="bg-[#121214] p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">Allocated Vehicle</span>
                <p className="font-bold text-brand-cyan text-sm">{selectedAssignment.vehicle?.make} {selectedAssignment.vehicle?.model}</p>
                <p className="text-xs text-gray-300 font-mono mt-1 font-semibold">{selectedAssignment.vehicle?.licensePlate || selectedAssignment.vehicle?.license_plate || "N/A"}</p>
                <p className="text-xs text-gray-500">Asset #{String(selectedAssignment.vehicle_id || "")}</p>
              </div>

              <div className="bg-[#121214] p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">Schedule & Duration</span>
                <p className="text-xs text-gray-300"><strong>Start:</strong> {selectedAssignment.start_date || "N/A"}</p>
                <p className="text-xs text-gray-300 mt-1"><strong>End:</strong> {selectedAssignment.end_date || "Ongoing"}</p>
              </div>

              <div className="bg-[#121214] p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-1">Financial Terms</span>
                <p className="font-black text-emerald-400 text-sm">LKR {Number(selectedAssignment.daily_rate || selectedAssignment.vehicle?.dailyRate || 0).toLocaleString()} / day</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {selectedAssignment.status || "Active"}
                </span>
              </div>
            </div>

            {selectedAssignment.notes && (
              <div className="bg-[#121214] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-0.5">Contract Notes</span>
                <p className="text-xs text-gray-300 italic">{selectedAssignment.notes}</p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-white/5">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
