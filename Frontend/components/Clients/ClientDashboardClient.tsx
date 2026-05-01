"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  SearchX,
  Fingerprint,
  CreditCard,
  User
} from "lucide-react";
import Link from "next/link";
import ViewClientModal from "./ViewClientModal";
import DeleteClientConfirmModal from "../Modals/DeleteClientConfirmModal";

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
  created_at?: string;
}

interface ClientDashboardClientProps {
  initialClients: Client[];
}

// --- MAIN CLIENT COMPONENT ---
export default function ClientDashboardClient({ initialClients }: ClientDashboardClientProps) {
  const [clients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  // Modal States
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // --- FILTERING LOGIC ---
  const filteredClients = clients.filter((client) => {
    const matchesSearch = `${client.first_name} ${client.last_name} ${client.email} ${client.phone}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Close menu on outside click
  useEffect(() => {
    const close = () => setActiveMenu(null);
    if (activeMenu !== null) document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [activeMenu]);

  return (
    <div className="space-y-8">
      
      {/* ACTION BAR: SEARCH & STATUS FILTERS */}
      <div className="bg-[#2c2c2e]/50 backdrop-blur-xl border border-white/5 rounded-[32px] p-4 flex flex-col lg:flex-row items-center gap-6 shadow-2xl">
         {/* SEARCH INPUT */}
         <div className="relative flex-1 w-full group">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6e6e73] group-focus-within:text-blue-500 transition-colors" />
            <input 
               type="text"
               placeholder="Search by name, email or mobile..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-black/20 border border-transparent rounded-2xl py-4 pl-14 pr-6 text-sm text-white placeholder-[#6e6e73] outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
         </div>

         {/* STATUS FILTERS */}
         <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/5 w-full lg:w-auto">
            {["All", "Active", "Inactive", "Blacklisted"].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     statusFilter === tab 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                        : 'text-[#6e6e73] hover:text-white'
                  }`}
               >
                  {tab}
               </button>
            ))}
         </div>
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                     <th className="px-10 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Identity</th>
                     <th className="px-8 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Contact</th>
                     <th className="px-8 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Location</th>
                     <th className="px-8 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">License Specs</th>
                     <th className="px-8 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Status</th>
                     <th className="px-10 py-8 text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em] text-right">Actions</th>
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
                           className="group border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors relative"
                        >
                           {/* IDENTITY */}
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-5">
                                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-600/20">
                                    {client.first_name[0]}{client.last_name[0]}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                       {client.first_name} {client.last_name}
                                    </span>
                                    <span className="text-[11px] font-medium text-[#6e6e73] flex items-center gap-1.5 uppercase tracking-tighter mt-1">
                                       <Mail size={12} className="opacity-50" />
                                       {client.email}
                                    </span>
                                 </div>
                              </div>
                           </td>

                           {/* CONTACT */}
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2 text-xs font-bold text-[#86868b]">
                                 <Phone size={14} className="text-blue-500" />
                                 {client.phone}
                              </div>
                           </td>

                           {/* LOCATION */}
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2 text-xs font-bold text-white">
                                 <MapPin size={14} className="text-[#6e6e73]" />
                                 {client.city}, {client.state}
                              </div>
                           </td>

                           {/* LICENSE BADGE */}
                           <td className="px-8 py-6">
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl">
                                 <CreditCard size={12} className="text-blue-500" />
                                 <span className="text-[10px] font-mono font-black text-[#86868b] uppercase tracking-widest">
                                    {client.license_number}
                                 </span>
                              </div>
                           </td>

                           {/* STATUS PILL */}
                           <td className="px-8 py-6">
                              <StatusPill status={client.status} />
                           </td>

                           {/* ACTIONS */}
                           <td className="px-10 py-6 text-right relative">
                              <button 
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(activeMenu === client.id ? null : client.id);
                                 }}
                                 className={`p-3 rounded-xl transition-all ${activeMenu === client.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40' : 'text-[#6e6e73] hover:text-white hover:bg-white/5'}`}
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
                                       className="absolute right-10 top-20 w-60 bg-[#2c2c2e] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden text-left"
                                    >
                                       <div className="p-2 space-y-1">
                                          <MenuAction 
                                             icon={<Eye size={16}/>} 
                                             label="View Profile" 
                                             onClick={() => { setViewingClient(client); setIsViewOpen(true); }} 
                                          />
                                          <Link href={`/clients/edit/${client.government_id}`}>
                                             <MenuAction icon={<Edit3 size={16}/>} label="Edit Identity" />
                                          </Link>
                                          <div className="h-px bg-white/5 my-2" />
                                          <MenuAction 
                                             icon={<Trash2 size={16}/>} 
                                             label="Remove Record" 
                                             variant="danger" 
                                             onClick={() => { setDeletingClient(client); setIsDeleteOpen(true); }} 
                                          />
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

            {/* EMPTY SEARCH STATE */}
            {filteredClients.length === 0 && (
               <div className="py-40 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-[#424245] mb-8">
                     <SearchX size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">No Clients Detected</h3>
                  <p className="text-[#6e6e73] text-sm mt-3 max-w-xs uppercase font-black tracking-[0.2em] leading-loose">
                     The current search criteria did not match any records in the secure registry.
                  </p>
               </div>
            )}
         </div>
      </div>

      {/* INTEGRATED MODALS */}
      <ViewClientModal 
         isOpen={isViewOpen} 
         onClose={() => setIsViewOpen(false)} 
         client={viewingClient} 
      />
      <DeleteClientConfirmModal 
         isOpen={isDeleteOpen} 
         onClose={() => setIsDeleteOpen(false)} 
         client={deletingClient} 
         onConfirm={() => {}} 
      />

      <style jsx>{`
         .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
         .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}

// --- HELPERS ---

function StatusPill({ status }: { status: string }) {
   const colors: any = {
      Active: "text-green-500 bg-green-500/10 border-green-500/20",
      Inactive: "text-[#6e6e73] bg-white/5 border-white/5",
      Blacklisted: "text-[#ff453a] bg-red-500/10 border-red-500/20",
   };

   const dots: any = {
      Active: "bg-green-500",
      Inactive: "bg-[#6e6e73]",
      Blacklisted: "bg-[#ff453a]",
   };

   return (
      <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${colors[status] || colors.Inactive}`}>
         <div className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.Inactive} ${status === 'Active' ? 'animate-pulse' : ''}`} />
         {status}
      </div>
   );
}

function MenuAction({ icon, label, onClick, variant = "default" }: any) {
   return (
      <button
         onClick={onClick}
         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
            variant === 'danger' 
               ? 'text-[#ff453a] hover:bg-red-500/10' 
               : 'text-[#86868b] hover:text-white hover:bg-white/5'
         }`}
      >
         {icon}
         {label}
      </button>
   );
}
