"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MoreHorizontal, 
  Search, 
  Mail, 
  Phone, 
  User, 
  Trash2, 
  Eye, 
  Edit3,
  UserX,
  Plus
} from "lucide-react";
import Link from "next/link";
import UpdateClientModal from "./UpdateClientModal";

// --- TYPES ---
interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  government_id: string; 
  license_number: string;
  status: string;
  total_rentals?: number;
}

interface ClientListActionableProps {
  initialClients: Client[];
}

// --- MAIN COMPONENT ---
export default function ClientListActionable({ initialClients }: ClientListActionableProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  
  // Modal States
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Filtering Logic (Instant Search)
  const filteredClients = clients.filter((client) => {
    const searchStr = `${client.first_name} ${client.last_name} ${client.email} ${client.phone} ${client.government_id}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  // Handle clicking outside to close menu
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu !== null) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenu]);

  return (
    <div className="space-y-8">
      {/* 1. SEARCH & ACTIONS BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:w-[450px] group">
          <div className="absolute inset-y-0 left-5 flex items-center text-[#6e6e73] group-focus-within:text-blue-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by Name, Email, Phone or NIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white placeholder-[#6e6e73] outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all shadow-2xl shadow-black/20"
          />
        </div>

        <Link 
          href="/Admin/Client/Data"
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <Plus size={18} />
          Register New Client
        </Link>
      </div>

      {/* 2. CLIENT TABLE CONTAINER */}
      <div className="relative bg-white/[0.02] border border-white/5 rounded-[40px] shadow-2xl shadow-black/40 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar text-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-10 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.3em]">Client Identity</th>
                <th className="px-8 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.3em]">Contact & NIC</th>
                <th className="px-8 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.3em]">History</th>
                <th className="px-8 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.3em]">Status</th>
                <th className="px-10 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.3em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredClients.map((client) => (
                  <motion.tr
                    key={client.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group border-b border-white/[0.03] hover:bg-white/[0.01] transition-all relative"
                  >
                    {/* IDENTITY COLUMN */}
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                          {client.first_name[0]}{client.last_name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">
                            {client.first_name} {client.last_name}
                          </span>
                          <span className="text-[11px] font-medium text-[#6e6e73] mt-1 flex items-center gap-1.5 uppercase tracking-tighter">
                            <Mail size={12} />
                            {client.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT COLUMN */}
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#86868b]">
                          <Phone size={14} className="text-blue-500" />
                          {client.phone}
                        </div>
                        <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg w-fit">
                          <span className="text-[10px] font-mono font-black text-blue-500 tracking-widest uppercase">
                            {client.government_id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* HISTORY COLUMN */}
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">{client.total_rentals || 0}</span>
                        <span className="text-[9px] font-black text-[#6e6e73] uppercase tracking-widest mt-1">Total Rentals</span>
                      </div>
                    </td>

                    {/* STATUS COLUMN */}
                    <td className="px-8 py-6">
                      <StatusPill status={client.status} />
                    </td>

                    {/* ACTIONS COLUMN */}
                    <td className="px-10 py-6 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === client.id ? null : client.id);
                        }}
                        className={`p-3 rounded-xl transition-all ${
                          activeMenu === client.id ? "bg-blue-600 text-white" : "text-[#6e6e73] hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {/* DROPDOWN MENU */}
                      <AnimatePresence>
                        {activeMenu === client.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-10 top-20 w-60 bg-[#2c2c2e] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden"
                          >
                            <div className="p-2 space-y-1">
                              <MenuButton icon={<Eye size={16} />} label="View Profile" />
                              <MenuButton 
                                icon={<Edit3 size={16} />} 
                                label="Edit Details" 
                                onClick={() => {
                                  setSelectedClient(client);
                                  setIsUpdateModalOpen(true);
                                  setActiveMenu(null);
                                }}
                              />
                              <div className="h-px bg-white/5 my-2" />
                              <MenuButton icon={<UserX size={16} />} label="Ban Client" variant="danger" />
                              <MenuButton icon={<Trash2 size={16} />} label="Remove Record" variant="danger" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredClients.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-[#424245] mb-6">
                <UserX size={48} />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">No Clients Found</h3>
              <p className="text-[#6e6e73] text-sm mt-2 max-w-xs uppercase font-bold tracking-widest leading-relaxed">
                We couldn't find any matches for "{searchTerm}".
              </p>
            </div>
          )}
        </div>
      </div>

      {/* UPDATE MODAL INTEGRATION */}
      <UpdateClientModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        client={selectedClient}
        onActionComplete={() => {
           // Optionally refetch or let router.refresh handle it
        }}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatusPill({ status }: { status: string }) {
  const variants: any = {
    Active: "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
    Pending: "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]",
    Banned: "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
  };

  return (
    <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest w-fit flex items-center gap-2 ${variants[status] || variants.Pending}`}>
      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'Active' ? 'bg-green-500' : status === 'Banned' ? 'bg-red-500' : 'bg-orange-500'}`} />
      {status}
    </div>
  );
}

function MenuButton({ icon, label, variant = "default", onClick }: { icon: any; label: string; variant?: "default" | "danger"; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
        variant === "danger" 
          ? "text-red-500 hover:bg-red-500/10" 
          : "text-[#86868b] hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
