"use client";

import React from "react";
import { UserPlus, Download } from "lucide-react";

interface MobileClientRegistryViewProps {
  onEnterClient: () => void;
}

export default function MobileClientRegistryView({
  onEnterClient,
}: MobileClientRegistryViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[#fcf9f9] text-center pb-20">
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 w-full max-w-[320px] flex flex-col items-center">
        {/* Rounded square box with user outline and magnifying glass */}
        <div className="w-16 h-16 rounded-2xl border border-slate-200 flex items-center justify-center bg-[#f8fafc] text-[#94a3b8] mb-6">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <circle cx="18" cy="11" r="3" />
            <line x1="22" y1="15" x2="20" y2="13" />
          </svg>
        </div>

        {/* Empty state title & description */}
        <h3 className="text-base font-black text-[#0f172a] tracking-tight">
          Client registry empty
        </h3>
        <p className="text-[10px] font-bold text-[#64748b] leading-relaxed mt-2 max-w-[240px]">
          Begin managing your enterprise logistics by registering your first corporate client or department.
        </p>

        {/* Actions */}
        <button
          onClick={onEnterClient}
          className="w-full bg-[#2563eb] text-white text-[9px] font-extrabold py-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all hover:bg-blue-700 active:scale-95 mt-6 uppercase tracking-wider"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5px]" />
          Enter Client
        </button>

        <a
          href="#"
          className="text-[#2563eb] text-[9px] font-extrabold flex items-center gap-1 hover:underline mt-4 uppercase tracking-wider"
        >
          Need help? <span className="text-[#64748b] font-bold">Download the client import template</span>
        </a>
      </div>
    </div>
  );
}
