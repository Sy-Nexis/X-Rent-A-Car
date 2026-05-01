import React from "react";
import AddClientForm from "@/components/Clients/AddClientForm";
import { ArrowLeft, UserPlus, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AddClientDataPage() {
  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white p-8 md:p-12 lg:p-20">
      <div className="max-w-[1400px] mx-auto space-y-16">
        
        {/* --- PREMIUM HEADER AREA --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <Link 
              href="/Admin/Client/Details"
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-[#86868b] hover:text-white transition-all group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Registry
            </Link>
            
            <div className="space-y-2">
               <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">
                  <ShieldCheck size={16} />
                  XNRENT SECURE ONBOARDING
               </div>
               <h1 className="text-6xl font-black tracking-tighter leading-tight">
                  Register <span className="text-[#6e6e73]">Client</span>
               </h1>
               <p className="text-[#86868b] text-xl font-medium max-w-xl">
                  Onboard a new customer to the XNRENT fleet management network. Ensure all identification data is verified against valid government records.
               </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
             <div className="w-16 h-16 rounded-[24px] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <UserPlus size={32} />
             </div>
             <div>
                <p className="text-[10px] font-black text-[#6e6e73] uppercase tracking-[0.3em]">Operational Phase</p>
                <p className="text-sm font-bold text-white uppercase">Client Intake</p>
             </div>
          </div>
        </header>

        {/* --- INTERACTIVE FORM WORKSTATION --- */}
        <main className="relative">
           {/* DECORATIVE AMBIENT GLOW */}
           <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -z-10" />
           <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-900/10 blur-[120px] rounded-full -z-10" />
           
           <AddClientForm />
        </main>

        {/* --- PAGE FOOTER INFO --- */}
        <footer className="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-30 group-hover:opacity-100 transition-opacity">
           <p className="text-[9px] font-black text-[#6e6e73] uppercase tracking-[0.5em]">© 2026 XNRENT FLEET OPERATIONS</p>
           <div className="flex gap-8">
              <span className="text-[9px] font-black text-[#6e6e73] uppercase tracking-[0.2em]">Privacy Protocols</span>
              <span className="text-[9px] font-black text-[#6e6e73] uppercase tracking-[0.2em]">Terms of Service</span>
           </div>
        </footer>

      </div>
    </div>
  );
}
