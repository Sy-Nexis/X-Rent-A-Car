"use client";

import React from "react";
import { AlertCircle, RefreshCcw, Database, UserPlus } from "lucide-react";
import Link from "next/link";

export function ErrorStateUI() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[32px] flex items-center justify-center text-red-500 mx-auto shadow-2xl shadow-red-500/10">
          <AlertCircle size={48} />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white">Registry Offline</h2>
          <p className="text-[#6e6e73] font-medium leading-relaxed">
            The XNRENT Fleet API is unreachable or returned a 404 error. Please ensure the backend is running and the Client Registry endpoint is mounted correctly.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleRetry}
            className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-3"
          >
            <RefreshCcw size={16} />
            Retry Connection
          </button>
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-[10px] font-mono text-[#424245] uppercase">
            TARGET_URL: http://localhost:5000/api/clients/view
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmptyRegistryUI() {
  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-10">
        <div className="relative">
          <div className="w-32 h-32 bg-blue-600/10 border border-blue-600/20 rounded-[40px] flex items-center justify-center text-blue-500 mx-auto animate-pulse">
            <Database size={56} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#1c1c1e] rounded-full flex items-center justify-center">
            <UserPlus size={24} className="text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tight text-white">Empty Registry</h2>
          <p className="text-[#86868b] font-medium leading-relaxed">
            There are currently no clients registered in the XNRENT system. Start by onboarding your first customer to build your fleet network.
          </p>
        </div>
        <Link
          href="/Admin/Client/Data"
          className="inline-flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-500 hover:-translate-y-1 transition-all"
        >
          <UserPlus size={18} />
          Onboard First Client
        </Link>
      </div>
    </div>
  );
}
