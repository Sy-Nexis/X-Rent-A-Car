"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Car,
  Users,
  CheckSquare,
  Square,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  RefreshCw,
  PlusCircle,
  FileCheck,
  RotateCcw
} from "lucide-react";
import {
  fetchVehicles,
  fetchClients,
  fetchAssignments,
  assignVehiclesToClients,
  updateAssignment,
  deleteAssignment,
  invalidateClientDataCache
} from "@/lib/api";

export default function AssignVehiclesView() {
  // Data lists
  const [clients, setClients] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  // Selection states (Multi-Client & Multi-Vehicle)
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<number[]>([]);

  // Contract form fields
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>("");
  const [dailyRateOverride, setDailyRateOverride] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Search & tab filters
  const [clientSearch, setClientSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [assignmentSearch, setAssignmentSearch] = useState("");
  const [assignmentTab, setAssignmentTab] = useState<"All" | "Active" | "Completed">("All");

  // UI status
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAllData = async (force = false) => {
    setIsLoading(true);
    try {
      const [vData, cData, aData] = await Promise.all([
        fetchVehicles(force),
        fetchClients(force),
        fetchAssignments(force),
      ]);
      if (Array.isArray(vData)) setVehicles(vData);
      if (Array.isArray(cData)) setClients(cData);
      if (Array.isArray(aData)) setAssignments(aData);
    } catch (err: any) {
      console.error("Failed to load assignment workstation data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const name = `${c.first_name || ""} ${c.last_name || ""} ${c.name || ""}`.toLowerCase();
      const email = (c.email || "").toLowerCase();
      const govId = (c.government_id || c.governmentId || "").toLowerCase();
      const q = clientSearch.toLowerCase();
      return name.includes(q) || email.includes(q) || govId.includes(q);
    });
  }, [clients, clientSearch]);

  // Filtered Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const makeModel = `${v.make || ""} ${v.model || ""}`.toLowerCase();
      const plate = (v.license_plate || v.licensePlate || "").toLowerCase();
      const vin = (v.vin || "").toLowerCase();
      const q = vehicleSearch.toLowerCase();
      return makeModel.includes(q) || plate.includes(q) || vin.includes(q);
    });
  }, [vehicles, vehicleSearch]);

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesTab =
        assignmentTab === "All" ||
        (assignmentTab === "Active" && (a.status || "").toLowerCase() === "active") ||
        (assignmentTab === "Completed" && (a.status || "").toLowerCase() !== "active");

      const clientName = (a.client?.name || "").toLowerCase();
      const vehicleName = `${a.vehicle?.make || ""} ${a.vehicle?.model || ""} ${a.vehicle?.licensePlate || ""}`.toLowerCase();
      const q = assignmentSearch.toLowerCase();
      const matchesSearch = !q || clientName.includes(q) || vehicleName.includes(q);

      return matchesTab && matchesSearch;
    });
  }, [assignments, assignmentTab, assignmentSearch]);

  // Multi-Select Client Toggle
  const toggleClient = (id: number) => {
    setSelectedClientIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAllClients = () => {
    if (selectedClientIds.length === filteredClients.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(filteredClients.map((c) => c.id));
    }
  };

  // Multi-Select Vehicle Toggle
  const toggleVehicle = (id: number) => {
    setSelectedVehicleIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAllVehicles = () => {
    if (selectedVehicleIds.length === filteredVehicles.length) {
      setSelectedVehicleIds([]);
    } else {
      setSelectedVehicleIds(filteredVehicles.map((v) => v.id));
    }
  };

  // Calculate estimated total rate for selected vehicles
  const calculatedDailyTotal = useMemo(() => {
    if (dailyRateOverride && Number(dailyRateOverride) > 0) {
      return Number(dailyRateOverride) * selectedVehicleIds.length;
    }
    return selectedVehicleIds.reduce((sum, vId) => {
      const v = vehicles.find((item) => item.id === vId);
      return sum + Number(v?.daily_rate || v?.dailyRate || 0);
    }, 0);
  }, [selectedVehicleIds, vehicles, dailyRateOverride]);

  const totalPossibleContracts = selectedClientIds.length * selectedVehicleIds.length;

  // Handle Dispatch Assignment
  const handleDispatchAssignments = async () => {
    if (selectedClientIds.length === 0 || selectedVehicleIds.length === 0) {
      setErrorMessage("Please select at least 1 Client and at least 1 Vehicle to assign.");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        client_ids: selectedClientIds,
        vehicle_ids: selectedVehicleIds,
        start_date: startDate,
        end_date: endDate || undefined,
        daily_rate: dailyRateOverride ? Number(dailyRateOverride) : undefined,
        notes: notes || "Batch fleet dispatch",
        status: "Active",
      };

      const res = await assignVehiclesToClients(payload);

      setSuccessMessage(
        `Successfully dispatched ${totalPossibleContracts} assignment contract(s) across ${selectedClientIds.length} client(s) and ${selectedVehicleIds.length} vehicle(s)!`
      );

      // Reset selection
      setSelectedClientIds([]);
      setSelectedVehicleIds([]);
      setDailyRateOverride("");
      setNotes("");

      invalidateClientDataCache();
      await loadAllData(true);

      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      console.error("Assignment dispatch error:", err);
      setErrorMessage(err.message || "Failed to create assignments");
      setTimeout(() => setErrorMessage(null), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete / Return Vehicle from assignment
  const handleCompleteAssignment = async (id: number) => {
    try {
      await updateAssignment({ id, status: "Completed" });
      invalidateClientDataCache();
      await loadAllData(true);
    } catch (err: any) {
      alert(err.message || "Failed to complete contract");
    }
  };

  // Delete Assignment
  const handleDeleteAssignment = async (id: number) => {
    if (!confirm("Are you sure you want to terminate and delete this assignment record?")) return;
    try {
      await deleteAssignment(id);
      invalidateClientDataCache();
      await loadAllData(true);
    } catch (err: any) {
      alert(err.message || "Failed to delete assignment");
    }
  };

  // Metrics
  const activeAssignments = assignments.filter((a) => (a.status || "").toLowerCase() === "active");
  const assignedVehiclesCount = new Set(activeAssignments.map((a) => a.vehicleId || a.vehicle?.id)).size;
  const assignedClientsCount = new Set(activeAssignments.map((a) => a.clientId || a.client?.id)).size;
  const totalDailyRevenueLKR = activeAssignments.reduce((sum, a) => sum + (Number(a.dailyRate) || 0), 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#0e0e11] min-h-screen flex flex-col gap-8">
      {/* Title & Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-brand-cyan mb-1">
            <Layers size={14} />
            <span>Multi-Unit Fleet Allocation Workstation</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Assign Vehicles to Clients
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-0.5">
            Bulk-assign multiple vehicles across single or multiple corporate clients simultaneously.
          </p>
        </div>

        <button
          onClick={() => loadAllData(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-all self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
              Active Contracts
            </span>
            <span className="text-3xl font-black text-white">{activeAssignments.length}</span>
            <span className="text-[11px] font-bold text-emerald-400 block mt-1">Live in service</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <FileCheck size={24} />
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
              Assigned Vehicles
            </span>
            <span className="text-3xl font-black text-white">{assignedVehiclesCount}</span>
            <span className="text-[11px] font-bold text-brand-cyan block mt-1">
              of {vehicles.length} fleet units
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-brand-cyan flex items-center justify-center">
            <Car size={24} />
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
              Assigned Clients
            </span>
            <span className="text-3xl font-black text-white">{assignedClientsCount}</span>
            <span className="text-[11px] font-bold text-brand-green block mt-1">
              of {clients.length} registered
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-brand-green flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block mb-1">
              Daily Contract Value
            </span>
            <span className="text-2xl font-black text-emerald-400">
              LKR {totalDailyRevenueLKR.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-gray-400 block mt-1">Active daily tally</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xs">
            LKR
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-3">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-3">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: INTERACTIVE ALLOCATION WORKSTATION (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PANEL 1: CLIENTS SELECTION (4 cols) */}
        <div className="lg:col-span-4 bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 flex flex-col gap-4 shadow-md">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-brand-cyan" />
              <h2 className="text-xs font-extrabold uppercase text-white tracking-wider">
                1. Select Clients ({selectedClientIds.length})
              </h2>
            </div>
            <button
              onClick={selectAllClients}
              className="text-[10px] font-bold text-brand-cyan hover:underline cursor-pointer"
            >
              {selectedClientIds.length === filteredClients.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              placeholder="Search corporate client..."
              className="w-full bg-[#0e0e11] text-white text-xs rounded-xl pl-9 pr-3 py-2 border border-white/5 focus:border-brand-cyan outline-none"
            />
          </div>

          <div className="flex-1 max-h-[380px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredClients.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">No clients found.</p>
            ) : (
              filteredClients.map((c) => {
                const isSelected = selectedClientIds.includes(c.id);
                const fullName = `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.name || "Client";
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleClient(c.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-brand-cyan/10 border-brand-cyan/40 text-white"
                        : "bg-[#121214] border-white/5 hover:border-white/10 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <CheckSquare size={16} className="text-brand-cyan flex-shrink-0" />
                      ) : (
                        <Square size={16} className="text-gray-500 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-bold leading-tight">{fullName}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {c.government_id || c.governmentId || c.email || "ID: Unassigned"}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-white/5 text-gray-400">
                      {c.status || "Active"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PANEL 2: VEHICLES SELECTION (4 cols) */}
        <div className="lg:col-span-4 bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 flex flex-col gap-4 shadow-md">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Car size={16} className="text-emerald-400" />
              <h2 className="text-xs font-extrabold uppercase text-white tracking-wider">
                2. Select Vehicles ({selectedVehicleIds.length})
              </h2>
            </div>
            <button
              onClick={selectAllVehicles}
              className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
            >
              {selectedVehicleIds.length === filteredVehicles.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
              placeholder="Search make, model, plate..."
              className="w-full bg-[#0e0e11] text-white text-xs rounded-xl pl-9 pr-3 py-2 border border-white/5 focus:border-emerald-400 outline-none"
            />
          </div>

          <div className="flex-1 max-h-[380px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredVehicles.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">No vehicles registered.</p>
            ) : (
              filteredVehicles.map((v) => {
                const isSelected = selectedVehicleIds.includes(v.id);
                const isRented = (v.status || "").toLowerCase() === "rented";
                return (
                  <div
                    key={v.id}
                    onClick={() => toggleVehicle(v.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                        : "bg-[#121214] border-white/5 hover:border-white/10 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <CheckSquare size={16} className="text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Square size={16} className="text-gray-500 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-bold leading-tight">
                          {v.make} {v.model}{" "}
                          <span className="text-[10px] text-gray-400 font-normal">({v.year || 2024})</span>
                        </p>
                        <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                          {v.license_plate || v.licensePlate || "NO-PLATE"} •{" "}
                          <span className="text-emerald-400 font-semibold">
                            LKR {Number(v.daily_rate || v.dailyRate || 0).toLocaleString()}/d
                          </span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        isRented
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {v.status || "Available"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* PANEL 3: CONTRACT DISPATCH CONFIGURATION (4 cols) */}
        <div className="lg:col-span-4 bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-xs font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-cyan" />
                3. Dispatch Configuration
              </h2>
            </div>

            {/* Summary preview badge */}
            <div className="p-3.5 rounded-xl bg-[#121214] border border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Selected Clients:</span>
                <span className="font-extrabold text-white">{selectedClientIds.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Selected Vehicles:</span>
                <span className="font-extrabold text-white">{selectedVehicleIds.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
                <span className="text-gray-300 font-bold">Total Dispatched Contracts:</span>
                <span className="font-black text-brand-cyan text-sm">{totalPossibleContracts}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
                <span className="text-gray-300 font-bold">Combined Daily LKR:</span>
                <span className="font-black text-emerald-400 text-sm">
                  LKR {calculatedDailyTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Contract Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#0e0e11] text-white text-xs rounded-xl px-3 py-2 border border-white/5 focus:border-brand-cyan outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1.5">
                  Return Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#0e0e11] text-white text-xs rounded-xl px-3 py-2 border border-white/5 focus:border-brand-cyan outline-none"
                />
              </div>
            </div>

            {/* Daily Rate Override */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1.5">
                Custom Daily Rate (LKR) — Optional Override
              </label>
              <input
                type="number"
                value={dailyRateOverride}
                onChange={(e) => setDailyRateOverride(e.target.value)}
                placeholder="Leave blank to use vehicle default rates"
                className="w-full bg-[#0e0e11] text-white text-xs rounded-xl px-3 py-2 border border-white/5 focus:border-brand-cyan outline-none placeholder:text-gray-600"
              />
            </div>

            {/* Contract Notes */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-gray-400 mb-1.5">
                Contract Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Corporate quarterly logistics contract, driver included..."
                rows={2}
                className="w-full bg-[#0e0e11] text-white text-xs rounded-xl p-3 border border-white/5 focus:border-brand-cyan outline-none placeholder:text-gray-600 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/5 mt-4">
            <button
              onClick={handleDispatchAssignments}
              disabled={isSubmitting || totalPossibleContracts === 0}
              className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                totalPossibleContracts > 0 && !isSubmitting
                  ? "bg-brand-gradient hover:opacity-95 text-white active:scale-98"
                  : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Dispatching Contracts...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>
                    Assign {selectedVehicleIds.length} Vehicle(s) to {selectedClientIds.length} Client(s)
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE ASSIGNMENT REGISTRY TABLE */}
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-white tracking-wide">
              Active Vehicle-to-Client Assignment Registry
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Live contracts tracking which vehicles are assigned to which clients.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tabs */}
            <div className="flex p-1 bg-[#121214] rounded-xl border border-white/5">
              {(["All", "Active", "Completed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setAssignmentTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    assignmentTab === tab ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={assignmentSearch}
                onChange={(e) => setAssignmentSearch(e.target.value)}
                placeholder="Search assignments..."
                className="bg-[#121214] text-white text-xs rounded-xl pl-9 pr-3 py-1.5 border border-white/5 focus:border-brand-cyan outline-none"
              />
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="rounded-xl border border-white/5 overflow-x-auto bg-[#121214]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                <th className="p-3 pl-4">Contract ID</th>
                <th className="p-3">Client Information</th>
                <th className="p-3">Assigned Vehicle</th>
                <th className="p-3">Contract Dates</th>
                <th className="p-3">Daily Rate</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                    {isLoading ? "Loading assignment records..." : "No assignment contracts found."}
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((a) => {
                  const isActive = (a.status || "").toLowerCase() === "active";
                  return (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 pl-4 font-mono font-bold text-gray-400">
                        #{a.id}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">
                            {a.client?.name || "Corporate Client"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {a.client?.governmentId || a.client?.email || ""}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">
                            {a.vehicle?.make} {a.vehicle?.model}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono uppercase">
                            {a.vehicle?.licensePlate || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-300">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span>{a.startDate ? new Date(a.startDate).toLocaleDateString() : "Active"}</span>
                          {a.endDate && (
                            <>
                              <ArrowRight size={10} className="text-gray-500" />
                              <span>{new Date(a.endDate).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">
                        LKR {Number(a.dailyRate || 0).toLocaleString()} / day
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {a.status || "Active"}
                        </span>
                      </td>
                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isActive && (
                            <button
                              onClick={() => handleCompleteAssignment(a.id)}
                              title="Complete / Return Vehicle"
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-gray-300 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <RotateCcw size={11} />
                              <span>Return</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAssignment(a.id)}
                            title="Delete Assignment Contract"
                            className="p-1 rounded-lg hover:bg-rose-500/20 text-gray-500 hover:text-rose-400 transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
