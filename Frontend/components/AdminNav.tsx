import React from 'react';
import { Car, User } from 'lucide-react';

export default function AdminNav() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-bg-base/80 border-b border-border-subtle">
      <div className="flex h-16 items-center justify-between px-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-apple to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-apple/20">
            <Car size={20} />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-text-primary uppercase">
            XNRENT <span className="text-blue-apple">CAR</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex px-3 py-1.5 rounded-full bg-purple-apple/10 border border-purple-apple/20">
            <span className="text-[10px] font-bold text-purple-apple tracking-wider uppercase">
              Admin Portal
            </span>
          </div>
          
          <div className="flex items-center gap-3 pl-4 border-l border-border-subtle cursor-pointer group">
            <div className="flex flex-col items-end mr-1">
              <span className="text-xs font-bold text-text-primary">Admin User</span>
              <span className="text-[10px] text-text-secondary uppercase tracking-tight">Super Admin</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-text-secondary shadow-sm overflow-hidden border border-border-subtle">
               <User size={18} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
