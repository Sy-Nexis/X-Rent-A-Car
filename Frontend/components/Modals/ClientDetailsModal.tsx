"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Hash,
  Car,
  Calendar,
  Activity,
  ShieldCheck,
  Loader2
} from "lucide-react";

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

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number | null;
}

export default function ClientDetailsModal({ isOpen, onClose, clientId }: ClientDetailsModalProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && clientId) {
      fetchDetails();
    } else {
      setClient(null);
      setError(null);
    }
  }, [isOpen, clientId]);

  const fetchDetails = async () => {
    if (!clientId) return;

    setLoading(true);
    setError(null);

    try {
      const url = `http://localhost:8801/api/clients/view/${clientId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Server Error (${response.status})`);
      }

      const result = await response.json();

      if (result.success) {
        setClient(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch client details.");
      }
    } catch (err: any) {
      // Mock Fallback
      if (clientId >= 1 && clientId <= 6) {
        const MOCK = [
          { id: 1, first_name: "John", last_name: "Doe", email: "john@alphalogistics.com", phone: "+1 (555) 019-8234", address: "123 Alpha St", city: "New York", state: "NY", zip_code: "10001", government_id: "CORP-9234", license_number: "LIC-1234", status: "ACTIVE" },
          { id: 2, first_name: "Sarah", last_name: "Smith", email: "sarah@globalfreight.com", phone: "+1 (555) 023-4451", address: "456 Freight Blvd", city: "Los Angeles", state: "CA", zip_code: "90001", government_id: "CORP-4451", license_number: "LIC-5678", status: "PENDING" },
          { id: 3, first_name: "Mike", last_name: "Johnson", email: "mike@apex.com", phone: "+1 (555) 045-6672", address: "789 Apex Way", city: "Chicago", state: "IL", zip_code: "60001", government_id: "CORP-6672", license_number: "LIC-9012", status: "ACTIVE" },
          { id: 4, first_name: "Emma", last_name: "Davis", email: "emma@nexustrans.com", phone: "+1 (555) 078-9933", address: "101 Nexus Rd", city: "Houston", state: "TX", zip_code: "77001", government_id: "CORP-9933", license_number: "LIC-3456", status: "INACTIVE" },
          { id: 5, first_name: "Robert", last_name: "Chen", email: "robert@primemovers.com", phone: "+1 (555) 112-3490", address: "202 Prime Ave", city: "Phoenix", state: "AZ", zip_code: "85001", government_id: "CORP-3490", license_number: "LIC-7890", status: "ACTIVE" },
          { id: 6, first_name: "Lisa", last_name: "Wong", email: "lisa@velocitycourier.com", phone: "+1 (555) 887-6521", address: "303 Velocity Ln", city: "Philadelphia", state: "PA", zip_code: "19019", government_id: "CORP-6521", license_number: "LIC-1122", status: "ACTIVE" },
        ];
        const mc = MOCK.find(m => m.id === Number(clientId));
        if (mc) {
          setClient(mc as any);
          setError(null);
          return;
        }
      }
      setError(err.message || "Failed to connect to the registry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-[#0e0e11] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto"
          >
            <div className="w-full md:w-2/5 bg-[#1e1e1e] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan mb-6">
                  <Building2 size={32} />
                </div>
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-white/5 rounded-lg w-3/4" />
                    <div className="h-4 bg-white/5 rounded-lg w-1/2" />
                  </div>
                ) : client ? (
                  <>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2">
                      {client.first_name} {client.last_name}
                    </h2>
                    <p className="text-brand-cyan font-bold uppercase tracking-widest text-xs">
                      Registry ID: {client.id}
                    </p>
                  </>
                ) : null}
              </div>

              <div className="mt-8 md:mt-0">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span>Verified Entity</span>
                </div>
                <div className="p-4 bg-[#0e0e11] rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${client?.status.toLowerCase() === 'active' ? 'bg-green-500' : client?.status.toLowerCase() === 'pending' ? 'bg-orange-500' : 'bg-red-500'} animate-pulse`} />
                    <span className="text-sm font-black uppercase">{client?.status || '---'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-3/5 p-8 overflow-y-auto custom-scrollbar">
              <div className="flex justify-end mb-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400"
                >
                  <X size={24} />
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-brand-cyan" size={40} />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fetching Latest Data...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-500 font-bold uppercase text-xs tracking-widest">
                  {error}
                </div>
              ) : client ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <DetailCard icon={<Mail size={18} />} label="Email" value={client.email} />
                  <DetailCard icon={<Phone size={18} />} label="Phone" value={client.phone} />
                  <DetailCard icon={<MapPin size={18} />} label="City" value={`${client.city}, ${client.state}`} />
                  <DetailCard icon={<Hash size={18} />} label="Zip Code" value={client.zip_code} isMono />
                  
                  <div className="col-span-full mt-2 p-5 bg-[#1e1e1e] rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2 text-gray-400">
                      <MapPin size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Full Address</span>
                    </div>
                    <p className="text-sm font-bold text-white">{client.address}, {client.city}, {client.state} {client.zip_code}</p>
                  </div>

                  <div className="col-span-full mt-2 p-5 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest mb-1">Government ID</p>
                        <p className="text-xs font-mono font-bold tracking-tighter break-all">{client.government_id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest mb-1">License No.</p>
                        <p className="text-xs font-mono font-bold tracking-tighter break-all">{client.license_number}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function DetailCard({ icon, label, value, isMono = false, highlight = false }: any) {
  return (
    <div className={`p-5 rounded-3xl border border-white/5 ${highlight ? 'bg-[#1e1e1e] shadow-lg ring-1 ring-blue-500/20' : 'bg-[#1e1e1e]'}`}>
      <div className="flex items-center gap-3 mb-2 text-gray-400">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-sm font-black ${isMono ? 'font-mono tracking-widest' : ''} ${highlight ? 'text-brand-cyan' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
