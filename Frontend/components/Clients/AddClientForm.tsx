"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Fingerprint,
  CreditCard,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  Navigation,
  Globe,
  Hash
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- TYPES ---
interface ClientFormValues {
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

// --- MAIN COMPONENT ---
export default function AddClientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    defaultValues: {
      status: "Active",
    },
  });

  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/clients/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to register client");
      }

      setSuccess(true);
      reset();

      // Auto-redirect after success
      setTimeout(() => {
        router.push("/Admin/Client");
      }, 2000);

    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* SUCCESS NOTIFICATION */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: success ? "auto" : 0, opacity: success ? 1 : 0 }}
        className="overflow-hidden mb-8"
      >
        <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6 flex items-center gap-4 text-green-500">
          <CheckCircle2 size={24} />
          <div>
            <p className="font-black uppercase tracking-widest text-xs">Registry Updated</p>
            <p className="text-sm font-medium">Client has been successfully onboarded to xrent. Redirecting to registry...</p>
          </div>
        </div>
      </motion.div>

      {/* ERROR NOTIFICATION */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: error ? "auto" : 0, opacity: error ? 1 : 0 }}
        className="overflow-hidden mb-8"
      >
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex items-center gap-4 text-red-500">
          <AlertCircle size={24} />
          <div>
            <p className="font-black uppercase tracking-widest text-xs">Submission Failed</p>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-[#2c2c2e] rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-12 space-y-12">

          {/* SECTION 01: PERSONAL INFORMATION */}
          <section className="space-y-8">
            <header className="flex items-center gap-4">
              <div className="w-1 h-8 bg-blue-600 rounded-full" />
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">01. Personal Information</h4>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputGroup label="First Name" icon={<User size={14} />} error={errors.first_name}>
                <input {...register("first_name", { required: "First name is required" })} className="input-field" placeholder="John" />
              </InputGroup>

              <InputGroup label="Last Name" icon={<User size={14} />} error={errors.last_name}>
                <input {...register("last_name", { required: "Last name is required" })} className="input-field" placeholder="Doe" />
              </InputGroup>

              <InputGroup label="Email Address" icon={<Mail size={14} />} error={errors.email}>
                <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} className="input-field" placeholder="john.doe@example.com" />
              </InputGroup>

              <InputGroup label="Phone Number" icon={<Phone size={14} />} error={errors.phone}>
                <input {...register("phone", { required: "Phone number is required" })} className="input-field" placeholder="+94 77 XXX XXXX" />
              </InputGroup>
            </div>
          </section>

          {/* SECTION 02: RESIDENTIAL ADDRESS */}
          <section className="space-y-8">
            <header className="flex items-center gap-4">
              <div className="w-1 h-8 bg-blue-600 rounded-full" />
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">02. Residential Address</h4>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputGroup label="Street Address" icon={<MapPin size={14} />} className="md:col-span-2">
                <input {...register("address")} className="input-field" placeholder="123 Luxury Lane" />
              </InputGroup>

              <InputGroup label="City" icon={<Navigation size={14} />}>
                <input {...register("city")} className="input-field" placeholder="Colombo" />
              </InputGroup>

              <InputGroup label="State / Province" icon={<Globe size={14} />}>
                <input {...register("state")} className="input-field" placeholder="Western" />
              </InputGroup>

              <InputGroup label="Zip / Postal Code" icon={<Hash size={14} />}>
                <input {...register("zip_code")} className="input-field" placeholder="00100" />
              </InputGroup>
            </div>
          </section>

          {/* SECTION 03: IDENTITY & STATUS */}
          <section className="space-y-8">
            <header className="flex items-center gap-4">
              <div className="w-1 h-8 bg-blue-600 rounded-full" />
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">03. Identity & Status</h4>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <InputGroup label="Government ID (NIC)" icon={<Fingerprint size={14} />} error={errors.government_id}>
                <input {...register("government_id", { required: "NIC is required" })} className="input-field" placeholder="19XXXXXXXXXX" />
              </InputGroup>

              <InputGroup label="Driving License" icon={<CreditCard size={14} />}>
                <input {...register("license_number")} className="input-field" placeholder="B1234567" />
              </InputGroup>

              <InputGroup label="Initial Status" icon={<ShieldCheck size={14} />}>
                <select {...register("status")} className="input-field appearance-none cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blacklisted">Blacklisted</option>
                </select>
              </InputGroup>
            </div>
          </section>
        </div>

        {/* FORM FOOTER ACTION */}
        <div className="p-12 bg-black/20 border-t border-white/5 flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-widest">Policy Agreement</p>
            <p className="text-[9px] text-[#424245] mt-1 max-w-[200px] leading-relaxed">By registering, you confirm the asset's identity has been verified against national records.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || success}
            className={`
              flex items-center gap-4 px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
              ${isSubmitting || success
                ? 'bg-white/5 text-[#424245] cursor-not-allowed'
                : 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1 active:scale-95'}
            `}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : success ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {isSubmitting ? "Syncing..." : success ? "Onboarded" : "Register Client"}
          </button>
        </div>
      </form>

      <style jsx>{`
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
        .input-field::placeholder {
          color: #424245;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

// --- HELPER COMPONENT ---

function InputGroup({ label, icon, children, className = "", error }: any) {
  return (
    <div className={`p-6 bg-black/20 rounded-2xl border border-white/5 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all group ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
          <span className="text-blue-500">{icon}</span>
          <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest">{label}</label>
        </div>
        {error && <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">{error.message}</span>}
      </div>
      {children}
    </div>
  );
}
