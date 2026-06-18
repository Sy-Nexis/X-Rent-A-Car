"use client";

import React, { useEffect } from "react";
import { Car, ShieldAlert } from "lucide-react";

interface MobileSplashViewProps {
  onComplete: () => void;
}

export default function MobileSplashView({ onComplete }: MobileSplashViewProps) {
  useEffect(() => {
    // Automatically transit after 2.5s for realistic loading experience
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col justify-between items-center bg-[#f8f9fa] py-8 px-6 h-full w-full">
      {/* Top progress indicator bar at the absolute top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#f1f5f9]">
        <div className="h-full bg-[#2563eb] w-[40%] animate-[pulse_1.5s_infinite]" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center select-none">
          <span className="font-serif text-[#0f172a] text-5xl tracking-wide flex items-center select-none leading-none mb-1">
            ne
            <span className="font-serif text-[#0f172a] text-6xl font-normal mx-0.5" style={{ fontFamily: "Georgia, serif" }}>X</span>
            us
          </span>
          <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            Powered by X Rent A Car
          </span>
        </div>

        {/* Action / Status */}
        <div className="space-y-4 pt-8 w-full max-w-[260px]">
          <div className="w-full bg-[#2563eb] text-white text-[10px] font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md">
            {/* Simple circular loading spinner */}
            <svg
              className="animate-spin h-3.5 w-3.5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            INITIALIZING SYSTEMS
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-[#64748b]">
              Checking fleet availability...
            </p>
            {/* Dots */}
            <div className="flex justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1]" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer security card */}
      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 flex items-center gap-3 w-full max-w-[280px] shadow-sm">
        <div className="w-7 h-7 bg-[#e8fbf4] text-[#10b981] rounded-lg flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9.5px] font-black text-[#1e293b] leading-tight">
            Enterprise Secure
          </span>
          <span className="text-[8px] font-bold text-[#64748b] mt-0.5">
            256-bit encrypted connection
          </span>
        </div>
      </div>
    </div>
  );
}
