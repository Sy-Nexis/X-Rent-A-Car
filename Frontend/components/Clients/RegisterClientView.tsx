import React, { useState } from "react";

export default function RegisterClientView() {
  const [firstName, setFirstName] = useState("Jonathan");
  const [lastName, setLastName] = useState("Wick");
  const [email, setEmail] = useState("jonathan.wick@continental.com");
  const [phone, setPhone] = useState("+1 (555) 000-0000");
  const [nic, setNic] = useState("00000-0000000-0");

  const [address, setAddress] = useState("123 Fleet Way, Industrial District");
  const [city, setCity] = useState("Logistics Hub");
  const [state, setState] = useState("California");
  const [zipCode, setZipCode] = useState("90001");

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setNic("");
    setAddress("");
    setCity("");
    setState("California");
    setZipCode("");
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Register New Client</h1>
        <p className="text-sm text-gray-400 font-medium">
          Create a new client profile for precision tracking and fleet allocation.
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
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
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Jonathan"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Wick"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
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
                  NIC Number
                </label>
                <input
                  type="text"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  placeholder="00000-0000000-0"
                  className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none transition-all placeholder:text-gray-500"
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
                  Residential Information
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
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#0e0e11] border border-white/5 rounded-lg px-4 py-3 text-xs font-semibold text-white focus:bg-[#0e0e11] focus:border-brand-cyan focus:outline-none appearance-none transition-all cursor-pointer"
                  >
                    <option value="California">California</option>
                    <option value="Texas">Texas</option>
                    <option value="Florida">Florida</option>
                    <option value="New York">New York</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
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
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 border border-white/5 bg-[#0e0e11] hover:bg-red-950/20 hover:text-brand-red hover:border-brand-red/20 text-gray-400 text-xs font-extrabold uppercase tracking-wider px-6 py-3 rounded-lg transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Form
            </button>
            <button className="flex items-center gap-2.5 bg-brand-gradient hover:opacity-90 active:scale-[0.98] text-white text-xs font-extrabold uppercase tracking-wider px-7 py-3 rounded-lg shadow-md transition-all cursor-pointer">
              Register Client
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Info panels column */}
        <div className="space-y-6">
          {/* REGISTRY INTELLIGENCE CARD */}
          <div className="bg-[#1e1e1e] text-white rounded-2xl border border-white/5 p-6 shadow-md relative overflow-hidden">
            {/* Subtle mesh background grid details */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
            
            <div className="relative z-10">
              <span className="text-brand-cyan text-[10px] uppercase font-extrabold tracking-wider block mb-3">
                Registry Intelligence
              </span>
              <h3 className="text-sm font-semibold tracking-wide leading-relaxed mb-6">
                Data integrity ensures seamless logistics execution.
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse shadow-md shadow-cyan-400/50" />
                  <span className="text-xs font-bold text-gray-300">Identity Verification Required</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-600" />
                  <span className="text-xs font-bold text-gray-400">Address Validation Pending</span>
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
                All client data is encrypted and stored according to FleetControl&apos;s strict GDPR compliance protocols.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metrics Bar */}
      <div className="border-t border-white/5 pt-6 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">
              Total Active Clients
            </span>
            <span className="text-2xl font-black text-white">1,402</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">
              Average Onboarding
            </span>
            <span className="text-2xl font-black text-white">4.2m</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">
              System Health
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">99.9%</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow shadow-emerald-450/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
