import React from "react";
import AdminNav from "@/components/AdminNav";
import TabSwitcher from "@/components/TabSwitcher";

export const metadata = {
  title: "XNRENT CAR | Admin Management Portal",
  description: "Manage your fleet and driver personnel",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Server Component Nav */}
      <AdminNav />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-10">
        {/* Client Component for Interactive Sections */}
        <TabSwitcher />
      </main>

      {/* Simple Footer */}
      <footer className="py-8 px-6 text-center border-t border-border-subtle bg-bg-surface/30">
        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-[0.2em]">
          XNRENT CAR Fleet Operations · Internal Admin System
        </p>
      </footer>
    </div>
  );
}
