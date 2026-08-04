import React from "react";

interface LandingViewProps {
  onEnter: () => void;
}

export default function LandingView({ onEnter }: LandingViewProps) {
  return (
    <div className="w-full h-screen bg-brand-dark flex flex-col justify-between p-12 text-white select-none relative overflow-hidden">
      {/* Background soft circular gradient using brand-cyan */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.07)_0%,transparent_65%)]" />

      {/* Top spacing */}
      <div />

      {/* Center Logo & Action */}
      <div className="flex flex-col items-center justify-center text-center relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 select-none">
          <span className="font-serif text-white text-7xl tracking-wide flex items-center select-none leading-none mb-1">
            ne
            <span className="font-serif text-white text-8xl font-normal mx-0.5" style={{ fontFamily: "Georgia, serif" }}>X</span>
            us
          </span>
          <span className="text-[11px] font-normal tracking-wider text-gray-400 uppercase">
            Powered by X Rent A Car
          </span>
        </div>

        {/* Enter System Button — uses brand gradient */}
        <button
          onClick={onEnter}
          className="flex items-center gap-2.5 bg-brand-gradient hover:opacity-90 active:scale-[0.98] text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-brand-cyan/10 transition-all cursor-pointer mb-8"
        >
          Enter System
          <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* Network connected badge */}
        <div className="flex items-center gap-2 bg-brand-dark-card border border-white/5 px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Network Connected: Secure Node 04
          </span>
        </div>
      </div>

      {/* Footer statistics */}
      <div className="flex justify-between items-center text-gray-500 border-t border-white/5 pt-8 relative z-10">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-wider mb-1">System Version</span>
          <span className="text-xs font-black text-gray-300">v4.82.0-Alpha</span>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-black uppercase tracking-wider mb-1">Global Fleet Assets</span>
            <span className="text-xs font-black text-gray-300">12,402 Active</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-black uppercase tracking-wider mb-1">Server Latency</span>
            <span className="text-xs font-black text-brand-cyan">14ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
