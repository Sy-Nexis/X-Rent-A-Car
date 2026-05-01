import React from "react";
import AdminNavbar from "@/components/Navigation/AdminNavbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#000000] flex">
      {/* PERSISTENT SIDEBAR NAVIGATION */}
      <AdminNavbar />

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 ml-72 min-h-screen relative overflow-y-auto">
        {/* PAGE CONTENT */}
        <div className="relative z-10">
          {children}
        </div>

        {/* GLOBAL BACKGROUND ELEMENTS */}
        <div className="fixed inset-0 bg-[#0a0a0a] -z-20" />
        <div className="fixed top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/[0.03] blur-[150px] rounded-full -z-10 pointer-events-none" />
      </main>
    </div>
  );
}
