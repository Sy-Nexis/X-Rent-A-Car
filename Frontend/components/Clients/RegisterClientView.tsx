"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterClientView() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("California");
  const [zipCode, setZipCode] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setNic("");
    setLicenseNumber("");
    setAddress("");
    setCity("");
    setState("California");
    setZipCode("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleRegisterClient = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !nic.trim()) {
      setErrorMessage("Please fill in all required fields (First Name, Last Name, Email, Government ID / NIC).");
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        government_id: nic.trim(),
        license_number: licenseNumber.trim() || nic.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zip_code: zipCode.trim(),
        status: "Active",
      };

      const res = await fetch("http://localhost:8801/api/clients/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to register client to database");
      }

      setSuccessMessage("Client registered successfully in Supabase! Redirecting to client registry...");
      setTimeout(() => {
        router.push("/clients");
      }, 1200);
    } catch (err: any) {
      console.error("Register client error:", err);
      setErrorMessage(err.message || "An error occurred while saving client");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#0e0e11]">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-2">
        <span>Client Registry</span>
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-brand-cyan">Add New Client</span>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Register New Client</h1>
        <p className="text-sm text-gray-400 font-medium">
          Create a new client profile for precision tracking and fleet allocation.
        </p>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main content grid */}
      <form onSubmit={handleRegisterClient} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
        {/* Forms column */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 01 - PERSONAL INFORMATION */}
          <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-cyan">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="text-sm font-extrabold uppercase text-white tracking-wider">
                  Personal Information
                </h2>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-white/5 text-gray-400 uppercase tracking-widest">
                Step 01
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Jonathan"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Wick"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jonathan.wick@continental.com"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg pl-10 pr-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  NIC / Government ID *
                </label>
                <input
                  type="text"
                  required
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  placeholder="US-CORP-0000"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* STEP 02 - RESIDENTIAL INFORMATION */}
          <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-cyan">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-sm font-extrabold uppercase text-white tracking-wider">
                  Location & Address
                </h2>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-white/5 text-gray-400 uppercase tracking-widest">
                Step 02
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Fleet Way, Industrial District"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Logistics Hub"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="California"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="90001"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Driver License No.
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="DL-0000000"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleClear}
              type="button"
              disabled={isSaving}
              className="flex items-center gap-2 border border-white/5 bg-[#0e0e11] hover:bg-red-950/20 hover:text-brand-red hover:border-brand-red/20 text-gray-400 text-xs font-extrabold uppercase tracking-wider px-6 py-3 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2.5 bg-brand-gradient hover:opacity-90 active:scale-[0.98] disabled:opacity-50 text-white text-xs font-extrabold uppercase tracking-wider px-7 py-3 rounded-lg shadow-md transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  Register Client
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Info panels column */}
        <div className="space-y-6">
          {/* REGISTRY INTELLIGENCE CARD */}
          <div className="bg-[#1e1e1e] text-white rounded-2xl border border-white/5 p-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
            
            <div className="relative z-10">
              <span className="text-brand-cyan text-[10px] uppercase font-extrabold tracking-wider block mb-3">
                Registry Intelligence
              </span>
              <h3 className="text-sm font-semibold tracking-wide leading-relaxed mb-6">
                Data integrity ensures seamless logistics execution and fleet security.
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse shadow-md shadow-cyan-400/50" />
                  <span className="text-xs font-bold text-gray-300">Supabase Connected</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-gray-300">Automatic ID Verification</span>
                </div>
              </div>
            </div>
          </div>

          {/* DATA PRIVACY INFO CARD */}
          <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 p-5 flex items-start gap-4 shadow-md">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-cyan flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-brand-cyan uppercase tracking-wider mb-1">
                Data Privacy
              </h4>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                All client data is encrypted and stored according to strict security protocols.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
