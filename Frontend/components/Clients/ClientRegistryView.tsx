import React from "react";

interface ClientRegistryViewProps {
  onEnterClient: () => void;
}

export default function ClientRegistryView({ onEnterClient }: ClientRegistryViewProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative flex flex-col justify-between bg-[#0e0e11]">
      <div>
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-gray-500 mb-6">
          <span>System</span>
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-brand-cyan">Client Registry</span>
        </div>

        {/* Main Grid: Empty state center panel vs Right metrics sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
          
          {/* LEFT: EMPTY STATE DISPLAY PANEL (span 2) */}
          <div className="lg:col-span-2 bg-[#1e1e1e] rounded-2xl border border-white/5 p-12 shadow-md min-h-[460px] flex flex-col items-center justify-center text-center">
            
            {/* ID Badge Icon */}
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-brand-cyan mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 014 0" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6" />
              </svg>
            </div>

            {/* Empty State message */}
            <h2 className="text-2xl font-bold uppercase text-white mb-3 tracking-tight">
              client registry empty
            </h2>
            <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-md mb-8">
              No logistics partners or client accounts have been registered in the system. Establish your first connection to begin managing fleet assignments and delivery routes.
            </p>

            {/* Enter Client button */}
            <button
              onClick={onEnterClient}
              className="flex items-center gap-2 bg-brand-gradient hover:opacity-90 text-white text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Enter Client
            </button>
          </div>

          {/* RIGHT SIDEBAR (span 1) */}
          <div className="space-y-6">
            
            {/* REGISTRY METRICS CARD */}
            <div className="bg-[#1e1e1e] rounded-xl border border-white/5 p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                  Registry Metrics
                </span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>

              <div className="py-2">
                <span className="text-5xl font-black text-white/10 block mb-1">0</span>
                <span className="text-xs font-bold text-gray-400 block mb-6">Active Accounts</span>
              </div>

              {/* Progress Bar placeholder */}
              <div className="border-t border-white/5 pt-4">
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-2">
                  <div className="bg-brand-gradient h-full w-0" />
                </div>
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wide block">
                  Utilization: 0% Capacity
                </span>
              </div>
            </div>

            {/* ONBOARDING TIPS CARD */}
            <div className="bg-[#1e1e1e] rounded-xl border border-white/5 p-6 shadow-md flex flex-col justify-between min-h-[220px]">
              <div>
                <h3 className="text-xs font-extrabold text-brand-cyan uppercase tracking-wider flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Onboarding Tips
                </h3>

                <ul className="space-y-4 mb-6">
                  {[
                    "Prepare tax IDs and billing contact details for new entries.",
                    "Link clients to regional warehouses for auto-dispatching.",
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-4 h-4 rounded-full bg-brand-green text-white flex items-center justify-center flex-shrink-0 text-[10px] shadow-sm mt-0.5 font-bold">
                        ✓
                      </span>
                      <span className="text-[11px] text-gray-300 font-semibold leading-relaxed">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="text-left text-xs font-extrabold text-brand-cyan hover:opacity-85 uppercase tracking-wider flex items-center gap-1.5 mt-auto cursor-pointer">
                View Documentation
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Floating Action Button "+" in blue bottom-right */}
      <button
        onClick={onEnterClient}
        className="absolute bottom-24 right-4 md:bottom-8 md:right-8 w-12 h-12 rounded-full bg-brand-gradient hover:opacity-90 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all z-20 cursor-pointer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
