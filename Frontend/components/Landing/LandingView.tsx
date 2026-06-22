import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, Shield } from "lucide-react";

export default function LandingView() {
  return (
    <div className="w-full h-screen bg-[#0b1220] flex flex-col justify-between p-8 md:p-12 text-white select-none relative overflow-hidden font-sans">
      {/* Background soft circular gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Header decoration */}
      <header className="flex items-center justify-between relative z-10 opacity-70">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-cyan-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            Secure Node Gateway
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <Globe size={14} className="text-cyan-400" />
          <span>SSL 256-BIT ENCRYPTION</span>
        </div>
      </header>

      {/* Center Logo & Action */}
      <div className="flex flex-col items-center justify-center text-center relative z-10 my-auto">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12 select-none">
          <span className="text-white text-7xl md:text-8xl tracking-wide flex items-center select-none leading-none mb-2 font-serif">
            ne
            <span className="text-white text-8xl md:text-9xl font-normal mx-0.5" style={{ fontFamily: "Georgia, serif" }}>X</span>
            us
          </span>
          <span className="text-xs font-extrabold tracking-[0.3em] text-gray-400 uppercase">
            Powered by X Rent A Car
          </span>
        </div>

        {/* Enter System Button */}
        <Link
          href="/login"
          className="flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-400 hover:to-cyan-300 text-[#0b1220] text-xs font-black uppercase tracking-widest px-10 py-5 rounded-2xl shadow-xl shadow-cyan-500/10 hover:shadow-cyan-400/20 active:scale-95 transition-all cursor-pointer mb-8 duration-300 min-h-[48px]"
        >
          Enter System
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </Link>

        {/* Network connected badge */}
        <div className="flex items-center gap-2.5 bg-[#111c35]/50 border border-white/5 px-5 py-2.5 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
            Network Connected: Secure Node 04
          </span>
        </div>
      </div>

      {/* Footer statistics */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-gray-500 border-t border-white/5 pt-8 gap-4 relative z-10">
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-[9px] font-black uppercase tracking-wider mb-1 text-gray-400">System Version</span>
          <span className="text-xs font-black text-gray-300">v4.82.0-Alpha</span>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col items-center sm:items-end">
            <span className="text-[9px] font-black uppercase tracking-wider mb-1 text-gray-400">Global Fleet Assets</span>
            <span className="text-xs font-black text-gray-300">12,402 Active</span>
          </div>
          <div className="flex flex-col items-center sm:items-end">
            <span className="text-[9px] font-black uppercase tracking-wider mb-1 text-gray-400">Server Latency</span>
            <span className="text-xs font-black text-cyan-400">14ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
