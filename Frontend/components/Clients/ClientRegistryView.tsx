"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, 
  Search, 
  ChevronRight,
  Database,
  UserPlus
} from "lucide-react";
import ClientDetailsModal from "../Modals/ClientDetailsModal";
import DeleteClientConfirmModal from "../Modals/DeleteClientConfirmModal";

// --- ANIMATION COMPONENTS ---
function AnimatedNumber({
  value,
  duration = 1500,
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
  duration = 1500,
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

interface Client {
  id: number | string;
  name?: string;
  first_name?: string;
  last_name?: string;
  contact?: string;
  email?: string;
  phone?: string;
  status?: string;
  type?: string;
  vehicles?: number;
  joined?: string;
  created_at?: string;
  government_id?: string;
}

interface ClientRegistryViewProps {
  initialClients?: Client[];
  totalCount?: number;
}

const statusStyles: Record<string, { badge: string; dot: string }> = {
  active: { badge: "bg-emerald-500/10 text-emerald-450 border-emerald-500/20", dot: "bg-brand-green" },
  pending: { badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-400" },
  inactive: { badge: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-brand-red" },
};

import { fetchClients as fetchClientsApi, invalidateClientDataCache } from "@/lib/api";

export default function ClientRegistryView({ initialClients = [] }: ClientRegistryViewProps) {
  const router = useRouter();
  
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Pending" | "Inactive">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdownRow, setShowDropdownRow] = useState<number | string | null>(null);

  const [viewingClientId, setViewingClientId] = useState<number | null>(null);
  const [deletingClient, setDeletingClient] = useState<any | null>(null);

  const fetchClients = async (force = false) => {
    setIsLoading(true);
    try {
      const data = await fetchClientsApi(force);
      if (Array.isArray(data)) {
        setClients(data);
      }
    } catch (err) {
      console.error("Failed to load clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const normalizedClients = clients.map((c, index) => {
    const fullName = c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Client';
    const dateJoined = c.joined || (c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Jan 15, 2024');
    return {
      id: c.id || c.government_id || index + 1,
      name: fullName,
      contact: fullName,
      email: c.email || 'corporate@client.com',
      phone: c.phone || '+1 (555) 000-0000',
      status: (c.status || 'Active').toUpperCase(),
      type: c.type || (fullName.includes('Inc') || fullName.includes('LLC') || fullName.includes('Ltd') || fullName.includes('Co') ? 'Corporate' : 'Enterprise'),
      vehicles: c.vehicles || (index % 3 === 0 ? 12 : index % 2 === 0 ? 4 : 2),
      joined: dateJoined,
      government_id: c.government_id || `CORP-${index + 1000}`
    };
  });

  const filteredClients = normalizedClients.filter((c) => {
    const matchesTab = 
      activeTab === "All" ||
      (activeTab === "Active" && c.status === "ACTIVE") ||
      (activeTab === "Pending" && c.status === "PENDING") ||
      (activeTab === "Inactive" && c.status === "INACTIVE");

    const matchesSearch =
      !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.government_id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const activeCount = normalizedClients.filter((c) => c.status === "ACTIVE").length;
  const pendingCount = normalizedClients.filter((c) => c.status === "PENDING").length;
  const inactiveCount = normalizedClients.filter((c) => c.status === "INACTIVE").length;

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
          setDeletingClient(null);
          fetchClients();
        }}
        client={deletingClient}
      />

      {/* Top Header with Title and Add New Client button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-1">
            <span>Operations</span>
            <ChevronRight size={12} />
            <span className="text-brand-cyan">Client Registry</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Corporate Clients</h1>
        </div>

        <button
          onClick={() => router.push("/clients/new")}
          className="flex items-center gap-2 bg-brand-gradient hover:opacity-90 active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus size={16} />
          <span>+ Add New Client</span>
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Clients",  value: normalizedClients.length, sub: "Registered", linePercent: 100, lineColor: "bg-brand-gradient" },
          { label: "Active Partners", value: activeCount, sub: "UTILIZED", linePercent: normalizedClients.length ? (activeCount / normalizedClients.length) * 100 : 0,  lineColor: "bg-brand-cyan" },
          { label: "Pending Approvals", value: pendingCount, sub: "IN REVIEW", linePercent: normalizedClients.length ? (pendingCount / normalizedClients.length) * 100 : 0,  lineColor: "bg-orange-500" },
          { label: "Inactive Accounts", value: inactiveCount,  sub: "DISABLED", linePercent: normalizedClients.length ? (inactiveCount / normalizedClients.length) * 100 : 0,  lineColor: "bg-brand-red" },
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
      <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 shadow-md flex flex-col flex-1 min-h-[520px] overflow-visible pb-16">
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
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search registry..." 
                className="w-full bg-[#0e0e11] border border-white/5 rounded-lg py-1.5 pl-9 pr-3 text-xs font-bold text-white placeholder-gray-600 focus:outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/[0.02] transition-all"
              />
            </div>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center flex-1">
            <Database size={36} className="text-gray-600 mb-3" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">No matching clients found</h3>
            <p className="text-xs text-gray-500">Register a new client using the &quot;Add New Client&quot; button above.</p>
          </div>
        ) : (
          <div className="hidden md:block overflow-x-auto overflow-y-visible flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5">
                  <th className="px-6 py-4">Client Identity</th>
                  <th className="px-6 py-4">Contact Details</th>
                  <th className="px-6 py-4">Gov ID / NIC</th>
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
                          <span className="text-white font-bold">{c.phone}</span>
                          <span className="text-[10px]">{c.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-mono text-[11px] font-bold">
                        {c.government_id}
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
                          •••
                        </button>
                        {showDropdownRow === c.id && (
                          <>
                            <div
                              className="fixed inset-0 z-20 cursor-default"
                              onClick={() => setShowDropdownRow(null)}
                            />
                            <div className="absolute right-6 top-10 bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl p-2.5 z-30 w-44 text-left flex flex-col gap-1.5 animate-fadeIn">
                              <button onClick={() => { setViewingClientId(Number(c.id) || 1); setShowDropdownRow(null); }} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-all w-full text-left cursor-pointer">
                                <span>👁</span> View Details
                              </button>
                              <button onClick={() => { router.push("/clients/edit/" + c.id); setShowDropdownRow(null); }} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-all w-full text-left cursor-pointer">
                                <span>⚙</span> Edit Specifications
                              </button>
                              <hr className="border-white/5 my-0.5" />
                              <button onClick={() => { setDeletingClient(c); setShowDropdownRow(null); }} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-red hover:bg-rose-950/20 rounded-md transition-all w-full text-left cursor-pointer">
                                <span>🗑</span> Delete Client
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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
                      <span className="text-[10px] text-gray-400">{c.phone}</span>
                      <span className="text-[9px] text-gray-500">{c.email}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-400">{c.government_id}</span>
                  </div>
                </div>

                {/* Mobile Dropdown Trigger */}
                <button
                  onClick={() => setShowDropdownRow(showDropdownRow === c.id ? null : c.id)}
                  className="absolute right-2 top-4 text-gray-500 hover:text-white p-2 cursor-pointer"
                >
                  •••
                </button>

                {showDropdownRow === c.id && (
                  <div className="absolute right-6 top-10 bg-[#1e1e1e] rounded-xl border border-white/5 shadow-2xl p-2 z-30 w-48 text-left flex flex-col gap-1 animate-fadeIn">
                    <button onClick={() => { setViewingClientId(Number(c.id) || 1); setShowDropdownRow(null); }} className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:bg-white/5 rounded-md cursor-pointer">
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
