import React from "react";

export default function AdminPortalView() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Admin Portal</h1>
        <p className="text-sm text-gray-500 font-medium">
          Centralized control for organizational assets and partner relationships.
        </p>
      </div>

      {/* Main Grid: two large panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* PANEL 1: MANAGE FLEET OPERATIONS */}
        <div className="bg-[#f0f4f9] rounded-2xl border border-gray-200/60 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div>
            {/* Top row with badge & icon */}
            <div className="flex items-center justify-between mb-6">
              <span className="flex items-center gap-1.5 bg-cyan-150 border border-cyan-250 text-cyan-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                System Active
              </span>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h10" />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-extrabold uppercase text-slate-800 tracking-wider mb-6">
              Manage Fleet Operations
            </h2>

            {/* Split layout inside: stats vs photo */}
            <div className="grid grid-cols-2 gap-4 items-center mb-6">
              {/* Stat block */}
              <div className="bg-white rounded-xl p-5 border border-gray-150 shadow-2xs h-36 flex flex-col justify-center">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Total Units
                </span>
                <span className="text-3xl font-black text-slate-850 block leading-tight">1,482</span>
                <div className="flex items-center gap-1 mt-1 text-xs font-bold text-emerald-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>+12% vs last month</span>
                </div>
              </div>

              {/* Port Photo block */}
              <div className="relative rounded-xl overflow-hidden h-36 border border-gray-200 group bg-slate-850">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fleet_port.png"
                  alt="Fleet Distribution View"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-white text-[8px] font-black uppercase tracking-wider text-center truncate">
                  Fleet Distribution View
                </span>
              </div>
            </div>
          </div>

          {/* Bottom actions row */}
          <div className="flex justify-between items-center border-t border-gray-200/50 pt-5 mt-2">
            <button className="flex items-center gap-2 bg-[#0b1220] hover:bg-slate-800 text-white text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-lg transition-all shadow-sm">
              Open Management Tables
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Overlap avatars */}
            <div className="flex items-center -space-x-2">
              <div className="w-7 h-7 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#f0f4f9]">A</div>
              <div className="w-7 h-7 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#f0f4f9]">B</div>
              <div className="w-7 h-7 rounded-full bg-teal-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#f0f4f9]">C</div>
              <div className="w-7 h-7 rounded-full bg-slate-400 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-[#f0f4f9]">+5</div>
            </div>
          </div>
        </div>

        {/* PANEL 2: MANAGE CLIENT REGISTRY */}
        <div className="bg-[#ebf3ff] rounded-2xl border border-[#d3e3fd]/60 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div>
            {/* Top row with badge & icon */}
            <div className="flex items-center justify-between mb-6">
              <span className="flex items-center gap-1.5 bg-emerald-100 border border-emerald-200 text-emerald-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified Data
              </span>
              <div className="w-10 h-10 rounded-xl bg-teal-850 text-white flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-extrabold uppercase text-slate-800 tracking-wider mb-6">
              Manage Client Registry
            </h2>

            {/* Split layout: stats vs two horizontal cards */}
            <div className="grid grid-cols-2 gap-4 items-center mb-6">
              {/* Stat block */}
              <div className="bg-white rounded-xl p-5 border border-gray-150 shadow-2xs h-36 flex flex-col justify-center">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Total Clients
                </span>
                <span className="text-3xl font-black text-slate-850 block leading-tight">342</span>
                <span className="text-[10px] text-gray-500 font-bold block mt-1">Enterprise Partners</span>
              </div>

              {/* Sub status blocks stacked */}
              <div className="flex flex-col gap-3 h-36 justify-between">
                {/* Box 1 */}
                <div className="bg-[#111827] text-white rounded-xl p-3 border border-white/5 flex-1 flex flex-col justify-center">
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">
                    New Contracts
                  </span>
                  <span className="text-lg font-black leading-none text-white">24</span>
                </div>
                {/* Box 2 */}
                <div className="bg-[#c3ddfd] text-blue-900 rounded-xl p-3 border border-blue-200/50 flex-1 flex flex-col justify-center">
                  <span className="text-[8px] font-extrabold text-[#2b6cb0] uppercase tracking-wider block mb-0.5">
                    Retention Rate
                  </span>
                  <span className="text-lg font-black leading-none text-[#1a56db]">98.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions row */}
          <div className="flex justify-between items-center border-t border-[#d3e3fd] pt-5 mt-2">
            <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-gray-200 text-xs font-extrabold uppercase tracking-wider px-5 py-3 rounded-lg transition-all shadow-2xs">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Open Management Tables
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Row: 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            label: "Tasks Pending",
            value: "12",
            icon: (
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            ),
          },
          {
            label: "System Load",
            value: "32%",
            icon: (
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            ),
          },
          {
            label: "Compliance",
            value: "100%",
            icon: (
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
          },
          {
            label: "Data Sync",
            value: "2ms",
            icon: (
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            ),
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-150 p-5 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all cursor-default"
          >
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider mb-1.5">
                {card.label}
              </span>
              <span className="text-xl font-black text-slate-800 leading-none">{card.value}</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
