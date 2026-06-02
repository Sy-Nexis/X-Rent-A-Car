import React from "react";

interface LandingViewProps {
  onEnter: () => void;
}

export default function LandingView({ onEnter }: LandingViewProps) {
  return (
    <div className="w-full h-screen bg-[#0b1220] flex flex-col justify-between p-12 text-white select-none relative overflow-hidden">
      {/* Background soft circular gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)]" />

      {/* Top spacing */}
      <div />

      {/* Center Logo & Action */}
      <div className="flex flex-col items-center justify-center text-center relative z-10">
        {/* Car Logo card */}
        <div className="w-24 h-24 rounded-2xl bg-[#111c35] border border-white/10 flex items-center justify-center mb-8 shadow-xl shadow-cyan-900/10">
          <svg className="w-12 h-12 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h10" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-2 leading-none">
          FleetControl
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-400/90 mb-10">
          Precision Logistics Ecosystem
        </p>

        {/* Enter System Button */}
        <button
          onClick={onEnter}
          className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-450 to-cyan-400 hover:from-cyan-400 hover:to-cyan-350 active:scale-[0.98] text-[#0b1220] text-xs font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/10 transition-all cursor-pointer mb-8"
        >
          Enter System
          <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {/* Network connected badge */}
        <div className="flex items-center gap-2 bg-[#111c35] border border-white/5 px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
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
            <span className="text-xs font-black text-cyan-400">14ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
