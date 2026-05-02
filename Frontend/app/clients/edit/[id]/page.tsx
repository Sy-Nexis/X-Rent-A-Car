"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Fingerprint,
  CreditCard,
  Save,
  Globe,
  Navigation,
  Hash,
  AlertCircle
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

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

// --- MAIN PAGE COMPONENT ---
export default function EditClientPage() {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<FormValues>();

  // 1. INITIAL DATA FETCH (Hydration)
  useEffect(() => {
    async function fetchClient() {
      try {
        setIsLoading(true);
        // Using government_id as the lookup ID (standard for XNRENT)
        const response = await fetch(`http://localhost:5001/api/clients/view/${id}`);

        if (!response.ok) {
          throw new Error(`Registry Error: Client with ID ${id} not found.`);
        }

        const result = await response.json();

        if (result.success) {
          const data = result.data;
          setClient(data);
          reset({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
            status: data.status,
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) fetchClient();
  }, [id, reset]);

  // 2. FORM SUBMISSION (Update Phase)
  const onSubmit = async (data: FormValues) => {
    if (!client) return;
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5001/api/clients/update?government=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update client profile in registry");
      }

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        router.refresh();
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDERING ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center">
        <Loader2 className="text-blue-600 animate-spin" size={48} />
      </div>
    );
  }

  if (error && !client) {
    return (
      <div className="min-h-screen bg-[#1c1c1e] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <AlertCircle size={64} className="text-red-500" />
        <h2 className="text-4xl font-black text-white tracking-tighter">Profile Access Error</h2>
        <p className="text-[#86868b] max-w-md">{error}</p>
        <button onClick={() => router.back()} className="px-8 py-4 bg-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-white">Return to Registry</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1c1c1e] text-white">
      {/* SUCCESS OVERLAY */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-blue-600/90 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-8">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl">
                <CheckCircle2 size={64} />
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-white">Registry Synchronized</h2>
              <p className="text-white/70 font-medium text-xl uppercase tracking-widest">Client profile updated successfully</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">

        {/* LEFT PANEL: IDENTITY & READ-ONLY (35%) */}
        <section className="w-full lg:w-[35%] bg-[#1c1c1e] border-r border-white/5 p-12 lg:p-20 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex-1 space-y-12">
            <Link href="/Admin/Client" className="inline-flex items-center gap-3 text-[10px] font-black text-[#6e6e73] hover:text-white uppercase tracking-[0.3em] transition-colors mb-10 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Registry
            </Link>

            <div className="space-y-8">
              <div className="w-28 h-28 rounded-[40px] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-2xl shadow-blue-600/40">
                <User size={56} />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">
                  {client?.first_name} <br />
                  <span className="text-[#6e6e73]">{client?.last_name}</span>
                </h1>
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  {client?.status}
                </div>
              </div>
            </div>

            {/* LOCKED FIELDS */}
            <div className="space-y-4 pt-10">
              <p className="text-[10px] font-black text-[#424245] uppercase tracking-[0.4em]">Primary Legal Identifiers</p>
              <LockedField icon={<Fingerprint size={16} />} label="NIC / Gov ID" value={client?.government_id} />
              <LockedField icon={<CreditCard size={16} />} label="Driving License" value={client?.license_number} />
            </div>
          </div>

          <div className="mt-12 p-8 bg-white/[0.02] rounded-3xl border border-white/5">
            <p className="text-[9px] font-black text-[#424245] uppercase tracking-[0.2em] leading-relaxed">
              Security Policy: Legal identifiers are immutable once verified. Manual overrides require administrative elevation.
            </p>
          </div>
        </section>

        {/* RIGHT PANEL: EDITABLE WORKSTATION (65%) */}
        <section className="flex-1 bg-[#2c2c2e]/30 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="px-14 py-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-blue-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Profile Workstation</span>
            </div>
          </div>

          {/* EDIT FORM */}
          <div className="flex-1 overflow-y-auto p-14 custom-scrollbar">
            <form id="client-edit-form" onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-16">

              {/* PERSONAL */}
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">01. Personal Records</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormGroup label="First Name" icon={<User size={14} />}>
                    <input {...register("first_name", { required: true })} className="input-field" />
                  </FormGroup>
                  <FormGroup label="Last Name" icon={<User size={14} />}>
                    <input {...register("last_name", { required: true })} className="input-field" />
                  </FormGroup>
                  <FormGroup label="Email Address" icon={<Mail size={14} />}>
                    <input {...register("email", { required: true })} className="input-field" />
                  </FormGroup>
                  <FormGroup label="Phone Number" icon={<Phone size={14} />}>
                    <input {...register("phone", { required: true })} className="input-field" />
                  </FormGroup>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">02. Residential Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormGroup label="Full Street Address" icon={<MapPin size={14} />} className="md:col-span-2">
                    <input {...register("address")} className="input-field" />
                  </FormGroup>
                  <FormGroup label="City" icon={<Navigation size={14} />}>
                    <input {...register("city")} className="input-field" />
                  </FormGroup>
                  <FormGroup label="State / Province" icon={<Globe size={14} />}>
                    <input {...register("state")} className="input-field" />
                  </FormGroup>
                  <FormGroup label="Postal Code" icon={<Hash size={14} />}>
                    <input {...register("zip_code")} className="input-field" />
                  </FormGroup>
                </div>
              </div>

              {/* STATUS */}
              <div className="space-y-8 pb-10">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">03. Administrative</h4>
                <FormGroup label="Account Status" icon={<ShieldCheck size={14} />}>
                  <select {...register("status")} className="input-field bg-transparent w-full cursor-pointer outline-none appearance-none">
                    <option value="Active" className="bg-[#1c1c1e]">Active</option>
                    <option value="Inactive" className="bg-[#1c1c1e]">Inactive</option>
                    <option value="Blacklisted" className="bg-[#1c1c1e]">Blacklisted</option>
                  </select>
                </FormGroup>
              </div>
            </form>
          </div>

          {/* FOOTER */}
          <div className="px-14 py-12 bg-black/20 border-t border-white/5 flex items-center justify-end gap-10">
            <button onClick={() => router.back()} className="text-[10px] font-black text-[#6e6e73] hover:text-red-500 uppercase tracking-widest transition-colors">Discard Changes</button>

            <button
              form="client-edit-form"
              type="submit"
              disabled={!isDirty || isSaving}
              className={`
                  flex items-center gap-4 px-16 py-6 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${!isDirty || isSaving
                  ? 'bg-white/5 text-[#424245] cursor-not-allowed'
                  : 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 active:scale-95'}
                `}
            >
              {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {isSaving ? "Syncing..." : "Sync Profile"}
            </button>
          </div>
        </section>
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
          font-size: 1rem;
          font-weight: 800;
          outline: none;
          padding: 0;
          margin-top: 0.75rem;
        }
      `}</style>
    </main>
  );
}

// --- HELPERS ---

function LockedField({ icon, label, value }: any) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl opacity-50 relative group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-blue-500">
          {icon}
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <Lock size={12} className="text-[#424245]" />
      </div>
      <p className="text-sm font-mono font-black tracking-widest text-white">{value || "UNSET"}</p>
    </div>
  );
}

function FormGroup({ label, icon, children, className = "" }: any) {
  return (
    <div className={`p-8 bg-[#2c2c2e]/50 rounded-[32px] border border-transparent focus-within:border-blue-500/30 transition-all group ${className}`}>
      <div className="flex items-center gap-3 mb-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
        <div className="w-6 h-6 flex items-center justify-center text-blue-500">{icon}</div>
        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">{label}</label>
      </div>
      {children}
    </div>
  );
}
