"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, 
  Mail, 
  Phone, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Filter,
  Car,
  ChevronRight,
  Database
} from "lucide-react";
import ClientDetailsModal from "../Modals/ClientDetailsModal";
import DeleteClientConfirmModal from "../Modals/DeleteClientConfirmModal";

// --- ANIMATION COMPONENTS FROM FLEET ---
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

interface ClientRegistryViewProps {
  totalCount?: number;
}

const MOCK_CLIENTS = [
  { id: 1, name: "Alpha Logistics Inc.", contact: "John Doe", first_name: "John", last_name: "Doe", email: "john@alphalogistics.com", phone: "+1 (555) 019-8234", status: "ACTIVE", type: "Corporate", vehicles: 12, joined: "Jan 15, 2024", government_id: "CORP-9234" },
  { id: 2, name: "Global Freight Co.", contact: "Sarah Smith", first_name: "Sarah", last_name: "Smith", email: "sarah@globalfreight.com", phone: "+1 (555) 023-4451", status: "PENDING", type: "Enterprise", vehicles: 4, joined: "Feb 28, 2024", government_id: "CORP-4451" },
  { id: 3, name: "Apex Deliveries", contact: "Mike Johnson", first_name: "Mike", last_name: "Johnson", email: "mike@apex.com", phone: "+1 (555) 045-6672", status: "ACTIVE", type: "Small Business", vehicles: 2, joined: "Mar 10, 2024", government_id: "CORP-6672" },
  { id: 4, name: "Nexus Transport Ltd.", contact: "Emma Davis", first_name: "Emma", last_name: "Davis", email: "emma@nexustrans.com", phone: "+1 (555) 078-9933", status: "INACTIVE", type: "Corporate", vehicles: 0, joined: "Nov 05, 2023", government_id: "CORP-9933" },
  { id: 5, name: "Prime Movers LLC", contact: "Robert Chen", first_name: "Robert", last_name: "Chen", email: "robert@primemovers.com", phone: "+1 (555) 112-3490", status: "ACTIVE", type: "Enterprise", vehicles: 28, joined: "Apr 02, 2024", government_id: "CORP-3490" },
  { id: 6, name: "Velocity Courier Services", contact: "Lisa Wong", first_name: "Lisa", last_name: "Wong", email: "lisa@velocitycourier.com", phone: "+1 (555) 887-6521", status: "ACTIVE", type: "Small Business", vehicles: 5, joined: "May 18, 2024", government_id: "CORP-6521" }
];

const statusStyles: any = {
  active: { badge: "bg-emerald-500/10 text-emerald-450 border-emerald-500/20", dot: "bg-brand-green" },
  pending: { badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-400" },
  inactive: { badge: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-brand-red" },
};

export default function ClientRegistryView({ totalCount }: ClientRegistryViewProps) {
  const router = useRouter();
  
  const [hasClients, setHasClients] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Pending" | "Inactive">("All");
  const [showDropdownRow, setShowDropdownRow] = useState<number | null>(null);

  const [viewingClientId, setViewingClientId] = useState<number | null>(null);
  const [deletingClient, setDeletingClient] = useState<any | null>(null);

  if (!hasClients) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative flex flex-col justify-between bg-[#0e0e11]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-6">
            <span>System</span>
            <ChevronRight size={12} />
            <span className="text-brand-cyan">Client Registry</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
            <div className="lg:col-span-2 bg-[#1e1e1e] rounded-[32px] border border-white/5 p-12 shadow-md min-h-[460px] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-[24px] bg-white/5 flex items-center justify-center text-brand-cyan mb-6">
                <Database size={40} />
              </div>
              <h2 className="text-2xl font-black uppercase text-white mb-3 tracking-tight">client registry empty</h2>
              <p className="text-xs text-gray-400 font-bold leading-relaxed max-w-md mb-8">
                No logistics partners or client accounts have been registered in the system. Establish your first connection to begin managing fleet assignments and delivery routes.
              </p>
              <button
                onClick={() => router.push('/clients/new')}
                className="flex items-center gap-2 bg-brand-gradient hover:opacity-90 text-white text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                + Enter Client
              </button>
            </div>
            <div className="space-y-6">
              <div className="bg-[#1e1e1e] rounded-[24px] border border-white/5 p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Registry Metrics</span>
                </div>
                <div className="py-2">
                  <span className="text-5xl font-black text-white/10 block mb-1">0</span>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-6">Active Accounts</span>
                </div>
                <div className="border-t border-white/5 pt-4">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-3">
                    <div className="bg-brand-gradient h-full w-0" />
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block">
                    Utilization: 0% Capacity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- POPULATED STATE (TABLE LAYOUT) ---

  const filteredClients = MOCK_CLIENTS.filter((c) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return c.status?.toLowerCase() === "active";
    if (activeTab === "Pending") return c.status?.toLowerCase() === "pending";
    if (activeTab === "Inactive") return c.status?.toLowerCase() === "inactive";
    return true;
  });

  const activeCount = MOCK_CLIENTS.filter((c) => c.status?.toLowerCase() === "active").length;
  const pendingCount = MOCK_CLIENTS.filter((c) => c.status?.toLowerCase() === "pending").length;
  const inactiveCount = MOCK_CLIENTS.filter((c) => c.status?.toLowerCase() === "inactive").length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar flex flex-col gap-6 bg-[#0e0e11] relative">
      
      <ClientDetailsModal 
        isOpen={!!viewingClientId}
        onClose={() => setViewingClientId(null)}
        clientId={viewingClientId}
      />

      <DeleteClientConfirmModal
        isOpen={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        onConfirm={() => {
          // Handle client deletion success logic here
          setDeletingClient(null);
          router.refresh();
        }}
        client={deletingClient}
      />

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Clients",  value: MOCK_CLIENTS.length, sub: "Registered", linePercent: 100, lineColor: "bg-brand-gradient" },
          { label: "Active Partners", value: activeCount, sub: "UTILIZED", linePercent: MOCK_CLIENTS.length ? (activeCount/MOCK_CLIENTS.length)*100 : 0,  lineColor: "bg-brand-cyan" },
          { label: "Pending Approvals", value: pendingCount, sub: "IN REVIEW", linePercent: MOCK_CLIENTS.length ? (pendingCount/MOCK_CLIENTS.length)*100 : 0,  lineColor: "bg-orange-500" },
          { label: "Inactive Accounts", value: inactiveCount,  sub: "DISABLED", linePercent: MOCK_CLIENTS.length ? (inactiveCount/MOCK_CLIENTS.length)*100 : 0,  lineColor: "bg-brand-red" },
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
              <span className={`text-[10px] font-bold ${card.sub === "UTILIZED" ? "text-brand-green" : card.sub === "DISABLED" ? "text-brand-red" : card.sub === "IN REVIEW" ? "text-orange-500" : "text-gray-500"}`}>
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
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 shadow-md flex flex-col overflow-visible pb-20 md:pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/5 gap-4">
          <h2 className="text-base font-black text-white tracking-tight">
            Corporate Client Registry
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Filter Tabs */}
            <div className="flex bg-[#0e0e11] p-0.5 rounded-lg border border-white/5">
              {(["All", "Active", "Pending", "Inactive"] as const).map((tab) => (
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
            
            {/* Search Input inside the header */}
            <div className="relative w-full sm:w-64 hidden xl:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search registry..." 
                className="w-full bg-[#0e0e11] border border-white/5 rounded-lg py-1.5 pl-9 pr-3 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/[0.02] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5">
                <th className="px-6 py-4">Client Identity</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4">Active Assets</th>
                <th className="px-6 py-4">Date Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 overflow-visible">
              {filteredClients.map((c) => {
                const style = statusStyles[c.status.toLowerCase()] || { badge: "bg-white/5 text-gray-400 border-white/10", dot: "bg-gray-500" };
                return (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors text-xs font-semibold text-gray-300 relative overflow-visible">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-brand-cyan">
                          <Building2 size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-white text-sm">{c.name}</span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{c.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-white font-bold">{c.contact}</span>
                        <span className="text-[10px]">{c.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car size={14} className="text-gray-500" />
                        <span className="text-white font-bold">{c.vehicles} <span className="text-gray-500 font-bold text-[10px]">Units</span></span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-bold">
                      {c.joined}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${style.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative overflow-visible">
                      <button
                        onClick={() => setShowDropdownRow(showDropdownRow === c.id ? null : c.id)}
                        className="text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {showDropdownRow === c.id && (
                        <div className="absolute right-6 top-10 bg-[#1e1e1e] rounded-xl border border-white/5 shadow-2xl p-2.5 z-30 w-44 text-left flex flex-col gap-1.5 animate-fadeIn">
                          <button onClick={() => { setViewingClientId(c.id); setShowDropdownRow(null); }} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-all w-full text-left cursor-pointer">
                            <span>👁</span> View Details
                          </button>
                          <button onClick={() => router.push("/clients/edit/" + c.id)} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-all w-full text-left cursor-pointer">
                            <span>⚙</span> Edit Specifications
                          </button>
                          <hr className="border-white/5 my-0.5" />
                          <button onClick={() => { setDeletingClient(c); setShowDropdownRow(null); }} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-red hover:bg-rose-950/20 rounded-md transition-all w-full text-left cursor-pointer">
                            <span>🗑</span> Delete Client
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

        {/* MOBILE VIEW */}
        <div className="md:hidden divide-y divide-white/5">
          {filteredClients.map((c) => {
            const style = statusStyles[c.status.toLowerCase()] || { badge: "bg-white/5 text-gray-400 border-white/10", dot: "bg-gray-500" };
            return (
              <div key={c.id} className="p-4 flex items-start gap-3 relative">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-brand-cyan flex-shrink-0 text-lg">
                  <Building2 size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-white truncate">{c.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border flex-shrink-0 ${style.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-500 font-bold">{c.type}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400">{c.contact}</span>
                      <span className="text-[9px] text-gray-500">{c.email}</span>
                    </div>
                    <span className="text-xs font-black text-white">{c.vehicles} <span className="text-[9px] text-gray-500">Units</span></span>
                  </div>
                </div>

                {/* Mobile Dropdown Trigger */}
                <button
                  onClick={() => setShowDropdownRow(showDropdownRow === c.id ? null : c.id)}
                  className="absolute right-2 top-4 text-gray-500 hover:text-white p-2 cursor-pointer"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Mobile Dropdown Menu */}
                {showDropdownRow === c.id && (
                  <div className="absolute right-6 top-10 bg-[#1e1e1e] rounded-xl border border-white/5 shadow-2xl p-2 z-30 w-48 text-left flex flex-col gap-1 animate-fadeIn">
                    <button onClick={() => { setViewingClientId(c.id); setShowDropdownRow(null); }} className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:bg-white/5 rounded-md cursor-pointer">
                      View Details
                    </button>
                    <button onClick={() => router.push("/clients/edit/" + c.id)} className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:bg-white/5 rounded-md cursor-pointer">
                      Edit Specs
                    </button>
                    <hr className="border-white/5 my-1" />
                    <button onClick={() => { setDeletingClient(c); setShowDropdownRow(null); }} className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-brand-red hover:bg-rose-950/20 rounded-md cursor-pointer">
                      Delete Client
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
