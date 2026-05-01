"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Fingerprint, 
  CreditCard,
  Save,
  Globe,
  Navigation,
  Hash
} from "lucide-react";
import { useRouter } from "next/navigation";

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
}

interface UpdateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onActionComplete: () => void;
}

interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  status: string;
}

// --- MAIN COMPONENT ---
export default function UpdateClientModal({ isOpen, onClose, client, onActionComplete }: UpdateClientModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<FormValues>();

  // Reset form whenever the active client changes
  useEffect(() => {
    if (client) {
      reset({
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        state: client.state,
        zip_code: client.zip_code,
        status: client.status,
      });
      setIsSuccess(false);
      setIsUpdating(false);
      setError(null);
    }
  }, [client, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!client) return;
    setIsUpdating(true);
    setError(null);

    try {
      // Endpoint mapping: http://localhost:5000/api/clients/update?government={id}
      const response = await fetch(`http://localhost:5000/api/clients/update?government=${client.government_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update client profile");
      }

      setIsSuccess(true);
      
      // Delay to show success state before closing
      setTimeout(() => {
        onActionComplete();
        onClose();
        router.refresh();
      }, 1500);

    } catch (error: any) {
      console.error("Update Error:", error);
      setError(error.message); // Assuming there's an error state
      setIsUpdating(false);
    }
  };

  if (!isOpen || !client) return null;

  return (
    <AnimatePresence>
      <div key="modal-overlay" className="fixed inset-0 z-[1000] flex items-center justify-center p-6 overflow-y-auto custom-scrollbar">
        {/* BACKDROP */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-2xl"
        />

        {/* MODAL CONTAINER */}
        <motion.div
          key="modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl bg-[#1c1c1e] rounded-[40px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row min-h-[700px]"
        >
          
          {/* LEFT PANEL: IDENTITY & LOCKED FIELDS (38%) */}
          <section className="w-full md:w-[38%] bg-[#1c1c1e] p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
            <div className="flex-1 space-y-10">
              {/* AVATAR & STATUS */}
              <div className="space-y-6">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
                  <User size={48} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">
                    {client.first_name} <br />
                    <span className="text-[#6e6e73]">{client.last_name}</span>
                  </h2>
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    {client.status}
                  </div>
                </div>
              </div>

              {/* LOCKED IDENTIFIERS */}
              <div className="space-y-4 pt-10">
                <p className="text-[10px] font-black text-[#424245] uppercase tracking-[0.3em]">Registry Identifiers</p>
                
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 opacity-60">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-blue-500">
                         <Fingerprint size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Gov ID / NIC</span>
                      </div>
                      <Lock size={12} className="text-[#424245]" />
                   </div>
                   <p className="text-sm font-mono font-black text-white tracking-widest">{client.government_id}</p>
                </div>

                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 opacity-60">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-blue-500">
                         <CreditCard size={16} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Driving License</span>
                      </div>
                      <Lock size={12} className="text-[#424245]" />
                   </div>
                   <p className="text-sm font-mono font-black text-white tracking-widest">{client.license_number}</p>
                </div>
              </div>
            </div>

            <div className="pt-12 text-[9px] font-black text-[#424245] uppercase tracking-widest leading-relaxed">
              Legal identifiers are locked once verified against the national registry.
            </div>
          </section>

          {/* RIGHT PANEL: EDITABLE FORM (62%) */}
          <section className="flex-1 bg-[#2c2c2e]/30 flex flex-col">
            {/* MODAL HEADER */}
            <div className="px-12 py-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                 <ShieldCheck size={18} className="text-blue-500" />
                 <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Profile Synchronization</span>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-[#6e6e73] hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* SCROLLABLE FORM AREA */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
               {/* ERROR NOTIFICATION */}
               <AnimatePresence>
                 {error && (
                   <motion.div
                     initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                     animate={{ height: "auto", opacity: 1, marginBottom: 32 }}
                     exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                     className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-xs font-medium"
                   >
                     <AlertCircle size={16} />
                     {error}
                   </motion.div>
                 )}
               </AnimatePresence>

               <form id="update-client-form" onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                  
                  {/* CONTACT INFO */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Personal Details</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <FormGroup label="First Name" icon={<User size={14}/>}>
                        <input {...register("first_name", { required: true })} className="input-field" />
                      </FormGroup>
                      <FormGroup label="Last Name" icon={<User size={14}/>}>
                        <input {...register("last_name", { required: true })} className="input-field" />
                      </FormGroup>
                      <FormGroup label="Email Address" icon={<Mail size={14}/>}>
                        <input {...register("email", { required: true })} className="input-field" />
                      </FormGroup>
                      <FormGroup label="Phone Number" icon={<Phone size={14}/>}>
                        <input {...register("phone", { required: true })} className="input-field" />
                      </FormGroup>
                    </div>
                  </div>

                  {/* ADDRESS INFO */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Residential Records</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <FormGroup label="Full Street Address" icon={<MapPin size={14}/>} className="col-span-2">
                        <input {...register("address")} className="input-field" />
                      </FormGroup>
                      <FormGroup label="City" icon={<Navigation size={14}/>}>
                        <input {...register("city")} className="input-field" />
                      </FormGroup>
                      <FormGroup label="State / Province" icon={<Globe size={14}/>}>
                        <input {...register("state")} className="input-field" />
                      </FormGroup>
                      <FormGroup label="Postal / Zip Code" icon={<Hash size={14}/>}>
                        <input {...register("zip_code")} className="input-field" />
                      </FormGroup>
                    </div>
                  </div>

                  {/* ADMIN STATUS */}
                  <div className="space-y-6 pb-12">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Registry Status</h4>
                    <FormGroup label="Onboarding Status" icon={<ShieldCheck size={14}/>}>
                      <select {...register("status")} className="input-field appearance-none cursor-pointer bg-transparent w-full outline-none">
                        <option value="Active" className="bg-[#1c1c1e]">Active</option>
                        <option value="Inactive" className="bg-[#1c1c1e]">Inactive</option>
                        <option value="Blacklisted" className="bg-[#1c1c1e]">Blacklisted</option>
                      </select>
                    </FormGroup>
                  </div>
               </form>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="px-12 py-8 border-t border-white/5 bg-black/20 flex items-center justify-between">
               <button 
                onClick={onClose}
                className="text-[10px] font-black text-[#6e6e73] hover:text-red-500 uppercase tracking-widest transition-colors"
               >
                Cancel Changes
               </button>

               <button
                form="update-client-form"
                type="submit"
                disabled={!isDirty || isUpdating || isSuccess}
                className={`
                  flex items-center gap-4 px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${!isDirty || isUpdating || isSuccess
                    ? 'bg-white/5 text-[#424245] cursor-not-allowed shadow-none'
                    : 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 active:scale-95'}
                `}
               >
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : isSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {isUpdating ? "Syncing Profile..." : isSuccess ? "Success" : "Update Client"}
               </button>
            </div>
          </section>

        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          color: white;
          font-size: 0.875rem;
          font-weight: 700;
          outline: none;
          padding: 0;
          margin-top: 0.5rem;
        }
      `}</style>
    </AnimatePresence>
  );
}

// --- HELPER COMPONENT ---

function FormGroup({ label, icon, children, className = "" }: any) {
  return (
    <div className={`p-6 bg-[#2c2c2e]/50 rounded-3xl border border-transparent focus-within:border-blue-500/30 transition-all group ${className}`}>
      <div className="flex items-center gap-2 mb-1 opacity-50 group-focus-within:opacity-100 transition-opacity">
        <span className="text-blue-500">{icon}</span>
        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">{label}</label>
      </div>
      {children}
    </div>
  );
}
