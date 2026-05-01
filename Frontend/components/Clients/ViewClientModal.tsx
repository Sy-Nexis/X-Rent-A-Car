"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Fingerprint, 
  CreditCard, 
  ShieldCheck, 
  Calendar,
  Globe,
  Navigation,
  Hash
} from "lucide-react";

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

interface ViewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

// --- MAIN COMPONENT ---
export default function ViewClientModal({ isOpen, onClose, client }: ViewClientModalProps) {
  if (!isOpen || !client) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 overflow-y-auto custom-scrollbar">
        {/* BACKDROP */}
        <motion.div
          key="view-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-2xl"
        />

        {/* MODAL CONTAINER */}
        <motion.div
          key="view-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[#1c1c1e] rounded-[40px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* HEADER SECTION: THE ID CARD */}
          <section className="bg-[#2c2c2e]/50 p-10 md:p-14 border-b border-white/5 relative overflow-hidden">
             {/* DECORATIVE AMBIENT BLOW */}
             <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
             
             <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
                {/* AVATAR */}
                <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
                  <User size={64} />
                </div>

                {/* CORE IDENTITY */}
                <div className="flex-1 text-center md:text-left space-y-4">
                   <div className="space-y-1">
                      <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
                        {client.first_name} <span className="text-[#6e6e73]">{client.last_name}</span>
                      </h2>
                      <p className="text-[#86868b] font-medium text-lg uppercase tracking-widest mt-2">Certified Fleet Member</p>
                   </div>
                   
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[#6e6e73]">
                      <div className="flex items-center gap-2 text-sm font-bold">
                         <Mail size={16} className="text-blue-500" />
                         {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold">
                         <Phone size={16} className="text-blue-500" />
                         {client.phone}
                      </div>
                   </div>
                </div>

                {/* STATUS PILL */}
                <div className="absolute top-0 right-0 md:relative">
                   <div className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl ${
                      client.status === 'Active' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-green-500/10' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/10'
                   }`}>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${client.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {client.status}
                   </div>
                </div>
             </div>

             {/* CLOSE BUTTON */}
             <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[#6e6e73] hover:text-white transition-all z-[100]"
             >
                <X size={20} />
             </button>
          </section>

          {/* DATA GRID: THE SPECS */}
          <section className="p-10 md:p-14 space-y-12">
             
             {/* IDENTITY VERIFICATION */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <ShieldCheck size={18} className="text-blue-500" />
                   <h4 className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Identity Verification</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <DataCard icon={<Fingerprint size={16}/>} label="Government ID (NIC)" value={client.government_id} color="blue" />
                   <DataCard icon={<CreditCard size={16}/>} label="Driving License" value={client.license_number} color="blue" />
                </div>
             </div>

             {/* RESIDENTIAL ADDRESS */}
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <MapPin size={18} className="text-blue-500" />
                   <h4 className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.4em]">Residential Data</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <DataCard icon={<Navigation size={16}/>} label="Full Address" value={client.address} className="md:col-span-2" />
                   <DataCard icon={<Globe size={16}/>} label="City / State" value={`${client.city}, ${client.state}`} />
                   <DataCard icon={<Hash size={16}/>} label="Postal Code" value={client.zip_code} />
                   <DataCard icon={<Calendar size={16}/>} label="Account Created" value={client.created_at ? new Date(client.created_at).toLocaleDateString() : "N/A"} className="md:col-span-2" />
                </div>
             </div>
          </section>

          {/* FOOTER ACTION */}
          <footer className="px-14 py-10 bg-black/20 border-t border-white/5 flex items-center justify-between">
             <p className="text-[9px] font-black text-[#424245] uppercase tracking-[0.4em]">XNRENT SECURE DATA ACCESS PROTOCOL // {client.government_id}</p>
             <button 
                onClick={onClose}
                className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-xl"
             >
                Close Profile
             </button>
          </footer>

        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </AnimatePresence>
  );
}

// --- HELPER COMPONENT ---

function DataCard({ icon, label, value, className = "", color = "default" }: any) {
  return (
    <div className={`p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/[0.06] transition-all group ${className}`}>
      <div className="flex items-center gap-2 mb-3 opacity-50 group-hover:opacity-100 transition-opacity">
        <div className={color === 'blue' ? 'text-blue-500' : 'text-[#86868b]'}>{icon}</div>
        <span className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold text-white tracking-tight">{value || "NOT PROVIDED"}</p>
    </div>
  );
}
