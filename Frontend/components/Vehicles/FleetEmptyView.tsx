import React from "react";

interface FleetEmptyViewProps {
  onEnterVehicle: () => void;
}

export default function FleetEmptyView({ onEnterVehicle }: FleetEmptyViewProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative flex flex-col justify-between bg-[#0e0e11]">
      {/* Top Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-6">
          <span>Operations</span>
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-brand-cyan">Fleet Management</span>
        </div>

        {/* Center Panel (span 3) */}
        <div className="lg:col-span-2 bg-[#1e1e1e] rounded-2xl border border-white/5 p-12 shadow-md min-h-[440px] flex flex-col items-center justify-center text-center mb-8 relative overflow-hidden">
          {/* Subtle logo badge with warning dot */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-brand-cyan">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h10" />
              </svg>
            </div>
            {/* Warning indicator dot overlay */}
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-red/10 border-4 border-[#1e1e1e] flex items-center justify-center text-[10px] text-brand-red font-extrabold shadow-sm">
              ⚠
            </span>
          </div>

          <h2 className="text-2xl font-bold uppercase text-white mb-3 tracking-tight">
            Fleet registry empty
          </h2>
          <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-md mb-8">
            No vehicles have been logged in the system yet. Initialize your operational fleet by registering your first asset to begin real-time precision tracking and logistics management.
          </p>

          {/* Action buttons side-by-side */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={onEnterVehicle}
              className="flex items-center gap-2 bg-brand-gradient hover:opacity-90 text-white text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Enter Vehicle
            </button>
            <button className="flex items-center gap-2 border border-brand-cyan hover:bg-white/5 text-brand-cyan text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-lg transition-all active:scale-[0.98] cursor-pointer bg-transparent">
              Import CSV
            </button>
          </div>
        </div>
      </div>

      {/* Bottom feature cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Automated Sync",
            desc: "Connect your existing telematics provider to automatically populate your registry with real-time data.",
            icon: (
              <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            ),
          },
          {
            title: "Compliance Ready",
            desc: "Every vehicle entry includes mandatory safety audit logs and emissions tracking standard for EU & NA regs.",
            icon: (
              <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
          },
          {
            title: "Fleet Analytics",
            desc: "Once registered, view comprehensive health metrics, fuel efficiency, and route optimization data instantly.",
            icon: (
              <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            ),
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-[#1e1e1e] rounded-xl border border-white/5 p-5 shadow-md flex flex-col gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
              {card.icon}
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                {card.title}
              </h3>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
