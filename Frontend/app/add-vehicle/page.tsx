import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import AddVehicleForm from '@/components/AddVehicleForm';

export const metadata = {
  title: 'Register New Vehicle | XNRENT CAR',
  description: 'Add a new vehicle to the fleet operations system.',
};

export default function AddVehiclePage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] selection:bg-blue-500/30">
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tighter text-xl">XNRENT</span>
              <div className="h-4 w-px bg-gray-300 dark:bg-white/10 mx-1" />
              <span className="text-sm font-medium opacity-60 uppercase tracking-widest">Fleet Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Secure Data Entry</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-white/10 ring-offset-2 ring-offset-[#f5f5f7] dark:ring-offset-[#1c1c1e]">
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        {/* Page Title Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Register New Vehicle</h1>
          <p className="text-[#6e6e73] max-w-lg mx-auto leading-relaxed">
            Enter the vehicle specifications to add it to the active fleet tracking system. All fields are required for initial registration.
          </p>
        </div>

        {/* Client-Side Form Component */}
        <AddVehicleForm />
      </main>

      {/* Footer */}
      <footer className="py-12 text-center opacity-40">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
          XNRENT CAR · Operations Management v2.4
        </p>
      </footer>
    </div>
  );
}
